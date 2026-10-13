import type {
  Audience,
  Campus,
  CampusSummary,
  Course,
  CourseCategory,
  CourseOffering,
  CourseSummary,
  DeliveryMode,
  FeeSchedule,
  Intake,
  IntakeStatus,
  Money,
  FeeBasis,
} from '@/api/types'
import { campuses as campusSeeds } from './data/campuses'
import { categories as categorySeeds } from './data/categories'
import { courseSeeds, ENTRY_DEFAULTS, PATHWAY_DISCLAIMER, type CourseSeed } from './data/courses'
import { resources } from './data/resources'
import { settings } from './data/settings'
import { addDays, daysFromToday, isoDate, mondayOfMonth, TODAY, yearEnd, yearStart } from './data/time'

/**
 * Derives the relational catalogue (courses → offerings → intakes + fee schedules) from the demo
 * seeds, mirroring how the backend would assemble published records.
 */

const todayIso = isoDate(TODAY)

const campusBySlug = new Map(campusSeeds.map((c) => [c.slug, c]))

function modesFor(seed: CourseSeed, audience: Audience, campusIndex: number): DeliveryMode[] {
  return seed.deliveryModes.filter((mode) => {
    if (mode === 'online' && audience === 'international') return false
    if (mode === 'online' && campusIndex > 0) return false // online cohorts are administered by the first campus
    return true
  })
}

function buildIntakes(seed: CourseSeed, offeringId: string, campusSlug: string, timezone: string): Intake[] {
  const starts: { start: string; index: number }[] = seed.intakeMonths.map((months, index) => ({
    start: mondayOfMonth(months),
    index,
  }))
  if (seed.closedIntakeSoon) {
    let soon = addDays(TODAY, 10)
    while (soon.getUTCDay() !== 1) soon = addDays(soon, 1)
    starts.unshift({ start: isoDate(soon), index: -1 })
  }
  return starts
    .filter(({ start }) => start > todayIso)
    .map(({ start, index }) => {
      const deadline = isoDate(addDays(new Date(`${start}T00:00:00Z`), -21))
      let status: IntakeStatus = seed.statusOverrides?.[`${campusSlug}:${index}`] ?? 'open'
      if (deadline < todayIso) status = 'closed'
      return {
        id: `${offeringId}__${start}`,
        offeringId,
        startDate: start,
        applicationDeadline: deadline,
        status,
        timezone,
      }
    })
}

function buildFee(seed: CourseSeed, offeringId: string, audience: Audience): FeeSchedule | null {
  const fee = seed.fees[audience]
  if (!fee) return null
  return {
    id: `fee__${offeringId}`,
    version: 1,
    audience,
    tuition: { amount: fee.amount, currency: settings.currency, basis: fee.basis },
    additional: (fee.additional ?? []).map((item) => ({ ...item, currency: item.currency || settings.currency })),
    validFrom: yearStart(0),
    validTo: yearEnd(1),
    paymentNotes:
      'Payment instructions are sent with your admissions outcome. Instalment options and refunds are explained in the fees and refunds policy.',
  }
}

function buildOfferings(seed: CourseSeed): CourseOffering[] {
  const offerings: CourseOffering[] = []
  seed.campuses.forEach((campusSlug, campusIndex) => {
    const campus = campusBySlug.get(campusSlug)
    if (!campus) return
    for (const audience of seed.audiences) {
      if (audience === 'international' && !settings.features.international) continue
      if (audience === 'domestic' && !settings.features.domestic) continue
      for (const mode of modesFor(seed, audience, campusIndex)) {
        const id = `${seed.slug}__${campusSlug}__${audience}__${mode}`
        offerings.push({
          id,
          campus: { slug: campus.slug, name: campus.name, timezone: campus.timezone },
          audience,
          deliveryMode: mode,
          intakes: buildIntakes(seed, id, campusSlug, campus.timezone),
          fee: buildFee(seed, id, audience),
        })
      }
    }
  })
  return offerings
}

export function isIntakeAvailable(intake: Intake) {
  return (intake.status === 'open' || intake.status === 'limited') && intake.applicationDeadline >= todayIso
}

function nextIntake(offerings: CourseOffering[]): CourseSummary['nextIntake'] {
  let best: { startDate: string; campus: { slug: string; name: string }; status: IntakeStatus } | null = null
  for (const offering of offerings) {
    for (const intake of offering.intakes) {
      if (!isIntakeAvailable(intake)) continue
      if (!best || intake.startDate < best.startDate) {
        best = { startDate: intake.startDate, campus: { slug: offering.campus.slug, name: offering.campus.name }, status: intake.status }
      }
    }
  }
  return best
}

function feeFrom(offerings: CourseOffering[]) {
  const result: Partial<Record<Audience, Money & { basis: FeeBasis }>> = {}
  for (const offering of offerings) {
    if (!offering.fee) continue
    const current = result[offering.audience]
    if (!current || Number(offering.fee.tuition.amount) < Number(current.amount)) {
      result[offering.audience] = { ...offering.fee.tuition }
    }
  }
  return result
}

const categoryBySlug = new Map(categorySeeds.map((c) => [c.slug, c]))

function toSummary(seed: CourseSeed, offerings: CourseOffering[]): CourseSummary {
  const category = categoryBySlug.get(seed.category)
  const campusRefs = seed.campuses
    .map((slug) => campusBySlug.get(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({ slug: c.slug, name: c.name }))
  return {
    id: seed.id,
    slug: seed.slug,
    title: seed.title,
    code: seed.code,
    level: seed.level,
    levelRank: seed.levelRank,
    category: { slug: seed.category, name: category?.name ?? seed.category },
    summary: seed.summary,
    duration: seed.duration,
    deliveryModes: seed.deliveryModes,
    audiences: seed.audiences.filter((a) => (a === 'international' ? settings.features.international : settings.features.domestic)),
    campuses: campusRefs,
    nextIntake: nextIntake(offerings),
    feeFrom: feeFrom(offerings),
    image: seed.image,
    featured: seed.featured,
  }
}

const offeringsBySlug = new Map(courseSeeds.map((seed) => [seed.slug, buildOfferings(seed)]))

export const courseSummaries: CourseSummary[] = courseSeeds.map((seed) => toSummary(seed, offeringsBySlug.get(seed.slug) ?? []))

const summaryBySlug = new Map(courseSummaries.map((c) => [c.slug, c]))

export const courses: Course[] = courseSeeds.map((seed) => {
  const offerings = offeringsBySlug.get(seed.slug) ?? []
  const summary = summaryBySlug.get(seed.slug)!
  return {
    ...summary,
    overview: seed.overview,
    intendedFor: seed.intendedFor,
    purpose: seed.purpose,
    studyPattern: seed.studyPattern,
    holidayBreakdown: seed.holidayBreakdown,
    teachingLanguage: seed.teachingLanguage ?? 'English',
    outcomes: seed.outcomes,
    modules: seed.modules,
    moduleNote: seed.moduleNote,
    entryRequirements: {
      ...ENTRY_DEFAULTS,
      ...seed.entry,
      audienceNotes: { ...ENTRY_DEFAULTS.audienceNotes, ...seed.entry?.audienceNotes },
    },
    delivery: seed.delivery,
    placement: seed.placement ?? null,
    creditTransfer: seed.creditTransfer ?? null,
    pathways: { ...seed.pathways, disclaimer: PATHWAY_DISCLAIMER },
    downloads: resources.filter((r) => seed.downloads?.includes(r.slug) || r.courseSlugs.includes(seed.slug)),
    offerings,
    related: (seed.related ?? []).map((slug) => summaryBySlug.get(slug)).filter((c): c is CourseSummary => Boolean(c)),
    updatedAt: TODAY.toISOString(),
  }
})

export const courseBySlug = new Map(courses.map((c) => [c.slug, c]))

export const categories: CourseCategory[] = categorySeeds.map((seed) => ({
  ...seed,
  courseCount: courseSummaries.filter((c) => c.category.slug === seed.slug).length,
}))

export const campuses: Campus[] = campusSeeds.map(({ studyAreaSlugs, ...seed }) => ({
  ...seed,
  studyAreas: studyAreaSlugs
    .map((slug) => categoryBySlug.get(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({ slug: c.slug, name: c.name })),
}))

export function toCampusSummary(campus: Campus): CampusSummary {
  return {
    id: campus.id,
    slug: campus.slug,
    name: campus.name,
    city: campus.city,
    address: campus.address,
    summary: campus.summary,
    image: campus.image,
    studyAreas: campus.studyAreas,
    timezone: campus.timezone,
  }
}

export { todayIso, daysFromToday }

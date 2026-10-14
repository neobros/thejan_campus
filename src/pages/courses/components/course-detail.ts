import type { Audience, CampusRef, Course, CourseOffering, DeliveryMode, FeeSchedule, Intake } from '@/api/types'

export interface IntakeWithOffering extends Intake {
  campus: CampusRef & { timezone: string }
  deliveryMode: DeliveryMode
}

export function isIntakeOpen(intake: Intake) {
  return intake.status === 'open' || intake.status === 'limited'
}

/** The audience to show: a valid `?audience=` value, else the course's first audience. */
export function resolveAudience(course: Course, requested: string | null): { audience?: Audience; unavailable?: Audience } {
  const valid = course.audiences.find((a) => a === requested)
  if (valid) return { audience: valid }
  const unavailable = requested === 'domestic' || requested === 'international' ? requested : undefined
  return { audience: course.audiences[0], unavailable }
}

export function offeringsFor(course: Course, audience?: Audience) {
  return audience ? course.offerings.filter((o) => o.audience === audience) : course.offerings
}

export function intakesFor(offerings: CourseOffering[]): IntakeWithOffering[] {
  return offerings
    .flatMap((o) => o.intakes.map((i) => ({ ...i, campus: o.campus, deliveryMode: o.deliveryMode })))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}

export function nextOpenIntake(offerings: CourseOffering[]) {
  return intakesFor(offerings).find(isIntakeOpen)
}

export function uniqueModes(course: Course, offerings: CourseOffering[]): DeliveryMode[] {
  const modes = new Set(offerings.map((o) => o.deliveryMode))
  return modes.size ? course.deliveryModes.filter((m) => modes.has(m)) : course.deliveryModes
}

export function uniqueCampuses(course: Course, offerings: CourseOffering[]): CampusRef[] {
  if (!offerings.length) return course.campuses
  return [...new Map(offerings.map((o) => [o.campus.slug, { slug: o.campus.slug, name: o.campus.name }])).values()]
}

export interface FeeGroup {
  key: string
  fee: FeeSchedule | null
  offerings: CourseOffering[]
}

/** Offerings with an identical fee schedule share one fee card (each lists where it applies). */
export function groupOfferingsByFee(offerings: CourseOffering[]): FeeGroup[] {
  const groups = new Map<string, FeeGroup>()
  for (const offering of offerings) {
    const fee = offering.fee
    const key = fee
      ? JSON.stringify([fee.tuition, fee.additional, fee.validFrom, fee.validTo ?? null, fee.paymentNotes ?? ''])
      : `none:${offering.campus.slug}`
    const group = groups.get(key)
    if (group) group.offerings.push(offering)
    else groups.set(key, { key, fee, offerings: [offering] })
  }
  return [...groups.values()]
}

/** Offerings grouped by campus + delivery mode for the intake timetable. */
export function groupIntakesByOffering(offerings: CourseOffering[]) {
  return [...offerings]
    .sort((a, b) => a.campus.name.localeCompare(b.campus.name) || a.deliveryMode.localeCompare(b.deliveryMode))
    .map((offering) => ({ offering, intakes: [...offering.intakes].sort((a, b) => a.startDate.localeCompare(b.startDate)) }))
}

export const SECTION_LABELS = {
  overview: 'Overview',
  'key-facts': 'Key facts',
  outcomes: 'Outcomes',
  curriculum: 'Curriculum',
  'entry-requirements': 'Entry requirements',
  delivery: 'Delivery & assessment',
  placement: 'Placement',
  fees: 'Fees',
  intakes: 'Intakes',
  credit: 'Credit',
  pathways: 'Pathways',
  downloads: 'Downloads',
  related: 'Related courses',
} as const

export type SectionId = keyof typeof SECTION_LABELS

/** Sections that have content for this course, in page order (empty sections are omitted). */
export function sectionsFor(course: Course): SectionId[] {
  const e = course.entryRequirements
  const has: Record<SectionId, boolean> = {
    overview: true,
    'key-facts': true,
    outcomes: course.outcomes.length > 0,
    curriculum: course.modules.length > 0,
    'entry-requirements':
      e.general.length + e.academic.length + e.language.length + e.prerequisites.length + e.evidence.length > 0 ||
      Boolean(e.age) ||
      Object.values(e.audienceNotes).some((notes) => notes && notes.length > 0),
    delivery: course.delivery.teachingMethods.length + course.delivery.assessmentTypes.length > 0 || Boolean(course.delivery.practical),
    placement: Boolean(course.placement),
    fees: course.offerings.some((o) => o.fee !== null),
    intakes: course.offerings.some((o) => o.intakes.length > 0),
    credit: Boolean(course.creditTransfer),
    pathways: course.pathways.furtherStudy.length + course.pathways.careers.length > 0,
    downloads: course.downloads.length > 0,
    related: course.related.length > 0,
  }
  return (Object.keys(SECTION_LABELS) as SectionId[]).filter((id) => has[id])
}

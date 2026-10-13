import type { CampusApi } from '@/api/contract'
import { ApiError } from '@/api/errors'
import type {
  ApplicationDraft,
  ApplicationReceipt,
  Article,
  ArticleSummary,
  Audience,
  CourseFilterOptions,
  CourseOption,
  CourseSummary,
  DeliveryMode,
  DocumentRequirement,
  DraftHandle,
  EnquiryReceipt,
  EventItem,
  EventSummary,
  FeeListing,
  IntakeListing,
  Navigation,
  NavLeaf,
  Paginated,
  Policy,
  PolicySummary,
  UploadedDocument,
} from '@/api/types'
import { uuid } from '@/lib/ids'
import { campuses, categories, courseBySlug, courses, courseSummaries, isIntakeAvailable, toCampusSummary, todayIso } from './catalogue'
import { accreditations } from './data/accreditations'
import { agents } from './data/agents'
import { articles, type ArticleSeed } from './data/articles'
import { events } from './data/events'
import { faqs } from './data/faqs'
import { galleryAlbums } from './data/gallery'
import { navigation } from './data/navigation'
import { pages } from './data/pages'
import { staff } from './data/people'
import { policies, resources } from './data/resources'
import { scholarships } from './data/scholarships'
import { settings } from './data/settings'
import { departments, orientationSessions, supportServices } from './data/support'
import { testimonials } from './data/testimonials'
import { featureEnabled, pagePublished } from './features'
import { searchAll } from './search'
import { load, makeReference, save } from './store'

const MODE_LABELS: Record<DeliveryMode, string> = { 'on-campus': 'On campus', online: 'Online', blended: 'Blended' }
const AUDIENCE_LABELS: Record<Audience, string> = { domestic: 'Domestic students', international: 'International students' }

const DECLARATION_VERSIONS = { accuracy: 'demo-1.0', privacy: 'demo-1.0', admissions: 'demo-1.0' }
const DRAFT_LIFETIME_DAYS = 7
const SCAN_SECONDS = 3

const notFound = (what: string) => new ApiError(`${what} could not be found.`, 404)

function paginate<T>(items: T[], page = 1, pageSize = 9): Paginated<T> {
  const size = Math.max(1, Math.min(pageSize, 48))
  const pageCount = Math.max(1, Math.ceil(items.length / size))
  const current = Math.min(Math.max(1, page), pageCount)
  return { items: items.slice((current - 1) * size, current * size), total: items.length, page: current, pageSize: size, pageCount }
}

function filterNavigation(nav: Navigation): Navigation {
  const leaf = (items: NavLeaf[]) => items.filter((item) => featureEnabled(item.feature))
  const utility = leaf(nav.utility)
  if (settings.studentPortalUrl) utility.push({ label: 'Student portal', href: settings.studentPortalUrl })
  return {
    main: nav.main
      .filter((item) => featureEnabled(item.feature))
      .map((item) => ({ ...item, groups: item.groups?.map((g) => ({ ...g, items: leaf(g.items) })).filter((g) => g.items.length) })),
    utility,
    footer: nav.footer.map((col) => ({ ...col, links: leaf(col.links) })).filter((col) => col.links.length),
    legal: leaf(nav.legal),
  }
}

function readingMinutes(body: string) {
  return Math.max(1, Math.round(body.split(/\s+/).length / 200))
}

function toArticleSummary({ body: _body, seo: _seo, ...article }: ArticleSeed): ArticleSummary {
  return { ...article, readingMinutes: readingMinutes(_body) }
}

const sortedArticles = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

function toEventSummary(event: EventItem): EventSummary {
  const { description: _d, organiser: _o, registration: _r, accessibilityContact: _a, seo: _s, ...summary } = event
  return summary
}

/* ------------------------------------------------------------------------------------------------
 * Draft / application persistence (demo only — localStorage)
 * ---------------------------------------------------------------------------------------------- */

interface StoredDraft extends ApplicationDraft {
  token: string
}

interface StoredApplication {
  reference: string
  receivedAt: string
  draft: Omit<StoredDraft, 'token'>
  snapshot: unknown
}

function getDrafts() {
  return load<Record<string, StoredDraft>>('drafts', {})
}

function requireDraft(handle: DraftHandle): StoredDraft {
  const draft = getDrafts()[handle.id]
  if (!draft || draft.token !== handle.token) throw new ApiError('This application draft could not be found. Please start again.', 404)
  if (draft.expiresAt < new Date().toISOString()) throw new ApiError('This application draft has expired. Please start a new application.', 410)
  return draft
}

function withScanState(doc: UploadedDocument): UploadedDocument {
  if (doc.scanStatus !== 'pending') return doc
  const elapsed = (Date.now() - new Date(doc.uploadedAt).getTime()) / 1000
  return elapsed > SCAN_SECONDS ? { ...doc, scanStatus: 'clean' } : doc
}

function publicDraft({ token: _token, ...draft }: StoredDraft): ApplicationDraft {
  return { ...draft, documents: draft.documents.map(withScanState) }
}

function documentRequirements(draft: StoredDraft): DocumentRequirement[] {
  const selection = draft.data.selection
  const course = selection ? courseBySlug.get(selection.courseSlug) : undefined
  const international = selection?.audience === 'international'
  const isEnglish = course?.category.slug === 'english'
  const isShort = course?.category.slug === 'short-courses'
  const list: DocumentRequirement[] = []
  if (!isShort) {
    list.push({
      type: 'qualification',
      label: 'Highest qualification',
      description: 'Certificate or completion letter for your highest completed qualification.',
      required: !isEnglish,
    })
    list.push({
      type: 'transcript',
      label: 'Academic transcript',
      description: 'Results for your highest qualification. Include a certified English translation if needed.',
      required: (course?.levelRank ?? 0) >= 5,
    })
  }
  if (international || isEnglish) {
    list.push({
      type: 'language',
      label: 'English language evidence',
      description: 'Test results or other evidence accepted by admissions. Leave this empty if you are not sure — we will advise you.',
      required: false,
    })
  }
  list.push({
    type: 'identity',
    label: 'Identity document',
    description: international ? 'Passport identity page.' : 'Only needed if requested by admissions.',
    required: international,
  })
  list.push({ type: 'cv', label: 'CV or résumé', description: 'Optional — useful if you are relying on work experience.', required: false })
  list.push({ type: 'other', label: 'Other supporting documents', description: 'Anything else you would like admissions to consider.', required: false })
  return list
}

/* ------------------------------------------------------------------------------------------------ */

export function createMockApi({ latency }: { latency: number }): CampusApi {
  function respond<T>(produce: () => T): Promise<T> {
    const wait = latency ? latency * (0.6 + Math.random() * 0.8) : 0
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // structuredClone keeps callers from mutating the demo dataset.
          resolve(structuredClone(produce()))
        } catch (error) {
          reject(error)
        }
      }, wait)
    })
  }

  const offeringIndex = new Map(
    courses.flatMap((course) => course.offerings.map((offering) => [offering.id, { course, offering }] as const)),
  )

  return {
    getSettings: () => respond(() => settings),
    getNavigation: () => respond(() => filterNavigation(navigation)),

    getPage: (path) =>
      respond(() => {
        const page = pages.find((p) => p.slug === path)
        if (!page || !pagePublished(path)) throw notFound('Page')
        return {
          ...page,
          blocks: page.blocks.map((block) =>
            block.type === 'linkCards' ? { ...block, items: block.items.filter((item) => featureEnabled(item.feature)) } : block,
          ),
        }
      }),

    listCategories: () => respond(() => categories),
    getCategory: (slug) =>
      respond(() => {
        const category = categories.find((c) => c.slug === slug)
        if (!category) throw notFound('Study area')
        return category
      }),

    listCourses: (query) =>
      respond(() => {
        const terms = (query.q ?? '').toLowerCase().split(/\s+/).filter(Boolean)
        const matches = courses.filter((course) => {
          if (query.category && course.category.slug !== query.category) return false
          if (query.level && course.level !== query.level) return false
          if (terms.length) {
            const haystack = [course.title, course.summary, course.code, course.category.name, course.level, ...course.modules.map((m) => m.title)]
              .join(' ')
              .toLowerCase()
            if (!terms.every((t) => haystack.includes(t))) return false
          }
          // Campus, audience, mode and intake filters must be satisfied by the same offering.
          if (query.campus || query.audience || query.mode || query.intake) {
            return course.offerings.some(
              (o) =>
                (!query.campus || o.campus.slug === query.campus) &&
                (!query.audience || o.audience === query.audience) &&
                (!query.mode || o.deliveryMode === query.mode) &&
                (!query.intake || o.intakes.some((i) => isIntakeAvailable(i) && i.startDate.startsWith(query.intake!))),
            )
          }
          return true
        })
        const summaries = matches.map((c) => courseSummaries.find((s) => s.slug === c.slug)!)
        const sort = query.sort ?? 'title'
        summaries.sort((a, b) => {
          if (sort === 'next-intake') {
            const av = a.nextIntake?.startDate ?? '9999'
            const bv = b.nextIntake?.startDate ?? '9999'
            return av.localeCompare(bv) || a.title.localeCompare(b.title)
          }
          if (sort === 'level') return a.levelRank - b.levelRank || a.title.localeCompare(b.title)
          return a.title.localeCompare(b.title)
        })
        return paginate<CourseSummary>(summaries, query.page, query.pageSize ?? 9)
      }),

    getCourseFilterOptions: () =>
      respond<CourseFilterOptions>(() => {
        const levels = [...new Map(courses.map((c) => [c.level, c.levelRank])).entries()].sort((a, b) => a[1] - b[1])
        const months = new Set<string>()
        for (const course of courses)
          for (const offering of course.offerings)
            for (const intake of offering.intakes) if (isIntakeAvailable(intake)) months.add(intake.startDate.slice(0, 7))
        const audiences = (['domestic', 'international'] as Audience[]).filter((a) => settings.features[a])
        return {
          categories: categories.map((c) => ({ value: c.slug, label: c.name })),
          levels: levels.map(([level]) => ({ value: level, label: level })),
          campuses: campuses.map((c) => ({ value: c.slug, label: c.name })),
          modes: (Object.keys(MODE_LABELS) as DeliveryMode[]).map((value) => ({ value, label: MODE_LABELS[value] })),
          audiences: audiences.map((value) => ({ value, label: AUDIENCE_LABELS[value] })),
          intakeMonths: [...months].sort().map((value) => ({
            value,
            label: new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}-01T00:00:00Z`)),
          })),
        }
      }),

    getCourse: (slug) =>
      respond(() => {
        const course = courseBySlug.get(slug)
        if (!course) throw notFound('Course')
        return course
      }),

    listCourseOptions: () =>
      respond<CourseOption[]>(() =>
        courses
          .map((course) => ({
            slug: course.slug,
            title: course.title,
            level: course.level,
            code: course.code,
            category: course.category.name,
            offerings: course.offerings
              .map((o) => ({ ...o, intakes: o.intakes.filter(isIntakeAvailable) }))
              .filter((o) => o.intakes.length > 0),
          }))
          .filter((course) => course.offerings.length > 0)
          .sort((a, b) => a.title.localeCompare(b.title)),
      ),

    listIntakes: (query) =>
      respond<IntakeListing[]>(() => {
        const rows: IntakeListing[] = []
        for (const course of courses) {
          if (query.course && course.slug !== query.course) continue
          for (const offering of course.offerings) {
            if (query.campus && offering.campus.slug !== query.campus) continue
            if (query.audience && offering.audience !== query.audience) continue
            for (const intake of offering.intakes) {
              if (!query.includeUnavailable && !isIntakeAvailable(intake)) continue
              rows.push({
                ...intake,
                course: { slug: course.slug, title: course.title, level: course.level, code: course.code, category: course.category, image: course.image },
                campus: { slug: offering.campus.slug, name: offering.campus.name },
                audience: offering.audience,
                deliveryMode: offering.deliveryMode,
              })
            }
          }
        }
        return rows.sort((a, b) => a.startDate.localeCompare(b.startDate) || a.course.title.localeCompare(b.course.title))
      }),

    listFees: (query) =>
      respond<FeeListing[]>(() =>
        courses.flatMap((course) =>
          query.course && course.slug !== query.course
            ? []
            : course.offerings
                .filter((o) => (!query.campus || o.campus.slug === query.campus) && (!query.audience || o.audience === query.audience))
                .map((o) => ({
                  offeringId: o.id,
                  course: { slug: course.slug, title: course.title, level: course.level, code: course.code },
                  campus: { slug: o.campus.slug, name: o.campus.name },
                  audience: o.audience,
                  deliveryMode: o.deliveryMode,
                  fee: o.fee,
                })),
        ),
      ),

    listCampuses: () => respond(() => campuses.map(toCampusSummary)),
    getCampus: (slug) =>
      respond(() => {
        const campus = campuses.find((c) => c.slug === slug)
        if (!campus) throw notFound('Campus')
        return campus
      }),

    listArticles: (query) =>
      respond(() =>
        paginate(
          sortedArticles.filter((a) => !query.category || a.category === query.category).map(toArticleSummary),
          query.page,
          query.pageSize ?? 9,
        ),
      ),
    getArticle: (slug) =>
      respond<Article>(() => {
        const article = articles.find((a) => a.slug === slug)
        if (!article) throw notFound('Article')
        const others = sortedArticles.filter((a) => a.slug !== slug)
        const related = [...others.filter((a) => a.category === article.category), ...others.filter((a) => a.category !== article.category)]
          .slice(0, 3)
          .map(toArticleSummary)
        return { ...article, readingMinutes: readingMinutes(article.body), related }
      }),

    listEvents: (query) =>
      respond(() => {
        const now = new Date().toISOString()
        const when = query.when ?? 'upcoming'
        const list = events
          .filter((e) => (when === 'upcoming' ? e.end >= now : e.end < now))
          .filter((e) => (!query.campus || e.campus?.slug === query.campus) && (!query.type || e.type === query.type))
          .sort((a, b) => (when === 'upcoming' ? a.start.localeCompare(b.start) : b.start.localeCompare(a.start)))
          .map(toEventSummary)
        return paginate(list, query.page, query.pageSize ?? 9)
      }),
    getEvent: (slug) =>
      respond(() => {
        const event = events.find((e) => e.slug === slug)
        if (!event) throw notFound('Event')
        return event
      }),

    listGalleryAlbums: () => respond(() => galleryAlbums),
    listTestimonials: () => respond(() => testimonials),
    listStaff: () => respond(() => staff),
    listAccreditations: () => respond(() => accreditations),
    listAgents: () => respond(() => [...agents].sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name))),
    listScholarships: () =>
      respond(() => {
        const order = { open: 0, upcoming: 1, closed: 2 }
        return [...scholarships].sort((a, b) => order[a.status] - order[b.status] || a.closesAt.localeCompare(b.closesAt))
      }),

    listSupportServices: () => respond(() => supportServices),
    listOrientationSessions: () =>
      respond(() => {
        const now = new Date().toISOString()
        return orientationSessions.filter((s) => s.end >= now).sort((a, b) => a.start.localeCompare(b.start))
      }),
    listResources: (query) =>
      respond(() => {
        const q = query.q?.toLowerCase().trim()
        return resources.filter(
          (r) =>
            (!query.type || r.type === query.type) &&
            (!query.audience || r.audiences.includes('all') || r.audiences.includes(query.audience)) &&
            // An empty courseSlugs list means the document applies to every course.
            (!query.course || r.courseSlugs.length === 0 || r.courseSlugs.includes(query.course)) &&
            (!q || `${r.title} ${r.purpose}`.toLowerCase().includes(q)),
        )
      }),
    listPolicies: () =>
      respond<PolicySummary[]>(() =>
        policies
          .map(({ body: _b, file: _f, relatedFormSlugs: _r, contact: _c, seo: _s, ...summary }) => summary)
          .sort((a, b) => a.title.localeCompare(b.title)),
      ),
    getPolicy: (slug) =>
      respond<Policy>(() => {
        const policy = policies.find((p) => p.slug === slug)
        if (!policy) throw notFound('Policy')
        const { relatedFormSlugs, ...rest } = policy
        return { ...rest, relatedForms: resources.filter((r) => relatedFormSlugs.includes(r.slug)) }
      }),
    listFaqs: () => respond(() => faqs),
    listDepartments: () => respond(() => departments),

    search: (q) => respond(() => searchAll(q)),

    createEnquiry: (input, { idempotencyKey }) =>
      respond<EnquiryReceipt>(() => {
        const receipts = load<Record<string, EnquiryReceipt>>('enquiry-receipts', {})
        if (receipts[idempotencyKey]) return receipts[idempotencyKey]
        const fieldErrors: Record<string, string> = {}
        if (!input.fullName?.trim()) fieldErrors.fullName = 'Enter your full name.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email ?? '')) fieldErrors.email = 'Enter a valid email address.'
        if (!input.message?.trim() || input.message.trim().length < 10) fieldErrors.message = 'Tell us a little more (at least 10 characters).'
        if (!input.privacyAccepted) fieldErrors.privacyAccepted = 'Please confirm you have read the privacy notice.'
        if (Object.keys(fieldErrors).length) throw new ApiError('Please check the highlighted fields.', 422, fieldErrors)
        const receipt: EnquiryReceipt = { reference: makeReference('ENQ'), receivedAt: new Date().toISOString() }
        // Honeypot filled → behave as if accepted but do not store (anti-spam).
        if (!input.website) {
          const stored = load<unknown[]>('enquiries', [])
          save('enquiries', [...stored, { ...receipt, input: { ...input, website: undefined } }])
        }
        save('enquiry-receipts', { ...receipts, [idempotencyKey]: receipt })
        return receipt
      }),

    createApplicationDraft: () =>
      respond<DraftHandle>(() => {
        const drafts = getDrafts()
        const now = Date.now()
        // Drop expired drafts (retention is configurable on the real backend).
        for (const [id, draft] of Object.entries(drafts)) if (new Date(draft.expiresAt).getTime() < now) delete drafts[id]
        const id = uuid()
        const token = uuid()
        const expiresAt = new Date(now + DRAFT_LIFETIME_DAYS * 86_400_000).toISOString()
        drafts[id] = { id, token, expiresAt, step: 0, data: {}, documents: [], declarationVersions: DECLARATION_VERSIONS }
        save('drafts', drafts)
        return { id, token, expiresAt }
      }),

    getApplicationDraft: (handle) => respond(() => publicDraft(requireDraft(handle))),

    saveApplicationDraft: (handle, patch) =>
      respond(() => {
        const draft = requireDraft(handle)
        const next: StoredDraft = { ...draft, step: Math.max(draft.step, patch.step), data: { ...draft.data, ...patch.data } }
        save('drafts', { ...getDrafts(), [draft.id]: next })
        return publicDraft(next)
      }),

    getDocumentRequirements: (handle) => respond(() => documentRequirements(requireDraft(handle))),

    uploadApplicationDocument: (handle, type, file, onProgress) =>
      new Promise<UploadedDocument>((resolve, reject) => {
        let draft: StoredDraft
        try {
          draft = requireDraft(handle)
        } catch (error) {
          reject(error)
          return
        }
        let progress = 0
        const timer = setInterval(() => {
          progress = Math.min(1, progress + 0.12 + Math.random() * 0.18)
          onProgress?.(progress)
          if (progress < 1) return
          clearInterval(timer)
          const doc: UploadedDocument = {
            id: uuid(),
            type,
            fileName: file.name,
            sizeBytes: file.size,
            mimeType: file.type || 'application/octet-stream',
            scanStatus: 'pending',
            uploadedAt: new Date().toISOString(),
          }
          // Demo mode stores metadata only — file contents never leave the browser.
          save('drafts', { ...getDrafts(), [draft.id]: { ...draft, documents: [...requireDraft(handle).documents, doc] } })
          resolve(doc)
        }, Math.max(80, latency / 2))
      }),

    removeApplicationDocument: (handle, documentId) =>
      respond(() => {
        const draft = requireDraft(handle)
        save('drafts', { ...getDrafts(), [draft.id]: { ...draft, documents: draft.documents.filter((d) => d.id !== documentId) } })
      }),

    submitApplication: (handle, { idempotencyKey }) =>
      respond<ApplicationReceipt>(() => {
        const receipts = load<Record<string, ApplicationReceipt>>('application-receipts', {})
        if (receipts[idempotencyKey]) return receipts[idempotencyKey]

        const draft = requireDraft(handle)
        const { selection, personal, background, declarations } = draft.data
        if (!selection || !personal || !background) throw new ApiError('Some application steps are incomplete.', 422)
        if (!declarations?.accuracy || !declarations.privacy || !declarations.admissions)
          throw new ApiError('Please accept the declarations before submitting.', 422)

        // Revalidate the selection at the moment of submission (spec §6.2).
        const match = offeringIndex.get(selection.offeringId)
        const intake = match?.offering.intakes.find((i) => i.id === selection.intakeId)
        if (!match || match.course.slug !== selection.courseSlug || !intake || !isIntakeAvailable(intake)) {
          throw new ApiError('This intake is no longer accepting applications. Please choose another intake.', 409)
        }
        const missing = documentRequirements(draft).filter((r) => r.required && !draft.documents.some((d) => d.type === r.type))
        if (missing.length) throw new ApiError(`Please upload: ${missing.map((m) => m.label).join(', ')}.`, 422)

        const receipt: ApplicationReceipt = {
          reference: makeReference('APP'),
          receivedAt: new Date().toISOString(),
          courseTitle: match.course.title,
          campusName: match.offering.campus.name,
          intakeStartDate: intake.startDate,
          email: personal.email,
        }
        const { token: _token, ...stored } = draft
        const applications = load<StoredApplication[]>('applications', [])
        save('applications', [
          ...applications,
          {
            reference: receipt.reference,
            receivedAt: receipt.receivedAt,
            draft: stored,
            // Snapshot of what the applicant saw: course, intake and fee schedule at submission time.
            snapshot: { course: match.course.title, intake, fee: match.offering.fee, declarationVersions: draft.declarationVersions },
          },
        ])
        save('application-receipts', { ...receipts, [idempotencyKey]: receipt })
        const drafts = getDrafts()
        delete drafts[draft.id]
        save('drafts', drafts)
        return receipt
      }),
  }
}

export { todayIso }

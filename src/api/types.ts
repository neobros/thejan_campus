/**
 * Public data contract between the website and the backend/CMS (specification §9–§10).
 *
 * The public API only ever returns *published* records. Private admissions data (notes, staff
 * routing, storage keys) never appears in these types. Money is a decimal string plus an
 * explicit currency; calendar dates are `YYYY-MM-DD` in the campus timezone; instants are ISO 8601.
 */
import type { IconName } from '@/components/ui/icon-names'

export type { IconName }

export type ID = string
/** Calendar date, YYYY-MM-DD, already expressed in the relevant campus timezone. */
export type ISODate = string
/** Instant, ISO 8601 with offset or Z. */
export type ISODateTime = string
/** Markdown (CommonMark + GFM tables). Raw HTML is not rendered. */
export type Markdown = string

export type Audience = 'domestic' | 'international'
export type DeliveryMode = 'on-campus' | 'online' | 'blended'
export type Tone = 'brand' | 'gold' | 'teal' | 'violet' | 'rose' | 'emerald' | 'sky' | 'slate'

export interface ImageAsset {
  /** Missing until approved media is supplied — components render a designed placeholder instead. */
  src?: string | null
  /** Responsive candidates ("…-640.webp 640w, …"), used with the component's `sizes`. */
  srcSet?: string
  /** AI concept standing in for a real place/person/event — rendered with a visible label. */
  concept?: boolean
  /** CSS object-position, e.g. "35% 45%" — lets several cards share one photo with different crops. */
  focus?: string
  /** Empty string for purely decorative images. */
  alt: string
  width?: number
  height?: number
  credit?: string
  /** Placeholder styling while `src` is missing. */
  tone?: Tone
  icon?: IconName
  /** Image slot id from docs/IMAGE_PROMPTS.md (shown on placeholders in development). */
  slot?: string
}

export interface LinkItem {
  label: string
  href: string
}

export interface Action extends LinkItem {
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost'
  icon?: IconName
}

export interface SeoFields {
  title?: string
  description?: string
  image?: string
  noindex?: boolean
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

/* ------------------------------------------------------------------------------------------------
 * Settings & navigation
 * ---------------------------------------------------------------------------------------------- */

export interface FeatureFlags {
  international: boolean
  domestic: boolean
  scholarships: boolean
  creditTransfer: boolean
  agents: boolean
}

export type SocialNetwork = 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'x' | 'tiktok'

export interface InstitutionSettings {
  name: string
  shortName: string
  legalName: string
  tradingName?: string | null
  tagline: string
  description: string
  country?: string | null
  /** Default IANA timezone; campuses may override. */
  timezone: string
  currency: string
  locale: string
  contact: {
    phone: string
    email: string
    address: string
    hours: string
  }
  /** Provider registrations/identifiers — only verified, applicable values. */
  identifiers: { label: string; value: string }[]
  /** Client-approved acknowledgement appropriate to the actual location, or null. */
  acknowledgement?: string | null
  /** Shown only once the destination is confirmed. */
  studentPortalUrl?: string | null
  lmsUrl?: string | null
  social: { network: SocialNetwork; url: string }[]
  features: FeatureFlags
  /** Location-appropriate emergency guidance; forms are never emergency channels. */
  emergency?: { title: string; body: string; phone: string; phoneLabel: string } | null
  seo: { titleTemplate: string; defaultTitle: string; description: string; image?: string | null }
}

export interface NavLeaf {
  label: string
  href: string
  description?: string
  icon?: IconName
  /** Colour for tile-style menu entries (study areas). */
  tone?: Tone
  feature?: keyof FeatureFlags
}

export interface NavGroup {
  title: string
  items: NavLeaf[]
}

export interface NavItem {
  label: string
  href: string
  feature?: keyof FeatureFlags
  groups?: NavGroup[]
  promo?: { eyebrow?: string; title: string; text: string; href: string; label: string; image?: ImageAsset }
}

export interface Navigation {
  main: NavItem[]
  utility: NavLeaf[]
  footer: { title: string; links: NavLeaf[] }[]
  legal: NavLeaf[]
}

/* ------------------------------------------------------------------------------------------------
 * Courses, offerings, intakes and fees
 * ---------------------------------------------------------------------------------------------- */

export interface CourseCategory {
  id: ID
  slug: string
  name: string
  summary: string
  description: Markdown
  icon: IconName
  image: ImageAsset
  suitableFor: string[]
  pathways: string[]
  courseCount: number
  seo?: SeoFields
}

export type IntakeStatus = 'open' | 'limited' | 'full' | 'closed'
export type FeeBasis = 'whole-course' | 'per-year' | 'per-term' | 'per-unit' | 'per-week'

export interface Money {
  /** Decimal string, e.g. "12500.00". */
  amount: string
  currency: string
}

export interface CampusRef {
  slug: string
  name: string
}

export interface CourseSummary {
  id: ID
  slug: string
  title: string
  code?: string | null
  level: string
  /** Sort key for qualification level (lower = introductory). */
  levelRank: number
  category: { slug: string; name: string }
  summary: string
  duration: string
  deliveryModes: DeliveryMode[]
  audiences: Audience[]
  campuses: CampusRef[]
  /** Earliest intake that is still accepting applications, or null. */
  nextIntake?: { startDate: ISODate; campus: CampusRef; status: IntakeStatus } | null
  /** Lowest current approved tuition per audience; absent audience = no approved fee record. */
  feeFrom: Partial<Record<Audience, Money & { basis: FeeBasis }>>
  image: ImageAsset
  featured?: boolean
}

export interface CourseModule {
  code?: string | null
  title: string
  type: 'core' | 'elective'
  summary?: string
}

export interface EntryRequirements {
  general: string[]
  academic: string[]
  language: string[]
  age?: string | null
  prerequisites: string[]
  evidence: string[]
  audienceNotes: Partial<Record<Audience, string[]>>
}

export interface Intake {
  id: ID
  offeringId: ID
  startDate: ISODate
  applicationDeadline: ISODate
  status: IntakeStatus
  /** IANA timezone of the campus the dates refer to. */
  timezone: string
}

export interface FeeSchedule {
  id: ID
  version: number
  audience: Audience
  tuition: Money & { basis: FeeBasis }
  additional: { label: string; amount: string; currency: string; basis?: FeeBasis; note?: string }[]
  validFrom: ISODate
  validTo?: ISODate | null
  paymentNotes?: string
}

export interface CourseOffering {
  id: ID
  campus: CampusRef & { timezone: string }
  audience: Audience
  deliveryMode: DeliveryMode
  intakes: Intake[]
  /** Current approved fee schedule, or null when none is approved (never shown as zero). */
  fee: FeeSchedule | null
}

export interface Course extends CourseSummary {
  overview: Markdown
  intendedFor: string[]
  purpose?: string
  studyPattern?: string
  holidayBreakdown?: string
  teachingLanguage: string
  outcomes: string[]
  modules: CourseModule[]
  moduleNote?: string
  entryRequirements: EntryRequirements
  delivery: { teachingMethods: string[]; assessmentTypes: string[]; practical?: string }
  placement?: {
    required: boolean
    summary: string
    duration?: string
    prerequisites?: string
    costs?: string
    arrangedBy?: string
  } | null
  creditTransfer?: { available: boolean; summary: string; evidence: string[] } | null
  pathways: { furtherStudy: string[]; careers: string[]; disclaimer: string }
  downloads: Resource[]
  offerings: CourseOffering[]
  related: CourseSummary[]
  seo?: SeoFields
  updatedAt: ISODateTime
}

export type CourseSort = 'title' | 'next-intake' | 'level'

export interface CourseQuery {
  q?: string
  category?: string
  level?: string
  campus?: string
  mode?: DeliveryMode
  audience?: Audience
  /** "YYYY-MM" — has an application-open intake starting that month. */
  intake?: string
  sort?: CourseSort
  page?: number
  pageSize?: number
}

export interface CourseFilterOptions {
  categories: { value: string; label: string }[]
  levels: { value: string; label: string }[]
  campuses: { value: string; label: string }[]
  modes: { value: DeliveryMode; label: string }[]
  audiences: { value: Audience; label: string }[]
  intakeMonths: { value: string; label: string }[]
}

/** Intake row with denormalised course/campus details for listings and the application form. */
export interface IntakeListing extends Intake {
  course: { slug: string; title: string; level: string; code?: string | null; category: { slug: string; name: string }; image: ImageAsset }
  campus: CampusRef
  audience: Audience
  deliveryMode: DeliveryMode
}

export interface IntakeQuery {
  course?: string
  campus?: string
  audience?: Audience
  /** Include closed/full intakes (default false → only open/limited). */
  includeUnavailable?: boolean
}

export interface FeeListing {
  offeringId: ID
  course: { slug: string; title: string; level: string; code?: string | null }
  campus: CampusRef
  audience: Audience
  deliveryMode: DeliveryMode
  fee: FeeSchedule | null
}

export interface FeeQuery {
  course?: string
  campus?: string
  audience?: Audience
}

/* ------------------------------------------------------------------------------------------------
 * Campuses
 * ---------------------------------------------------------------------------------------------- */

export interface CampusSummary {
  id: ID
  slug: string
  name: string
  city: string
  address: string
  summary: string
  image: ImageAsset
  studyAreas: { slug: string; name: string }[]
  timezone: string
}

export interface Campus extends CampusSummary {
  overview: Markdown
  coordinates?: { lat: number; lng: number } | null
  contact: { phone?: string | null; email?: string | null }
  hours: { label: string; value: string }[]
  facilities: { name: string; description?: string; icon?: IconName }[]
  transport: string[]
  parking?: string | null
  accessibility: string[]
  directionsUrl?: string | null
  gallery: ImageAsset[]
  admissionsContact?: { name?: string; email?: string; phone?: string } | null
  seo?: SeoFields
}

/* ------------------------------------------------------------------------------------------------
 * News, events, media
 * ---------------------------------------------------------------------------------------------- */

export interface ArticleSummary {
  id: ID
  slug: string
  title: string
  summary: string
  category: string
  /** "announcement" = verified institutional notice; "story" = editorial content. */
  kind: 'announcement' | 'story'
  publishedAt: ISODateTime
  author?: string | null
  image: ImageAsset
  readingMinutes: number
}

export interface Article extends ArticleSummary {
  body: Markdown
  related: ArticleSummary[]
  seo?: SeoFields
}

export interface ArticleQuery {
  category?: string
  page?: number
  pageSize?: number
}

export interface EventSummary {
  id: ID
  slug: string
  title: string
  type: string
  summary: string
  start: ISODateTime
  end: ISODateTime
  timezone: string
  campus?: CampusRef | null
  location: string
  audience: string
  cost?: string | null
  image: ImageAsset
}

export interface EventItem extends EventSummary {
  description: Markdown
  organiser: string
  registration?: { url?: string | null; deadline?: ISODateTime | null; note?: string | null } | null
  accessibilityContact?: string | null
  seo?: SeoFields
}

export interface EventQuery {
  when?: 'upcoming' | 'past'
  campus?: string
  type?: string
  page?: number
  pageSize?: number
}

export interface GalleryItem {
  id: ID
  kind: 'image' | 'video'
  image: ImageAsset
  caption: string
  credit?: string
  /** Videos must provide captions/transcripts; never autoplay with sound. */
  videoUrl?: string | null
  transcriptUrl?: string | null
}

export interface GalleryAlbum {
  id: ID
  slug: string
  title: string
  description: string
  cover: ImageAsset
  items: GalleryItem[]
}

export interface Testimonial {
  id: ID
  quote: string
  name: string
  context: string
  photo?: ImageAsset | null
}

/* ------------------------------------------------------------------------------------------------
 * People, partners, agents, scholarships
 * ---------------------------------------------------------------------------------------------- */

export interface StaffProfile {
  id: ID
  name: string
  role: string
  group: 'leadership' | 'faculty' | 'professional'
  department: string
  bio: string
  qualifications: string[]
  expertise: string[]
  photo: ImageAsset
  email?: string | null
}

export interface Accreditation {
  id: ID
  name: string
  kind: 'registration' | 'accreditation' | 'awarding-body' | 'partnership' | 'membership'
  description: string
  identifier?: string | null
  validFrom?: ISODate | null
  validTo?: ISODate | null
  evidenceUrl?: string | null
  logo?: ImageAsset | null
}

export interface Agent {
  id: ID
  name: string
  country: string
  city?: string | null
  email?: string | null
  phone?: string | null
  website?: string | null
  languages: string[]
}

export interface Scholarship {
  id: ID
  slug: string
  name: string
  sponsor: string
  value: string
  status: 'open' | 'upcoming' | 'closed'
  eligibility: string[]
  covers: string[]
  exclusions: string[]
  opensAt: ISODate
  closesAt: ISODate
  howToApply: string
  selection: string
  contact: string
}

/* ------------------------------------------------------------------------------------------------
 * Support, resources, policies, FAQs, contacts
 * ---------------------------------------------------------------------------------------------- */

export interface SupportService {
  id: ID
  issue: string
  team: string
  assistance: string
  contact: string
  hours: string
  requestMethod: string
  charges?: string | null
  icon?: IconName
}

export interface OrientationSession {
  id: ID
  title: string
  intakeLabel: string
  campus: CampusRef
  start: ISODateTime
  end: ISODateTime
  timezone: string
  location: string
  topics: string[]
  bring: string[]
  remoteUrl?: string | null
  coordinator: { name: string; email: string }
}

export type ResourceType = 'handbook' | 'form' | 'policy' | 'brochure' | 'calendar' | 'guide'

export interface FileInfo {
  url: string
  format: 'PDF' | 'DOCX' | 'XLSX' | 'PPTX'
  sizeBytes: number
  language: string
}

export interface Resource {
  id: ID
  slug: string
  title: string
  type: ResourceType
  purpose: string
  audiences: (Audience | 'all')[]
  courseSlugs: string[]
  file: FileInfo
  version: string
  effectiveDate: ISODate
  owner: string
}

export interface ResourceQuery {
  type?: ResourceType
  audience?: Audience
  course?: string
  q?: string
}

export interface PolicySummary {
  id: ID
  slug: string
  title: string
  summary: string
  category: string
  version: string
  effectiveDate: ISODate
  owner: string
}

export interface Policy extends PolicySummary {
  body: Markdown
  file?: FileInfo | null
  relatedForms: Resource[]
  contact: string
  seo?: SeoFields
}

export type FaqCategory =
  | 'courses'
  | 'eligibility'
  | 'applications'
  | 'fees'
  | 'intakes'
  | 'campuses'
  | 'international'
  | 'support'
  | 'resources'

export interface Faq {
  id: ID
  question: string
  answer: Markdown
  category: FaqCategory
  links: LinkItem[]
}

export type EnquiryTopic = 'course' | 'admissions' | 'fees' | 'international' | 'agent' | 'support' | 'campus' | 'other'

export interface Department {
  id: ID
  name: string
  description: string
  email: string
  phone?: string | null
  hours?: string | null
  campus?: CampusRef | null
  topics: EnquiryTopic[]
}

/* ------------------------------------------------------------------------------------------------
 * CMS pages — structured blocks rendered by components/blocks
 * ---------------------------------------------------------------------------------------------- */

interface BlockBase {
  id: string
  /** Section background. */
  background?: 'default' | 'alt' | 'night'
}

export interface SectionIntro {
  eyebrow?: string
  heading?: string
  intro?: string
}

export type ModuleName =
  | 'courseSearch'
  | 'categoryGrid'
  | 'featuredCourses'
  | 'intakeExplorer'
  | 'feeExplorer'
  | 'campusList'
  | 'teamDirectory'
  | 'accreditations'
  | 'partnerStrip'
  | 'agentsDirectory'
  | 'scholarships'
  | 'testimonials'
  | 'supportDirectory'
  | 'orientationSessions'
  | 'downloads'
  | 'policies'
  | 'faqDirectory'
  | 'latestNews'
  | 'upcomingEvents'
  | 'galleryAlbums'
  | 'contactDirectory'
  | 'enquiryForm'
  | 'agentEnquiryForm'

export type Block =
  | (BlockBase & SectionIntro & { type: 'richText'; body: Markdown; width?: 'narrow' | 'wide' })
  | (BlockBase & {
      type: 'intro'
      lead: string
      body?: Markdown
      highlights?: { label: string; value: string; icon?: IconName }[]
    })
  | (BlockBase &
      SectionIntro & {
        type: 'featureGrid'
        variant?: 'cards' | 'icons' | 'numbered'
        columns?: 2 | 3 | 4
        items: { title: string; text: string; icon?: IconName; href?: string; linkLabel?: string }[]
      })
  | (BlockBase & SectionIntro & { type: 'steps'; items: { title: string; text: string; meta?: string }[] })
  | (BlockBase &
      SectionIntro & {
        type: 'checklist'
        groups: { title?: string; items: string[] }[]
        note?: string
      })
  | (BlockBase & {
      type: 'split'
      eyebrow?: string
      heading: string
      body: Markdown
      image: ImageAsset
      imageSide?: 'left' | 'right'
      bullets?: string[]
      actions?: Action[]
    })
  | (BlockBase & SectionIntro & { type: 'table'; columns: string[]; rows: string[][]; caption?: string })
  | (BlockBase & {
      type: 'callout'
      tone: 'info' | 'warning' | 'success' | 'danger'
      title: string
      body: Markdown
      action?: Action
    })
  | (BlockBase &
      SectionIntro & {
        type: 'linkCards'
        items: { title: string; text: string; href: string; icon?: IconName; feature?: keyof FeatureFlags }[]
      })
  | (BlockBase & SectionIntro & { type: 'timeline'; items: { label: string; title: string; text: string }[] })
  | (BlockBase & { type: 'quote'; quote: string; attribution: string; role?: string })
  | (BlockBase & { type: 'cta'; eyebrow?: string; heading: string; body?: string; actions: Action[] })
  | (BlockBase & SectionIntro & { type: 'faqs'; items: { question: string; answer: Markdown }[] })
  | (BlockBase & SectionIntro & { type: 'module'; module: ModuleName; props?: Record<string, unknown> })

export type BlockType = Block['type']

/** One rotating hero banner. Words wrapped in *asterisks* in the title get the accent style. */
export interface HeroSlide {
  image: ImageAsset
  eyebrow?: string
  title: string
  summary?: string
  actions?: Action[]
}

export interface Page {
  id: ID
  slug: string
  title: string
  eyebrow?: string
  summary?: string
  hero?: {
    image?: ImageAsset | null
    actions?: Action[]
    /** Rotating banners (home page). When present they replace `image`/`actions`. */
    slides?: HeroSlide[]
    /** Milliseconds each slide stays before advancing (default 7000). */
    interval?: number
  } | null
  /** "article" = narrow long-form layout with a table of contents (policies, legal pages). */
  layout?: 'default' | 'article'
  blocks: Block[]
  seo?: SeoFields
  updatedAt: ISODateTime
}

/* ------------------------------------------------------------------------------------------------
 * Search
 * ---------------------------------------------------------------------------------------------- */

export type SearchResultType = 'course' | 'page' | 'campus' | 'article' | 'event' | 'resource' | 'policy' | 'faq'

export interface SearchResult {
  type: SearchResultType
  title: string
  excerpt: string
  href: string
  meta?: string
}

/* ------------------------------------------------------------------------------------------------
 * Enquiries and applications
 * ---------------------------------------------------------------------------------------------- */

export interface EnquiryInput {
  fullName: string
  email: string
  phone?: string
  country?: string
  audience?: Audience | 'unsure'
  topic: EnquiryTopic
  courseSlug?: string
  campusSlug?: string
  organisation?: string
  message: string
  privacyAccepted: boolean
  marketingOptIn: boolean
  /** Honeypot — must stay empty. */
  website?: string
}

export interface EnquiryReceipt {
  reference: string
  receivedAt: ISODateTime
}

/** Active course/campus/intake combinations a visitor may apply for. */
export interface CourseOption {
  slug: string
  title: string
  level: string
  code?: string | null
  category: string
  offerings: {
    id: ID
    campus: CampusRef & { timezone: string }
    audience: Audience
    deliveryMode: DeliveryMode
    intakes: Intake[]
    fee: FeeSchedule | null
  }[]
}

export type DocumentType =
  | 'qualification'
  | 'transcript'
  | 'language'
  | 'identity'
  | 'cv'
  | 'other'

export interface DocumentRequirement {
  type: DocumentType
  label: string
  description: string
  required: boolean
}

export interface UploadedDocument {
  id: ID
  type: DocumentType
  fileName: string
  sizeBytes: number
  mimeType: string
  /** Server-side malware scan/quarantine state. */
  scanStatus: 'pending' | 'clean' | 'rejected'
  uploadedAt: ISODateTime
}

export interface ApplicationSelection {
  audience: Audience
  courseSlug: string
  offeringId: ID
  intakeId: ID
}

export interface ApplicationPersonal {
  givenNames: string
  familyName: string
  preferredName?: string
  email: string
  phone: string
  dateOfBirth?: string
  citizenship: string
  residency: string
  address?: string
}

export interface ApplicationBackground {
  highestQualification: string
  institution: string
  completionYear: string
  experience?: string
  languageEvidence?: string
}

export interface ApplicationAgent {
  viaAgent: boolean
  agentName?: string
  agentReference?: string
  agentConsent?: boolean
}

export interface ApplicationSupport {
  requested: boolean
  details?: string
}

export interface ApplicationDeclarations {
  accuracy: boolean
  privacy: boolean
  admissions: boolean
}

export interface ApplicationData {
  selection?: ApplicationSelection
  personal?: ApplicationPersonal
  background?: ApplicationBackground
  agent?: ApplicationAgent
  support?: ApplicationSupport
  declarations?: ApplicationDeclarations
}

/** Secret handle for a server-side draft. The token is kept in sessionStorage, never in a URL. */
export interface DraftHandle {
  id: ID
  token: string
  expiresAt: ISODateTime
}

export interface ApplicationDraft {
  id: ID
  expiresAt: ISODateTime
  step: number
  data: ApplicationData
  documents: UploadedDocument[]
  /** Versions of the declarations text shown to the applicant (recorded on submission). */
  declarationVersions: { accuracy: string; privacy: string; admissions: string }
}

export interface ApplicationReceipt {
  reference: string
  receivedAt: ISODateTime
  courseTitle: string
  campusName: string
  intakeStartDate: ISODate
  email: string
}

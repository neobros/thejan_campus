import type { Audience, DeliveryMode, DocumentType, EnquiryTopic, FaqCategory, FeeBasis, IntakeStatus, ResourceType } from '@/api/types'
import type { BadgeTone } from '@/components/ui/Badge'

export const MODE_LABELS: Record<DeliveryMode, string> = {
  'on-campus': 'On campus',
  online: 'Online',
  blended: 'Blended',
}

export const AUDIENCE_LABELS: Record<Audience, string> = {
  domestic: 'Domestic',
  international: 'International',
}

export const AUDIENCE_LONG_LABELS: Record<Audience, string> = {
  domestic: 'Domestic students',
  international: 'International students',
}

export const FEE_BASIS_LABELS: Record<FeeBasis, string> = {
  'whole-course': 'whole course',
  'per-year': 'per year',
  'per-term': 'per term',
  'per-unit': 'per unit',
  'per-week': 'per week',
}

export const INTAKE_STATUS: Record<IntakeStatus, { label: string; tone: BadgeTone }> = {
  open: { label: 'Open', tone: 'success' },
  limited: { label: 'Limited places', tone: 'warning' },
  full: { label: 'Full', tone: 'danger' },
  closed: { label: 'Closed', tone: 'neutral' },
}

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  handbook: 'Handbook',
  form: 'Form',
  policy: 'Policy',
  brochure: 'Brochure',
  calendar: 'Calendar',
  guide: 'Guide',
}

export const FAQ_CATEGORY_LABELS: Record<FaqCategory, string> = {
  courses: 'Courses',
  eligibility: 'Eligibility',
  applications: 'Applications',
  fees: 'Fees',
  intakes: 'Intakes',
  campuses: 'Campuses',
  international: 'International',
  support: 'Support',
  resources: 'Resources',
}

export const ENQUIRY_TOPIC_LABELS: Record<EnquiryTopic, string> = {
  course: 'Course information',
  admissions: 'Applying and admissions',
  fees: 'Fees and payments',
  international: 'International students',
  agent: 'Education agents',
  support: 'Student support',
  campus: 'Campus visits and facilities',
  other: 'Something else',
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  qualification: 'Qualification',
  transcript: 'Transcript',
  language: 'English language evidence',
  identity: 'Identity document',
  cv: 'CV',
  other: 'Other',
}

/** Message shown wherever an approved fee record is missing (spec §5.5 — never show as zero). */
export const NO_FEE_MESSAGE = 'Contact admissions for current fees.'

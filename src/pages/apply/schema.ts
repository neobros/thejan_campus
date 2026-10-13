import { z } from 'zod'
import type {
  ApplicationAgent,
  ApplicationBackground,
  ApplicationPersonal,
  ApplicationSelection,
  ApplicationSupport,
  Audience,
  CourseOption,
} from '@/api/types'

/** Application steps (spec §6.1). The confirmation is a separate route. */
export const STEPS = [
  { key: 'course', title: 'Course', heading: 'Choose your course and intake' },
  { key: 'details', title: 'Your details', heading: 'Your details' },
  { key: 'background', title: 'Study background', heading: 'Your study background' },
  { key: 'agent', title: 'Agent', heading: 'Applying with an agent?' },
  { key: 'documents', title: 'Documents', heading: 'Supporting documents' },
  { key: 'support', title: 'Support', heading: 'Support while you study' },
  { key: 'review', title: 'Review', heading: 'Review and submit' },
] as const

export const LAST_STEP = STEPS.length - 1
export const DOCUMENTS_STEP = 4

const required = (message: string, max = 120) =>
  z.string().trim().min(1, message).max(max, `Keep this under ${max} characters.`)
const optional = (max = 200) => z.string().trim().max(max, `Keep this under ${max} characters.`)

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_WITH_CODE = /^\+\d[\d\s().-]{6,22}$/

/* ------------------------------------------------------------------------------------------------
 * Step 1 — course selection
 * ---------------------------------------------------------------------------------------------- */

export const selectionSchema = z.object({
  audience: z.string().refine((v) => v === 'domestic' || v === 'international', 'Choose whether you are a domestic or international student.'),
  courseSlug: z.string().min(1, 'Choose a course.'),
  offeringId: z.string().min(1, 'Choose a campus and study mode.'),
  intakeId: z.string().min(1, 'Choose an intake.'),
})
export type SelectionValues = z.input<typeof selectionSchema>
export const SELECTION_ORDER = ['audience', 'courseSlug', 'offeringId', 'intakeId'] as const

export const EMPTY_SELECTION: SelectionValues = { audience: '', courseSlug: '', offeringId: '', intakeId: '' }

/**
 * Turn a (possibly stale or hand-edited) course/campus/audience/intake context into a valid
 * selection. Anything that does not match a currently open offering is dropped.
 */
export function resolveSelection(
  options: CourseOption[],
  source: { audience?: string | null; course?: string | null; campus?: string | null; offeringId?: string | null; intake?: string | null },
): SelectionValues {
  const isAudience = (v?: string | null): v is Audience => v === 'domestic' || v === 'international'
  let audience: Audience | undefined = isAudience(source.audience) ? source.audience : undefined
  if (audience && !options.some((c) => c.offerings.some((o) => o.audience === audience))) audience = undefined

  const course = options.find((c) => c.slug === source.course)
  if (!course) return { ...EMPTY_SELECTION, audience: audience ?? '' }

  let offering = source.intake ? course.offerings.find((o) => o.intakes.some((i) => i.id === source.intake)) : undefined
  if (!offering && source.offeringId) offering = course.offerings.find((o) => o.id === source.offeringId)
  if (offering && audience && offering.audience !== audience) offering = undefined
  if (!audience) {
    const audiences = new Set(course.offerings.map((o) => o.audience))
    audience = offering?.audience ?? (audiences.size === 1 ? [...audiences][0] : undefined)
  }
  if (!audience || !course.offerings.some((o) => o.audience === audience)) return { ...EMPTY_SELECTION, audience: audience ?? '' }

  if (!offering) {
    const matching = course.offerings.filter((o) => o.audience === audience && (!source.campus || o.campus.slug === source.campus))
    if (matching.length === 1) offering = matching[0]
  }
  const intakeId = offering && source.intake && offering.intakes.some((i) => i.id === source.intake) ? source.intake : ''
  return { audience, courseSlug: course.slug, offeringId: offering?.id ?? '', intakeId }
}

export function selectionFromForm(v: SelectionValues): ApplicationSelection {
  return { audience: v.audience as Audience, courseSlug: v.courseSlug, offeringId: v.offeringId, intakeId: v.intakeId }
}

/** Look up the selected course, offering and intake in the open-options tree. */
export function findSelection(options: CourseOption[], selection?: { courseSlug: string; offeringId: string; intakeId: string } | null) {
  const course = selection ? options.find((c) => c.slug === selection.courseSlug) : undefined
  const offering = course?.offerings.find((o) => o.id === selection?.offeringId)
  const intake = offering?.intakes.find((i) => i.id === selection?.intakeId)
  return { course, offering, intake }
}

/* ------------------------------------------------------------------------------------------------
 * Step 2 — personal details
 * ---------------------------------------------------------------------------------------------- */

export const personalSchema = z.object({
  givenNames: required('Enter your given names, as shown on your identity documents.'),
  familyName: required('Enter your family name, as shown on your identity documents.'),
  preferredName: optional(80),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .max(200, 'Keep the email address under 200 characters.')
    .refine((v) => EMAIL.test(v), 'Enter a valid email address, like name@example.com.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Enter your phone number, including the country code.')
    .refine((v) => PHONE_WITH_CODE.test(v), 'Include the country code, starting with +, for example +44 20 7946 0000.'),
  dateOfBirth: z
    .string()
    .refine((v) => !v || (/^\d{4}-\d{2}-\d{2}$/.test(v) && v > '1900-01-01' && v < new Date().toISOString().slice(0, 10)), 'Enter a valid date of birth.'),
  citizenship: required('Enter your country of citizenship.', 80),
  residency: required('Enter the country where you currently live.', 80),
  address: optional(300),
})
export type PersonalValues = z.input<typeof personalSchema>
export const PERSONAL_ORDER = ['givenNames', 'familyName', 'preferredName', 'email', 'phone', 'dateOfBirth', 'citizenship', 'residency', 'address'] as const

export function personalToForm(p?: ApplicationPersonal): PersonalValues {
  return {
    givenNames: p?.givenNames ?? '',
    familyName: p?.familyName ?? '',
    preferredName: p?.preferredName ?? '',
    email: p?.email ?? '',
    phone: p?.phone ?? '',
    dateOfBirth: p?.dateOfBirth ?? '',
    citizenship: p?.citizenship ?? '',
    residency: p?.residency ?? '',
    address: p?.address ?? '',
  }
}

export function personalFromForm(v: PersonalValues): ApplicationPersonal {
  return {
    givenNames: v.givenNames,
    familyName: v.familyName,
    preferredName: v.preferredName || undefined,
    email: v.email,
    phone: v.phone,
    dateOfBirth: v.dateOfBirth || undefined,
    citizenship: v.citizenship,
    residency: v.residency,
    address: v.address || undefined,
  }
}

/* ------------------------------------------------------------------------------------------------
 * Step 3 — study background
 * ---------------------------------------------------------------------------------------------- */

export const backgroundSchema = z.object({
  highestQualification: required('Enter your highest completed (or current) qualification.', 160),
  institution: required('Enter the school, college or university where you studied.', 160),
  completionYear: z
    .string()
    .trim()
    .refine((v) => /^\d{4}$/.test(v) && Number(v) >= 1940 && Number(v) <= new Date().getFullYear() + 2, 'Enter the year you completed it (or expect to), for example 2024.'),
  experience: optional(1500),
  languageEvidence: optional(300),
})
export type BackgroundValues = z.input<typeof backgroundSchema>
export const BACKGROUND_ORDER = ['highestQualification', 'institution', 'completionYear', 'experience', 'languageEvidence'] as const

export function backgroundToForm(b?: ApplicationBackground): BackgroundValues {
  return {
    highestQualification: b?.highestQualification ?? '',
    institution: b?.institution ?? '',
    completionYear: b?.completionYear ?? '',
    experience: b?.experience ?? '',
    languageEvidence: b?.languageEvidence ?? '',
  }
}

export function backgroundFromForm(v: BackgroundValues): ApplicationBackground {
  return {
    highestQualification: v.highestQualification,
    institution: v.institution,
    completionYear: v.completionYear,
    experience: v.experience || undefined,
    languageEvidence: v.languageEvidence || undefined,
  }
}

/* ------------------------------------------------------------------------------------------------
 * Step 4 — agent
 * ---------------------------------------------------------------------------------------------- */

export const agentSchema = z
  .object({
    viaAgent: z.string().refine((v) => v === 'direct' || v === 'agent', 'Tell us whether you are applying directly or through an agent.'),
    agentName: optional(160),
    agentReference: optional(80),
    agentConsent: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.viaAgent !== 'agent') return
    if (!v.agentName) ctx.addIssue({ code: 'custom', path: ['agentName'], message: 'Enter the name of your agent or agency.' })
    if (!v.agentConsent)
      ctx.addIssue({ code: 'custom', path: ['agentConsent'], message: 'Confirm that we may discuss your application with your agent.' })
  })
export type AgentValues = z.input<typeof agentSchema>
export const AGENT_ORDER = ['viaAgent', 'agentName', 'agentReference', 'agentConsent'] as const

export function agentToForm(a?: ApplicationAgent): AgentValues {
  return {
    viaAgent: a ? (a.viaAgent ? 'agent' : 'direct') : '',
    agentName: a?.agentName ?? '',
    agentReference: a?.agentReference ?? '',
    agentConsent: a?.agentConsent ?? false,
  }
}

export function agentFromForm(v: AgentValues): ApplicationAgent {
  if (v.viaAgent !== 'agent') return { viaAgent: false }
  return { viaAgent: true, agentName: v.agentName, agentReference: v.agentReference || undefined, agentConsent: v.agentConsent }
}

/* ------------------------------------------------------------------------------------------------
 * Step 6 — support
 * ---------------------------------------------------------------------------------------------- */

export const supportSchema = z
  .object({
    requested: z.string().refine((v) => v === 'no' || v === 'yes', 'Tell us whether you would like to request support.'),
    details: optional(1000),
  })
  .superRefine((v, ctx) => {
    if (v.requested === 'yes' && !v.details)
      ctx.addIssue({ code: 'custom', path: ['details'], message: 'Briefly tell us what support would help, or choose “No”.' })
  })
export type SupportValues = z.input<typeof supportSchema>
export const SUPPORT_ORDER = ['requested', 'details'] as const

export function supportToForm(s?: ApplicationSupport): SupportValues {
  return { requested: s ? (s.requested ? 'yes' : 'no') : '', details: s?.details ?? '' }
}

export function supportFromForm(v: SupportValues): ApplicationSupport {
  return v.requested === 'yes' ? { requested: true, details: v.details } : { requested: false }
}

/* ------------------------------------------------------------------------------------------------
 * Step 7 — declarations
 * ---------------------------------------------------------------------------------------------- */

export const declarationsSchema = z.object({
  accuracy: z.boolean().refine((v) => v, 'Confirm that the information you have given is true and complete.'),
  privacy: z.boolean().refine((v) => v, 'Confirm that you have read the privacy notice.'),
  admissions: z.boolean().refine((v) => v, 'Confirm that you understand what submitting this application means.'),
})
export type DeclarationsValues = z.input<typeof declarationsSchema>
export const DECLARATIONS_ORDER = ['accuracy', 'privacy', 'admissions'] as const

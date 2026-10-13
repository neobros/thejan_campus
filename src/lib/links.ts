import type { Audience, EnquiryTopic } from '@/api/types'

/** Context carried from course/campus pages into the enquiry and application forms (spec §3). */
export interface StudyContext {
  course?: string
  campus?: string
  audience?: Audience
  intake?: string
}

function withParams(path: string, params: Record<string, string | undefined>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value)
  const query = search.toString()
  return query ? `${path}?${query}` : path
}

export function applyHref(context: StudyContext = {}) {
  return withParams('/apply', { course: context.course, campus: context.campus, audience: context.audience, intake: context.intake })
}

export function enquireHref(context: StudyContext & { topic?: EnquiryTopic } = {}) {
  return withParams('/enquire', {
    topic: context.topic ?? (context.course ? 'course' : undefined),
    course: context.course,
    campus: context.campus,
    audience: context.audience,
  })
}

export function coursesHref(filters: Record<string, string | undefined> = {}) {
  return withParams('/courses', filters)
}

/** Only render tel:/mailto: links for real values — never for "[PLACEHOLDER]" text. */
export function isDialable(phone?: string | null): phone is string {
  return Boolean(phone && /^[+\d(][\d\s().-]{5,}$/.test(phone.trim()))
}

export function isEmail(email?: string | null): email is string {
  return Boolean(email && /^[^\s@[\]]+@[^\s@[\]]+\.[^\s@[\]]+$/.test(email.trim()))
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function isExternalUrl(href: string) {
  return /^(https?:)?\/\//i.test(href)
}

/** Static files must bypass the client-side router. */
export function isFileUrl(href: string) {
  return /\.(pdf|docx?|xlsx?|pptx?|zip|csv|txt|png|jpe?g|webp|avif|svg)(\?.*)?$/i.test(href)
}

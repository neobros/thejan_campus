/**
 * Display formatting. Calendar dates (YYYY-MM-DD) are rendered exactly as stored — they are
 * already "campus local" dates. Date-times (ISO 8601 with offset) are rendered in the campus
 * timezone passed by the caller, never the visitor's browser timezone.
 */

const DEFAULT_LOCALE = 'en-GB'

let locale = DEFAULT_LOCALE

/** Called once settings load so all formatting follows the institution's locale. */
export function setFormatLocale(next: string | undefined) {
  locale = next || DEFAULT_LOCALE
}

export function formatMoney(amount: string | number, currency: string) {
  const value = typeof amount === 'number' ? amount : Number(amount)
  if (!Number.isFinite(value)) return `${currency} ${amount}`
  const hasCents = Math.round(value * 100) % 100 !== 0
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace(/ /g, ' ')
}

function parseCalendarDate(isoDate: string) {
  const [y, m, d] = isoDate.slice(0, 10).split('-').map(Number)
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1))
}

type DateStyle = 'long' | 'medium' | 'short' | 'weekday'

const dateStyles: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  long: { day: 'numeric', month: 'long', year: 'numeric' },
  medium: { day: 'numeric', month: 'short', year: 'numeric' },
  short: { day: 'numeric', month: 'short' },
  weekday: { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' },
}

/** Format a calendar date (YYYY-MM-DD) without any timezone shift. */
export function formatDate(isoDate: string, style: DateStyle = 'long') {
  return new Intl.DateTimeFormat(locale, { ...dateStyles[style], timeZone: 'UTC' }).format(parseCalendarDate(isoDate))
}

export function formatMonth(isoDate: string) {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    parseCalendarDate(isoDate),
  )
}

/** Parts used by date "tiles" (e.g. event cards). */
export function dateParts(iso: string, timeZone = 'UTC') {
  const date = iso.length <= 10 ? parseCalendarDate(iso) : new Date(iso)
  const tz = iso.length <= 10 ? 'UTC' : timeZone
  const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { ...opts, timeZone: tz }).format(date)
  return { day: fmt({ day: 'numeric' }), month: fmt({ month: 'short' }), year: fmt({ year: 'numeric' }), weekday: fmt({ weekday: 'short' }) }
}

/** Format an instant in a specific (campus) timezone. */
export function formatDateTime(iso: string, timeZone: string, style: 'long' | 'short' = 'long') {
  return new Intl.DateTimeFormat(locale, {
    ...(style === 'long'
      ? { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }
      : { day: 'numeric', month: 'short' }),
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(new Date(iso))
}

export function formatTime(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', timeZone }).format(new Date(iso))
}

/** "Tue 4 March 2026, 10:00 – 12:30" (same day) or a full range across days, in the campus timezone. */
export function formatDateTimeRange(startIso: string, endIso: string, timeZone: string) {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const dayKey = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone }).format(d)
  if (dayKey(start) === dayKey(end)) {
    return `${formatDateTime(startIso, timeZone)} – ${formatTime(endIso, timeZone)}`
  }
  return `${formatDateTime(startIso, timeZone)} – ${formatDateTime(endIso, timeZone)}`
}

/** Short timezone label for an instant, e.g. "GMT+5:30" or "AEDT". */
export function timeZoneLabel(timeZone: string, at: Date = new Date()) {
  const part = new Intl.DateTimeFormat(locale, { timeZone, timeZoneName: 'short' })
    .formatToParts(at)
    .find((p) => p.type === 'timeZoneName')
  return part?.value ?? timeZone
}

/** Human city/region name for an IANA zone, e.g. "Asia/Colombo" → "Colombo". */
export function timeZoneCity(timeZone: string) {
  return timeZone.split('/').pop()?.replace(/_/g, ' ') ?? timeZone
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value >= 10 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`
}

/** Whole days from today (local calendar) until a calendar date; negative when in the past. */
export function daysUntil(isoDate: string, now: Date = new Date()) {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((parseCalendarDate(isoDate).getTime() - today) / 86_400_000)
}

export function relativeDays(isoDate: string, now: Date = new Date()) {
  const days = daysUntil(isoDate, now)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  if (Math.abs(days) >= 60) return rtf.format(Math.round(days / 30), 'month')
  if (Math.abs(days) >= 14) return rtf.format(Math.round(days / 7), 'week')
  return rtf.format(days, 'day')
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

export function formatList(items: string[], type: 'conjunction' | 'disjunction' = 'conjunction') {
  return new Intl.ListFormat(locale, { style: 'long', type }).format(items)
}

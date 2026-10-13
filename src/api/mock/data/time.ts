/**
 * Demo dates are generated relative to today so intakes, events and deadlines stay current
 * whenever the preview is opened.
 */
const now = new Date()

export const TODAY = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))

export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

export function daysFromToday(days: number) {
  return isoDate(addDays(TODAY, days))
}

/** First Monday of the month `monthsAhead` months from now (plus optional whole weeks). */
export function mondayOfMonth(monthsAhead: number, extraWeeks = 0) {
  const date = new Date(Date.UTC(TODAY.getUTCFullYear(), TODAY.getUTCMonth() + monthsAhead, 1))
  while (date.getUTCDay() !== 1) date.setUTCDate(date.getUTCDate() + 1)
  date.setUTCDate(date.getUTCDate() + extraWeeks * 7)
  return isoDate(date)
}

/** ISO instant for a calendar day and time in UTC (the demo campuses use the UTC timezone). */
export function at(isoDay: string, time: string) {
  return `${isoDay}T${time}:00Z`
}

export function yearStart(offsetYears = 0) {
  return `${TODAY.getUTCFullYear() + offsetYears}-01-01`
}

export function yearEnd(offsetYears = 0) {
  return `${TODAY.getUTCFullYear() + offsetYears}-12-31`
}

/**
 * Minimal RFC 5545 calendar file for a single event, generated in the browser (no ticketing or
 * registration is implied — it only saves the date to the visitor's calendar).
 */
export interface IcsEvent {
  uid: string
  title: string
  description?: string
  location?: string
  url?: string
  start: string
  end: string
}

/** 2026-03-04T10:00:00Z → 20260304T100000Z */
export function toIcsDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

export function escapeIcsText(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

/** Fold content lines at 75 octets (UTF-8 safe); continuation lines start with a space. */
function fold(line: string) {
  const encoder = new TextEncoder()
  const out: string[] = []
  let current = ''
  let bytes = 0
  for (const char of line) {
    const size = encoder.encode(char).length
    const limit = out.length === 0 ? 75 : 74
    if (bytes + size > limit) {
      out.push(current)
      current = ''
      bytes = 0
    }
    current += char
    bytes += size
  }
  out.push(current)
  return out.join('\r\n ')
}

export function buildIcs(event: IcsEvent, productName = 'Campus website') {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${escapeIcsText(productName)}//Events//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(event.start)}`,
    `DTEND:${toIcsDate(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeIcsText(event.description)}` : null,
    event.location ? `LOCATION:${escapeIcsText(event.location)}` : null,
    event.url ? `URL:${event.url}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter((line): line is string => line !== null)
  return `${lines.map(fold).join('\r\n')}\r\n`
}

export function downloadIcs(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.ics') ? filename : `${filename}.ics`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

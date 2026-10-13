import { useEffect, useState } from 'react'

/** Lower-case, accent-insensitive text for forgiving client-side matching ("Bogota" finds "Bogotá"). */
export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
}

/** True when every word of the query appears somewhere in the haystack fields. */
export function matchesQuery(query: string, ...fields: (string | null | undefined)[]) {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return true
  const haystack = normalizeText(fields.filter(Boolean).join(' '))
  return terms.every((term) => haystack.includes(term))
}

/** Rough plain text from CMS markdown, for searching answers. */
export function stripMarkdown(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

/** Calendar date (YYYY-MM-DD) for "today" in the visitor's local calendar. */
export function todayIso(now: Date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** Display host for a URL, e.g. "example.org". */
export function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

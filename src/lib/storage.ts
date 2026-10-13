/**
 * Browser storage can be unavailable (private windows, blocked site data, embedded previews).
 * Every access is wrapped so the site keeps working without it.
 */
type Area = 'local' | 'session'

function area(kind: Area): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

export function readString(key: string, kind: Area = 'local'): string | null {
  try {
    return area(kind)?.getItem(key) ?? null
  } catch {
    return null
  }
}

export function writeString(key: string, value: string, kind: Area = 'local') {
  try {
    area(kind)?.setItem(key, value)
  } catch {
    /* storage full or blocked — ignore */
  }
}

export function removeKey(key: string, kind: Area = 'local') {
  try {
    area(kind)?.removeItem(key)
  } catch {
    /* ignore */
  }
}

export function readJson<T>(key: string, kind: Area = 'local'): T | null {
  const raw = readString(key, kind)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function writeJson(key: string, value: unknown, kind: Area = 'local') {
  try {
    writeString(key, JSON.stringify(value), kind)
  } catch {
    /* ignore */
  }
}

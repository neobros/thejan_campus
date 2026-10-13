import { readJson, writeJson } from '@/lib/storage'

/**
 * Tiny persistence layer that stands in for the backend database in demo mode. Data lives in
 * this browser's localStorage only — nothing is sent anywhere.
 */
const PREFIX = 'campus-demo:'

export function load<T>(name: string, fallback: T): T {
  return readJson<T>(PREFIX + name) ?? fallback
}

export function save<T>(name: string, value: T) {
  writeJson(PREFIX + name, value)
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Human-friendly reference such as "ENQ-7K3P-9XQ2" (no ambiguous characters). */
export function makeReference(prefix: string) {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')
  return `${prefix}-${chars.slice(0, 4)}-${chars.slice(4)}`
}

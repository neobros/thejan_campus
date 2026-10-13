import type { CSSProperties } from 'react'
import type { Tone } from '@/api/types'

/** Rich duotone palettes for artwork and placeholders — one per `Tone`. */
export interface Palette {
  deep: string
  mid: string
  light: string
  accent: string
}

export const PALETTES: Record<Tone, Palette> = {
  brand: { deep: '#0b1240', mid: '#2b45b8', light: '#8ea8ff', accent: '#f2aa2e' },
  sky: { deep: '#06192e', mid: '#0a4f82', light: '#38bdf8', accent: '#bae6fd' },
  gold: { deep: '#3a1a05', mid: '#b4530a', light: '#f5b43a', accent: '#fff1cc' },
  emerald: { deep: '#03281f', mid: '#0a7a58', light: '#5eead4', accent: '#d1fae5' },
  violet: { deep: '#250c4d', mid: '#6d28d9', light: '#c4b5fd', accent: '#fbcfe8' },
  rose: { deep: '#48091f', mid: '#be123c', light: '#fda4af', accent: '#fde68a' },
  teal: { deep: '#042f33', mid: '#0f766e', light: '#5eead4', accent: '#fef3c7' },
  slate: { deep: '#111827', mid: '#475569', light: '#cbd5e1', accent: '#f2aa2e' },
}

const CATEGORY_TONES: Record<string, Tone> = {
  business: 'brand',
  'information-technology': 'sky',
  hospitality: 'gold',
  health: 'emerald',
  english: 'violet',
  'short-courses': 'rose',
}

export function categoryTone(slug: string, fallback: Tone = 'brand'): Tone {
  return CATEGORY_TONES[slug] ?? fallback
}

/** Layered mesh gradient background. */
export function meshStyle(p: Palette): CSSProperties {
  return {
    backgroundImage: [
      `radial-gradient(120% 90% at 85% 10%, ${p.light}66 0%, transparent 55%)`,
      `radial-gradient(90% 80% at 10% 100%, ${p.mid} 0%, transparent 60%)`,
      `radial-gradient(70% 60% at 60% 60%, ${p.mid}aa 0%, transparent 70%)`,
      `linear-gradient(160deg, ${p.deep} 0%, ${p.mid} 70%, ${p.deep} 130%)`,
    ].join(','),
  }
}

export function hashString(value: string) {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619)
  return Math.abs(h)
}

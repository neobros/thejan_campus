import { describe, expect, it } from 'vitest'
import { checkUpload } from './files'
import { formatMoney } from './format'
import { applyHref, enquireHref, isDialable, isEmail } from './links'

const file = (bytes: number[], name: string, size?: number) => {
  const f = new File([new Uint8Array(bytes)], name)
  if (size) Object.defineProperty(f, 'size', { value: size })
  return f
}

describe('checkUpload', () => {
  it('accepts a PDF identified by its signature', async () => {
    expect(await checkUpload(file([0x25, 0x50, 0x44, 0x46, 0x2d, 1, 2], 'cv.pdf'), 0)).toEqual({ ok: true, kind: 'pdf' })
  })
  it('rejects a renamed executable', async () => {
    const result = await checkUpload(file([0x4d, 0x5a, 0x90, 0x00], 'cv.pdf'), 0)
    expect(result.ok).toBe(false)
  })
  it('rejects files over 10 MB and totals over 50 MB', async () => {
    expect((await checkUpload(file([0x25, 0x50, 0x44, 0x46, 0x2d], 'a.pdf', 11 * 1024 * 1024), 0)).ok).toBe(false)
    expect((await checkUpload(file([0x25, 0x50, 0x44, 0x46, 0x2d], 'a.pdf', 5 * 1024 * 1024), 46 * 1024 * 1024)).ok).toBe(false)
  })
})

describe('links', () => {
  it('never treats placeholders as dialable or emailable', () => {
    expect(isDialable('[PHONE_NUMBER]')).toBe(false)
    expect(isEmail('[ADMISSIONS_EMAIL]')).toBe(false)
    expect(isDialable('+94 11 234 5678')).toBe(true)
    expect(isEmail('admissions@example.com')).toBe(true)
  })
  it('preserves study context in apply/enquire links', () => {
    expect(applyHref({ course: 'diploma-of-business', audience: 'international' })).toBe('/apply?course=diploma-of-business&audience=international')
    expect(enquireHref({ course: 'x' })).toBe('/enquire?topic=course&course=x')
  })
})

describe('formatMoney', () => {
  it('shows currency code and drops zero cents', () => {
    expect(formatMoney('12500', 'USD')).toMatch(/USD\s?12,500$/)
  })
})

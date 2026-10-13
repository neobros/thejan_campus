import { beforeEach, describe, expect, it } from 'vitest'
import { createMockApi } from './index'

const api = createMockApi({ latency: 0 })

const enquiry = {
  fullName: 'Test Person',
  email: 'test@example.com',
  topic: 'course' as const,
  message: 'I would like to know more about this course.',
  privacyAccepted: true,
  marketingOptIn: false,
}

describe('mock API', () => {
  beforeEach(() => localStorage.clear())

  it('stores an enquiry once per idempotency key', async () => {
    const a = await api.createEnquiry(enquiry, { idempotencyKey: 'k1' })
    const b = await api.createEnquiry(enquiry, { idempotencyKey: 'k1' })
    const c = await api.createEnquiry(enquiry, { idempotencyKey: 'k2' })
    expect(a.reference).toBe(b.reference)
    expect(c.reference).not.toBe(a.reference)
  })

  it('rejects enquiries without privacy acknowledgement', async () => {
    await expect(api.createEnquiry({ ...enquiry, privacyAccepted: false }, { idempotencyKey: 'k3' })).rejects.toMatchObject({ status: 422 })
  })

  it('only offers open intakes for applications', async () => {
    const options = await api.listCourseOptions()
    const intakes = options.flatMap((c) => c.offerings.flatMap((o) => o.intakes))
    expect(intakes.length).toBeGreaterThan(0)
    expect(intakes.every((i) => i.status === 'open' || i.status === 'limited')).toBe(true)
  })

  it('never reports a missing fee as zero', async () => {
    const fees = await api.listFees({})
    expect(fees.some((f) => f.fee === null)).toBe(true)
    expect(fees.every((f) => f.fee === null || Number(f.fee.tuition.amount) > 0)).toBe(true)
  })

  it('requires the draft token', async () => {
    const handle = await api.createApplicationDraft()
    await expect(api.getApplicationDraft({ ...handle, token: 'wrong' })).rejects.toMatchObject({ status: 404 })
  })

  it('returns 404 for unknown courses and disabled pages stay published only when enabled', async () => {
    await expect(api.getCourse('nope')).rejects.toMatchObject({ status: 404 })
    await expect(api.getPage('about')).resolves.toMatchObject({ slug: 'about' })
  })
})

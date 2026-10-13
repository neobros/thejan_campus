import type { Scholarship } from '@/api/types'
import { daysFromToday } from './time'

/**
 * DEMO DATA — sample scholarships showing the open, upcoming and closed states (specification §5.11).
 * Values, sponsors and eligibility are placeholders: never invent funding or eligibility criteria.
 */
export const scholarships: Scholarship[] = [
  {
    id: 'scholarship-diploma-excellence',
    slug: 'diploma-excellence-scholarship',
    name: 'Diploma Excellence Scholarship (sample)',
    sponsor: 'AIT',
    value: '[Tuition reduction amount or percentage, and currency — to be confirmed]',
    status: 'open',
    eligibility: [
      'Applying for a diploma-level course at AIT that starts in an eligible intake',
      'Meets all entry requirements for the chosen course',
      '[Academic or other merit criteria — to be confirmed]',
      '[Eligible student types, e.g. domestic, international or both — to be confirmed]',
    ],
    covers: ['[Covered portion of tuition fees — to be confirmed]'],
    exclusions: [
      'Application processing fee',
      'Learning materials, uniforms, kits and equipment',
      'Living, travel and insurance costs',
      '[Other exclusions — to be confirmed]',
    ],
    opensAt: daysFromToday(-21),
    closesAt: daysFromToday(35),
    howToApply:
      'Submit your course application first, then complete the scholarship application form and a short written statement by the closing date. [Application method — to be confirmed.]',
    selection:
      'Applications are assessed by a selection panel against the published criteria. [Panel membership, criteria weighting and notification timing — to be confirmed.]',
    contact: 'Admissions team — admissions@example.com',
  },
  {
    id: 'scholarship-community-access',
    slug: 'community-access-bursary',
    name: 'Community Access Bursary (sample)',
    sponsor: '[Sponsor name — to be confirmed]',
    value: '[Bursary amount and currency — to be confirmed]',
    status: 'upcoming',
    eligibility: [
      '[Eligibility criteria agreed with the sponsor — to be confirmed]',
      'Applying for or enrolled in an eligible certificate-level course [eligible courses — to be confirmed]',
      '[Evidence of circumstances required — to be confirmed]',
    ],
    covers: ['[Covered costs, e.g. tuition or learning materials — to be confirmed]'],
    exclusions: ['Living, travel and insurance costs', '[Other exclusions — to be confirmed]'],
    opensAt: daysFromToday(30),
    closesAt: daysFromToday(75),
    howToApply: 'Applications open on the date shown. The application form and guidance will be published here when the bursary opens.',
    selection: '[Selection process agreed with the sponsor — to be confirmed.]',
    contact: 'Student support — support@example.com',
  },
  {
    id: 'scholarship-international-early',
    slug: 'international-early-application-award',
    name: 'International Early Application Award (sample)',
    sponsor: 'AIT',
    value: '[Award value and currency — to be confirmed]',
    status: 'closed',
    eligibility: [
      'International applicant for an eligible course and intake',
      'Complete application submitted by [early application date — to be confirmed]',
      'Meets all entry requirements and accepts the offer by the date stated in the offer',
    ],
    covers: ['[Covered portion of first-term tuition — to be confirmed]'],
    exclusions: ['Application processing fee', 'Living, travel and insurance costs', '[Other exclusions — to be confirmed]'],
    opensAt: daysFromToday(-120),
    closesAt: daysFromToday(-40),
    howToApply: 'This round has closed. Future rounds, if offered, will be listed on this page.',
    selection: '[Selection process — to be confirmed.]',
    contact: 'International office — international@example.com',
  },
]

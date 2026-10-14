import type { InstitutionSettings } from '@/api/types'

/**
 * DEMO DATA — institution identity uses bracketed placeholders that must be replaced with
 * client-approved values (specification §12) before anything is published.
 */
export const settings: InstitutionSettings = {
  name: 'AIT',
  shortName: 'AIT',
  legalName: '[LEGAL_ENTITY_NAME]',
  tradingName: null,
  tagline: 'Australian skills. Local opportunity. A wider future.',
  description:
    'Explore international education and vocational training opportunities in Sri Lanka through selected programmes offered in collaboration with Australian education providers.',
  country: 'Sri Lanka',
  timezone: 'Asia/Colombo',
  currency: 'AUD',
  locale: 'en-AU',
  contact: {
    phone: '[PHONE_NUMBER]',
    email: '[ADMISSIONS_EMAIL]',
    address: '[STREET_ADDRESS], Colombo 14, Sri Lanka',
    hours: 'Monday to Friday, [OPENING_HOURS]',
  },
  // Only verified registrations that apply to this provider are listed. None are confirmed yet.
  identifiers: [],
  acknowledgement: null,
  studentPortalUrl: null,
  lmsUrl: null,
  // Demo links point at each network's home page until the client supplies official accounts.
  social: [
    { network: 'facebook', url: 'https://www.facebook.com/' },
    { network: 'instagram', url: 'https://www.instagram.com/' },
    { network: 'linkedin', url: 'https://www.linkedin.com/' },
    { network: 'youtube', url: 'https://www.youtube.com/' },
  ],
  features: {
    international: true,
    domestic: true,
    scholarships: true,
    creditTransfer: true,
    agents: true,
  },
  emergency: {
    title: 'In an emergency',
    body: 'Website forms, enquiry inboxes and chat are not monitored for emergencies. If you or someone else is in immediate danger, contact local emergency services first, then let campus staff know.',
    phone: '[EMERGENCY_NUMBER]',
    phoneLabel: 'Local emergency services',
  },
  seo: {
    titleTemplate: '%s | AIT',
    defaultTitle: 'AIT — Courses, admissions and student support',
    description:
      'Explore study opportunities at AIT. Compare courses, review entry requirements and speak with our admissions team about your next step.',
    // Provisional typographic treatment from the concept pack — replace once the approved logo arrives.
    image: '/og-default.jpg',
  },
}

import type { Page } from '@/api/types'
import { media } from '../media'
import { TODAY } from '../time'

/**
 * DEMO DATA — campus listing, gallery and contact pages (specification §5.23, §5.25, §5.26).
 * Contact details mirror the placeholders in settings.ts and campuses.ts. Never promise a
 * response time for enquiries.
 */
const updatedAt = TODAY.toISOString()

export const campusesPage: Page = {
  id: 'page-campuses',
  slug: 'campuses',
  title: 'Our campuses',
  eyebrow: 'Campuses',
  summary: 'Three campuses, each with its own specialist facilities. Find the one that offers your course.',
  hero: { image: media.page.campuses },
  blocks: [
    {
      id: 'campuses-intro',
      type: 'intro',
      lead: 'Each campus has its own specialist facilities and study areas. Find the campus that offers your course, then visit its page for directions, opening hours, accessibility information and contacts.',
    },
    {
      id: 'campuses-list',
      type: 'module',
      module: 'campusList',
      background: 'alt',
      eyebrow: 'Locations',
      heading: 'Choose a campus',
    },
    {
      id: 'campuses-compare',
      type: 'table',
      eyebrow: 'At a glance',
      heading: 'Study areas and facilities by campus',
      columns: ['Campus', 'Study areas', 'Specialist facilities'],
      rows: [
        ['City Campus', 'Business, information technology, English language, short courses', 'Library, computer lab, flexible classrooms, student lounge'],
        ['Riverside Campus', 'Hospitality and cookery, business', 'Commercial training kitchens, training restaurant, common room'],
        ['Parkview Campus', 'Health and community services, English language', 'Simulated care rooms, library corner, outdoor seating'],
      ],
      caption: 'Course availability varies by intake. Check each course page for the campuses where it is offered.',
    },
    {
      id: 'campuses-visit',
      type: 'featureGrid',
      background: 'alt',
      variant: 'icons',
      columns: 4,
      eyebrow: 'Visiting',
      heading: 'Planning your visit',
      items: [
        { icon: 'clock', title: 'Opening hours', text: 'Hours are listed on each campus page and may differ between campuses.' },
        { icon: 'bus', title: 'Getting there', text: 'Public transport, cycling and parking options for each campus.' },
        { icon: 'accessibility', title: 'Accessibility', text: 'Step-free access details, accessible bathrooms and parking information.' },
        { icon: 'door-open', title: 'Open days', text: 'Tour a campus and meet our trainers at an upcoming open day.', href: '/events', linkLabel: 'See events' },
      ],
    },
    {
      id: 'campuses-cta',
      type: 'cta',
      eyebrow: 'Come and see us',
      heading: 'Visit a campus',
      body: 'Join an open day or contact us to arrange a visit during opening hours.',
      actions: [
        { label: 'Upcoming events', href: '/events', variant: 'accent' },
        { label: 'Contact us', href: '/contact', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Campuses of AIT: locations, study areas, specialist facilities, transport and accessibility information.',
  },
  updatedAt,
}

export const galleryPage: Page = {
  id: 'page-gallery',
  slug: 'gallery',
  title: 'Gallery',
  eyebrow: 'Student life',
  summary: 'A look around our campuses, facilities and student activities.',
  hero: { image: media.page.gallery },
  blocks: [
    {
      id: 'gallery-intro',
      type: 'intro',
      lead: 'Take a look around our campuses, see the spaces where students learn and catch up on recent activities.',
      body: 'Photos and videos are published with the consent of the people pictured. If you appear in an image and would like it removed, contact us at [MARKETING_EMAIL] and we will take it down.',
    },
    {
      id: 'gallery-albums',
      type: 'module',
      module: 'galleryAlbums',
      background: 'alt',
      eyebrow: 'Albums',
      heading: 'Browse the gallery',
    },
    {
      id: 'gallery-video-note',
      type: 'callout',
      tone: 'info',
      title: 'Accessible video',
      body: 'Every video is published with closed captions and a text transcript. Videos never play automatically with sound.',
    },
    {
      id: 'gallery-links',
      type: 'linkCards',
      background: 'alt',
      eyebrow: 'Explore more',
      heading: 'See it for yourself',
      items: [
        { icon: 'building', title: 'Campuses', text: 'Facilities, hours and directions for each campus.', href: '/campuses' },
        { icon: 'sparkles', title: 'Student life', text: 'Activities, events and community.', href: '/student-life' },
        { icon: 'calendar', title: 'Events', text: 'Open days, workshops and celebrations.', href: '/events' },
      ],
    },
  ],
  seo: {
    description: 'Photos and videos of AIT campuses, facilities and student activities.',
  },
  updatedAt,
}

export const contactPage: Page = {
  id: 'page-contact',
  slug: 'contact',
  title: 'Contact us',
  eyebrow: 'Contact',
  summary: 'Find the right team, visit a campus or send us an enquiry.',
  hero: { image: media.page.contact },
  blocks: [
    {
      id: 'contact-intro',
      type: 'intro',
      lead: 'We are happy to help. Choose the team that best matches your question, visit one of our campuses, or send us an enquiry.',
      highlights: [
        { label: '076 700 25 25', value: 'Call us', icon: 'phone' },
        { label: 'info@aitcampus.com', value: 'Email us', icon: 'mail' },
        { label: 'Monday to Friday, [OPENING_HOURS]', value: 'Opening hours', icon: 'clock' },
        { label: '[STREET_ADDRESS], [CITY] [POSTCODE]', value: 'Visit us', icon: 'map-pin' },
      ],
    },
    {
      id: 'contact-emergency',
      type: 'callout',
      tone: 'warning',
      title: 'Not for emergencies',
      body: 'Our enquiry form and email inboxes are not monitored for emergencies. If you or someone else is in immediate danger, call local emergency services on **[EMERGENCY_NUMBER]**.',
    },
    {
      id: 'contact-directory',
      type: 'module',
      module: 'contactDirectory',
      background: 'alt',
      eyebrow: 'Departments and campuses',
      heading: 'Who to contact',
      intro: 'Contact the team responsible for your question, or reach a campus directly.',
    },
    {
      id: 'contact-campuses',
      type: 'linkCards',
      eyebrow: 'Visit us',
      heading: 'Campus addresses and directions',
      items: [
        { icon: 'map-pin', title: 'City Campus', text: 'Business, IT, English and short courses. Main admissions and student services.', href: '/campuses/city-campus' },
        { icon: 'map-pin', title: 'Riverside Campus', text: 'Hospitality and cookery, with training kitchens and a training restaurant.', href: '/campuses/riverside-campus' },
        { icon: 'map-pin', title: 'Parkview Campus', text: 'Health and community services, with simulated care rooms.', href: '/campuses/parkview-campus' },
      ],
    },
    {
      id: 'contact-faqs',
      type: 'faqs',
      background: 'alt',
      eyebrow: 'Before you get in touch',
      heading: 'Quick answers',
      items: [
        {
          question: 'How do I check on my application?',
          answer: 'Contact the admissions team and include your application reference so we can find your details quickly.',
        },
        {
          question: 'Can I visit a campus without an appointment?',
          answer: 'You are welcome during opening hours, and open days are a great time to visit. To meet an adviser, please contact us first so the right person is available.',
        },
        {
          question: 'I am an education agent. Who should I contact?',
          answer: 'Please contact our international office or use the [agent enquiry form](/international/agents).',
        },
      ],
    },
    {
      id: 'contact-form',
      type: 'module',
      module: 'enquiryForm',
      eyebrow: 'Send an enquiry',
      heading: 'How can we help?',
      intro: 'Tell us a little about your question and the right team will contact you using the details you provide.',
    },
  ],
  seo: {
    description: 'Contact AIT: departments, campus addresses, opening hours and an online enquiry form.',
  },
  updatedAt,
}

export const placePages: Page[] = [campusesPage, galleryPage, contactPage]

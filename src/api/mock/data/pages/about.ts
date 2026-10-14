import type { Page } from '@/api/types'
import { media } from '../media'
import { TODAY } from '../time'

/**
 * DEMO DATA — About, Leadership and faculty, Accreditation and partners (specification §5.2–§5.4).
 * History, mission, vision and values are drafts or placeholders for client approval. Never add
 * recognitions, rankings or partnerships that have not been verified.
 */
const updatedAt = TODAY.toISOString()

export const aboutPage: Page = {
  id: 'page-about',
  slug: 'about',
  title: 'About AIT',
  eyebrow: 'About us',
  summary:
    'AIT — the Australian Institute of Technology — offers international education and vocational training opportunities in Sri Lanka, through selected programmes delivered in collaboration with Australian education providers.',
  hero: {
    image: media.page.about,
    actions: [
      { label: 'Explore courses', href: '/courses', variant: 'accent' },
      { label: 'Meet our team', href: '/about/team', variant: 'secondary' },
    ],
  },
  blocks: [
    {
      id: 'about-intro',
      type: 'intro',
      lead: 'AIT (Australian Institute of Technology) connects students in Sri Lanka with selected international education and vocational training opportunities, offered in collaboration with Australian education providers.',
      body: 'AIT was established through the initiative of AusAsia Education & Migration Consultants, building on a commitment to connecting people with international education opportunities. With AIT, that vision takes a new direction — education and vocational training opportunities delivered locally in Sri Lanka. We aim to give students clear information and steady support, and to connect programme learning with practical activities and relevant industry contexts, according to the requirements of each course.',
      highlights: [
        { label: 'Based in', value: 'Colombo 14, Sri Lanka', icon: 'map-pin' },
        { label: 'Founded through the initiative of', value: 'AusAsia', icon: 'handshake' },
        { label: 'In collaboration with', value: 'Australian providers', icon: 'globe' },
        { label: 'Local access to', value: 'Vocational training', icon: 'layers' },
      ],
    },
    {
      id: 'about-overview',
      type: 'split',
      background: 'alt',
      eyebrow: 'Our story',
      heading: 'A New Chapter in Education',
      body: 'AIT was established through the initiative of AusAsia Education & Migration Consultants, extending a vision of connecting Sri Lankan students with international education opportunities. With AIT, that vision takes a new direction through education and vocational training opportunities delivered locally in Sri Lanka.\n\nAIT is the primary brand and identity for this work; AusAsia’s role is as the founding initiator. We aim to work with Australian and international education providers, identifying each organisation’s role — delivery, awarding or oversight — for the relevant programmes.',
      image: media.home.why,
      imageSide: 'right',
      bullets: [
        'Selected international programmes, accessed locally in Sri Lanka',
        'Delivered in collaboration with Australian education providers',
        'Practical, vocational learning linked to relevant industry contexts',
      ],
      actions: [
        { label: 'Explore courses', href: '/courses', variant: 'primary' },
        { label: 'Enquire now', href: '/enquire', variant: 'ghost' },
      ],
    },
    {
      id: 'about-history',
      type: 'timeline',
      eyebrow: 'Our history',
      heading: 'How we got here',
      intro: 'The milestones that have shaped AIT. Only verified, client-approved events are included.',
      items: [
        { label: '[ESTABLISHMENT_YEAR]', title: 'AIT is founded', text: '[Approved summary of how and why the institution began.]' },
        { label: '[YEAR]', title: '[First campus opens]', text: '[Approved milestone — for example, the opening of City Campus and its first classes.]' },
        { label: '[YEAR]', title: '[New study areas introduced]', text: '[Approved milestone — for example, the first hospitality or health programs at a new campus.]' },
        { label: '[YEAR]', title: '[Recent milestone]', text: '[Approved milestone — for example, a new facility or a refreshed learning space.]' },
      ],
    },
    {
      id: 'about-purpose',
      type: 'featureGrid',
      background: 'alt',
      variant: 'cards',
      columns: 2,
      eyebrow: 'Mission and vision',
      heading: 'Why we do what we do',
      items: [
        {
          icon: 'target',
          title: 'Our mission',
          text: 'To provide practical, well-supported education that helps every student take their next step with confidence. [Draft mission — to be approved by the client.]',
        },
        {
          icon: 'compass',
          title: 'Our vision',
          text: 'A welcoming learning community where people of every background can build skills, confidence and connections. [Draft vision — to be approved by the client.]',
        },
      ],
    },
    {
      id: 'about-values',
      type: 'featureGrid',
      variant: 'icons',
      columns: 4,
      eyebrow: 'Our values',
      heading: 'What guides us',
      intro: 'Draft values describing how we aim to work with students and with each other. [Values — to be confirmed by the client.]',
      items: [
        { icon: 'hand-heart', title: 'Respect', text: 'We treat every student, colleague and visitor with courtesy and care.' },
        { icon: 'shield-check', title: 'Integrity', text: 'We give honest information and make decisions fairly and transparently.' },
        { icon: 'flask', title: 'Practical learning', text: 'We teach skills by doing, with feedback that helps students improve.' },
        { icon: 'users', title: 'Inclusion', text: 'We welcome people of all backgrounds and adapt support to individual needs.' },
      ],
    },
    {
      id: 'about-teaching',
      type: 'split',
      background: 'alt',
      eyebrow: 'Teaching approach',
      heading: 'Learning by doing, with feedback along the way',
      body: 'Our teaching approach combines [CLIENT_CONFIRMED_METHODS] with regular feedback. Trainers explain what each module covers and how it is assessed from the start, so you can plan your time and know what is expected.\n\nMany assessments are based on realistic workplace tasks — from preparing a business report to running a kitchen service or practising care skills in a simulated room.',
      image: media.life.study,
      imageSide: 'left',
      bullets: [
        'Practical tasks based on realistic workplace scenarios',
        'Clear assessment information at the start of each module',
        'Regular feedback from trainers',
        'Academic skills help whenever you need it',
      ],
    },
    {
      id: 'about-facilities',
      type: 'featureGrid',
      variant: 'cards',
      columns: 3,
      eyebrow: 'Learning facilities',
      heading: 'Spaces designed for practical learning',
      intro: 'Facilities vary by campus. Each campus page has details, opening hours and accessibility information.',
      items: [
        { icon: 'library', title: 'Library and study spaces', text: 'Quiet study areas, print and digital resources, and bookable rooms for group work.', href: '/campuses/city-campus', linkLabel: 'City Campus' },
        { icon: 'monitor', title: 'Computer lab', text: 'Workstations with the software used in our information technology courses.', href: '/campuses/city-campus', linkLabel: 'City Campus' },
        { icon: 'chef-hat', title: 'Training kitchens', text: 'Commercial kitchens and a training restaurant for cookery and hospitality students.', href: '/campuses/riverside-campus', linkLabel: 'Riverside Campus' },
        { icon: 'stethoscope', title: 'Simulated care rooms', text: 'Spaces to practise care skills safely before supervised placement.', href: '/campuses/parkview-campus', linkLabel: 'Parkview Campus' },
        { icon: 'school', title: 'Flexible classrooms', text: 'Collaborative layouts with presentation screens for group work.', href: '/campuses', linkLabel: 'All campuses' },
        { icon: 'coffee', title: 'Student lounges', text: 'Places to relax, eat and catch up with friends between classes.', href: '/student-life', linkLabel: 'Student life' },
      ],
    },
    {
      id: 'about-support',
      type: 'split',
      background: 'alt',
      eyebrow: 'Student support',
      heading: 'Support throughout your studies',
      body: 'Support starts before you enrol and continues until you finish. Our teams can help with study skills, English language, accessibility, wellbeing, fees and administration — and connect you with specialist services when you need them.',
      image: media.page.support,
      imageSide: 'right',
      bullets: [
        'Orientation sessions for new students',
        'Academic and English language support',
        'Learning adjustments for disability and health conditions',
        'Clear complaint and appeal processes',
      ],
      actions: [{ label: 'Explore student support', href: '/student-support', variant: 'primary' }],
    },
    {
      id: 'about-recognition',
      type: 'module',
      module: 'partnerStrip',
      eyebrow: 'Recognition',
      heading: 'Registrations and partners',
      intro: 'We list only registrations, accreditations and partnerships that have been verified. Full details are on our accreditation page.',
    },
    {
      id: 'about-links',
      type: 'linkCards',
      background: 'alt',
      eyebrow: 'Get to know us',
      heading: 'Explore more about AIT',
      items: [
        { icon: 'users', title: 'Leadership and faculty', text: 'Meet the people who lead, teach and support our students.', href: '/about/team' },
        { icon: 'badge-check', title: 'Accreditation and partners', text: 'Verified registrations, accreditations and partnerships.', href: '/about/accreditation' },
        { icon: 'building', title: 'Our campuses', text: 'Locations, facilities, opening hours and directions.', href: '/campuses' },
        { icon: 'sparkles', title: 'Student life', text: 'Activities, events and community on campus.', href: '/student-life' },
      ],
    },
  ],
  seo: {
    description: 'Learn about AIT — our history, mission, teaching approach, learning facilities and the support we offer students.',
  },
  updatedAt,
}

export const teamPage: Page = {
  id: 'page-about-team',
  slug: 'about/team',
  title: 'Leadership and faculty',
  eyebrow: 'About us',
  summary: 'Meet the people who lead AIT, teach our courses and support students every day.',
  hero: { image: media.page.team },
  blocks: [
    {
      id: 'team-intro',
      type: 'intro',
      lead: 'Our leadership, teaching and professional staff work together so that every student receives consistent, practical teaching and support — from first enquiry to completion.',
      body: 'Profiles are published with each person’s approval, and qualifications are listed as confirmed by AIT. For questions about courses or applications, please contact the [admissions team](/enquire?topic=course) rather than individual staff members.',
    },
    {
      id: 'team-leadership',
      type: 'module',
      module: 'teamDirectory',
      background: 'alt',
      eyebrow: 'Leadership',
      heading: 'Leadership team',
      intro: 'Responsible for strategy, academic quality and the student experience.',
      props: { groups: ['leadership'] },
    },
    {
      id: 'team-faculty',
      type: 'module',
      module: 'teamDirectory',
      eyebrow: 'Faculty',
      heading: 'Teaching staff',
      intro: 'Program leads and trainers across our study areas.',
      props: { groups: ['faculty'] },
    },
    {
      id: 'team-professional',
      type: 'module',
      module: 'teamDirectory',
      background: 'alt',
      eyebrow: 'Professional staff',
      heading: 'Admissions and student services',
      intro: 'The teams that help applicants and students with advice, administration and support.',
      props: { groups: ['professional'] },
    },
    {
      id: 'team-expectations',
      type: 'featureGrid',
      variant: 'icons',
      columns: 3,
      eyebrow: 'How we work',
      heading: 'What you can expect from our staff',
      items: [
        { icon: 'message-square', title: 'Clear communication', text: 'Trainers explain what is expected in each module and how you will be assessed.' },
        { icon: 'notebook-pen', title: 'Useful feedback', text: 'Feedback that helps you understand your progress and what to work on next.' },
        { icon: 'hand-helping', title: 'Help when you need it', text: 'Staff can connect you with study, wellbeing and accessibility support.' },
      ],
    },
    {
      id: 'team-cta',
      type: 'cta',
      eyebrow: 'Questions?',
      heading: 'Talk to our admissions team',
      body: 'For course advice, entry requirements or application questions, our admissions team is the best place to start.',
      actions: [
        { label: 'Make an enquiry', href: '/enquire?topic=course', variant: 'accent' },
        { label: 'Browse courses', href: '/courses', variant: 'secondary' },
      ],
    },
  ],
  seo: { description: 'Meet the leadership team, teaching staff and professional staff at AIT.' },
  updatedAt,
}

export const accreditationPage: Page = {
  id: 'page-about-accreditation',
  slug: 'about/accreditation',
  title: 'Accreditation and partners',
  eyebrow: 'About us',
  summary: 'Verified registrations, accreditations and partnerships — and a plain explanation of what each type of relationship means.',
  hero: { image: media.pageExtra.accreditation },
  blocks: [
    {
      id: 'accreditation-intro',
      type: 'intro',
      lead: 'We publish only the registrations, accreditations and partnerships that have been verified for AIT, so you can see exactly what each one covers.',
      body: 'Each listing shows the type of relationship, a short description, any official identifier, the dates it applies and — where one exists — a link to the official public record.',
    },
    {
      id: 'accreditation-types',
      type: 'table',
      background: 'alt',
      eyebrow: 'Understanding the difference',
      heading: 'Types of recognition and partnership',
      intro: 'Different relationships mean different things. This table explains what each type covers, and what it does not.',
      columns: ['Relationship', 'What it means', 'What it does not mean'],
      rows: [
        ['Registration', 'Approval from an authorised body to operate as an education provider, where the jurisdiction requires it.', 'It does not, on its own, accredit every course.'],
        ['Accreditation', 'Formal recognition of a specific course or qualification by an authorised body.', 'It applies only to the courses named in the accreditation.'],
        ['Awarding body', 'The organisation that issues the qualification when a student completes a course.', 'It does not mean the awarding body teaches the course.'],
        ['Teaching partnership', 'An agreement with another organisation to deliver or support part of a course or activity.', 'It is not an accreditation and does not change who awards the qualification.'],
        ['Membership', 'Membership of a professional or industry association.', 'It is not an endorsement or accreditation of our courses.'],
      ],
      caption: 'Relationship types used on this page',
    },
    {
      id: 'accreditation-list',
      type: 'module',
      module: 'accreditations',
      eyebrow: 'Our details',
      heading: 'Registrations, accreditations and partners',
      intro: 'Details are added once verified. Country-specific identifiers appear only where they apply to AIT.',
    },
    {
      id: 'accreditation-check',
      type: 'callout',
      background: 'alt',
      tone: 'info',
      title: 'Check our details for yourself',
      body: 'Where an official public register exists, each listing links to it so you can confirm the details independently. If something on this page looks incorrect, or someone describes a relationship with AIT that is not listed here, please let us know at [COMPLIANCE_EMAIL].',
      action: { label: 'Contact us', href: '/contact', variant: 'secondary' },
    },
    {
      id: 'accreditation-links',
      type: 'linkCards',
      eyebrow: 'Related information',
      heading: 'Learn more',
      items: [
        { icon: 'landmark', title: 'About us', text: 'Our history, mission and approach to teaching.', href: '/about' },
        { icon: 'book-open', title: 'Courses', text: 'Course details, including qualification level and study pathways.', href: '/courses' },
        { icon: 'scroll-text', title: 'Policies', text: 'Current approved policies and procedures.', href: '/policies' },
      ],
    },
  ],
  seo: {
    description: 'Verified registrations, accreditations and partnerships for AIT, and what each type of relationship means.',
  },
  updatedAt,
}

export const aboutPages: Page[] = [aboutPage, teamPage, accreditationPage]

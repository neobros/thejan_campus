import type { Page } from '@/api/types'
import { media } from '../media'
import { TODAY } from '../time'

/** DEMO DATA — home page (specification §5.1). Section order follows the brief. */
export const homePage: Page = {
  id: 'page-home',
  slug: 'home',
  // *Asterisks* mark the words that get the animated accent style in the hero headline.
  title: 'Explore study opportunities at *AIT*',
  eyebrow: 'Courses · Admissions · Student support',
  summary: 'Compare courses, review entry requirements and speak with our admissions team about your next step.',
  hero: {
    image: media.banners.nursing,
    interval: 7000,
    // Rotating banners. Copy stays within the specification: no promises of visas, migration or jobs.
    slides: [
      {
        image: media.banners.nursing,
        eyebrow: 'Courses · Admissions · Student support',
        title: 'Explore study opportunities at *AIT*',
        summary: 'Compare courses, review entry requirements and speak with our admissions team about your next step.',
        actions: [
          { label: 'Find a course', href: '/courses', variant: 'accent' },
          { label: 'Apply now', href: '/apply', variant: 'secondary' },
        ],
      },
      {
        image: media.banners.practical,
        eyebrow: 'Hands-on learning',
        title: 'Practise real skills in *simulated clinical settings*',
        summary: 'Supervised practical training with modern equipment builds your confidence before placement.',
        actions: [
          { label: 'Explore courses', href: '/courses', variant: 'accent' },
          { label: 'How admissions works', href: '/admissions', variant: 'secondary' },
        ],
      },
      {
        image: media.banners.support,
        eyebrow: 'Support at every step',
        title: 'Guidance from *first enquiry* to graduation',
        summary: 'Our admissions and student support teams help you plan your study, stay on track and find help when you need it.',
        actions: [
          { label: 'Student support', href: '/student-support', variant: 'accent' },
          { label: 'Make an enquiry', href: '/enquire', variant: 'secondary' },
        ],
      },
      {
        image: media.banners.graduation,
        eyebrow: 'Your qualification',
        title: 'Celebrate what you *achieve*',
        summary: 'Clear entry requirements, structured courses and support throughout — so you can complete your qualification with confidence.',
        actions: [
          { label: 'Entry requirements', href: '/admissions/entry-requirements', variant: 'accent' },
          { label: 'Apply now', href: '/apply', variant: 'secondary' },
        ],
      },
      {
        image: media.banners.australia,
        eyebrow: 'Pathways',
        title: 'Explore pathways *beyond graduation*',
        summary: 'Find out how further study and overseas career pathways may work for you. Eligibility depends on each program’s and country’s requirements — our advisers can explain the options.',
        actions: [
          { label: 'Talk to an adviser', href: '/enquire?topic=course', variant: 'accent' },
          { label: 'Explore courses', href: '/courses', variant: 'secondary' },
        ],
      },
    ],
  },
  blocks: [
    { id: 'home-search', type: 'module', module: 'courseSearch' },
    {
      id: 'home-areas',
      type: 'module',
      module: 'categoryGrid',
      eyebrow: 'Study areas',
      heading: 'Find the field that fits you',
      intro: 'Explore practical courses across our study areas — from short courses to diplomas.',
    },
    {
      id: 'home-featured',
      type: 'module',
      module: 'featuredCourses',
      background: 'alt',
      eyebrow: 'Featured courses',
      heading: 'Courses to explore',
      intro: 'A selection of courses across our study areas. Compare duration, delivery and campuses at a glance.',
      props: { limit: 6 },
    },
    {
      id: 'home-why',
      type: 'featureGrid',
      variant: 'icons',
      columns: 3,
      eyebrow: 'Why study with us',
      heading: 'Learning designed around real life',
      intro: 'Practical teaching, clear information and support from your first enquiry to your first class.',
      items: [
        { icon: 'flask', title: 'Practical, hands-on learning', text: 'Labs, kitchens, simulated workplaces and projects help you practise the skills you are learning.' },
        { icon: 'life-buoy', title: 'Support from day one', text: 'Academic, wellbeing and administrative support teams are here to help throughout your studies.' },
        { icon: 'layers', title: 'Flexible study options', text: 'Choose on-campus, blended or online delivery where a course offers it.' },
        { icon: 'list-checks', title: 'Clear information up front', text: 'Entry requirements, fees and intakes are published for each course so you can plan with confidence.' },
        { icon: 'route', title: 'Pathways to further study', text: 'Many courses connect to higher-level study. Pathways depend on meeting each course’s entry requirements.' },
        { icon: 'users', title: 'A welcoming community', text: 'Meet students from different backgrounds through orientation, events and student activities.' },
      ],
    },
    {
      id: 'home-steps',
      type: 'steps',
      background: 'alt',
      eyebrow: 'How admissions works',
      heading: 'From first look to first class',
      intro: 'Applying is straightforward. Our admissions team reviews every application and will contact you about the next step.',
      items: [
        { title: 'Choose a course', text: 'Compare courses, campuses and delivery options, then pick an upcoming intake.' },
        { title: 'Check your eligibility', text: 'Review the entry requirements and prepare your supporting documents.' },
        { title: 'Submit your application', text: 'Complete the online form at your own pace and upload your documents securely.' },
        { title: 'Admissions review', text: 'Our team assesses your application and may ask for more information.' },
        { title: 'Follow your next steps', text: 'You will receive your outcome and instructions for any acceptance or enrolment steps.' },
      ],
    },
    {
      id: 'home-intakes',
      type: 'module',
      module: 'intakeExplorer',
      eyebrow: 'Upcoming intakes',
      heading: 'Plan your start date',
      intro: 'Upcoming start dates that are open for applications. Dates are shown in each campus’s local time.',
      props: { limit: 6, showFilters: false },
    },
    {
      id: 'home-campuses',
      type: 'module',
      module: 'campusList',
      background: 'alt',
      eyebrow: 'Our campuses',
      heading: 'Places to learn and connect',
      intro: 'Each campus has its own facilities and study areas. Visit a campus page for directions, hours and contacts.',
    },
    {
      id: 'home-support',
      type: 'split',
      eyebrow: 'Student support',
      heading: 'Help is close by when you need it',
      body: 'From study skills and language help to wellbeing and administrative questions, our support teams can point you in the right direction. Support is available to every enrolled student.',
      image: media.home.support,
      imageSide: 'left',
      bullets: ['Academic and study skills help', 'Wellbeing and personal support', 'Accessibility and learning adjustments', 'Fees and administrative questions'],
      actions: [
        { label: 'Student support', href: '/student-support', variant: 'primary' },
        { label: 'Student life', href: '/student-life', variant: 'ghost' },
      ],
    },
    {
      id: 'home-testimonials',
      type: 'module',
      module: 'testimonials',
      background: 'alt',
      eyebrow: 'Student voices',
      heading: 'In their own words',
    },
    { id: 'home-partners', type: 'module', module: 'partnerStrip', eyebrow: 'Recognition & partners' },
    {
      id: 'home-news',
      type: 'module',
      module: 'latestNews',
      eyebrow: 'News',
      heading: 'Latest from campus',
      props: { limit: 3 },
    },
    {
      id: 'home-events',
      type: 'module',
      module: 'upcomingEvents',
      background: 'alt',
      eyebrow: 'Events',
      heading: 'Coming up',
      props: { limit: 3 },
    },
    {
      id: 'home-cta',
      type: 'cta',
      eyebrow: 'Talk to us',
      heading: 'Ready to take your next step?',
      body: 'Ask our admissions team about courses, entry requirements or fees — or start your application today.',
      actions: [
        { label: 'Make an enquiry', href: '/enquire', variant: 'accent' },
        { label: 'Apply now', href: '/apply', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    title: undefined,
    description:
      'Explore study opportunities at AIT. Compare courses, review entry requirements and speak with our admissions team about your next step.',
  },
  updatedAt: TODAY.toISOString(),
}

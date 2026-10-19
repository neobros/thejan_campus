import type { Page } from '@/api/types'
import { media } from '../media'
import { TODAY } from '../time'

/** DEMO DATA — home page (specification §5.1). Section order follows the brief. */
export const homePage: Page = {
  id: 'page-home',
  slug: 'home',
  // *Asterisks* mark the words that get the animated accent style in the hero headline.
  title: 'Australian Skills. Local Opportunity. *A Wider Future.*',
  eyebrow: 'Australian Institute of Technology',
  summary:
    'Explore international education and vocational training opportunities in Sri Lanka through selected programmes offered in collaboration with Australian education providers.',
  hero: {
    image: media.banners.nursing,
    interval: 7000,
    // Rotating banners. Copy follows the client brief: transnational education framing, qualified claims, no visa/migration/job promises.
    slides: [
      {
        image: media.banners.nursing,
        eyebrow: 'Australian Institute of Technology',
        title: 'Australian Skills. Local Opportunity. *A Wider Future.*',
        summary:
          'Explore international education and vocational training opportunities in Sri Lanka through selected programmes offered in collaboration with Australian education providers. Develop your knowledge, build practical skills and explore new possibilities for your future.',
        actions: [
          { label: 'Explore Courses', href: '/courses', variant: 'accent' },
          { label: 'Enquire Now', href: '/enquire', variant: 'secondary' },
        ],
      },
      {
        image: media.banners.practical,
        eyebrow: 'International education',
        title: 'International learning, *closer to home*',
        summary: 'Explore selected international programmes offered through our education partnerships and delivered locally in Sri Lanka.',
        actions: [
          { label: 'Explore Courses', href: '/courses', variant: 'accent' },
          { label: 'Enquire Now', href: '/enquire', variant: 'secondary' },
        ],
      },
      {
        image: media.banners.support,
        eyebrow: 'Study locally',
        title: 'Study locally, *think globally*',
        summary: 'Access available programmes in Sri Lanka without necessarily relocating overseas to study.',
        actions: [
          { label: 'Explore Courses', href: '/courses', variant: 'accent' },
          { label: 'Enquire Now', href: '/enquire', variant: 'secondary' },
        ],
      },
      {
        image: media.banners.graduation,
        eyebrow: 'Practical skills',
        title: 'Build *practical, relevant* skills',
        summary: 'Develop relevant technical and vocational skills through the practical components included in each programme.',
        actions: [
          { label: 'Explore Courses', href: '/courses', variant: 'accent' },
          { label: 'Enquire Now', href: '/enquire', variant: 'secondary' },
        ],
      },
      {
        image: media.banners.australia,
        eyebrow: 'A wider future',
        title: 'Open the door to *a wider future*',
        summary: 'Build knowledge and skills that may support future career development and further study.',
        actions: [
          { label: 'Explore Courses', href: '/courses', variant: 'accent' },
          { label: 'Enquire Now', href: '/enquire', variant: 'secondary' },
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
      eyebrow: 'Courses',
      heading: 'Find Your Pathway',
      intro:
        'Explore confirmed programmes by subject area. Discover programmes designed to help you develop knowledge and skills in areas of interest, and find an option that aligns with your goals.',
    },
    {
      id: 'home-featured',
      type: 'module',
      module: 'featuredCourses',
      background: 'alt',
      eyebrow: 'Courses',
      heading: 'Courses to explore',
      intro: 'Every course across our study areas. Compare duration, delivery and campuses at a glance.',
      props: { layout: 'grid' },
    },
    {
      id: 'home-why',
      type: 'featureGrid',
      variant: 'icons',
      columns: 4,
      eyebrow: 'Why choose AIT?',
      heading: 'International Learning, Closer to Home',
      intro: 'Selected international programmes • Local access • Practical learning • Future possibilities.',
      items: [
        { icon: 'globe', title: 'International Education Opportunities', text: 'Explore selected programmes offered through our education partnerships.' },
        { icon: 'map-pin', title: 'Study Locally', text: 'Access available programmes in Sri Lanka without necessarily relocating overseas to study.' },
        { icon: 'briefcase', title: 'Practical Skills Development', text: 'Develop relevant technical and vocational skills through the practical components included in each programme.' },
        { icon: 'route', title: 'A Wider Future', text: 'Build knowledge and skills that may support future career development and further study.' },
      ],
    },
    {
      id: 'home-steps',
      type: 'steps',
      background: 'alt',
      eyebrow: 'How it works',
      heading: 'International Programmes. Delivered Locally.',
      intro: 'Explore → Understand the provider and qualification → Learn in Sri Lanka → Plan your next step.',
      items: [
        { title: 'Explore', text: 'Find a programme that matches your interests.' },
        { title: 'Understand', text: 'Review the qualification, provider and entry requirements.' },
        { title: 'Learn', text: 'Study in Sri Lanka through the arrangement specified for the programme.' },
        { title: 'Plan Ahead', text: 'Explore potential career or further-study options.' },
      ],
    },
    {
      id: 'home-practical',
      type: 'split',
      eyebrow: 'Practical learning',
      heading: 'Learn Skills You Can Put into Practice',
      body: 'We believe education should help students build knowledge and develop skills they can apply in relevant settings. Our approach connects programme learning with practical activities and relevant industry contexts, according to the requirements of each course.',
      image: media.home.why,
      imageSide: 'right',
      actions: [{ label: 'Explore courses', href: '/courses', variant: 'primary' }],
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
    {
      id: 'home-partners',
      type: 'module',
      module: 'partnerStrip',
      eyebrow: 'Education partners',
      heading: 'Connecting Students with International Education',
      intro: 'We work with Australian and international education providers. Each partner’s role — delivery, awarding or oversight — is identified for the relevant programmes.',
    },
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
      heading: 'Your Next Step Starts Here',
      body: 'Ask us about available programmes, entry requirements and the next steps in your application.',
      actions: [
        { label: 'Enquire Now', href: '/enquire', variant: 'accent' },
        { label: 'Contact Our Team', href: '/contact', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    title: undefined,
    description:
      'Explore international education and vocational training opportunities in Sri Lanka through selected programmes offered in collaboration with Australian education providers.',
  },
  updatedAt: TODAY.toISOString(),
}

import type { Page } from '@/api/types'
import { media } from '../media'
import { TODAY } from '../time'

/**
 * DEMO DATA — CMS records for pages with bespoke templates (course listing, news, events, enquiry,
 * application and search). They hold the editable hero copy and image; `blocks` render AFTER each
 * page's built-in content, so keep them short. Asterisks in titles mark the accent word.
 */
const updatedAt = TODAY.toISOString()

export const coursesPage: Page = {
  id: 'page-courses',
  slug: 'courses',
  title: 'Find your *course*',
  eyebrow: 'Courses',
  summary: 'Search and filter courses by study area, qualification level, campus, delivery mode, student type and intake.',
  hero: { image: media.page.courses },
  blocks: [
    {
      id: 'courses-faqs',
      type: 'faqs',
      background: 'alt',
      eyebrow: 'Choosing a course',
      heading: 'Questions to help you decide',
      items: [
        {
          question: 'How do I know which course is right for me?',
          answer:
            'Start with your goals, then compare study areas, qualification levels, delivery modes and campuses. Each course page explains who the course suits, what you will learn, how it is assessed, and its entry requirements, fees and intakes.',
        },
        {
          question: 'What is the difference between a short course, a certificate and a diploma?',
          answer:
            'Short courses build one practical skill over a few weeks and do not lead to a formal qualification. Certificates build foundation skills in a study area, and diplomas develop broader knowledge for supervisory or specialist roles. Read our [guide to choosing your starting point](/news/certificate-diploma-or-short-course) for more.',
        },
        {
          question: 'What if I am not sure I meet the entry requirements?',
          answer:
            'Check the entry requirements on the course page, then [talk to our admissions team](/enquire?topic=admissions). Admissions staff review each application individually, and previous study or work experience may count through [credit transfer or prior learning](/admissions/credit-transfer).',
        },
      ],
    },
    {
      id: 'courses-cta',
      type: 'cta',
      eyebrow: 'Not sure where to start?',
      heading: 'Talk to an admissions adviser',
      body: 'Tell us about your goals and experience, and we will help you compare suitable courses.',
      actions: [
        { label: 'Make an enquiry', href: '/enquire?topic=course', variant: 'accent' },
        { label: 'Apply now', href: '/apply', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Search courses at AIT by study area, qualification level, campus, delivery mode, student type and intake.',
  },
  updatedAt,
}

export const newsPage: Page = {
  id: 'page-news',
  slug: 'news',
  title: 'News & *stories*',
  eyebrow: 'News',
  summary: 'Announcements from AIT and stories from our students, staff and campuses.',
  hero: { image: media.page.news },
  blocks: [
    {
      id: 'news-cta',
      type: 'cta',
      eyebrow: 'See it for yourself',
      heading: 'Visit us at an upcoming event',
      body: 'Join an open day or information session, or ask our team about your study options.',
      actions: [
        { label: 'Upcoming events', href: '/events', variant: 'accent' },
        { label: 'Make an enquiry', href: '/enquire', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'News, announcements and student stories from AIT.',
  },
  updatedAt,
}

export const eventsPage: Page = {
  id: 'page-events',
  slug: 'events',
  title: 'Events & *open days*',
  eyebrow: 'Events',
  summary: 'Open days, information sessions, orientation, workshops and celebrations across our campuses and online.',
  hero: { image: media.page.events },
  blocks: [
    {
      id: 'events-cta',
      type: 'cta',
      eyebrow: 'Can’t make it?',
      heading: 'Talk to us any time',
      body: 'If none of these dates suit you, our team can answer your questions or help you arrange a campus visit.',
      actions: [
        { label: 'Make an enquiry', href: '/enquire', variant: 'accent' },
        { label: 'Contact us', href: '/contact', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Upcoming open days, information sessions, workshops and student events at AIT, with times shown in campus local time.',
  },
  updatedAt,
}

export const enquirePage: Page = {
  id: 'page-enquire',
  slug: 'enquire',
  title: 'Make an *enquiry*',
  eyebrow: 'Contact',
  summary: 'Ask us about courses, admissions, fees, international study, campuses or support. We will reply using the contact details you provide.',
  hero: { image: media.page.contact },
  blocks: [],
  seo: {
    description: 'Send an enquiry to AIT about courses, admissions, fees, international study, campuses or student support.',
  },
  updatedAt,
}

export const applyPage: Page = {
  id: 'page-apply',
  slug: 'apply',
  title: 'Apply *online*',
  eyebrow: 'Admissions',
  summary: 'Choose your course, campus and intake, then complete each step at your own pace. Your progress is saved as a secure draft.',
  hero: { image: media.page.admissions },
  blocks: [
    {
      id: 'apply-notice',
      type: 'callout',
      tone: 'info',
      title: 'Before you begin',
      body: 'A submitted application is a request for admissions review — it is not an offer, enrolment, visa document or payment obligation. You will receive the outcome and any next steps in writing.',
    },
  ],
  seo: {
    description: 'Apply online to AIT. Choose your course, campus and intake, upload your documents securely and submit for admissions review.',
  },
  updatedAt,
}

export const searchPage: Page = {
  id: 'page-search',
  slug: 'search',
  title: 'Search',
  eyebrow: 'Search',
  summary: 'Search published courses, pages, campuses, news, events, documents and policies.',
  blocks: [],
  seo: {
    description: 'Search courses, pages, campuses, news, events, documents and policies at AIT.',
    noindex: true,
  },
  updatedAt,
}

export const bespokePages: Page[] = [coursesPage, newsPage, eventsPage, enquirePage, applyPage, searchPage]

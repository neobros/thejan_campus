import type { Navigation } from '@/api/types'
import { media } from './media'

export const navigation: Navigation = {
  // Simple navigation per the client brief: Home · About · Courses · How It Works · Partners · Contact.
  main: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    {
      label: 'Courses',
      href: '/courses',
      groups: [
        {
          title: 'Study areas',
          items: [
            { label: 'Business & Management', href: '/courses/category/business', icon: 'briefcase', tone: 'brand' },
            { label: 'Beauty Therapy', href: '/courses/category/beauty', icon: 'sparkles', tone: 'rose' },
            { label: 'Hairdressing & Salon', href: '/courses/category/hairdressing', icon: 'palette', tone: 'gold' },
            { label: 'Building & Construction', href: '/courses/category/construction', icon: 'building', tone: 'slate' },
            { label: 'Civil Construction Design', href: '/courses/category/civil-construction', icon: 'compass', tone: 'sky' },
            { label: 'English Language (ELICOS)', href: '/courses/category/english', icon: 'languages', tone: 'violet' },
          ],
        },
        {
          title: 'Browse',
          items: [
            { label: 'All courses', href: '/courses', description: 'Explore programmes by subject area', icon: 'book-open' },
            { label: 'How it works', href: '/how-it-works', description: 'International programmes, delivered locally', icon: 'route' },
          ],
        },
      ],
      promo: {
        eyebrow: 'Not sure where to start?',
        title: 'Talk to an adviser',
        text: 'Tell us your goals and we will help you compare suitable programmes.',
        href: '/enquire?topic=course',
        label: 'Enquire now',
        image: media.page.courses,
      },
    },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Partners', href: '/about/accreditation' },
    { label: 'Contact', href: '/contact' },
  ],
  utility: [
    { label: 'Downloads', href: '/downloads' },
    { label: 'FAQs', href: '/faq' },
  ],
  footer: [
    {
      title: 'Study',
      links: [
        { label: 'All courses', href: '/courses' },
        { label: 'Entry requirements', href: '/admissions/entry-requirements' },
        { label: 'Fees & payments', href: '/admissions/fees' },
        { label: 'Intakes', href: '/admissions/intakes' },
        { label: 'Scholarships', href: '/admissions/scholarships', feature: 'scholarships' },
        { label: 'Apply online', href: '/apply' },
      ],
    },
    {
      title: 'Students',
      links: [
        { label: 'Student support', href: '/student-support' },
        { label: 'Orientation', href: '/student-support/orientation' },
        { label: 'Student resources', href: '/student-resources' },
        { label: 'Downloads', href: '/downloads' },
        { label: 'Policies', href: '/policies' },
        { label: 'FAQs', href: '/faq' },
      ],
    },
    {
      title: 'About',
      links: [
        { label: 'About us', href: '/about' },
        { label: 'Leadership & faculty', href: '/about/team' },
        { label: 'Accreditation & partners', href: '/about/accreditation' },
        { label: 'Campuses', href: '/campuses' },
        { label: 'News', href: '/news' },
        { label: 'Events', href: '/events' },
      ],
    },
    {
      title: 'Prospective students',
      links: [
        { label: 'International students', href: '/international', feature: 'international' },
        { label: 'Domestic students', href: '/domestic', feature: 'domestic' },
        { label: 'Education agents', href: '/international/agents', feature: 'agents' },
        { label: 'Student life', href: '/student-life' },
        { label: 'Gallery', href: '/gallery' },
        { label: 'Contact us', href: '/contact' },
      ],
    },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms of use', href: '/terms' },
    { label: 'Accessibility', href: '/accessibility' },
    { label: 'Policies', href: '/policies' },
  ],
}

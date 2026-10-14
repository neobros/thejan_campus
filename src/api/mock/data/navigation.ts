import type { Navigation } from '@/api/types'
import { media } from './media'

export const navigation: Navigation = {
  main: [
    {
      label: 'About',
      href: '/about',
      groups: [
        {
          title: 'Who we are',
          items: [
            { label: 'About us', href: '/about', description: 'Our story, mission and approach to teaching', icon: 'landmark' },
            { label: 'Leadership & faculty', href: '/about/team', description: 'Meet the people behind your learning', icon: 'users' },
            { label: 'Accreditation & partners', href: '/about/accreditation', description: 'Registrations and verified partnerships', icon: 'badge-check' },
          ],
        },
        {
          title: 'Our places',
          items: [
            { label: 'Campuses', href: '/campuses', description: 'Locations, facilities and directions', icon: 'building' },
            { label: 'News', href: '/news', description: 'Announcements and stories', icon: 'newspaper' },
            { label: 'Events', href: '/events', description: 'Open days, sessions and activities', icon: 'calendar' },
          ],
        },
      ],
      promo: {
        eyebrow: 'Visit us',
        title: 'See where you will study',
        text: 'Facilities, transport options and contacts for each campus.',
        href: '/campuses',
        label: 'Explore campuses',
        image: media.page.campuses,
      },
    },
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
          title: 'Plan your study',
          items: [
            { label: 'All courses', href: '/courses', description: 'Search and filter the full catalogue', icon: 'book-open' },
            { label: 'Upcoming intakes', href: '/admissions/intakes', description: 'Start dates and deadlines', icon: 'calendar' },
            { label: 'Fees', href: '/admissions/fees', description: 'Tuition and additional costs', icon: 'wallet' },
            { label: 'Credit transfer', href: '/admissions/credit-transfer', description: 'Recognition of prior study', icon: 'file-check', feature: 'creditTransfer' },
          ],
        },
      ],
      promo: {
        eyebrow: 'Not sure where to start?',
        title: 'Talk to an admissions adviser',
        text: 'Tell us your goals and we will help you compare suitable courses.',
        href: '/enquire?topic=course',
        label: 'Make an enquiry',
        image: media.page.courses,
      },
    },
    {
      label: 'Admissions',
      href: '/admissions',
      groups: [
        {
          title: 'Applying',
          items: [
            { label: 'How to apply', href: '/admissions', description: 'Step-by-step admissions process', icon: 'route' },
            { label: 'Entry requirements', href: '/admissions/entry-requirements', description: 'Academic and language evidence', icon: 'list-checks' },
            { label: 'Fees & payments', href: '/admissions/fees', description: 'Tuition, extra costs and instalments', icon: 'wallet' },
            { label: 'Intakes', href: '/admissions/intakes', description: 'Start dates by course and campus', icon: 'calendar' },
          ],
        },
        {
          title: 'Funding & recognition',
          items: [
            { label: 'Scholarships', href: '/admissions/scholarships', description: 'Current opportunities and eligibility', icon: 'award', feature: 'scholarships' },
            { label: 'Credit transfer & prior learning', href: '/admissions/credit-transfer', description: 'Use previous study or experience', icon: 'file-check', feature: 'creditTransfer' },
            { label: 'FAQs', href: '/faq', description: 'Answers to common questions', icon: 'help' },
          ],
        },
      ],
      promo: {
        eyebrow: 'Applications open',
        title: 'Start your application',
        text: 'Choose your course and intake, then complete each step at your own pace.',
        href: '/apply',
        label: 'Apply now',
        image: media.page.admissions,
      },
    },
    {
      label: 'International',
      href: '/international',
      feature: 'international',
      groups: [
        {
          title: 'International students',
          items: [
            { label: 'Studying with us', href: '/international', description: 'Courses, requirements and support', icon: 'globe' },
            { label: 'Before you arrive', href: '/international/pre-arrival', description: 'Your pre-departure checklist', icon: 'plane' },
            { label: 'Living & studying here', href: '/international/living-and-studying', description: 'Housing, transport and living costs', icon: 'house' },
            { label: 'Education agents', href: '/international/agents', description: 'Approved agents by country', icon: 'handshake', feature: 'agents' },
          ],
        },
      ],
      promo: {
        eyebrow: 'International',
        title: 'Fees and intakes for international students',
        text: 'Compare courses available to international applicants.',
        href: '/courses?audience=international',
        label: 'View courses',
        image: media.page.international,
      },
    },
    {
      label: 'Student Life',
      href: '/student-life',
      groups: [
        {
          title: 'Campus life',
          items: [
            { label: 'Student life', href: '/student-life', description: 'Clubs, activities and community', icon: 'sparkles' },
            { label: 'Events', href: '/events', description: 'What is on across our campuses', icon: 'ticket' },
            { label: 'Gallery', href: '/gallery', description: 'Photos from campus and activities', icon: 'images' },
          ],
        },
        {
          title: 'Support & resources',
          items: [
            { label: 'Student support', href: '/student-support', description: 'Academic, wellbeing and admin help', icon: 'life-buoy' },
            { label: 'Orientation', href: '/student-support/orientation', description: 'Your first days on campus', icon: 'compass' },
            { label: 'Student resources', href: '/student-resources', description: 'Handbooks, calendars and forms', icon: 'folder-open' },
            { label: 'Policies', href: '/policies', description: 'Current approved policies', icon: 'scroll-text' },
          ],
        },
      ],
    },
    { label: 'Campuses', href: '/campuses' },
    { label: 'News', href: '/news' },
    { label: 'Contact', href: '/contact' },
  ],
  utility: [
    { label: 'Domestic students', href: '/domestic', feature: 'domestic' },
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

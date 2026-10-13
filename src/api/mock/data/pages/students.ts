import type { Page } from '@/api/types'
import { media } from '../media'
import { TODAY } from '../time'

/**
 * DEMO DATA — student life, support, orientation, resources, downloads, policies and FAQ pages
 * (specification §5.17–§5.22). Activities and services marked as placeholders must be confirmed
 * before publication — do not imply that unconfirmed services exist.
 */
const updatedAt = TODAY.toISOString()

export const studentLifePage: Page = {
  id: 'page-student-life',
  slug: 'student-life',
  title: 'Student life',
  eyebrow: 'Student life',
  summary: 'Meet people, try something new and make the most of the spaces on each campus.',
  hero: { image: media.page.studentLife },
  blocks: [
    {
      id: 'life-intro',
      type: 'intro',
      lead: 'Student life at AIT is about more than classes. It is the friends you make, the events you join and the spaces where you study, relax and connect.',
      body: 'The activities below are examples. [Confirmed clubs, activities and services — to be supplied by the student experience team.]',
    },
    {
      id: 'life-activities',
      type: 'featureGrid',
      background: 'alt',
      variant: 'cards',
      columns: 3,
      eyebrow: 'Get involved',
      heading: 'Ways to connect',
      items: [
        { icon: 'users', title: 'Clubs and interest groups', text: 'Meet students who share your interests. [Confirmed clubs — to be listed.]' },
        { icon: 'sparkles', title: 'Cultural celebrations', text: 'Food, music and festivals that celebrate the many cultures in our community.', href: '/events', linkLabel: 'See events' },
        { icon: 'book-open', title: 'Study groups', text: 'Work through course content together with support from the academic skills team.' },
        { icon: 'sprout', title: 'Volunteering', text: 'Give back through community projects, such as the Parkview community garden.' },
        { icon: 'trophy', title: 'Sport and recreation', text: 'Casual games and activities to stay active. [Confirmed activities — to be listed.]' },
        { icon: 'megaphone', title: 'Student voice', text: 'Share feedback and help shape your student experience. [Student representation arrangements — to be confirmed.]' },
      ],
    },
    {
      id: 'life-spaces',
      type: 'split',
      eyebrow: 'Campus spaces',
      heading: 'Places to study, relax and recharge',
      body: 'Each campus has spaces to spend time between classes — from quiet study areas to lounges with kitchenettes and outdoor seating. Facilities vary by campus, so check each campus page for details.',
      image: media.facility.lounge,
      imageSide: 'right',
      bullets: [
        'Student lounges and common rooms',
        'Library and quiet study areas',
        'Outdoor seating at Parkview Campus',
        'Wi-Fi for enrolled students at City and Parkview campuses',
      ],
      actions: [{ label: 'Explore campuses', href: '/campuses', variant: 'primary' }],
    },
    {
      id: 'life-events',
      type: 'module',
      module: 'upcomingEvents',
      background: 'alt',
      eyebrow: 'What’s on',
      heading: 'Upcoming events',
      props: { limit: 3 },
    },
    {
      id: 'life-news',
      type: 'module',
      module: 'latestNews',
      eyebrow: 'Stories',
      heading: 'News from our campuses',
      props: { limit: 3 },
    },
    {
      id: 'life-testimonials',
      type: 'module',
      module: 'testimonials',
      background: 'alt',
      eyebrow: 'Student voices',
      heading: 'Student experiences',
    },
    {
      id: 'life-gallery',
      type: 'module',
      module: 'galleryAlbums',
      eyebrow: 'Gallery',
      heading: 'Moments from campus',
      intro: 'Photos are shared with the consent of the people pictured.',
      props: { limit: 3 },
    },
    {
      id: 'life-links',
      type: 'linkCards',
      background: 'alt',
      eyebrow: 'Support and settling in',
      heading: 'Help is never far away',
      items: [
        { icon: 'life-buoy', title: 'Student support', text: 'Study, wellbeing, accessibility and administrative support.', href: '/student-support' },
        { icon: 'compass', title: 'Orientation', text: 'Your first days on campus.', href: '/student-support/orientation' },
        { icon: 'calendar', title: 'All events', text: 'Open days, workshops and celebrations.', href: '/events' },
        { icon: 'images', title: 'Gallery', text: 'Campus, facilities and student activities.', href: '/gallery' },
      ],
    },
  ],
  seo: {
    description: 'Student life at AIT: activities, events, campus spaces and community, with links to support and orientation.',
  },
  updatedAt,
}

export const studentSupportPage: Page = {
  id: 'page-student-support',
  slug: 'student-support',
  title: 'Student support',
  eyebrow: 'Student support',
  summary: 'Help with study, language, accessibility, wellbeing, fees and administration — and how to raise a concern.',
  hero: {
    image: media.page.support,
    actions: [{ label: 'Ask for support', href: '/enquire?topic=support', variant: 'accent' }],
  },
  blocks: [
    {
      id: 'support-intro',
      type: 'intro',
      lead: 'Everyone needs help sometimes. Our support teams can help with study, language, accessibility, wellbeing, fees and administration — and connect you with specialist services when needed.',
      body: 'Support is available to every enrolled student. If you are not sure who to ask, start with student support and we will point you in the right direction.',
    },
    {
      // The support directory module renders the emergency notice from settings.emergency.
      id: 'support-directory',
      type: 'module',
      module: 'supportDirectory',
      background: 'alt',
      eyebrow: 'Support directory',
      heading: 'Find the right team',
      intro: 'Each row shows the issue, the team that can help, what assistance is available, how to contact them, their hours and how to request help. Any charges or external referral limits are noted.',
    },
    {
      id: 'support-accessibility',
      type: 'split',
      eyebrow: 'Accessibility and inclusion',
      heading: 'Learning adjustments that work for you',
      body: 'If you have a disability, a health condition or other circumstances that affect your study, our accessibility and inclusion team can work with you on a learning access plan. Information you share is kept confidential and used only to arrange your support.\n\nIt helps to get in touch before your course starts, but you can ask for support at any time.',
      image: media.home.support,
      imageSide: 'left',
      bullets: [
        'Adjustments to assessment arrangements',
        'Course materials in accessible formats',
        'Assistive technology and accessible workstations',
        'Regular reviews as your needs change',
      ],
      actions: [
        { label: 'Accessibility and inclusion policy', href: '/policies/accessibility-and-inclusion', variant: 'primary' },
        { label: 'Contact the team', href: '/enquire?topic=support', variant: 'ghost' },
      ],
    },
    {
      id: 'support-complaints',
      type: 'steps',
      background: 'alt',
      eyebrow: 'Complaints and appeals',
      heading: 'If something is not right',
      intro: 'We want to hear about problems so we can put them right. Concerns are handled fairly and confidentially.',
      items: [
        { title: 'Talk to us early', text: 'Many concerns can be resolved quickly by talking with your trainer or the team involved.', meta: 'Informal' },
        { title: 'Lodge a formal complaint or appeal', text: 'Use the complaints and appeals form if the issue is not resolved, or if you prefer a formal process.', meta: 'Formal' },
        { title: 'Review and outcome', text: 'Your complaint is reviewed by someone not involved in the original matter, and you receive a written outcome with reasons.', meta: 'Written outcome' },
        { title: 'External review', text: 'If you are still not satisfied, you can request an external review. [External body — to be confirmed for the actual jurisdiction.]', meta: 'Independent' },
      ],
    },
    {
      id: 'support-privacy',
      type: 'callout',
      tone: 'info',
      title: 'Your privacy',
      body: 'Information you share with support staff is handled under our [privacy policy](/privacy). We share it only with your consent, or where the law requires it. [Confidentiality wording — to be approved.]',
    },
    {
      id: 'support-links',
      type: 'linkCards',
      background: 'alt',
      eyebrow: 'Useful links',
      heading: 'More help and information',
      items: [
        { icon: 'compass', title: 'Orientation', text: 'Get ready for your first days on campus.', href: '/student-support/orientation' },
        { icon: 'folder-open', title: 'Student resources', text: 'Handbook, calendar, forms and student systems.', href: '/student-resources' },
        { icon: 'scroll-text', title: 'Policies', text: 'Complaints, assessment, attendance and more.', href: '/policies' },
        { icon: 'help', title: 'FAQs', text: 'Quick answers to common questions.', href: '/faq' },
      ],
    },
    {
      id: 'support-cta',
      type: 'cta',
      eyebrow: 'Not sure where to start?',
      heading: 'Ask student support',
      body: 'Tell us what is going on and we will connect you with the right team. For emergencies, always call [EMERGENCY_NUMBER].',
      actions: [
        { label: 'Ask for support', href: '/enquire?topic=support', variant: 'accent' },
        { label: 'Contact details', href: '/contact', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Student support at AIT: academic, language, accessibility, wellbeing, fees and administrative help, plus complaints and emergency information.',
  },
  updatedAt,
}

export const orientationPage: Page = {
  id: 'page-student-support-orientation',
  slug: 'student-support/orientation',
  title: 'Orientation',
  eyebrow: 'Student support',
  summary: 'Session dates for each intake and campus, what to bring, what we cover and how to request support on the day.',
  hero: { image: media.page.orientation },
  blocks: [
    {
      id: 'orientation-intro',
      type: 'intro',
      lead: 'Orientation helps you settle in before classes begin. You will meet staff and classmates, learn how your course works and find out where to get help.',
      body: 'Session details are also included with your enrolment information. [Orientation attendance requirements — to be confirmed.]',
    },
    {
      id: 'orientation-sessions',
      type: 'module',
      module: 'orientationSessions',
      background: 'alt',
      eyebrow: 'Upcoming sessions',
      heading: 'Orientation dates by intake and campus',
      intro: 'Times are shown in each campus’s local time zone. Past sessions are not listed.',
    },
    {
      id: 'orientation-arrival',
      type: 'steps',
      eyebrow: 'On the day',
      heading: 'Arrival instructions',
      items: [
        { title: 'Arrive a little early', text: 'Plan to arrive about 15 minutes before your session starts [check-in time — to be confirmed].' },
        { title: 'Check in at reception', text: 'Show your photo identification and enrolment confirmation. Staff will direct you to your session.' },
        { title: 'Welcome session', text: 'Meet the team, hear how your course works and learn where to find help.' },
        { title: 'Campus tour', text: 'See classrooms, study spaces and facilities, and learn the emergency procedures.' },
      ],
    },
    {
      id: 'orientation-checklist',
      type: 'checklist',
      background: 'alt',
      eyebrow: 'Be prepared',
      heading: 'What to bring and what we cover',
      groups: [
        {
          title: 'Bring with you',
          items: [
            'Photo identification',
            'Your enrolment confirmation, printed or on your phone',
            'Original documents, if admissions has asked to see them',
            'A notebook and pen, or a laptop or tablet',
            'Uniform and kit details for practical courses',
          ],
        },
        {
          title: 'Topics covered',
          items: [
            'Your timetable and how classes run',
            'Logging in to student systems [systems to be confirmed]',
            'Assessment, attendance and academic integrity',
            'Support services and how to ask for help',
            'Health, safety and emergency procedures',
          ],
        },
      ],
      note: 'Session-specific topics and items to bring are listed with each session above.',
    },
    {
      id: 'orientation-access',
      type: 'callout',
      tone: 'info',
      title: 'Accessibility requests and remote access',
      body: 'If you need adjustments to take part — such as accessible seating, an interpreter or materials in another format — contact the orientation coordinator at orientation@example.com before your session [notice period — to be confirmed]. If you cannot attend in person, check whether your session has a live online option, or ask the coordinator about alternatives.',
      action: { label: 'Contact the coordinator', href: '/enquire?topic=support', variant: 'secondary' },
    },
    {
      id: 'orientation-links',
      type: 'linkCards',
      background: 'alt',
      eyebrow: 'Before you start',
      heading: 'Read up before orientation',
      items: [
        { icon: 'book-text', title: 'Student handbook', text: 'Key contacts, rules, assessment and support — download the current version.', href: '/downloads?type=handbook' },
        { icon: 'calendar', title: 'Academic calendar', text: 'Term dates, breaks and assessment weeks.', href: '/downloads?type=calendar' },
        { icon: 'life-buoy', title: 'Student support', text: 'Support teams and how to contact them.', href: '/student-support' },
        { icon: 'scroll-text', title: 'Policies', text: 'Attendance, assessment and academic integrity.', href: '/policies' },
      ],
    },
    {
      id: 'orientation-cta',
      type: 'cta',
      eyebrow: 'Questions?',
      heading: 'We look forward to welcoming you',
      body: 'If you have questions about orientation or your first week, the student experience team is happy to help.',
      actions: [
        { label: 'Ask a question', href: '/enquire?topic=support', variant: 'accent' },
        { label: 'Student resources', href: '/student-resources', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Orientation at AIT: session dates by intake and campus, arrival instructions, what to bring and how to request support.',
  },
  updatedAt,
}

export const studentResourcesPage: Page = {
  id: 'page-student-resources',
  slug: 'student-resources',
  title: 'Student resources',
  eyebrow: 'Student resources',
  summary: 'Handbooks, calendars, forms, policies and links to student systems — everything you need during your studies.',
  hero: { image: media.page.resources },
  blocks: [
    {
      id: 'resources-intro',
      type: 'intro',
      lead: 'Everything you need during your studies, in one place: the student handbook, academic calendar, forms, policies and links to student systems.',
      body: 'Documents on this site are always the current approved version. Your personal records, results and timetables are available through student systems, not on the public website.',
    },
    {
      id: 'resources-quick-links',
      type: 'linkCards',
      background: 'alt',
      eyebrow: 'Quick links',
      heading: 'Popular resources',
      items: [
        { icon: 'book-text', title: 'Student handbook', text: 'Your guide to rules, assessment, support and key contacts.', href: '/downloads?type=handbook' },
        { icon: 'calendar', title: 'Academic calendar', text: 'Term dates, breaks and assessment weeks.', href: '/downloads?type=calendar' },
        { icon: 'scroll-text', title: 'Policies', text: 'Current approved policies and procedures.', href: '/policies' },
        { icon: 'life-buoy', title: 'Student support', text: 'Find the right team for your question.', href: '/student-support' },
        { icon: 'compass', title: 'Orientation', text: 'Session dates and what to bring.', href: '/student-support/orientation' },
        { icon: 'help', title: 'FAQs', text: 'Quick answers to common questions.', href: '/faq' },
      ],
    },
    {
      id: 'resources-forms',
      type: 'module',
      module: 'downloads',
      eyebrow: 'Forms',
      heading: 'Common forms',
      intro: 'Download a form, complete it and send it to the team listed on the form.',
      props: { type: 'form', showFilters: false },
    },
    {
      id: 'resources-systems',
      type: 'callout',
      background: 'alt',
      tone: 'info',
      title: 'Student portal and learning platform',
      body: 'Links to the student portal and the learning management system will appear here once their destinations are confirmed. [Student portal URL — to be confirmed.] [Learning management system URL — to be confirmed.] For login help, contact student administration.',
    },
    {
      id: 'resources-official',
      type: 'featureGrid',
      variant: 'icons',
      columns: 3,
      eyebrow: 'Official information',
      heading: 'Useful official links',
      intro: 'Links to official sources are added only after they have been checked for the actual study location.',
      items: [
        { icon: 'landmark', title: 'Education regulator', text: '[Official education regulator website — to be confirmed for the actual jurisdiction.]' },
        { icon: 'globe', title: 'Immigration information', text: '[Official immigration information for international students — if applicable.]' },
        { icon: 'heart-pulse', title: 'Health and emergency services', text: '[Official local health and emergency services information — to be confirmed.]' },
      ],
    },
    {
      id: 'resources-cta',
      type: 'cta',
      eyebrow: 'Can’t find something?',
      heading: 'We can point you to the right place',
      body: 'Contact student support or browse every published document on the downloads page.',
      actions: [
        { label: 'All downloads', href: '/downloads', variant: 'accent' },
        { label: 'Ask student support', href: '/enquire?topic=support', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Student resources at AIT: the student handbook, academic calendar, forms, policies and student systems.',
  },
  updatedAt,
}

export const downloadsPage: Page = {
  id: 'page-downloads',
  slug: 'downloads',
  title: 'Downloads',
  eyebrow: 'Student resources',
  summary: 'Course guides, handbooks, calendars and forms. Filter by document type, student type or course.',
  blocks: [
    {
      id: 'downloads-intro',
      type: 'intro',
      lead: 'Download current course guides, handbooks, calendars and forms. Each document shows its purpose, version, effective date, owner, format and file size.',
      body: 'Only the current approved version of each document is published here. Previous versions are retained on record.',
    },
    {
      id: 'downloads-list',
      type: 'module',
      module: 'downloads',
      background: 'alt',
      eyebrow: 'Documents',
      heading: 'All downloads',
      props: { showFilters: true },
    },
    {
      id: 'downloads-formats',
      type: 'callout',
      tone: 'info',
      title: 'Need a document in another format?',
      body: 'If a document is not accessible to you, contact us at [ACCESSIBILITY_EMAIL] and we will work with you to provide the information in a suitable alternative format.',
      action: { label: 'Accessibility', href: '/accessibility', variant: 'secondary' },
    },
    {
      id: 'downloads-links',
      type: 'linkCards',
      background: 'alt',
      eyebrow: 'Related',
      heading: 'More information',
      items: [
        { icon: 'scroll-text', title: 'Policies', text: 'Read current policies online.', href: '/policies' },
        { icon: 'folder-open', title: 'Student resources', text: 'Quick links for current students.', href: '/student-resources' },
        { icon: 'book-open', title: 'Courses', text: 'Course details, intakes and fees.', href: '/courses' },
      ],
    },
  ],
  seo: {
    description: 'Download course guides, the student handbook, the academic calendar and forms from AIT.',
  },
  updatedAt,
}

export const policiesPage: Page = {
  id: 'page-policies',
  slug: 'policies',
  title: 'Policies',
  eyebrow: 'Student resources',
  summary: 'Current approved policies, with their version, effective date and owner.',
  blocks: [
    {
      id: 'policies-intro',
      type: 'intro',
      lead: 'Our policies explain how we make decisions and what you can expect from us — and what we expect from you. Each policy shows its version, effective date and the role responsible for it.',
      body: 'Please read the admissions, fees and refunds, and deferral and withdrawal policies before you accept an offer.',
    },
    {
      id: 'policies-list',
      type: 'module',
      module: 'policies',
      background: 'alt',
      eyebrow: 'Current policies',
      heading: 'Policies and procedures',
    },
    {
      id: 'policies-help',
      type: 'callout',
      tone: 'info',
      title: 'Need help understanding a policy?',
      body: 'Contact the team listed on each policy, or ask student support to explain how a policy applies to your situation. Related forms are linked from each policy and are also on the downloads page.',
      action: { label: 'Ask student support', href: '/enquire?topic=support', variant: 'secondary' },
    },
    {
      id: 'policies-links',
      type: 'linkCards',
      background: 'alt',
      eyebrow: 'Related',
      heading: 'Forms and support',
      items: [
        { icon: 'download', title: 'Downloads', text: 'Forms, handbooks and course guides.', href: '/downloads' },
        { icon: 'scale', title: 'Complaints and appeals', text: 'How to raise a concern or appeal a decision.', href: '/policies/complaints-and-appeals' },
        { icon: 'life-buoy', title: 'Student support', text: 'Help with study, wellbeing and administration.', href: '/student-support' },
      ],
    },
  ],
  seo: {
    description: 'Current approved policies at AIT, including admissions, fees and refunds, complaints and appeals, and assessment.',
  },
  updatedAt,
}

export const faqPage: Page = {
  id: 'page-faq',
  slug: 'faq',
  title: 'Frequently asked questions',
  eyebrow: 'Help',
  summary: 'Quick answers about courses, applications, fees, intakes, campuses and support — each linked to the page with full details.',
  blocks: [
    {
      id: 'faq-intro',
      type: 'intro',
      lead: 'Find quick answers to common questions. Each answer links to the page with the full, current details.',
    },
    {
      id: 'faq-directory',
      type: 'module',
      module: 'faqDirectory',
      background: 'alt',
      eyebrow: 'Browse by topic',
      heading: 'All questions',
      props: { showSearch: true },
    },
    {
      id: 'faq-cta',
      type: 'cta',
      eyebrow: 'Still have a question?',
      heading: 'Ask our team',
      body: 'Send us an enquiry and the right team will get back to you using the contact details you provide.',
      actions: [
        { label: 'Make an enquiry', href: '/enquire', variant: 'accent' },
        { label: 'Contact details', href: '/contact', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Answers to common questions about courses, applications, fees, intakes, campuses, international study and support at AIT.',
  },
  updatedAt,
}

export const studentPages: Page[] = [
  studentLifePage,
  studentSupportPage,
  orientationPage,
  studentResourcesPage,
  downloadsPage,
  policiesPage,
  faqPage,
]

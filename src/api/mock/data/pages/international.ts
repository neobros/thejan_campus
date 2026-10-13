import type { Page } from '@/api/types'
import { media } from '../media'
import { TODAY } from '../time'

/**
 * DEMO DATA — international and domestic pages (specification §5.13–§5.16). The study country is
 * unconfirmed: immigration, health insurance, work rights and living-cost content stays as
 * placeholders until checked against official sources for the actual jurisdiction. Never promise
 * visa approval, migration outcomes or employment.
 */
const updatedAt = TODAY.toISOString()

export const internationalPage: Page = {
  id: 'page-international',
  slug: 'international',
  title: 'International students',
  eyebrow: 'International',
  summary: 'Courses open to international students, what you need to apply, and the support available as you plan your move.',
  hero: {
    image: media.page.international,
    actions: [
      { label: 'Courses for international students', href: '/courses?audience=international', variant: 'accent' },
      { label: 'Talk to us', href: '/enquire?topic=international', variant: 'secondary' },
    ],
  },
  blocks: [
    {
      id: 'international-intro',
      type: 'intro',
      lead: 'AIT welcomes students from around the world. Find courses open to international students, check what you need to apply and plan your arrival with help from our international office.',
      highlights: [
        { label: 'Apply directly or through an approved education agent', value: 'Your choice', icon: 'send' },
        { label: 'Advice from our international office', value: 'Personal support', icon: 'globe' },
        { label: 'Pre-arrival checklist and orientation for new students', value: 'Arrival planning', icon: 'plane' },
      ],
    },
    {
      id: 'international-visa-notice',
      type: 'callout',
      tone: 'info',
      title: 'Visas, migration and work',
      body: 'Visa and study permission decisions are made by the relevant government authorities. AIT cannot guarantee visa approval, migration outcomes or employment, and our staff do not give migration advice. We will link to official government information once it has been checked for [COUNTRY]. [Official immigration, health insurance and education links — to be confirmed.]',
    },
    {
      id: 'international-courses',
      type: 'module',
      module: 'featuredCourses',
      background: 'alt',
      eyebrow: 'Course options',
      heading: 'Courses for international students',
      intro: 'A selection of courses open to international applicants. Use the course search to see them all.',
      props: { audience: 'international', limit: 6 },
    },
    {
      id: 'international-steps',
      type: 'steps',
      eyebrow: 'Applying',
      heading: 'How to apply as an international student',
      items: [
        { title: 'Choose a course and intake', text: 'Compare courses open to international students and pick an intake that is accepting applications.' },
        { title: 'Check the requirements', text: 'Review academic and English language requirements on your course page, and any conditions for international students.' },
        { title: 'Prepare your documents', text: 'Gather your passport details, academic documents, English evidence and certified translations.' },
        { title: 'Apply online', text: 'Apply directly online, or through an approved education agent if you prefer.' },
        { title: 'Admissions assessment', text: 'Our team reviews your application and may ask for more information.' },
        { title: 'Receive your outcome', text: 'If you are successful, you receive a written outcome with any conditions and the steps to accept. [Offer documents — to be confirmed.]' },
        { title: 'Accept and complete enrolment', text: 'Follow the written instructions to accept, pay any amount due and complete enrolment.' },
        { title: 'Prepare to travel', text: 'Use our pre-arrival checklist and join orientation when you arrive.' },
      ],
    },
    {
      id: 'international-checklist',
      type: 'checklist',
      background: 'alt',
      eyebrow: 'Admissions checklist',
      heading: 'Before you apply',
      groups: [
        {
          title: 'Documents',
          items: [
            'Passport identity page, where required for your application',
            'Academic certificates and transcripts, with certified English translations',
            'Evidence of English language skills [accepted evidence — to be confirmed]',
            'CV or evidence of work experience, if your course asks for it',
          ],
        },
        {
          title: 'Planning',
          items: [
            'Check international fees and additional costs for your course',
            'Read the fees and refunds, and deferral and withdrawal policies',
            'Check official visa and study permission requirements for [COUNTRY] [official source — to be confirmed]',
            'Estimate your living costs and plan your accommodation',
          ],
        },
      ],
      note: 'The online application shows the document checklist that applies to your course and circumstances.',
    },
    {
      id: 'international-intakes',
      type: 'module',
      module: 'intakeExplorer',
      eyebrow: 'Upcoming intakes',
      heading: 'Start dates for international students',
      intro: 'Dates are shown in each campus’s local time.',
      props: { audience: 'international', limit: 6, showFilters: false },
    },
    {
      id: 'international-plan',
      type: 'linkCards',
      background: 'alt',
      eyebrow: 'Plan your study',
      heading: 'Fees, arrival and support',
      items: [
        { icon: 'wallet', title: 'Fees and payments', text: 'International fees, additional costs and payment instructions.', href: '/admissions/fees' },
        { icon: 'plane', title: 'Before you arrive', text: 'Your pre-arrival checklist, from documents to travel plans.', href: '/international/pre-arrival' },
        { icon: 'house', title: 'Living and studying here', text: 'Accommodation, transport, living costs and settling in.', href: '/international/living-and-studying' },
        { icon: 'handshake', title: 'Education agents', text: 'Approved agents by country and how they can help.', href: '/international/agents', feature: 'agents' },
        { icon: 'award', title: 'Scholarships', text: 'Current opportunities and eligibility.', href: '/admissions/scholarships', feature: 'scholarships' },
        { icon: 'life-buoy', title: 'Student support', text: 'Academic, wellbeing and international student advice.', href: '/student-support' },
      ],
    },
    {
      id: 'international-faqs',
      type: 'module',
      module: 'faqDirectory',
      eyebrow: 'Questions',
      heading: 'International student FAQs',
      props: { categories: ['international'] },
    },
    {
      id: 'international-cta',
      type: 'cta',
      eyebrow: 'Talk to us',
      heading: 'Our international office is here to help',
      body: 'Ask about courses, requirements, fees or arrival — or start your application online.',
      actions: [
        { label: 'Make an enquiry', href: '/enquire?topic=international', variant: 'accent' },
        { label: 'Apply now', href: '/apply', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Study at AIT as an international student: courses, entry requirements, application checklist, fees, arrival and support.',
  },
  updatedAt,
}

export const preArrivalPage: Page = {
  id: 'page-international-pre-arrival',
  slug: 'international/pre-arrival',
  title: 'Before you arrive',
  eyebrow: 'International',
  summary: 'A pre-arrival checklist covering your enrolment, travel documents, accommodation, insurance and orientation.',
  hero: { image: media.page.preArrival },
  blocks: [
    {
      id: 'pre-arrival-intro',
      type: 'intro',
      lead: 'Once you have accepted your offer and completed your enrolment steps, it is time to plan your move. Use this checklist to prepare for your arrival and your first weeks.',
      body: 'Requirements depend on your course, your circumstances and the rules of the study location. Our international office can help if you are unsure about anything.',
    },
    {
      id: 'pre-arrival-checklist',
      type: 'checklist',
      background: 'alt',
      eyebrow: 'Checklist',
      heading: 'Your pre-arrival checklist',
      groups: [
        {
          title: 'Acceptance and enrolment',
          items: [
            'Follow the acceptance instructions in your written offer',
            'Pay any amount due by the date in your official payment instructions',
            'Keep copies of your offer, receipts and enrolment confirmation',
          ],
        },
        {
          title: 'Travel documents',
          items: [
            'A valid passport',
            'Any visa or study permission required for [COUNTRY] [official source — to be confirmed]',
            'Your offer and enrolment documents from AIT',
            'Original academic documents, if admissions has asked to see them',
          ],
        },
        {
          title: 'Health and insurance',
          items: [
            '[Health insurance requirements — to be confirmed for the actual jurisdiction]',
            'Copies of prescriptions and medical records, translated into English',
            'Any vaccination requirements, checked with official sources',
          ],
        },
        {
          title: 'Arrival plans',
          items: [
            'Book accommodation for at least your first few weeks',
            'Plan how you will travel from the airport to your accommodation',
            'Arrange access to money for your first weeks',
            'Check what to pack for the local climate and your course, such as uniforms or kits',
          ],
        },
      ],
      note: 'Download the full international pre-departure guide from the downloads page.',
    },
    {
      id: 'pre-arrival-timeline',
      type: 'steps',
      eyebrow: 'Timeline',
      heading: 'Your first weeks',
      items: [
        { title: 'Before you leave', text: 'Complete your checklist, confirm accommodation and share your travel plans with the international office.', meta: '[Recommended timing — to be confirmed]' },
        { title: 'Arrival', text: 'Settle into your accommodation, set up your phone and banking, and plan your route to campus.', meta: 'First days' },
        { title: 'Orientation', text: 'Meet staff and classmates, learn how your course works and find out where to get help.', meta: 'Before classes begin' },
        { title: 'First week of classes', text: 'Attend your classes, log in to student systems and ask for help if anything is unclear.', meta: 'Week one' },
      ],
    },
    {
      id: 'pre-arrival-accommodation',
      type: 'featureGrid',
      background: 'alt',
      variant: 'cards',
      columns: 3,
      eyebrow: 'Accommodation',
      heading: 'Planning where to live',
      intro: 'Arrange somewhere to stay before you travel. [Accommodation services offered by AIT, if any — to be confirmed.]',
      items: [
        { icon: 'hotel', title: 'Short-term stays', text: 'Temporary accommodation gives you time to inspect longer-term options in person.' },
        { icon: 'house', title: 'Shared housing', text: 'Renting a room in a shared house or apartment. Always inspect a property and read the agreement before paying.' },
        { icon: 'users', title: 'Homestay', text: 'Living with a local host. [Homestay providers — to be confirmed.]' },
      ],
    },
    {
      id: 'pre-arrival-late',
      type: 'callout',
      tone: 'warning',
      title: 'Running late?',
      body: 'If you cannot arrive before your course starts, contact the international office as soon as possible — before your start date. Late arrival may affect your enrolment. [Late arrival conditions — to be confirmed.]',
      action: { label: 'Contact the international office', href: '/enquire?topic=international', variant: 'secondary' },
    },
    {
      id: 'pre-arrival-links',
      type: 'linkCards',
      eyebrow: 'Helpful links',
      heading: 'Get ready for your first day',
      items: [
        { icon: 'compass', title: 'Orientation', text: 'Dates, times and what to bring.', href: '/student-support/orientation' },
        { icon: 'house', title: 'Living and studying here', text: 'Transport, living costs and settling in.', href: '/international/living-and-studying' },
        { icon: 'download', title: 'Pre-departure guide', text: 'Download the full guide and checklist.', href: '/downloads' },
        { icon: 'life-buoy', title: 'Student support', text: 'Who to contact once you arrive.', href: '/student-support' },
      ],
    },
    {
      id: 'pre-arrival-cta',
      type: 'cta',
      eyebrow: 'Questions before you travel?',
      heading: 'We are here to help you prepare',
      body: 'Contact our international office about arrival, accommodation planning or your first week.',
      actions: [
        { label: 'Contact the international office', href: '/enquire?topic=international', variant: 'accent' },
        { label: 'Contact details', href: '/contact', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Prepare to study at AIT: a pre-arrival checklist covering enrolment, travel documents, accommodation, insurance and orientation.',
  },
  updatedAt,
}

export const livingPage: Page = {
  id: 'page-international-living',
  slug: 'international/living-and-studying',
  title: 'Living and studying here',
  eyebrow: 'International',
  summary: 'Housing options, transport, estimated living costs and tips for settling in to life in [CITY].',
  hero: { image: media.page.living },
  blocks: [
    {
      id: 'living-intro',
      type: 'intro',
      lead: 'Settling into a new city takes time. Here is an overview of what to expect, with links to trusted sources for up-to-date information.',
      body: 'Costs and rules change, so the figures and requirements on this page always show their source and date. [All local information — to be confirmed for the actual location.]',
    },
    {
      id: 'living-housing',
      type: 'featureGrid',
      background: 'alt',
      variant: 'cards',
      columns: 2,
      eyebrow: 'Housing',
      heading: 'Finding somewhere to live',
      items: [
        { icon: 'house', title: 'Shared rentals', text: 'Many students share a house or apartment. Inspect the property, read the agreement carefully and keep records of any payments.' },
        { icon: 'users', title: 'Homestay', text: 'Living with a local host can help you settle in and practise English. [Homestay options — to be confirmed.]' },
        { icon: 'building', title: 'Student residences', text: 'Purpose-built student accommodation. [Local providers — to be confirmed.]' },
        { icon: 'hotel', title: 'Short-term stays', text: 'Temporary accommodation for your first weeks while you look for a longer-term home.' },
      ],
    },
    {
      id: 'living-costs',
      type: 'table',
      eyebrow: 'Living costs',
      heading: 'Estimated living costs',
      intro: 'A planning guide only. Your costs depend on your lifestyle, accommodation and location.',
      columns: ['Expense', 'Estimated cost', 'Source and date'],
      rows: [
        ['Accommodation (rent)', '[Living cost estimate — to be confirmed]', '[Source and date — to be confirmed]'],
        ['Food and groceries', '[Living cost estimate — to be confirmed]', '[Source and date — to be confirmed]'],
        ['Public transport', '[Living cost estimate — to be confirmed]', '[Source and date — to be confirmed]'],
        ['Phone and internet', '[Living cost estimate — to be confirmed]', '[Source and date — to be confirmed]'],
        ['Utilities', '[Living cost estimate — to be confirmed]', '[Source and date — to be confirmed]'],
        ['Health insurance, if required', '[Living cost estimate — to be confirmed]', '[Source and date — to be confirmed]'],
      ],
      caption: 'Estimates are published only with an approved, current source. Figures must not be copied from other providers.',
    },
    {
      id: 'living-getting-around',
      type: 'split',
      background: 'alt',
      eyebrow: 'Getting around',
      heading: 'Transport and campus access',
      body: 'All three campuses can be reached by public transport. Each campus page lists the nearest stops, bicycle parking, car parking options and accessibility information.\n\n[Local public transport options, concession eligibility and travel card information — to be confirmed.]',
      image: media.campus.city,
      imageSide: 'right',
      bullets: [
        'City Campus — close to public transport and city services',
        'Riverside Campus — beside a riverside walking and cycling path',
        'Parkview Campus — limited on-site parking and nearby public transport',
      ],
      actions: [{ label: 'Campus locations', href: '/campuses', variant: 'primary' }],
    },
    {
      id: 'living-settling',
      type: 'featureGrid',
      variant: 'icons',
      columns: 3,
      eyebrow: 'Settling in',
      heading: 'Getting set up',
      items: [
        { icon: 'banknote', title: 'Banking', text: 'Open a local bank account soon after arrival. [Documents usually needed — to be confirmed.]' },
        { icon: 'smartphone', title: 'Phone and internet', text: 'Compare prepaid and contract options before you sign up. [Local providers and typical costs — to be confirmed.]' },
        { icon: 'stethoscope', title: 'Health care', text: 'Find a local doctor and learn how to access health services. [Local health service information — to be confirmed.]' },
        { icon: 'shield', title: 'Staying safe', text: 'Save emergency numbers, plan your route home and keep valuables secure. Campus staff can share local safety advice.' },
        { icon: 'heart', title: 'Cultural adjustment', text: 'Feeling homesick or unsettled is normal. Our wellbeing team is here to talk.' },
        { icon: 'users', title: 'Making connections', text: 'Join student activities, cultural events and study groups to meet people.' },
      ],
    },
    {
      id: 'living-emergency',
      type: 'callout',
      background: 'alt',
      tone: 'danger',
      title: 'In an emergency',
      body: 'If you or someone else is in immediate danger, call local emergency services on **[EMERGENCY_NUMBER]**. Website forms and email inboxes are not monitored for emergencies. Once you are safe, let campus staff know.',
    },
    {
      id: 'living-rules',
      type: 'callout',
      tone: 'info',
      title: 'Work, visa conditions and official rules',
      body: 'Rules about working while you study, study conditions and health cover depend on the study location and your visa. Always check official government sources. [Official links — to be confirmed for the actual jurisdiction.] AIT cannot give migration advice or promise employment.',
    },
    {
      id: 'living-links',
      type: 'linkCards',
      background: 'alt',
      eyebrow: 'Related information',
      heading: 'More help settling in',
      items: [
        { icon: 'plane', title: 'Before you arrive', text: 'Your pre-arrival checklist.', href: '/international/pre-arrival' },
        { icon: 'life-buoy', title: 'Student support', text: 'Wellbeing, study and international student advice.', href: '/student-support' },
        { icon: 'sparkles', title: 'Student life', text: 'Activities, events and community.', href: '/student-life' },
        { icon: 'building', title: 'Campuses', text: 'Addresses, transport and facilities.', href: '/campuses' },
      ],
    },
  ],
  seo: {
    description: 'Living and studying in [CITY]: housing options, transport, estimated living costs with sources, banking, safety and settling in.',
  },
  updatedAt,
}

export const agentsPage: Page = {
  id: 'page-international-agents',
  slug: 'international/agents',
  title: 'Education agents',
  eyebrow: 'International',
  summary: 'Find an approved education agent in your country, or apply directly. Agents can also enquire about working with us.',
  hero: { image: media.page.agents },
  blocks: [
    {
      id: 'agents-intro',
      type: 'intro',
      lead: 'Education agents can help international students compare courses and prepare an application. You can apply directly to AIT or through one of our approved agents — the choice is yours.',
    },
    {
      id: 'agents-role',
      type: 'featureGrid',
      background: 'alt',
      variant: 'icons',
      columns: 3,
      eyebrow: 'The role of an agent',
      heading: 'How an approved agent can help',
      intro: 'Agents may charge their own service fees, which are separate from AIT fees. Ask about any fees before you agree to use an agent.',
      items: [
        { icon: 'compass', title: 'Comparing courses', text: 'Explaining course options, entry requirements and intakes in your language.' },
        { icon: 'clipboard-list', title: 'Preparing your application', text: 'Helping you gather documents and complete the online application accurately.' },
        { icon: 'route', title: 'Next steps', text: 'Helping you understand your outcome, acceptance steps and pre-arrival planning.' },
      ],
    },
    {
      id: 'agents-direct',
      type: 'callout',
      tone: 'info',
      title: 'You can always apply directly',
      body: 'You do not need an agent to apply. If you choose to use one, check that they appear in the list below. Agents cannot guarantee an offer, a visa or employment, and only AIT can make admissions decisions.',
      action: { label: 'Apply directly', href: '/apply', variant: 'secondary' },
    },
    {
      id: 'agents-directory',
      type: 'module',
      module: 'agentsDirectory',
      background: 'alt',
      eyebrow: 'Approved agents',
      heading: 'Find an agent in your country',
      intro: 'Only agents with a current agreement with AIT are listed. If an agent is not listed, contact us before sharing documents or making any payment.',
    },
    {
      id: 'agents-partner',
      type: 'steps',
      eyebrow: 'For agents',
      heading: 'Working with AIT',
      intro: 'Interested in representing AIT? Here is how the process works. [Agent onboarding process — to be confirmed.]',
      items: [
        { title: 'Send an agent enquiry', text: 'Tell us about your organisation, the countries you work in and your experience.' },
        { title: 'Initial review', text: 'Our international office reviews your enquiry and may ask for more information.' },
        { title: 'Agreement and checks', text: 'If we proceed, we complete due diligence and agree the terms of an agent agreement.' },
        { title: 'Listing', text: 'Agents are listed on this page only after an agreement has been approved.' },
      ],
    },
    {
      id: 'agents-not-approval',
      type: 'callout',
      background: 'alt',
      tone: 'warning',
      title: 'An enquiry is not an approval',
      body: 'Submitting an agent enquiry does not create an agreement or approve you to represent AIT. Please do not describe yourself as an approved agent until you receive a signed agreement and your listing appears on this page.',
    },
    {
      id: 'agents-form',
      type: 'module',
      module: 'agentEnquiryForm',
      eyebrow: 'Agent enquiry',
      heading: 'Enquire about becoming an agent',
      intro: 'Complete the form and our international office will be in touch using the details you provide.',
    },
  ],
  seo: {
    description: 'Approved education agents for AIT by country, how agents can help, and how agents can enquire about working with us.',
  },
  updatedAt,
}

export const domesticPage: Page = {
  id: 'page-domestic',
  slug: 'domestic',
  title: 'Domestic students',
  eyebrow: 'Domestic students',
  summary: 'Courses open to domestic students, eligibility, fees and the support available while you study close to home.',
  hero: {
    image: media.page.domestic,
    actions: [
      { label: 'Find a course', href: '/courses?audience=domestic', variant: 'accent' },
      { label: 'Ask a question', href: '/enquire?topic=course', variant: 'secondary' },
    ],
  },
  blocks: [
    {
      id: 'domestic-intro',
      type: 'intro',
      lead: 'Studying close to home? Explore courses open to domestic students, check your eligibility and find out about fees and support.',
      body: 'Course details, intakes and fees on this page come from the same course catalogue as the rest of the site, so information is always consistent.',
    },
    {
      id: 'domestic-courses',
      type: 'module',
      module: 'featuredCourses',
      background: 'alt',
      eyebrow: 'Course options',
      heading: 'Courses for domestic students',
      intro: 'A selection of courses open to domestic students, including flexible short courses.',
      props: { audience: 'domestic', limit: 6 },
    },
    {
      id: 'domestic-eligibility',
      type: 'featureGrid',
      variant: 'icons',
      columns: 3,
      eyebrow: 'Eligibility',
      heading: 'Is this the right pathway for you?',
      items: [
        { icon: 'id-card', title: 'Who is a domestic student?', text: '[Definition of a domestic student for [COUNTRY] — to be confirmed by admissions.]' },
        { icon: 'list-checks', title: 'Entry requirements', text: 'Each course lists its academic, language and other requirements. Course pages take priority over general guidance.', href: '/admissions/entry-requirements', linkLabel: 'Entry requirements' },
        { icon: 'wallet', title: 'Fees', text: 'Domestic fees are shown on each course page and in the fee finder.', href: '/admissions/fees', linkLabel: 'Fees and payments' },
      ],
    },
    {
      id: 'domestic-funding',
      type: 'callout',
      background: 'alt',
      tone: 'info',
      title: 'Funding and concessions',
      body: 'Information about government funding, subsidies or concessions appears here only once it has been approved for AIT and the specific course. [Approved funding information, if any — to be confirmed.] Admissions can confirm what applies to your circumstances.',
    },
    {
      id: 'domestic-steps',
      type: 'steps',
      eyebrow: 'Applying',
      heading: 'How to apply',
      items: [
        { title: 'Choose a course', text: 'Compare courses, campuses and delivery options, including evening and online study where offered.' },
        { title: 'Check your eligibility', text: 'Review the course entry requirements and prepare your documents.' },
        { title: 'Apply online', text: 'Complete the application at your own pace and receive a reference number.' },
        { title: 'Admissions review and next steps', text: 'Our team reviews your application and contacts you with the outcome in writing.' },
      ],
    },
    {
      id: 'domestic-intakes',
      type: 'module',
      module: 'intakeExplorer',
      background: 'alt',
      eyebrow: 'Upcoming intakes',
      heading: 'Start dates for domestic students',
      props: { audience: 'domestic', limit: 6, showFilters: false },
    },
    {
      id: 'domestic-links',
      type: 'linkCards',
      eyebrow: 'Related information',
      heading: 'Plan your study',
      items: [
        { icon: 'file-check', title: 'Credit transfer', text: 'Use previous study or work experience towards your course.', href: '/admissions/credit-transfer', feature: 'creditTransfer' },
        { icon: 'life-buoy', title: 'Student support', text: 'Study, wellbeing and accessibility support.', href: '/student-support' },
        { icon: 'building', title: 'Campuses', text: 'Find the campus closest to you.', href: '/campuses' },
        { icon: 'help', title: 'FAQs', text: 'Answers to common questions.', href: '/faq' },
      ],
    },
    {
      id: 'domestic-cta',
      type: 'cta',
      eyebrow: 'Talk to us',
      heading: 'Find the course that fits your life',
      body: 'Our admissions team can help you compare options, including part-time and online study.',
      actions: [
        { label: 'Make an enquiry', href: '/enquire?topic=course', variant: 'accent' },
        { label: 'Apply now', href: '/apply', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Study at AIT as a domestic student: course options, eligibility, entry requirements, fees and support.',
  },
  updatedAt,
}

export const internationalPages: Page[] = [internationalPage, preArrivalPage, livingPage, agentsPage, domesticPage]

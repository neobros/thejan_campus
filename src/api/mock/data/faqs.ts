import type { Faq } from '@/api/types'

/**
 * DEMO DATA — starter FAQs across every category (specification §5.22). Answers follow the
 * admissions process and policies in this dataset and link to the authoritative page; bracketed
 * items need client-approved answers.
 */
export const faqs: Faq[] = [
  /* Courses ---------------------------------------------------------------------------------- */
  {
    id: 'faq-choose-course',
    category: 'courses',
    question: 'How do I choose the right course?',
    answer:
      'Start with the [course search](/courses), where you can filter by study area, qualification level, campus, delivery mode and student type. Each course page explains who the course is for, what you will learn, entry requirements, fees and upcoming intakes.\n\nIf you would like personal advice, our admissions team is happy to help you compare options.',
    links: [
      { label: 'Search courses', href: '/courses' },
      { label: 'Ask about a course', href: '/enquire?topic=course' },
    ],
  },
  {
    id: 'faq-study-online',
    category: 'courses',
    question: 'Can I study online?',
    answer:
      'Some courses are offered online or in blended mode, which combines online learning with campus classes. The delivery options for each course are listed on its course page. Practical courses, such as cookery and care, include on-campus training and may include work placement.\n\nInternational students should check which study modes apply to them. [Study-mode conditions for international students in the actual study location — to be confirmed.]',
    links: [{ label: 'Browse courses', href: '/courses' }],
  },

  /* Eligibility ------------------------------------------------------------------------------ */
  {
    id: 'faq-entry-requirements',
    category: 'eligibility',
    question: 'What are the entry requirements?',
    answer:
      'Entry requirements depend on the course and can include academic qualifications, English language evidence, a minimum age and course-specific prerequisites. Each course page lists its exact requirements, and these take priority over general guidance.',
    links: [
      { label: 'Entry requirements', href: '/admissions/entry-requirements' },
      { label: 'Browse courses', href: '/courses' },
    ],
  },
  {
    id: 'faq-english-evidence',
    category: 'eligibility',
    question: 'Do I need to show evidence of my English language skills?',
    answer:
      'Our courses are taught in English, so you may need to provide evidence of your English language skills. Accepted evidence and minimum results depend on the course — check the entry requirements on your course page. [Accepted tests and minimum results — to be confirmed by admissions.]\n\nIf you would like to build your English first, our English language programs may help.',
    links: [
      { label: 'Entry requirements', href: '/admissions/entry-requirements' },
      { label: 'English language programs', href: '/courses/category/english' },
    ],
  },
  {
    id: 'faq-credit',
    category: 'eligibility',
    question: 'Can I get credit for previous study or work experience?',
    answer:
      'You may be able to receive credit through credit transfer or recognition of prior learning. You will need to provide evidence, and the final decision is made by authorised academic staff after assessment. Credit can change your course length and fees.',
    links: [{ label: 'Credit transfer and prior learning', href: '/admissions/credit-transfer' }],
  },

  /* Applications ----------------------------------------------------------------------------- */
  {
    id: 'faq-how-to-apply',
    category: 'applications',
    question: 'How do I apply?',
    answer:
      'Choose your course, campus and intake, then complete the [online application](/apply). The form guides you through each step, including your study background and supporting documents, and you receive a reference number when you submit. You can apply directly or through an approved education agent.',
    links: [
      { label: 'Apply now', href: '/apply' },
      { label: 'How admissions works', href: '/admissions' },
    ],
  },
  {
    id: 'faq-documents',
    category: 'applications',
    question: 'What documents are required?',
    answer:
      'Most applicants provide academic certificates and transcripts, evidence of English language skills if their course requires it, and certified translations of any documents that are not in English. Some courses and applicants need extra documents.\n\nThe application form shows the checklist that applies to you. We only ask for identity documents where they are needed.',
    links: [
      { label: 'Application checklist', href: '/admissions' },
      { label: 'Entry requirements', href: '/admissions/entry-requirements' },
    ],
  },
  {
    id: 'faq-application-not-enrolment',
    category: 'applications',
    question: 'Does submitting an application mean I am enrolled?',
    answer:
      'No. Submitting an application asks our admissions team to review your details. It does not create an enrolment, an offer, a visa document or a payment obligation. We may ask you for more information, and you will receive the outcome and any next steps in writing.',
    links: [{ label: 'How admissions works', href: '/admissions' }],
  },

  /* Fees ------------------------------------------------------------------------------------- */
  {
    id: 'faq-how-fees-paid',
    category: 'fees',
    question: 'How are fees paid?',
    answer:
      'If your application is successful, you will receive written payment instructions from AIT with the amount due, due dates and accepted payment methods. [Accepted payment methods — to be confirmed by finance.]\n\nOnly pay using the details in your official instructions. If anything looks unusual, contact our finance team before paying.',
    links: [
      { label: 'Fees and payments', href: '/admissions/fees' },
      { label: 'Fees and refunds policy', href: '/policies/fees-and-refunds' },
    ],
  },
  {
    id: 'faq-extra-costs',
    category: 'fees',
    question: 'Are there costs in addition to tuition?',
    answer:
      'Some courses have additional costs, such as an application processing fee, learning materials, uniforms and kits, or placement-related costs. These are listed with the fees for each course. If you are moving to study, also plan for accommodation, transport and everyday living costs.',
    links: [
      { label: 'Fees and payments', href: '/admissions/fees' },
      { label: 'Living and studying', href: '/international/living-and-studying' },
    ],
  },
  {
    id: 'faq-no-fee-listed',
    category: 'fees',
    question: 'Why does a course say "Contact admissions for current fees"?',
    answer:
      'It means an approved fee for that course and student type has not been published yet. It never means the course is free. Our admissions team can give you current fee information.',
    links: [{ label: 'Make a fees enquiry', href: '/enquire?topic=fees' }],
  },

  /* Intakes ---------------------------------------------------------------------------------- */
  {
    id: 'faq-when-start',
    category: 'intakes',
    question: 'When can I start?',
    answer:
      'Start dates depend on the course and campus. The intakes page lists upcoming dates, application deadlines and availability, shown in each campus’s local time.',
    links: [{ label: 'Upcoming intakes', href: '/admissions/intakes' }],
  },
  {
    id: 'faq-change-intake',
    category: 'intakes',
    question: 'Can I change my intake?',
    answer:
      'If you have not yet accepted an offer, contact admissions and we will check whether a later intake is available. If you are already enrolled, you may be able to defer your start under the deferral and withdrawal policy.\n\nChanging your intake can affect fees and other arrangements, so please ask before making plans.',
    links: [
      { label: 'Deferral and withdrawal policy', href: '/policies/deferral-and-withdrawal' },
      { label: 'Contact admissions', href: '/enquire?topic=admissions' },
    ],
  },

  /* Campuses --------------------------------------------------------------------------------- */
  {
    id: 'faq-where-delivered',
    category: 'campuses',
    question: 'Where is my course delivered?',
    answer:
      'Each course page lists the campuses where it is offered and its delivery modes. Some courses run at one campus because they use specialist facilities — for example, the training kitchens at Riverside Campus or the simulated care rooms at Parkview Campus. You choose your campus and intake when you apply.',
    links: [
      { label: 'Our campuses', href: '/campuses' },
      { label: 'Browse courses', href: '/courses' },
    ],
  },
  {
    id: 'faq-visit-campus',
    category: 'campuses',
    question: 'Can I visit a campus before I apply?',
    answer:
      'Yes. Come along to an open day, or contact us to arrange a visit during opening hours. Each campus page includes the address, transport options and accessibility information.',
    links: [
      { label: 'Upcoming events', href: '/events' },
      { label: 'Our campuses', href: '/campuses' },
    ],
  },

  /* International ---------------------------------------------------------------------------- */
  {
    id: 'faq-international-apply',
    category: 'international',
    question: 'Can international students apply online?',
    answer:
      'Yes. International students can apply online, either directly or through an approved education agent. Courses open to international students show international fees and upcoming intakes.',
    links: [
      { label: 'International students', href: '/international' },
      { label: 'Courses for international students', href: '/courses?audience=international' },
    ],
  },
  {
    id: 'faq-visa',
    category: 'international',
    question: 'Can you help me with my visa?',
    answer:
      'Our international office can explain our admissions and enrolment process and point you to official government information. Visa decisions are made by the relevant government authority, so we cannot guarantee approval or give migration advice. [Details of any enrolment documents issued to support study permission applications — to be confirmed for the actual jurisdiction.]',
    links: [
      { label: 'International students', href: '/international' },
      { label: 'Before you arrive', href: '/international/pre-arrival' },
    ],
  },
  {
    id: 'faq-agent-required',
    category: 'international',
    question: 'Do I need to use an education agent?',
    answer:
      'No. You can apply directly to AIT or use an approved education agent — the choice is yours. If you use an agent, check that they are listed on our agents page. Agents may charge their own service fees, which are separate from AIT fees.',
    links: [
      { label: 'Education agents', href: '/international/agents' },
      { label: 'Apply directly', href: '/apply' },
    ],
  },

  /* Support ---------------------------------------------------------------------------------- */
  {
    id: 'faq-request-support',
    category: 'support',
    question: 'How do I request support?',
    answer:
      'The student support directory lists what each team can help with, how to contact them and when they are available. If you are not sure where to start, contact student support and we will point you in the right direction. You can also mention any support needs in your application.',
    links: [
      { label: 'Student support', href: '/student-support' },
      { label: 'Ask for support', href: '/enquire?topic=support' },
    ],
  },
  {
    id: 'faq-emergency',
    category: 'support',
    question: 'What should I do in an emergency?',
    answer:
      'If you or someone else is in immediate danger, call local emergency services on [EMERGENCY_NUMBER] first, then let campus staff know. Website forms and email inboxes are not monitored for emergencies.',
    links: [{ label: 'Student support', href: '/student-support' }],
  },
  {
    id: 'faq-complaint',
    category: 'support',
    question: 'How do I make a complaint or appeal a decision?',
    answer:
      'We encourage you to raise concerns early — often a conversation with your trainer or the relevant team can resolve things quickly. If not, you can lodge a formal complaint or appeal under the complaints and appeals policy. Complaints are handled fairly and confidentially.',
    links: [
      { label: 'Complaints and appeals policy', href: '/policies/complaints-and-appeals' },
      { label: 'Student support', href: '/student-support' },
    ],
  },

  /* Resources -------------------------------------------------------------------------------- */
  {
    id: 'faq-handbook-forms',
    category: 'resources',
    question: 'Where can I find the student handbook and forms?',
    answer:
      'The student handbook, academic calendar, course guides and common forms are on the downloads page. Each document shows its version, effective date, format and file size.',
    links: [
      { label: 'Downloads', href: '/downloads' },
      { label: 'Student resources', href: '/student-resources' },
    ],
  },
  {
    id: 'faq-accessible-documents',
    category: 'resources',
    question: 'Can I get a document in an accessible format?',
    answer:
      'Yes. If a document or page is not accessible to you, contact us and we will work with you to provide the information in a suitable alternative format.',
    links: [
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
]

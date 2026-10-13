import type { Page } from '@/api/types'
import { media } from '../media'
import { TODAY } from '../time'

/**
 * DEMO DATA — admissions pages (specification §5.7–§5.12). Final admissions stages, turnaround
 * guidance, English requirements, payment methods and refund rules are placeholders for the
 * admissions and finance teams. Never imply that a submitted application is an offer or enrolment.
 */
const updatedAt = TODAY.toISOString()

export const admissionsPage: Page = {
  id: 'page-admissions',
  slug: 'admissions',
  title: 'How to apply',
  eyebrow: 'Admissions',
  summary: 'A clear, step-by-step guide to applying — from choosing a course to your first day.',
  hero: {
    image: media.page.admissions,
    actions: [
      { label: 'Apply now', href: '/apply', variant: 'accent' },
      { label: 'Check entry requirements', href: '/admissions/entry-requirements', variant: 'secondary' },
    ],
  },
  blocks: [
    {
      id: 'admissions-intro',
      type: 'intro',
      lead: 'Applying to AIT is straightforward. This page explains each stage, who you will hear from and what to prepare before you start.',
      highlights: [
        { label: 'Apply at your own pace, from anywhere', value: 'Online', icon: 'laptop' },
        { label: 'Every application is reviewed by our admissions team', value: 'Personal review', icon: 'users' },
        { label: 'Typical review time — approved guidance to be confirmed', value: '[TIMEFRAME]', icon: 'clock' },
      ],
    },
    {
      id: 'admissions-notice',
      type: 'callout',
      tone: 'info',
      title: 'A submitted application is not an offer or enrolment',
      body: 'Submitting an application asks our admissions team to review your details. It does not create an enrolment, an offer, a visa document or a payment obligation. You will receive the outcome and any next steps in writing.',
    },
    {
      id: 'admissions-steps',
      type: 'steps',
      background: 'alt',
      eyebrow: 'Step by step',
      heading: 'From first look to first class',
      intro: 'Our admissions team will confirm any additional steps that apply to your course or circumstances.',
      items: [
        { title: 'Explore courses', text: 'Compare courses, delivery modes and campuses to find the right fit for your goals.', meta: 'You' },
        { title: 'Check entry requirements and intakes', text: 'Review the requirements on your course page and choose an intake that is open for applications.', meta: 'You' },
        { title: 'Prepare your documents', text: 'Gather certificates, transcripts, English language evidence and certified translations as needed.', meta: 'You' },
        { title: 'Submit your application', text: 'Complete the online form and upload your documents securely. You receive a reference number as soon as you submit.', meta: 'You · online' },
        { title: 'Admissions assessment', text: 'Our team reviews your application against the course requirements and contacts you if anything is missing or unclear.', meta: 'Admissions team' },
        { title: 'Receive your outcome', text: 'We let you know the outcome in writing, including any conditions. [Approved turnaround guidance — to be confirmed.]', meta: 'Admissions team' },
        { title: 'Accept and complete enrolment', text: 'If your application is successful, follow the written instructions to accept your offer and complete any enrolment and payment steps.', meta: 'You and admissions' },
        { title: 'Attend orientation', text: 'Join orientation to meet staff and classmates and get ready for your first class.', meta: 'Student experience team' },
      ],
    },
    {
      id: 'admissions-checklist',
      type: 'checklist',
      eyebrow: 'Before you apply',
      heading: 'Application document checklist',
      intro: 'Having your documents ready makes applying quicker. Clear scans or photos in PDF, JPG or PNG format are accepted.',
      groups: [
        {
          title: 'Most applicants',
          items: [
            'Academic certificates and transcripts for your highest completed qualification',
            'Evidence of English language skills, if your course requires it',
            'Certified English translations of any documents not in English',
          ],
        },
        {
          title: 'If they apply to you',
          items: [
            'Identity document — only where it is required for your application',
            'CV or evidence of work experience, for courses that ask for it',
            'Evidence for credit transfer or recognition of prior learning',
            'Details of your education agent, if you are applying through one',
          ],
        },
      ],
      note: 'The online form shows the exact checklist for your course and circumstances. [Final document list — to be confirmed by admissions.]',
    },
    {
      id: 'admissions-contacts',
      type: 'table',
      background: 'alt',
      eyebrow: 'Who to contact',
      heading: 'The right team for your question',
      columns: ['Your question', 'Responsible team', 'How to reach them'],
      rows: [
        ['Choosing a course, entry requirements or your application', 'Admissions', 'admissions@example.com · [ADMISSIONS_PHONE]'],
        ['Applying as an international student', 'International office', 'international@example.com · [INTERNATIONAL_PHONE]'],
        ['Fees, invoices and payment instructions', 'Finance', 'finance@example.com · [FINANCE_PHONE]'],
        ['Credit transfer and prior learning', 'Admissions (decisions by authorised academic staff)', 'admissions@example.com · [ADMISSIONS_PHONE]'],
        ['Support needs or adjustments', 'Student support', 'support@example.com · [SUPPORT_PHONE]'],
      ],
      caption: 'Teams are available Monday to Friday, [OPENING_HOURS]. Please include your application reference if you have one.',
    },
    {
      id: 'admissions-plan',
      type: 'linkCards',
      eyebrow: 'Plan your application',
      heading: 'Everything you need to decide',
      items: [
        { icon: 'list-checks', title: 'Entry requirements', text: 'Academic, English language and course-specific requirements.', href: '/admissions/entry-requirements' },
        { icon: 'wallet', title: 'Fees and payments', text: 'Tuition, additional costs and how payment works.', href: '/admissions/fees' },
        { icon: 'calendar', title: 'Intakes', text: 'Start dates, deadlines and availability by campus.', href: '/admissions/intakes' },
        { icon: 'award', title: 'Scholarships', text: 'Current opportunities, eligibility and key dates.', href: '/admissions/scholarships', feature: 'scholarships' },
        { icon: 'file-check', title: 'Credit transfer', text: 'Have previous study or work experience recognised.', href: '/admissions/credit-transfer', feature: 'creditTransfer' },
        { icon: 'help', title: 'FAQs', text: 'Quick answers to common admissions questions.', href: '/faq' },
      ],
    },
    {
      id: 'admissions-search',
      type: 'module',
      module: 'courseSearch',
      background: 'alt',
      eyebrow: 'Find your course',
      heading: 'Start with the right course',
      intro: 'Search by keyword, study area, qualification, campus or student type.',
    },
    {
      id: 'admissions-cta',
      type: 'cta',
      eyebrow: 'Ready when you are',
      heading: 'Start your application',
      body: 'Choose your course and intake, then complete each step at your own pace. Need help first? Our admissions team is happy to talk.',
      actions: [
        { label: 'Apply now', href: '/apply', variant: 'accent' },
        { label: 'Ask a question', href: '/enquire?topic=admissions', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'How to apply to AIT: the admissions process step by step, the documents to prepare and who to contact.',
  },
  updatedAt,
}

export const entryRequirementsPage: Page = {
  id: 'page-admissions-entry-requirements',
  slug: 'admissions/entry-requirements',
  title: 'Entry requirements',
  eyebrow: 'Admissions',
  summary: 'General guidance on academic, English language and document requirements. Each course page lists its exact requirements.',
  hero: {
    image: media.pageExtra.entryRequirements,
    actions: [{ label: 'Find a course', href: '/courses', variant: 'accent' }],
  },
  blocks: [
    {
      id: 'entry-intro',
      type: 'intro',
      lead: 'Entry requirements help make sure a course is the right fit and that you are ready to succeed. This page gives general guidance for all applicants.',
      body: 'Requirements vary by course, qualification level and your background. If you do not meet a requirement exactly, you can still ask to be considered — admissions staff review every application individually.',
    },
    {
      id: 'entry-authority',
      type: 'callout',
      tone: 'info',
      title: 'Course pages take priority',
      body: 'Each course page lists its own academic, English language, age and prerequisite requirements. If anything on this page differs from a course page, **the course page applies**.',
      action: { label: 'Browse courses', href: '/courses', variant: 'secondary' },
    },
    {
      id: 'entry-general',
      type: 'featureGrid',
      background: 'alt',
      variant: 'cards',
      columns: 2,
      eyebrow: 'General requirements',
      heading: 'What we look at',
      items: [
        { icon: 'graduation-cap', title: 'Academic background', text: 'Your highest completed qualification and results. [Minimum academic requirements by qualification level — to be confirmed by the academic team.]' },
        { icon: 'languages', title: 'English language', text: 'Courses are taught in English, so you may need to show evidence of your English skills. [Accepted evidence and minimum results — to be confirmed by admissions.]' },
        { icon: 'id-card', title: 'Minimum age', text: '[Minimum age and any guardian requirements — to be confirmed by admissions.]' },
        { icon: 'list-checks', title: 'Course prerequisites', text: 'Some courses need previous study, relevant experience or checks before placement. These are listed on the course page.' },
      ],
    },
    {
      id: 'entry-levels',
      type: 'table',
      eyebrow: 'By course type',
      heading: 'Guidance by qualification level',
      intro: 'A general guide only — always check the course page for exact requirements.',
      columns: ['Course type', 'General starting point', 'Where to check'],
      rows: [
        ['Short courses', 'Most short courses have no formal academic requirements.', 'Entry requirements on each short course page'],
        ['English programs', 'A placement test or [minimum English level — to be confirmed] determines your starting level.', 'English program course pages'],
        ['Certificates', '[General academic requirement — to be confirmed by the academic team]', 'Entry requirements on the course page'],
        ['Diplomas', '[General academic requirement — to be confirmed by the academic team]', 'Entry requirements on the course page'],
        ['Advanced diplomas', '[Prerequisite qualification or relevant experience — to be confirmed]', 'Prerequisites on the course page'],
      ],
    },
    {
      id: 'entry-audiences',
      type: 'linkCards',
      background: 'alt',
      eyebrow: 'Domestic and international applicants',
      heading: 'Requirements can differ by student type',
      intro: 'Some requirements depend on whether you apply as a domestic or an international student. Admissions will confirm what applies to you before any offer.',
      items: [
        { icon: 'map-pin', title: 'Domestic applicants', text: 'Local eligibility, documents domestic applicants usually provide, and any approved funding information.', href: '/domestic', feature: 'domestic' },
        { icon: 'globe', title: 'International applicants', text: 'Additional conditions can apply, including requirements of the study location. [Jurisdiction-specific requirements — to be confirmed.]', href: '/international', feature: 'international' },
      ],
    },
    {
      id: 'entry-evidence',
      type: 'checklist',
      eyebrow: 'Evidence and verification',
      heading: 'English language evidence and documents',
      groups: [
        {
          title: 'English language evidence',
          items: [
            '[Accepted English test and minimum result — to be confirmed]',
            'Previous study completed in English [eligible countries, levels and dates — to be confirmed]',
            'An English placement test with AIT, for English language programs',
            'Other evidence, assessed individually by admissions staff',
          ],
        },
        {
          title: 'Document verification',
          items: [
            'Upload clear, complete copies of your documents',
            'Provide certified English translations of documents in other languages',
            'We may contact issuing institutions to verify your documents',
            'We may ask to see original documents before enrolment',
          ],
        },
      ],
      note: 'Providing false or misleading documents may lead to an application being declined or an enrolment being cancelled, as set out in the admissions policy.',
    },
    {
      id: 'entry-exceptions',
      type: 'callout',
      background: 'alt',
      tone: 'success',
      title: 'Your individual circumstances are considered',
      body: 'If you do not meet a requirement exactly — for example, your qualification is from another country, or you have relevant work experience instead of formal study — tell us in your application. Authorised admissions staff will review your situation and may ask for more evidence. Any exception is confirmed in writing.',
      action: { label: 'Ask admissions', href: '/enquire?topic=admissions', variant: 'secondary' },
    },
    {
      id: 'entry-faqs',
      type: 'faqs',
      eyebrow: 'Common questions',
      heading: 'Entry requirement FAQs',
      items: [
        {
          question: 'Do my documents need to be certified?',
          answer: 'For your application you can usually upload clear copies. We may ask for certified copies or originals before enrolment. [Certification requirements — to be confirmed by admissions.]',
        },
        {
          question: 'What if my documents are not in English?',
          answer: 'Please provide a certified English translation together with a copy of the original document.',
        },
        {
          question: 'Can work experience count instead of formal qualifications?',
          answer: 'For some courses, relevant experience may be considered. You may also be able to apply for [recognition of prior learning](/admissions/credit-transfer). Admissions will advise you based on your circumstances.',
        },
      ],
    },
    {
      id: 'entry-cta',
      type: 'cta',
      eyebrow: 'Next step',
      heading: 'Check the requirements for your course',
      body: 'Every course page lists its exact entry requirements and the evidence you will need.',
      actions: [
        { label: 'Find a course', href: '/courses', variant: 'accent' },
        { label: 'Ask admissions', href: '/enquire?topic=admissions', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'General entry requirements at AIT: academic background, English language evidence, prerequisites and document verification.',
  },
  updatedAt,
}

export const feesPage: Page = {
  id: 'page-admissions-fees',
  slug: 'admissions/fees',
  title: 'Fees and payment information',
  eyebrow: 'Admissions',
  summary: 'Current approved fees by course, campus and student type — plus additional costs, payment instructions and refund guidance.',
  hero: { image: media.page.fees },
  blocks: [
    {
      id: 'fees-intro',
      type: 'intro',
      lead: 'Your fees depend on your course, campus and whether you study as a domestic or an international student. Use the fee finder below to see current approved fees and what they include.',
      body: 'Fees are set by our finance team and published with the dates they apply. If you have a question about a specific course, our admissions and finance teams are happy to help.',
    },
    {
      id: 'fees-reading',
      type: 'callout',
      tone: 'info',
      title: 'How to read fee information',
      body: '- **Currency and basis:** each fee shows its currency and whether it covers the whole course, a year, a term, a unit or a week.\n- **Valid dates:** fees apply to the dates shown. Your written offer confirms the fees that apply to you.\n- **No fee listed?** “Contact admissions for current fees” means an approved fee has not been published yet. It never means the course is free.',
    },
    {
      id: 'fees-explorer',
      type: 'module',
      module: 'feeExplorer',
      background: 'alt',
      eyebrow: 'Fee finder',
      heading: 'Find fees for your course',
      intro: 'Filter by course, campus and student type. Additional costs are listed under each fee.',
    },
    {
      id: 'fees-additional',
      type: 'table',
      eyebrow: 'Beyond tuition',
      heading: 'Other costs to plan for',
      intro: 'Not every cost applies to every course. Where a cost applies, it is listed with the course fee.',
      columns: ['Cost', 'When it may apply', 'Where to find details'],
      rows: [
        ['Application processing fee', 'Once per application, where listed', 'Additional costs in the fee finder'],
        ['Learning resources and materials', 'Courses that list them', 'Additional costs in the fee finder'],
        ['Uniforms, kits and equipment', 'Practical courses, such as cookery', 'Course page and fee finder'],
        ['Placement-related costs', 'Courses with supervised work placement', 'Placement section of the course page'],
        ['Re-assessment or replacement documents', '[If applicable — to be confirmed by finance]', 'Fees and refunds policy'],
        ['Living and travel costs', 'Students moving to study', 'Living and studying page'],
      ],
    },
    {
      id: 'fees-payment',
      type: 'steps',
      background: 'alt',
      eyebrow: 'Paying your fees',
      heading: 'How payment works',
      intro: 'Tuition is not payable when you submit an application. [Timing of any application processing fee — to be confirmed by finance.]',
      items: [
        { title: 'Receive written instructions', text: 'If your application is successful, your offer or enrolment documents include the amount due, due dates and accepted payment methods.' },
        { title: 'Check the details', text: 'Make sure the course, intake and amounts match what you expect. Ask our finance team if anything is unclear.' },
        { title: 'Pay by the due date', text: 'Use only the payment details in your official instructions. [Accepted payment methods and any instalment options — to be confirmed by finance.]' },
        { title: 'Keep your receipt', text: 'Keep a copy of your receipt and payment confirmation for your records.' },
      ],
    },
    {
      id: 'fees-fraud',
      type: 'callout',
      tone: 'warning',
      title: 'Protect yourself from payment fraud',
      body: 'AIT will never ask you to pay into a personal bank account, and we do not change our bank details by email or phone. If you receive payment instructions that look unusual, contact our finance team using the details on this website before you pay.',
      action: { label: 'Contact finance', href: '/enquire?topic=fees', variant: 'secondary' },
    },
    {
      id: 'fees-related',
      type: 'linkCards',
      background: 'alt',
      eyebrow: 'Related information',
      heading: 'Instalments, refunds and support',
      items: [
        { icon: 'scroll-text', title: 'Fees and refunds policy', text: 'When fees are due, instalment arrangements and when refunds may apply.', href: '/policies/fees-and-refunds' },
        { icon: 'award', title: 'Scholarships', text: 'Current opportunities that may help with tuition costs.', href: '/admissions/scholarships', feature: 'scholarships' },
        { icon: 'file-check', title: 'Credit transfer', text: 'Credit for previous study may change your course length and fees.', href: '/admissions/credit-transfer', feature: 'creditTransfer' },
        { icon: 'house', title: 'Living costs', text: 'Plan for accommodation, transport and everyday expenses.', href: '/international/living-and-studying', feature: 'international' },
      ],
    },
    {
      id: 'fees-faqs',
      type: 'faqs',
      eyebrow: 'Fee questions',
      heading: 'Common questions about fees',
      items: [
        {
          question: 'Can I pay in instalments?',
          answer: '[Instalment arrangements, if offered — to be confirmed by finance.] If instalments are available for your course, the details will be included in your written payment instructions.',
        },
        {
          question: 'Can someone else pay my fees?',
          answer: 'A family member, sponsor or employer may be able to pay on your behalf. [Third-party payment arrangements — to be confirmed by finance.] Payments must still follow your official payment instructions.',
        },
        {
          question: 'What happens to my fees if I withdraw?',
          answer: 'Refunds depend on when and why you withdraw. Please read the [fees and refunds policy](/policies/fees-and-refunds) and the [deferral, suspension and withdrawal policy](/policies/deferral-and-withdrawal) before you accept an offer.',
        },
      ],
    },
    {
      id: 'fees-cta',
      type: 'cta',
      eyebrow: 'Questions about fees?',
      heading: 'Our finance team can help',
      body: 'Ask about fees for a specific course, your payment instructions or a refund.',
      actions: [
        { label: 'Make a fees enquiry', href: '/enquire?topic=fees', variant: 'accent' },
        { label: 'Browse courses', href: '/courses', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Fees at AIT by course, campus and student type, with additional costs, payment instructions and refund guidance.',
  },
  updatedAt,
}

export const intakesPage: Page = {
  id: 'page-admissions-intakes',
  slug: 'admissions/intakes',
  title: 'Intakes and start dates',
  eyebrow: 'Admissions',
  summary: 'Upcoming start dates, application deadlines and availability for every course and campus.',
  hero: { image: media.page.intakes },
  blocks: [
    {
      id: 'intakes-intro',
      type: 'intro',
      lead: 'Find upcoming start dates by course, campus and student type. Each intake shows its application deadline, delivery mode and current availability.',
      body: 'Intake dates vary by course and campus, so please check the listing below rather than assuming a fixed schedule. All dates are shown in each campus’s local time zone.',
    },
    {
      id: 'intakes-explorer',
      type: 'module',
      module: 'intakeExplorer',
      background: 'alt',
      eyebrow: 'Upcoming intakes',
      heading: 'Find a start date',
      intro: 'Filter by course, campus and student type, then choose an intake to apply or ask a question.',
      props: { showFilters: true },
    },
    {
      id: 'intakes-status',
      type: 'featureGrid',
      variant: 'icons',
      columns: 4,
      eyebrow: 'Availability',
      heading: 'What each status means',
      items: [
        { icon: 'badge-check', title: 'Open', text: 'Applications are being accepted for this intake.' },
        { icon: 'timer', title: 'Limited places', text: 'Applications are open, but places are filling. Apply soon.' },
        { icon: 'users', title: 'Full', text: 'All places have been taken. Choose a later intake or ask about alternatives.' },
        { icon: 'lock', title: 'Closed', text: 'The deadline has passed. You can still make an enquiry about future dates.' },
      ],
    },
    {
      id: 'intakes-timezone',
      type: 'callout',
      background: 'alt',
      tone: 'info',
      title: 'Dates, deadlines and time zones',
      body: 'Start dates and deadlines are shown in the local time zone of the campus where the course is delivered. Applications close at the end of the listed deadline day [closing time — to be confirmed]. Intake dates can occasionally change — your written offer confirms your start date.',
    },
    {
      id: 'intakes-next',
      type: 'linkCards',
      eyebrow: 'Next steps',
      heading: 'Found your date?',
      items: [
        { icon: 'send', title: 'Apply online', text: 'Choose your course, campus and intake to start your application.', href: '/apply' },
        { icon: 'message-square', title: 'Ask about an intake', text: 'Not sure which date suits you? Our admissions team can help.', href: '/enquire?topic=admissions' },
        { icon: 'compass', title: 'Orientation', text: 'Orientation dates and what to expect as a new student.', href: '/student-support/orientation' },
        { icon: 'calendar', title: 'Changing your start date', text: 'How deferral works once you have enrolled.', href: '/policies/deferral-and-withdrawal' },
      ],
    },
    {
      id: 'intakes-faqs',
      type: 'faqs',
      background: 'alt',
      eyebrow: 'Common questions',
      heading: 'Intake FAQs',
      items: [
        {
          question: 'What if there are no upcoming dates for my course?',
          answer: 'New intakes are added once dates are confirmed. [Make an enquiry](/enquire?topic=admissions) and our admissions team can tell you about expected dates or similar courses.',
        },
        {
          question: 'My preferred intake is full. What can I do?',
          answer: 'You can choose a later intake, consider the same course at another campus where it is offered, or make an enquiry about alternatives.',
        },
        {
          question: 'Can I change my intake after I apply?',
          answer: 'Contact admissions as soon as possible. Before you accept an offer, we can check whether a later intake is available. After enrolment, changes are handled under the [deferral, suspension and withdrawal policy](/policies/deferral-and-withdrawal).',
        },
      ],
    },
    {
      id: 'intakes-cta',
      type: 'cta',
      eyebrow: 'Ready to start?',
      heading: 'Secure your place in an upcoming intake',
      body: 'Applications are reviewed by our admissions team. Apply early for intakes with limited places.',
      actions: [
        { label: 'Apply now', href: '/apply', variant: 'accent' },
        { label: 'Browse courses', href: '/courses', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Upcoming intakes at AIT: start dates, application deadlines and availability by course, campus and student type.',
  },
  updatedAt,
}

export const scholarshipsPage: Page = {
  id: 'page-admissions-scholarships',
  slug: 'admissions/scholarships',
  title: 'Scholarships',
  eyebrow: 'Admissions',
  summary: 'Approved scholarships with eligibility, coverage, key dates and how to apply.',
  hero: { image: media.page.scholarships },
  blocks: [
    {
      id: 'scholarships-intro',
      type: 'intro',
      lead: 'Scholarships can help with the cost of study. Each opportunity lists who can apply, what it covers, key dates and how recipients are selected.',
      body: 'Only approved scholarships are listed. Closed opportunities stay on this page, clearly labelled, until they are archived.',
    },
    {
      id: 'scholarships-list',
      type: 'module',
      module: 'scholarships',
      background: 'alt',
      eyebrow: 'Opportunities',
      heading: 'Current and upcoming scholarships',
    },
    {
      id: 'scholarships-steps',
      type: 'steps',
      eyebrow: 'Applying',
      heading: 'How to apply for a scholarship',
      items: [
        { title: 'Check eligibility', text: 'Read the eligibility, coverage and exclusions for the scholarship carefully.' },
        { title: 'Apply for your course', text: 'Most scholarships are considered alongside a course application. [Confirm for each scholarship.]' },
        { title: 'Submit your scholarship application', text: 'Follow the instructions listed for the scholarship before the closing date.' },
        { title: 'Selection and outcome', text: 'Applications are assessed using the published selection process, and you are told the outcome in writing.' },
      ],
    },
    {
      id: 'scholarships-note',
      type: 'callout',
      background: 'alt',
      tone: 'info',
      title: 'Good to know',
      body: '- Scholarships are limited, and applying does not guarantee an award.\n- A scholarship does not replace meeting the entry requirements for your course.\n- Check what each scholarship covers — living, travel and insurance costs are usually excluded.',
    },
    {
      id: 'scholarships-faqs',
      type: 'faqs',
      eyebrow: 'Common questions',
      heading: 'Scholarship FAQs',
      items: [
        {
          question: 'Can I apply for more than one scholarship?',
          answer: '[Rules for applying for, or holding, more than one scholarship — to be confirmed.] Each scholarship lists its own eligibility.',
        },
        {
          question: 'When will I know the outcome?',
          answer: 'Each scholarship describes its selection process. [Notification timeframes — to be confirmed for each scholarship.]',
        },
        {
          question: 'What if a scholarship is closed?',
          answer: 'Closed scholarships cannot accept applications. Check this page for upcoming opportunities, or ask our admissions team about other ways to plan for your fees.',
        },
      ],
    },
    {
      id: 'scholarships-cta',
      type: 'cta',
      eyebrow: 'Questions?',
      heading: 'Ask us about scholarships',
      body: 'Our admissions team can explain eligibility and how scholarships work alongside your application.',
      actions: [
        { label: 'Make an enquiry', href: '/enquire?topic=fees', variant: 'accent' },
        { label: 'Fees and payments', href: '/admissions/fees', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Scholarships at AIT: eligibility, coverage, opening and closing dates, and how to apply.',
  },
  updatedAt,
}

export const creditTransferPage: Page = {
  id: 'page-admissions-credit-transfer',
  slug: 'admissions/credit-transfer',
  title: 'Credit transfer and prior learning',
  eyebrow: 'Admissions',
  summary: 'Have your previous study or work experience recognised, and find out how credit could affect your course.',
  hero: { image: media.page.creditTransfer },
  blocks: [
    {
      id: 'credit-intro',
      type: 'intro',
      lead: 'If you have completed relevant study or gained skills through work, you may be able to receive credit towards your course — which can reduce the number of modules you need to complete.',
      body: 'This page explains the options, the evidence you will need and how decisions are made. Our admissions team can talk you through the process before you apply.',
    },
    {
      id: 'credit-options',
      type: 'featureGrid',
      background: 'alt',
      variant: 'cards',
      columns: 2,
      eyebrow: 'Your options',
      heading: 'Two ways to have your learning recognised',
      items: [
        {
          icon: 'file-check',
          title: 'Credit transfer',
          text: 'Credit for modules you have already completed through equivalent formal study, at AIT or another education provider. [Approved definition — to be confirmed.]',
        },
        {
          icon: 'briefcase',
          title: 'Recognition of prior learning',
          text: 'An assessment of the skills and knowledge you have gained through work, volunteering or life experience, measured against module requirements. [Approved definition — to be confirmed.]',
        },
      ],
    },
    {
      id: 'credit-authority',
      type: 'callout',
      tone: 'info',
      title: 'Final decisions are made by academic staff',
      body: 'Credit is granted only after assessment by authorised academic staff. Admissions staff can explain the process, but cannot promise an outcome. You will receive the decision, and any effect on your course, in writing.',
    },
    {
      id: 'credit-steps',
      type: 'steps',
      background: 'alt',
      eyebrow: 'The process',
      heading: 'How applying for credit works',
      items: [
        { title: 'Talk to admissions', text: 'Tell us about your previous study or experience so we can explain which option suits you.', meta: 'Before or when you apply' },
        { title: 'Complete the application form', text: 'Download the credit transfer and recognition of prior learning form from the downloads page.', meta: 'You' },
        { title: 'Provide your evidence', text: 'Submit transcripts, module outlines or evidence of your skills, as listed below.', meta: 'You' },
        { title: 'Academic assessment', text: 'Authorised academic staff review your evidence. Recognition of prior learning may include an interview or a practical demonstration.', meta: 'Academic staff' },
        { title: 'Written decision', text: 'You receive the outcome in writing, including any change to your course duration or fees.', meta: 'Admissions team' },
        { title: 'Appeal if you disagree', text: 'You can ask for a review under the complaints and appeals policy.', meta: 'If needed' },
      ],
    },
    {
      id: 'credit-evidence',
      type: 'checklist',
      eyebrow: 'Evidence',
      heading: 'What you may need to provide',
      groups: [
        {
          title: 'Credit transfer',
          items: ['Certified academic transcripts', 'Module or unit outlines from your previous course', 'Copies of qualification certificates'],
        },
        {
          title: 'Recognition of prior learning',
          items: [
            'A current CV and references describing your duties',
            'Examples of your work, such as reports, portfolios or project documents',
            'Position descriptions or statements from employers',
            'Licences or industry certificates, if relevant',
          ],
        },
      ],
      note: 'Evidence must be authentic, current and relevant to the modules you are seeking credit for.',
    },
    {
      id: 'credit-effects',
      type: 'table',
      background: 'alt',
      eyebrow: 'What changes',
      heading: 'How credit may affect your course',
      columns: ['Area', 'What to expect'],
      rows: [
        ['Course duration', 'Credit may shorten your course. If your duration changes, admissions will explain any effect on your study arrangements before you accept.'],
        ['Tuition fees', 'Fees may be adjusted for credited modules. [Fee adjustment rules — to be confirmed by finance.]'],
        ['Assessment fee', '[Any fee for a recognition of prior learning assessment — to be confirmed.]'],
        ['Timing', 'Apply before or at enrolment where possible. [Application deadline — to be confirmed.]'],
      ],
    },
    {
      id: 'credit-links',
      type: 'linkCards',
      eyebrow: 'Forms and policies',
      heading: 'Related documents',
      items: [
        { icon: 'download', title: 'Credit transfer application form', text: 'Download the form and evidence checklist.', href: '/downloads' },
        { icon: 'scroll-text', title: 'Admissions policy', text: 'How applications, including credit applications, are assessed.', href: '/policies/admissions' },
        { icon: 'scale', title: 'Complaints and appeals', text: 'How to request a review of a credit decision.', href: '/policies/complaints-and-appeals' },
        { icon: 'wallet', title: 'Fees and payments', text: 'Current fees for each course and student type.', href: '/admissions/fees' },
      ],
    },
    {
      id: 'credit-cta',
      type: 'cta',
      eyebrow: 'Find out more',
      heading: 'Ask about credit for your course',
      body: 'Tell us what you have studied or where you have worked, and we will explain the next steps.',
      actions: [
        { label: 'Make an enquiry', href: '/enquire?topic=admissions', variant: 'accent' },
        { label: 'Apply now', href: '/apply', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'Credit transfer and recognition of prior learning at AIT: eligibility, evidence, assessment and how credit affects your course.',
  },
  updatedAt,
}

export const admissionsPages: Page[] = [
  admissionsPage,
  entryRequirementsPage,
  feesPage,
  intakesPage,
  scholarshipsPage,
  creditTransferPage,
]

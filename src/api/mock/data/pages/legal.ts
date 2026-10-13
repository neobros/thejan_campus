import type { Page } from '@/api/types'
import { TODAY } from '../time'

/**
 * DEMO DATA — privacy, terms and accessibility pages (specification §5.27). Privacy and terms are
 * placeholder STRUCTURES, not drafted legal text: every bracketed item must be completed and
 * approved by the client's authorised reviewer before publication.
 */
const updatedAt = TODAY.toISOString()

export const privacyPage: Page = {
  id: 'page-privacy',
  slug: 'privacy',
  title: 'Privacy policy',
  eyebrow: 'Legal',
  summary: 'How AIT collects, uses, shares, protects and keeps personal information, and the choices you have.',
  layout: 'article',
  blocks: [
    {
      // Article layout renders richText blocks as one document, so this notice stays at the top.
      id: 'privacy-draft',
      type: 'richText',
      body: '> **Placeholder structure.** This page sets out the sections the approved privacy policy must include. Each bracketed item must be completed with the actual collection purposes, recipients and retention periods, and approved by AIT before publication.',
    },
    {
      id: 'privacy-who',
      type: 'richText',
      heading: 'Who we are',
      body: '[LEGAL_ENTITY_NAME], trading as AIT (“we”, “us”), is responsible for the personal information collected through this website and through our admissions, enrolment and student services.\n\n[Registered address and any registration details — to be confirmed.]',
    },
    {
      id: 'privacy-collect',
      type: 'richText',
      heading: 'Information we collect',
      body: '- **Enquiries:** your name, email address, and optional phone number, country, course and campus interests, and message.\n- **Applications:** your course selection, contact details, study background, supporting documents and declarations.\n- **Support requests:** information you choose to share so we can arrange support. We ask only for what we need.\n- **Website use:** technical information, such as pages visited. [Analytics configuration — to be confirmed.]\n- [Other categories of personal information — to be confirmed.]',
    },
    {
      id: 'privacy-how',
      type: 'richText',
      heading: 'How we collect it',
      body: '- Directly from you, when you complete a form, apply, or contact us.\n- From an education agent you have authorised to act for you.\n- From institutions and referees, when we verify documents you have provided.\n- Automatically, through cookies and similar technologies, where used. [Details — to be confirmed.]',
    },
    {
      id: 'privacy-use',
      type: 'richText',
      heading: 'Why we use it',
      body: '- To respond to your enquiries.\n- To assess your application and communicate the outcome and next steps.\n- To provide student services and support.\n- To meet our legal and regulatory obligations. [Obligations — to be confirmed for the actual jurisdiction.]\n- To improve our website, using aggregated information.\n- To send you news and marketing **only if you opt in**. You can unsubscribe at any time.\n\n[Any other purposes — to be confirmed.]',
    },
    {
      id: 'privacy-share',
      type: 'richText',
      heading: 'Who we share it with',
      body: '- Staff who need the information to do their work.\n- An education agent you have nominated in your application.\n- Service providers that host our systems or deliver email for us, under contract.\n- Government agencies, where the law requires it. [Agencies — to be confirmed.]\n\n[Statement on the sale of personal information — to be confirmed.]',
    },
    {
      id: 'privacy-overseas',
      type: 'richText',
      heading: 'Storage and overseas disclosure',
      body: '[Where personal information is stored, and whether it is disclosed outside [COUNTRY] — including to which countries — to be confirmed.]',
    },
    {
      id: 'privacy-retention',
      type: 'richText',
      heading: 'How long we keep it',
      body: '- **Enquiries:** [retention period — to be confirmed]\n- **Unsubmitted application drafts:** [expiry period — to be confirmed]\n- **Submitted applications and documents:** [retention period — to be confirmed]\n- **Student records:** [retention period, as required by law — to be confirmed]',
    },
    {
      id: 'privacy-security',
      type: 'richText',
      heading: 'How we protect it',
      body: 'Application documents are stored privately and are never placed in public website storage. Access is limited to authorised staff, and we keep identity documents and sensitive support information out of system logs, analytics and notification emails.\n\n[Summary of security measures — to be confirmed.]',
    },
    {
      id: 'privacy-rights',
      type: 'richText',
      heading: 'Your rights and choices',
      body: 'You can ask to access or correct the personal information we hold about you, withdraw your consent to marketing at any time, and make a privacy complaint.\n\n[Rights under applicable privacy law — to be confirmed for the actual jurisdiction.]',
    },
    {
      id: 'privacy-cookies',
      type: 'richText',
      heading: 'Cookies and analytics',
      body: '[Describe the cookies and analytics actually used on this website, and how to manage your preferences.]\n\nOur analytics count page views, course interest and successful form submissions. They never record what you type into a form or the documents you upload.',
    },
    {
      id: 'privacy-contact',
      type: 'richText',
      heading: 'Contact and complaints',
      body: 'Contact our privacy officer at [PRIVACY_EMAIL] or [POSTAL_ADDRESS].\n\nIf you are not satisfied with our response, you may contact [privacy regulator — to be confirmed for the actual jurisdiction].',
    },
    {
      id: 'privacy-changes',
      type: 'richText',
      heading: 'Changes to this policy',
      body: 'We publish any changes on this page. Last updated: [DATE]. Version: [VERSION].',
    },
  ],
  seo: {
    description: 'How AIT collects, uses, shares, protects and keeps personal information.',
  },
  updatedAt,
}

export const termsPage: Page = {
  id: 'page-terms',
  slug: 'terms',
  title: 'Terms of use',
  eyebrow: 'Legal',
  summary: 'The terms that apply when you use the AIT website.',
  layout: 'article',
  blocks: [
    {
      // Article layout renders richText blocks as one document, so this notice stays at the top.
      id: 'terms-draft',
      type: 'richText',
      body: '> **Placeholder structure.** This page sets out the sections the approved website terms must include. Each bracketed item must be completed and approved by AIT — for example, by a legal adviser — before publication.',
    },
    {
      id: 'terms-about',
      type: 'richText',
      heading: 'About these terms',
      body: 'These terms apply to your use of this website, which is operated by [LEGAL_ENTITY_NAME], trading as AIT. By using the website, you agree to these terms. [Approved wording — to be confirmed.]',
    },
    {
      id: 'terms-use',
      type: 'richText',
      heading: 'Using this website',
      body: 'Please use this website lawfully and respectfully. You must not:\n\n- provide false or misleading information in an enquiry or application\n- upload files that contain malicious or harmful content\n- attempt to access areas or information you are not authorised to see\n- interfere with the operation or security of the website\n\n[Additional acceptable-use terms — to be confirmed.]',
    },
    {
      id: 'terms-accuracy',
      type: 'richText',
      heading: 'Course, fee and intake information',
      body: 'We work to keep course, fee, intake and campus information accurate and current, but details can change. Your written offer and enrolment documents confirm the terms that apply to you. [Approved wording — to be confirmed.]',
    },
    {
      id: 'terms-applications',
      type: 'richText',
      heading: 'Enquiries and applications',
      body: 'Submitting an enquiry or application through this website does not create an enrolment, an offer, a visa document or a payment obligation. Admission terms are set out in your written offer and our [policies](/policies).',
    },
    {
      id: 'terms-ip',
      type: 'richText',
      heading: 'Intellectual property',
      body: '[Ownership of website content, logos, images and documents, and any permitted uses — to be confirmed.]',
    },
    {
      id: 'terms-links',
      type: 'richText',
      heading: 'Links to other websites',
      body: 'This website links to external websites, such as official government sources. We are not responsible for the content of external websites. [Approved wording — to be confirmed.]',
    },
    {
      id: 'terms-liability',
      type: 'richText',
      heading: 'Liability',
      body: '[Approved limitation of liability wording, consistent with applicable consumer law — to be confirmed by a legal adviser.]',
    },
    {
      id: 'terms-privacy',
      type: 'richText',
      heading: 'Privacy',
      body: 'Our [privacy policy](/privacy) explains how we handle personal information collected through this website.',
    },
    {
      id: 'terms-law',
      type: 'richText',
      heading: 'Governing law',
      body: '[Governing law and jurisdiction — to be confirmed.]',
    },
    {
      id: 'terms-changes',
      type: 'richText',
      heading: 'Changes and contact',
      body: 'We may update these terms from time to time and will publish changes on this page. Last updated: [DATE].\n\nQuestions about these terms can be sent to [GENERAL_EMAIL].',
    },
  ],
  seo: {
    description: 'The terms that apply when you use the AIT website.',
  },
  updatedAt,
}

export const accessibilityPage: Page = {
  id: 'page-accessibility',
  slug: 'accessibility',
  title: 'Accessibility',
  eyebrow: 'Legal',
  summary: 'Our commitment to an accessible website, known limitations and how to get help or give feedback.',
  layout: 'article',
  blocks: [
    {
      id: 'accessibility-commitment',
      type: 'richText',
      heading: 'Our commitment',
      body: 'AIT wants everyone to be able to use this website — including people with disability, people using assistive technology, and people on mobile devices or slower connections.\n\nWe aim to meet the **Web Content Accessibility Guidelines (WCAG) 2.2 at level AA**. We check the website with automated tools and with manual keyboard and screen reader testing.',
    },
    {
      id: 'accessibility-features',
      type: 'richText',
      heading: 'What we do',
      body: 'We design and build this website to:\n\n- work with a keyboard, with a clearly visible focus indicator\n- provide text alternatives for images, and hide purely decorative images from screen readers\n- caption and transcribe videos, which never play automatically with sound\n- give every form field a clear label, instructions and helpful error messages\n- support text resizing and readable colour contrast\n- label downloadable documents with their format and file size',
    },
    {
      id: 'accessibility-limitations',
      type: 'richText',
      heading: 'Known limitations',
      body: '[List any known accessibility issues, the content affected and planned fixes — to be confirmed after accessibility testing.]\n\nIf you find content you cannot access, please tell us so we can help and improve it.',
    },
    {
      id: 'accessibility-help',
      type: 'richText',
      heading: 'How to get help',
      body: 'If you have difficulty using any part of this website, or need information in a different format:\n\n- email [ACCESSIBILITY_EMAIL]\n- call [PHONE_NUMBER], Monday to Friday, [OPENING_HOURS]\n- send an [online enquiry](/enquire?topic=other)\n\nPlease tell us the web address of the page, the problem you found, and how you would like us to respond. [Response arrangements — to be confirmed.]',
    },
    {
      id: 'accessibility-formats',
      type: 'richText',
      heading: 'Alternative formats',
      body: 'You can ask for documents and course information in an alternative format, such as large print, an accessible Word document or plain text. [Available formats — to be confirmed.]',
    },
    {
      id: 'accessibility-campuses',
      type: 'richText',
      heading: 'Visiting our campuses',
      body: 'Physical access information — including step-free entrances, lifts, accessible bathrooms and parking — is listed on each [campus page](/campuses). For support with your studies, see [student support](/student-support).',
    },
    {
      id: 'accessibility-feedback',
      type: 'richText',
      heading: 'Feedback and complaints',
      body: 'If you are not satisfied with our response, you can make a complaint under our [complaints and appeals policy](/policies/complaints-and-appeals). [External enforcement or complaints body — to be confirmed for the actual jurisdiction.]',
    },
    {
      id: 'accessibility-review',
      type: 'richText',
      heading: 'About this statement',
      body: 'This statement was last reviewed on [DATE]. [Testing approach and scope — to be confirmed.]',
    },
    {
      id: 'accessibility-cta',
      type: 'callout',
      tone: 'info',
      title: 'Need help now?',
      body: 'Our team can provide the information you need in another way. Let us know how we can help.',
      action: { label: 'Contact us', href: '/contact', variant: 'secondary' },
    },
  ],
  seo: {
    description: 'Accessibility at AIT: our WCAG 2.2 AA target, known limitations and how to get help or give feedback.',
  },
  updatedAt,
}

export const legalPages: Page[] = [privacyPage, termsPage, accessibilityPage]

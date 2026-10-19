import type { Page } from '@/api/types'
import { media } from '../media'
import { TODAY } from '../time'

/** How it works — transnational education explained simply (client brief §7). */
export const howItWorksPage: Page = {
  id: 'page-how-it-works',
  slug: 'how-it-works',
  title: 'International Programmes. *Delivered Locally.*',
  eyebrow: 'How it works',
  summary:
    'Explore selected international programmes, understand the provider and qualification, learn in Sri Lanka, and plan your next step.',
  hero: {
    image: media.home.why,
    actions: [
      { label: 'Explore courses', href: '/courses', variant: 'accent' },
      { label: 'Enquire now', href: '/enquire', variant: 'secondary' },
    ],
  },
  blocks: [
    {
      id: 'hiw-intro',
      type: 'intro',
      lead: 'AIT connects students in Sri Lanka with selected international education and vocational training, offered in collaboration with Australian education providers.',
      body: 'Programmes are delivered locally through the arrangement specified for each one. Here is how a typical journey works, from first interest to planning your next step.',
    },
    {
      id: 'hiw-steps',
      type: 'steps',
      background: 'alt',
      eyebrow: 'Four steps',
      heading: 'From first look to your next step',
      intro: 'Explore → Understand the provider and qualification → Learn in Sri Lanka → Plan your next step.',
      items: [
        { title: 'Explore', text: 'Find a programme that matches your interests.' },
        { title: 'Understand', text: 'Review the qualification, provider and entry requirements.' },
        { title: 'Learn', text: 'Study in Sri Lanka through the arrangement specified for the programme.' },
        { title: 'Plan Ahead', text: 'Explore potential career or further-study options.' },
      ],
    },
    {
      id: 'hiw-cta',
      type: 'cta',
      eyebrow: 'Talk to us',
      heading: 'Have a question about how a programme works?',
      body: 'Ask us about a specific programme, the provider and qualification, or the entry requirements.',
      actions: [
        { label: 'Enquire Now', href: '/enquire', variant: 'accent' },
        { label: 'Explore courses', href: '/courses', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description:
      'How AIT works: selected international programmes, offered in collaboration with Australian education providers and delivered locally in Sri Lanka.',
  },
  updatedAt: TODAY.toISOString(),
}

import type { Page } from '@/api/types'
import { media } from '../media'
import { educationPartners, srilankanDeliveryPartners, vcConsultancyProviders } from '../partners'
import { TODAY } from '../time'

/**
 * DEMO DATA — home page. Section order and copy follow the client Homepage Content & Developer Brief
 * (Australian Institute of Technology – Sri Lanka). Transnational-education framing throughout;
 * qualified claims only — no implication that AIT itself awards partner qualifications.
 */
export const homePage: Page = {
  slug: 'home',
  id: 'page-home',
  // *Asterisks* mark the words that get the animated accent style in the hero headline.
  title: 'Australian Skills. Global Opportunities. *A Brighter Future.*',
  eyebrow: 'Australian Institute of Technology — Sri Lanka',
  summary:
    'Bring your ambitions closer to home. AIT connects Sri Lankan learners with selected Australian education programmes and international training opportunities through academic partnerships and local delivery.',
  hero: {
    image: media.ait.hero,
    interval: 7000,
    slides: [
      {
        image: media.ait.hero,
        eyebrow: 'Australian Institute of Technology — Sri Lanka',
        title: 'Australian Skills. Global Opportunities. *A Brighter Future.*',
        summary:
          'Bring your ambitions closer to home. AIT connects Sri Lankan learners with selected Australian education programmes and international training opportunities through academic partnerships and local delivery — from construction and advanced nursing to specialised vocational fields.',
        actions: [
          { label: 'Find Your Path', href: '#home-find-path', variant: 'accent' },
          { label: 'Discover AIT', href: '/about', variant: 'secondary' },
        ],
      },
      {
        image: media.banners.australia,
        eyebrow: 'Transnational education',
        title: 'A world of education, *without crossing borders*',
        summary:
          'Through academic partnerships between institutions in different countries, selected international programmes can be delivered to learners right here in Sri Lanka.',
        actions: [
          { label: 'Find Your Path', href: '#home-find-path', variant: 'accent' },
          { label: 'Discover AIT', href: '/about', variant: 'secondary' },
        ],
      },
      {
        image: media.banners.practical,
        eyebrow: 'Practical learning',
        title: 'International perspectives, *practical skills*',
        summary: 'Discover learning pathways that combine international perspectives with practical skills and prepare you for what comes next.',
        actions: [
          { label: 'Find Your Path', href: '#home-find-path', variant: 'accent' },
          { label: 'Discover AIT', href: '/about', variant: 'secondary' },
        ],
      },
    ],
  },
  blocks: [
    // 02 | Find Your Path
    {
      id: 'home-find-path',
      type: 'featureGrid',
      variant: 'cards',
      aside: true,
      columns: 3,
      eyebrow: 'Find Your Path',
      heading: 'Your Goals. Your Pathway.',
      intro: 'Tell us what you want to achieve. We’ll help you explore the learning options that may suit your goals.',
      items: [
        { icon: 'graduation-cap', title: 'I’m a Student', text: 'Begin your education journey and build skills for the future.', href: '/enquire?topic=student' },
        { icon: 'briefcase-business', title: 'I’m a Professional', text: 'Strengthen your expertise and explore your next career step.', href: '/enquire?topic=professional' },
        { icon: 'users', title: 'I’m a Spouse / Partner', text: 'Develop your own skills and interests while supporting your partner’s international journey.', href: '/enquire?topic=spouse' },
      ],
    },
    // 03 | Our Story
    {
      id: 'home-story',
      type: 'split',
      background: 'alt',
      eyebrow: 'Our Story',
      heading: 'From International Connections to a New Educational Vision.',
      body: 'AIT’s story began long before the institution itself. Through years of connecting local students with Australian education providers, AusAsia built relationships, developed partnerships and gained first-hand experience of the changing international education landscape.\n\nThe growing potential of Transnational Education brought a new possibility into focus: what if international education, expertise and qualifications could reach learners in Sri Lanka, without every learning journey having to begin overseas?\n\nToday, AIT carries that vision forward — bringing international academic partnerships, local educational institutions and industry-relevant learning together to create opportunities for a wider future.',
      image: media.ait.story,
      imageSide: 'left',
      actions: [{ label: 'Discover Our Story', href: '/about', variant: 'primary' }],
    },
    // 04 | Our Programmes
    {
      id: 'home-programs',
      type: 'featureGrid',
      variant: 'cards',
      aside: true,
      columns: 2,
      eyebrow: 'Our Programmes',
      heading: 'Focused Programmes. Practical Knowledge.',
      intro: 'Explore AIT’s core programme offerings, designed to develop knowledge and skills in fields with clear professional relevance.',
      items: [
        {
          icon: 'building',
          title: 'Construction & Technical Studies',
          text: 'With The Centre of Excellence. Build technical expertise for a global industry — painting & decorating, tiling, carpentry, building & construction and civil construction design.',
          href: '/courses',
          image: media.ait.construction,
        },
        {
          icon: 'heart-pulse',
          title: 'GCAN (Advanced Nursing)',
          text: 'With the Institute of Health & Management (IHM). Advance your nursing knowledge and career — from Graduate Certificate through to Master of Nursing.',
          href: '/courses',
          image: media.ait.nursing,
        },
      ],
    },
    // 05 | Partnered Programmes
    {
      id: 'home-partnered',
      type: 'featureGrid',
      variant: 'cards',
      aside: true,
      columns: 3,
      eyebrow: 'Partnered Programmes',
      heading: 'Explore More Fields. Discover More Possibilities.',
      intro: 'Through collaboration with education and training partners, AIT connects learners with further programme options across practical and service-focused fields.',
      items: [
        { icon: 'chef-hat', title: 'Hospitality Management & Cookery', text: 'InSITE Campus + AIBT Australia. Commercial cookery, kitchen management and hospitality management, with package options.', href: '/courses', image: media.ait.hospitality },
        { icon: 'hand-heart', title: 'Ageing, Disability Support & Community Services', text: 'First Friends Campus + AVTA, ESOFT and Reach Community College. Individual support, ageing support and community services.', href: '/courses', image: media.ait.community },
        { icon: 'palette', title: 'Hair & Beauty', text: 'AEHB Academy + The Centre of Excellence Australia. Hairdressing, salon management and beauty therapy, with packages.', href: '/courses', image: media.ait.beauty },
      ],
    },
    // 06 | What is TNE?
    {
      id: 'home-tne',
      type: 'split',
      background: 'night',
      eyebrow: 'What is TNE?',
      heading: 'A World of Education. Without Having to Cross Borders.',
      body: 'Transnational Education (TNE) enables you to access selected international education programmes through approved delivery arrangements in Sri Lanka.\n\nThrough academic partnerships between institutions in different countries, programmes are delivered to learners locally, while retaining the academic framework and qualification arrangements of the relevant overseas education provider.',
      image: media.ait.tne,
      imageSide: 'left',
      actions: [{ label: 'Learn More', href: '/about', variant: 'primary' }],
    },
    // 07 | Your Learning Journey
    {
      id: 'home-journey',
      type: 'steps',
      variant: 'row',
      eyebrow: 'Your Learning Journey',
      heading: 'Your Learning Journey with AIT',
      intro: 'Qualification completion is subject to meeting the awarding institution’s academic and assessment requirements.',
      items: [
        { icon: 'file-text', title: 'Choose Your Programme', text: 'Find the programme that matches your goals.' },
        { icon: 'list-checks', title: 'Check Eligibility', text: 'Review the entry requirements.' },
        { icon: 'notebook-pen', title: 'Apply with AIT', text: 'Apply with support from our team.' },
        { icon: 'users', title: 'Study in Sri Lanka', text: 'Begin your studies locally.' },
        { icon: 'graduation-cap', title: 'Complete Your Qualification', text: 'Finish and complete your qualification.' },
      ],
    },
    // 08 | Qualification outcomes
    {
      id: 'home-outcomes',
      type: 'featureGrid',
      variant: 'panels',
      aside: true,
      columns: 4,
      background: 'alt',
      eyebrow: 'Qualification Outcomes',
      heading: 'Where Can Your Qualification Take You?',
      intro:
        'Every TNE qualification opens new doors. Put your knowledge into practice, strengthen your professional capabilities and explore opportunities for career growth, further education and new directions. Let what you learn today shape what you can achieve tomorrow.',
      items: [
        { icon: 'trending-up', title: 'Career Progression', text: 'Build the knowledge and capabilities to move forward in your chosen profession.', tone: 'rose' },
        { icon: 'book-open', title: 'Advanced Learning', text: 'Continue your education and pursue higher-level qualifications.', tone: 'blue' },
        { icon: 'globe', title: 'Global Mobility', text: 'Explore opportunities to apply your skills across international markets.', tone: 'amber' },
        { icon: 'award', title: 'Industry Recognition', text: 'Strengthen your professional profile with relevant knowledge and recognised qualifications.', tone: 'emerald' },
      ],
    },
    // 09 | Vision, Mission & Values
    {
      id: 'home-vmv',
      type: 'featureGrid',
      variant: 'panels',
      aside: true,
      columns: 3,
      heading: 'Our Vision, Mission & Values',
      items: [
        { icon: 'eye', title: 'Our Vision', text: 'To shape a world where education transcends borders, knowledge drives progress and opportunity knows no limits.', tone: 'rose' },
        { icon: 'target', title: 'Our Mission', text: 'To connect learners with quality education, industry and global opportunities through trusted partnerships and innovative learning.', tone: 'blue' },
        {
          icon: 'sparkles',
          title: 'Our Values',
          text: 'Excellence · Collaboration · Innovation · Inclusivity & Opportunity · Industry Relevance.',
          tone: 'amber',
        },
      ],
    },
    // 10 | Our Partners
    {
      id: 'home-partners',
      type: 'module',
      module: 'partnerStrip',
      background: 'alt',
      heading: 'Our Partners',
      intro: 'A trusted network of Australian academic partners and local delivery campuses, working together to create meaningful learning opportunities.',
      props: {
        groups: [
          { label: 'Australian Academic Partners', pill: 'navy', partners: [...educationPartners, ...vcConsultancyProviders] },
          { label: 'Sri Lankan Delivery Partners', pill: 'red', partners: srilankanDeliveryPartners },
        ],
      },
    },
    // 11 | Final enquiry banner
    {
      id: 'home-cta',
      type: 'cta',
      eyebrow: 'Ready to move forward?',
      heading: 'Ready to Move Forward?',
      body: 'Your next opportunity starts with a conversation. Explore AIT programmes and find the right pathway for your ambitions.',
      actions: [
        { label: 'Enquire Now', href: '/enquire', variant: 'accent' },
        { label: 'Speak to Our Team', href: '/contact', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    title: undefined,
    description:
      'AIT connects Sri Lankan learners with selected Australian education programmes and international training opportunities through academic partnerships and local delivery.',
  },
  updatedAt: TODAY.toISOString(),
}

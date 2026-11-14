import type { ImageAsset, Page } from '@/api/types'
import { media } from '../media'
import { educationPartners, srilankanDeliveryPartners, vcConsultancyLead, vcConsultancyProviders } from '../partners'
import { TODAY } from '../time'

/**
 * DEMO DATA — About AIT, Leadership and faculty, Our Partners. The About AIT page follows the client
 * "About AIT" content brief. Leadership copy is proposed wording pending Dr Niroshan's approval; no
 * unconfirmed professional titles are added.
 */
const updatedAt = TODAY.toISOString()

const founderPortrait: ImageAsset = {
  src: '/people/founder-niroshan-800.jpg',
  srcSet: '/people/founder-niroshan-800.jpg 800w, /people/founder-niroshan-1200.jpg 1200w',
  width: 800,
  height: 1000,
  alt: 'Dr Niroshan Ranaweera, Founder & CEO of AIT',
  focus: '50% 22%',
}

export const aboutPage: Page = {
  id: 'page-about',
  slug: 'about',
  title: 'A Vision Beyond Borders. An Opportunity Closer to Home.',
  eyebrow: 'About AIT · A New Vision for International Education in Sri Lanka',
  summary:
    'Born from international education experience and a belief in the power of learning, AIT brings global academic connections, local delivery and industry-focused education together to create new possibilities for Sri Lanka — the vision, the journey and the people shaping AIT.',
  hero: {
    image: media.ait.aboutHero,
    actions: [
      { label: 'Explore Programmes', href: '/courses', variant: 'accent' },
      { label: 'Enquire Now', href: '/enquire', variant: 'secondary' },
    ],
  },
  blocks: [
    // 02 | In-page navigation
    {
      id: 'about-nav',
      type: 'linkCards',
      eyebrow: 'Explore AIT',
      items: [
        { icon: 'book-text', title: 'Our Story', text: 'How and why AIT began.', href: '#about-story' },
        { icon: 'user-check', title: 'Our Leadership', text: 'A message from our founder.', href: '#about-leadership' },
        { icon: 'handshake', title: 'A Journey From AusAsia', text: 'The foundation AIT was built on.', href: '#about-ausasia' },
        { icon: 'sparkles', title: 'What Shapes AIT', text: 'Our beliefs and our direction.', href: '#about-shapes' },
        { icon: 'shield-check', title: 'Our Commitment', text: 'What we promise every learner.', href: '#about-commitment' },
      ],
    },
    // 03 | Our Story
    {
      id: 'about-story',
      type: 'split',
      background: 'alt',
      eyebrow: 'Our Story',
      heading: 'The Story Behind AIT',
      body: 'The Australian Institute of Technology (AIT) was established with a vision to bring international education and globally relevant learning opportunities closer to Sri Lankan learners.\n\nRooted in experience across international education and strengthened by relationships with overseas education providers, AIT seeks to bridge academic partnerships and local learning. Through selected international programmes, practical education and industry-relevant training, we aim to connect students and professionals with opportunities to expand their knowledge, develop their capabilities and advance their ambitions.',
      image: media.home.why,
      imageSide: 'right',
    },
    // 04 | Our Leadership
    {
      id: 'about-leadership',
      type: 'split',
      eyebrow: 'Our Leadership',
      heading: 'A Message from Our Founder & Director',
      body: '“For many years, I have believed that international education should create opportunities beyond geographical boundaries. Through our work with AusAsia, we built relationships with international education providers and local institutions, gaining a deeper understanding of the opportunities and challenges within the education sector.\n\nA defining moment came when we recognised the potential of Transnational Education. It offered a chance to bring international academic expertise, qualifications and learning opportunities closer to Sri Lankan students and professionals.\n\nAIT was born from that vision. It represents our commitment to building meaningful academic partnerships, expanding access to quality education and creating learning pathways that respond to the needs of a changing world.\n\nThis is more than the establishment of an educational institution. It is the beginning of a long-term vision to connect knowledge, institutions and people across borders, while creating opportunities that can make a lasting difference.”\n\n**Dr Niroshan Ranaweera** — Founder & CEO, Australian Institute of Technology – Sri Lanka',
      image: founderPortrait,
      imageSide: 'left',
    },
    // 05 | A Journey From AusAsia
    {
      id: 'about-ausasia',
      type: 'split',
      background: 'alt',
      eyebrow: 'A Journey From AusAsia',
      heading: 'A Journey From AusAsia',
      body: 'AIT is a progression of the vision and experience of AusAsia Education & Migration Consultants, a trusted name in international education and student guidance.\n\nBuilding on AusAsia’s industry knowledge, partnerships and global network, AIT was established to create a broader educational platform, expand academic collaborations and deliver meaningful learning opportunities for Sri Lankan learners.',
      image: media.banners.australia,
      imageSide: 'right',
      actions: [{ label: 'Explore AIT’s Programmes', href: '/courses', variant: 'primary' }],
    },
    // 06 | What Shapes AIT
    {
      id: 'about-shapes',
      type: 'featureGrid',
      variant: 'panels',
      aside: true,
      columns: 3,
      eyebrow: 'Our beliefs. Our direction. Our commitment.',
      heading: 'What Shapes AIT',
      intro:
        'Every institution needs a clear purpose and a direction for the future. At AIT, our commitment to international education, meaningful partnerships and industry-relevant learning shapes the way we grow, collaborate and create opportunities.',
      items: [
        { icon: 'star', title: 'Excellence', text: 'Striving for quality in everything we do.', tone: 'rose' },
        { icon: 'handshake', title: 'Collaboration', text: 'Building meaningful academic partnerships.', tone: 'blue' },
        { icon: 'lightbulb', title: 'Innovation', text: 'Finding new ways to deliver learning locally.', tone: 'amber' },
        { icon: 'users', title: 'Inclusivity', text: 'Welcoming learners of every background.', tone: 'emerald' },
        { icon: 'briefcase-business', title: 'Industry Relevance', text: 'Connecting learning with real-world skills.', tone: 'rose' },
      ],
    },
    // 07 | Our Commitment
    {
      id: 'about-commitment',
      type: 'featureGrid',
      variant: 'icons',
      columns: 4,
      background: 'night',
      eyebrow: 'Our Commitment',
      heading: 'Our Commitment to Every Learner',
      intro:
        'At AIT, we are committed to connecting learners with quality education, relevant knowledge and practical skills through meaningful academic partnerships. These are institutional commitments, not guarantees of specific student outcomes.',
      items: [
        { icon: 'graduation-cap', title: 'Quality Education', text: 'Programmes delivered with academic integrity and care.' },
        { icon: 'trophy', title: 'Learner Success', text: 'Support that helps learners build capability and confidence.' },
        { icon: 'briefcase-business', title: 'Industry Relevance', text: 'Learning connected to professional and practical skills.' },
        { icon: 'globe', title: 'Global Opportunities', text: 'Pathways that open doors beyond borders.' },
        { icon: 'handshake', title: 'Trusted Partnerships', text: 'Working with established, verified education providers.' },
      ],
    },
    // Explore Our Programmes
    {
      id: 'about-programmes-cta',
      type: 'cta',
      eyebrow: 'Explore',
      heading: 'Explore Our Programmes',
      body: 'Discover internationally aligned education opportunities at AIT.',
      actions: [
        { label: 'View Programmes', href: '/courses', variant: 'accent' },
        { label: 'Enquire Now', href: '/enquire', variant: 'secondary' },
      ],
    },
  ],
  seo: {
    description: 'A new vision for international education in Sri Lanka — the story, the leadership and the beliefs that shape the Australian Institute of Technology.',
  },
  updatedAt,
}

export const teamPage: Page = {
  id: 'page-about-team',
  slug: 'about/team',
  title: 'Leadership and faculty',
  eyebrow: 'About us',
  summary: 'Meet the people who lead AIT, teach our courses and support students every day.',
  hero: { image: media.page.team },
  blocks: [
    {
      id: 'team-intro',
      type: 'intro',
      lead: 'Our leadership, teaching and professional staff work together so that every student receives consistent, practical teaching and support — from first enquiry to completion.',
      body: 'Profiles are published with each person’s approval, and qualifications are listed as confirmed by AIT. For questions about courses or applications, please contact the [admissions team](/enquire?topic=course) rather than individual staff members.',
    },
    {
      id: 'team-leadership',
      type: 'module',
      module: 'teamDirectory',
      background: 'alt',
      eyebrow: 'Leadership',
      heading: 'Leadership team',
      intro: 'Responsible for strategy, academic quality and the student experience.',
      props: { groups: ['leadership'] },
    },
    {
      id: 'team-faculty',
      type: 'module',
      module: 'teamDirectory',
      eyebrow: 'Faculty',
      heading: 'Teaching staff',
      intro: 'Program leads and trainers across our study areas.',
      props: { groups: ['faculty'] },
    },
    {
      id: 'team-professional',
      type: 'module',
      module: 'teamDirectory',
      background: 'alt',
      eyebrow: 'Professional staff',
      heading: 'Admissions and student services',
      intro: 'The teams that help applicants and students with advice, administration and support.',
      props: { groups: ['professional'] },
    },
    {
      id: 'team-expectations',
      type: 'featureGrid',
      variant: 'icons',
      columns: 3,
      eyebrow: 'How we work',
      heading: 'What you can expect from our staff',
      items: [
        { icon: 'message-square', title: 'Clear communication', text: 'Trainers explain what is expected in each module and how you will be assessed.' },
        { icon: 'notebook-pen', title: 'Useful feedback', text: 'Feedback that helps you understand your progress and what to work on next.' },
        { icon: 'hand-helping', title: 'Help when you need it', text: 'Staff can connect you with study, wellbeing and accessibility support.' },
      ],
    },
    {
      id: 'team-cta',
      type: 'cta',
      eyebrow: 'Questions?',
      heading: 'Talk to our admissions team',
      body: 'For course advice, entry requirements or application questions, our admissions team is the best place to start.',
      actions: [
        { label: 'Make an enquiry', href: '/enquire?topic=course', variant: 'accent' },
        { label: 'Browse courses', href: '/courses', variant: 'secondary' },
      ],
    },
  ],
  seo: { description: 'Meet the leadership team, teaching staff and professional staff at AIT.' },
  updatedAt,
}

export const accreditationPage: Page = {
  id: 'page-about-accreditation',
  slug: 'partners',
  title: 'Our Partners',
  eyebrow: 'Partners',
  summary: 'The Australian and international education providers and Sri Lankan delivery partners we work with to bring selected programmes to students in Sri Lanka.',
  hero: { image: media.pageExtra.accreditation },
  blocks: [
    {
      id: 'accreditation-intro',
      type: 'intro',
      lead: 'AIT works with international education providers and local delivery partners to connect learners with selected programmes and learning opportunities in Sri Lanka.',
      body: 'Each partner brings its own programmes and expertise, with a distinct role — awarding, delivery or support. Visit a partner’s website to learn more about the organisation behind the courses we help you access.',
    },
    {
      id: 'partners-list',
      type: 'module',
      module: 'partnerStrip',
      background: 'alt',
      eyebrow: 'Australian Awarding Partners',
      heading: 'Our Partners',
      intro: 'Select a partner to visit their official website.',
      props: { partners: educationPartners, pill: 'navy' },
    },
    {
      id: 'partners-vc',
      type: 'module',
      module: 'partnerStrip',
      eyebrow: 'Our education network',
      heading: 'VC Consultancy',
      intro: 'Through VC Consultancy, students can access programmes from a network of Australian education providers.',
      props: { lead: vcConsultancyLead, partners: vcConsultancyProviders, marquee: true },
    },
    {
      id: 'partners-delivery',
      type: 'module',
      module: 'partnerStrip',
      background: 'alt',
      eyebrow: 'Sri Lankan Delivery Partners',
      intro: 'Programmes are delivered locally in partnership with our Sri Lankan campuses and institutions.',
      props: { partners: srilankanDeliveryPartners, pill: 'red' },
    },
    {
      id: 'accreditation-links',
      type: 'linkCards',
      eyebrow: 'Related information',
      heading: 'Learn more',
      items: [
        { icon: 'landmark', title: 'About us', text: 'Our history, mission and approach to teaching.', href: '/about' },
        { icon: 'book-open', title: 'Courses', text: 'Course details, including qualification level and study pathways.', href: '/courses' },
        { icon: 'scroll-text', title: 'Policies', text: 'Current approved policies and procedures.', href: '/policies' },
      ],
    },
  ],
  seo: {
    description: 'The Australian awarding partners, VC Consultancy network and Sri Lankan delivery partners AIT works with to deliver selected programmes locally in Sri Lanka.',
  },
  updatedAt,
}

export const aboutPages: Page[] = [aboutPage, teamPage, accreditationPage]

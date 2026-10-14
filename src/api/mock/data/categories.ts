import type { CourseCategory } from '@/api/types'
import { media } from './media'

/** Study areas for the catalogue. Create only areas the provider offers. */
export type CategorySeed = Omit<CourseCategory, 'courseCount'>

export const categories: CategorySeed[] = [
  {
    id: 'cat-business',
    slug: 'business',
    name: 'Business & Management',
    summary: 'Operations, marketing, finance and leadership skills for modern workplaces.',
    description:
      'Business courses build practical skills for administration, coordination and leadership roles. Students work through case studies, team projects and simulated workplace tasks that reflect how organisations operate day to day.',
    icon: 'briefcase',
    image: media.category.business,
    suitableFor: [
      'School leavers who want a broad grounding in business',
      'Career changers moving into office, coordination or supervisory roles',
      'People already working who want to formalise their skills',
    ],
    pathways: ['Progress from diploma to advanced diploma study', 'Explore approved further-study options with admissions'],
  },
  {
    id: 'cat-english',
    slug: 'english',
    name: 'English Language (ELICOS)',
    summary: 'General English programs to build everyday, work and study confidence.',
    description:
      'English language programs help students communicate with confidence in everyday, workplace and academic situations. Classes focus on speaking, listening, reading and writing, with regular feedback on progress.',
    icon: 'languages',
    image: media.category.english,
    suitableFor: [
      'Students who want to improve everyday English',
      'Applicants preparing for further study taught in English',
      'Professionals who use English at work',
    ],
    pathways: ['English can help prepare for further study — entry still depends on each course’s requirements'],
  },
  {
    id: 'cat-beauty',
    slug: 'beauty',
    name: 'Beauty Therapy',
    summary: 'Skincare, treatments, makeup and client care for salons and spas.',
    description:
      'Beauty courses are taught in training salons. Students practise facials, waxing, lashes and brows, nails, make-up and body treatments while developing the consultation, hygiene and retail skills used in salons and spas.',
    icon: 'sparkles',
    image: media.category.beauty,
    suitableFor: [
      'People who enjoy hands-on, client-facing work',
      'Students interested in salon, spa or makeup careers',
      'Current beauty workers seeking formal qualifications',
    ],
    pathways: ['Progress from certificate-level beauty services into diploma study', 'Some courses include supervised salon practice'],
  },
  {
    id: 'cat-hairdressing',
    slug: 'hairdressing',
    name: 'Hairdressing & Salon',
    summary: 'Cutting, colouring, styling and salon management training.',
    description:
      'Hairdressing and salon courses combine technical training in a working salon with the service, teamwork and business skills needed to run a salon floor.',
    icon: 'palette',
    image: media.category.hairdressing,
    suitableFor: [
      'People who enjoy creative, practical work',
      'Current hairdressers advancing their skills or moving into management',
      'Students interested in salon leadership',
    ],
    pathways: ['Move from certificate hairdressing into advanced technical or salon-management study'],
  },
  {
    id: 'cat-construction',
    slug: 'construction',
    name: 'Building & Construction',
    summary: 'Building, supervision and trade skills taught in real or simulated workplaces.',
    description:
      'Building and construction courses develop the technical, planning and compliance skills used on site. Learning is delivered in real or closely simulated workplaces, with a focus on safety and current codes and standards.',
    icon: 'building',
    image: media.category.construction,
    suitableFor: [
      'People who want hands-on trade or site-supervision careers',
      'Workers in construction seeking formal qualifications',
      'Students planning to move into building supervision or contracting',
    ],
    pathways: ['Licensing and registration depend on jurisdiction-specific checks — confirm with the relevant authority'],
  },
  {
    id: 'cat-civil',
    slug: 'civil-construction',
    name: 'Civil Construction Design',
    summary: 'Civil design support for engineering, planning and infrastructure projects.',
    description:
      'Civil construction design courses prepare students to support engineers on infrastructure projects — preparing detailed designs, drawings and documentation, and coordinating technical and quality processes.',
    icon: 'compass',
    image: media.category['civil-construction'],
    suitableFor: [
      'People interested in civil, infrastructure and design work',
      'Technical staff supporting engineering teams',
      'Students planning careers in civil design and documentation',
    ],
    pathways: ['Progress from diploma to advanced diploma civil design study'],
  },
]

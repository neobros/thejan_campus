import type { CourseCategory } from '@/api/types'
import { media } from './media'

/** DEMO DATA — study areas for discussion only (specification §5.5). Create only areas the client offers. */
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
    pathways: ['Progress from certificate to diploma and advanced diploma study', 'Explore approved further-study options with admissions'],
  },
  {
    id: 'cat-it',
    slug: 'information-technology',
    name: 'Information Technology',
    summary: 'Programming, networking, cloud and cyber security foundations.',
    description:
      'Information technology courses combine technical fundamentals with hands-on lab work. Students build, configure and secure systems while developing the problem-solving and teamwork skills used in IT projects.',
    icon: 'laptop',
    image: media.category['information-technology'],
    suitableFor: [
      'Beginners who enjoy problem solving and technology',
      'Students with some coding or IT experience who want structured training',
      'Professionals adding technical skills to their current role',
    ],
    pathways: ['Move from foundation IT skills into specialist diploma study', 'Discuss credit for previous IT study or industry certificates'],
  },
  {
    id: 'cat-hospitality',
    slug: 'hospitality',
    name: 'Hospitality & Cookery',
    summary: 'Commercial cookery and hospitality management with practical kitchen training.',
    description:
      'Hospitality courses are taught in training kitchens and service environments. Students develop practical techniques, food safety habits and the organisational skills used across restaurants, hotels and events.',
    icon: 'chef-hat',
    image: media.category.hospitality,
    suitableFor: [
      'People who enjoy hands-on, fast-paced work',
      'Current hospitality workers seeking formal training',
      'Students interested in kitchen, service or venue management',
    ],
    pathways: ['Combine cookery skills with hospitality management study', 'Some courses include supervised work placement'],
  },
  {
    id: 'cat-health',
    slug: 'health',
    name: 'Health & Community',
    summary: 'Care, support and community services training with supervised placement.',
    description:
      'Health and community courses prepare students to support people with care and respect. Learning combines classroom theory, simulated practice and, where required, supervised placement in an approved setting.',
    icon: 'heart-pulse',
    image: media.category.health,
    suitableFor: [
      'People who want to support others in care or community settings',
      'Students seeking practical, people-focused work',
      'Current support workers looking to formalise their skills',
    ],
    pathways: ['Progress from certificate-level care to community services diploma study', 'Placement requirements are explained on each course page'],
  },
  {
    id: 'cat-english',
    slug: 'english',
    name: 'English Language',
    summary: 'General and academic English programs to build confidence and study skills.',
    description:
      'English language programs help students communicate with confidence in everyday, workplace and academic situations. Classes focus on speaking, listening, reading and writing, with regular feedback on progress.',
    icon: 'languages',
    image: media.category.english,
    suitableFor: [
      'Students who want to improve everyday English',
      'Applicants preparing for further study taught in English',
      'Professionals who use English at work',
    ],
    pathways: ['Academic English can help prepare for further study — entry still depends on each course’s requirements'],
  },
  {
    id: 'cat-short',
    slug: 'short-courses',
    name: 'Short Courses',
    summary: 'Focused, flexible courses to build a specific skill quickly.',
    description:
      'Short courses focus on a single practical skill and are designed to fit around work and other commitments. Many are available online or in the evening.',
    icon: 'sparkles',
    image: media.category['short-courses'],
    suitableFor: ['Working professionals', 'Anyone exploring a new field before committing to longer study'],
    pathways: ['Short courses are a low-commitment way to explore a study area'],
  },
]

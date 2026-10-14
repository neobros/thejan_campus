import type { Campus } from '@/api/types'
import { media } from './media'

/** Campus names from the provider's course pages; addresses, hours and contacts remain placeholders. */
export type CampusSeed = Omit<Campus, 'studyAreas'> & { studyAreaSlugs: string[] }

const PLACEHOLDER = {
  coordinates: null as null,
  hours: [
    { label: 'Monday – Friday', value: '[OPENING_HOURS]' },
    { label: 'Weekends', value: '[WEEKEND_HOURS]' },
  ],
  facilities: [
    { name: 'Classrooms', description: 'Theory classes and group work', icon: 'school' as const },
    { name: 'Student common room', description: 'Seating and a kitchenette between classes', icon: 'coffee' as const },
    { name: 'Campus Wi-Fi', description: 'Free wireless access for enrolled students', icon: 'wifi' as const },
  ],
  transport: ['[Nearest public transport options]'],
  accessibility: ['[Accessibility details to be confirmed by campus operations]'],
  directionsUrl: null,
  admissionsContact: { name: 'Admissions team', email: '[ADMISSIONS_EMAIL]', phone: '[PHONE_NUMBER]' },
}

export const campuses: CampusSeed[] = [
  {
    id: 'campus-melbourne',
    slug: 'city-campus',
    name: 'Melbourne',
    city: 'Melbourne',
    address: '[MELBOURNE_CAMPUS_ADDRESS]',
    summary: 'Business, English and salon-management classes with the main student services team.',
    overview:
      'The Melbourne campus delivers business, English (ELICOS), salon-management and civil-construction-design classes, together with the main student services and admissions teams.\n\nAddress, opening hours and facilities are confirmed by campus operations.',
    timezone: 'Australia/Melbourne',
    image: media.campus.city,
    studyAreaSlugs: ['business', 'english', 'hairdressing', 'civil-construction'],
    contact: { phone: '[MELBOURNE_CAMPUS_PHONE]', email: '[MELBOURNE_CAMPUS_EMAIL]' },
    parking: '[Parking options near the Melbourne campus]',
    gallery: [media.facility.classroom, media.facility.library, media.facility.lounge],
    ...PLACEHOLDER,
  },
  {
    id: 'campus-geelong',
    slug: 'riverside-campus',
    name: 'Geelong',
    city: 'Geelong',
    address: '[GEELONG_CAMPUS_ADDRESS]',
    summary: 'Beauty, hairdressing and business training in working-salon environments.',
    overview:
      'The Geelong campus delivers beauty therapy, hairdressing, business and civil-construction-design programs, with training salons where students practise in a realistic environment.\n\nAddress, opening hours and facilities are confirmed by campus operations.',
    timezone: 'Australia/Melbourne',
    image: media.campus.riverside,
    studyAreaSlugs: ['business', 'beauty', 'hairdressing', 'civil-construction'],
    contact: { phone: '[GEELONG_CAMPUS_PHONE]', email: '[GEELONG_CAMPUS_EMAIL]' },
    parking: '[Parking options near the Geelong campus]',
    gallery: [media.facility.classroom, media.facility.lounge],
    ...PLACEHOLDER,
  },
  {
    id: 'campus-north-geelong',
    slug: 'north-geelong-campus',
    name: 'North Geelong',
    city: 'North Geelong',
    address: '[NORTH_GEELONG_CAMPUS_ADDRESS]',
    summary: 'Building, construction and civil-design training in real and simulated workplaces.',
    overview:
      'The North Geelong campus delivers building and construction and civil-construction-design programs, taught in real or closely simulated workplaces.\n\nAddress, opening hours and facilities are confirmed by campus operations.',
    timezone: 'Australia/Melbourne',
    image: media.campus.riverside,
    studyAreaSlugs: ['construction', 'civil-construction'],
    contact: { phone: '[NORTH_GEELONG_CAMPUS_PHONE]', email: '[NORTH_GEELONG_CAMPUS_EMAIL]' },
    parking: '[Parking options near the North Geelong campus]',
    gallery: [media.facility.classroom],
    ...PLACEHOLDER,
  },
  {
    id: 'campus-adelaide',
    slug: 'parkview-campus',
    name: 'Adelaide',
    city: 'Adelaide',
    address: '[ADELAIDE_CAMPUS_ADDRESS]',
    summary: 'Business, English, painting and civil-design classes.',
    overview:
      'The Adelaide campus delivers business, English (ELICOS), painting and decorating and civil-construction-design programs.\n\nAddress, opening hours and facilities are confirmed by campus operations.',
    timezone: 'Australia/Adelaide',
    image: media.campus.parkview,
    studyAreaSlugs: ['business', 'english', 'construction', 'civil-construction'],
    contact: { phone: '[ADELAIDE_CAMPUS_PHONE]', email: '[ADELAIDE_CAMPUS_EMAIL]' },
    parking: '[Parking options near the Adelaide campus]',
    gallery: [media.facility.classroom, media.facility.library],
    ...PLACEHOLDER,
  },
]

import type { Campus } from '@/api/types'
import { media } from './media'

/** DEMO DATA — campus names, addresses and coordinates are placeholders until supplied by campus operations. */
export type CampusSeed = Omit<Campus, 'studyAreas'> & { studyAreaSlugs: string[] }

export const campuses: CampusSeed[] = [
  {
    id: 'campus-city',
    slug: 'city-campus',
    name: 'City Campus',
    city: '[CITY]',
    address: '[CITY_CAMPUS_ADDRESS]',
    summary: 'Our central campus, close to public transport, with business, IT and English classrooms.',
    overview:
      'City Campus is located in the heart of [CITY], a short walk from public transport, cafés and services. The campus hosts business, information technology and English language classes, together with the main student services and admissions teams.\n\nStudents have access to modern classrooms, a computer lab, a quiet library and a student lounge.',
    timezone: 'UTC',
    image: media.campus.city,
    studyAreaSlugs: ['business', 'information-technology', 'english', 'short-courses'],
    coordinates: null,
    contact: { phone: '[CITY_CAMPUS_PHONE]', email: '[CITY_CAMPUS_EMAIL]' },
    hours: [
      { label: 'Monday – Friday', value: '[OPENING_HOURS]' },
      { label: 'Saturday', value: '[SATURDAY_HOURS]' },
      { label: 'Sunday & public holidays', value: 'Closed' },
    ],
    facilities: [
      { name: 'Library & quiet study', description: 'Print and digital resources with bookable study rooms', icon: 'library' },
      { name: 'Computer lab', description: 'Workstations with the software used in IT courses', icon: 'monitor' },
      { name: 'Flexible classrooms', description: 'Collaborative layouts with presentation screens', icon: 'school' },
      { name: 'Student lounge', description: 'Kitchenette and space to relax between classes', icon: 'coffee' },
      { name: 'Campus Wi-Fi', description: 'Free wireless access for enrolled students', icon: 'wifi' },
    ],
    transport: ['[Nearest train or metro station and walking time]', '[Bus routes that stop near campus]', 'Secure bicycle parking on site'],
    parking: '[Parking options near City Campus]',
    accessibility: ['Step-free entrance and lifts to all floors', 'Accessible bathrooms on each level', 'Contact us before your visit if you need support on arrival'],
    directionsUrl: null,
    gallery: [media.facility.library, media.facility.computerLab, media.facility.classroom, media.facility.lounge],
    admissionsContact: { name: 'Admissions team', email: '[ADMISSIONS_EMAIL]', phone: '[PHONE_NUMBER]' },
  },
  {
    id: 'campus-riverside',
    slug: 'riverside-campus',
    name: 'Riverside Campus',
    city: '[CITY]',
    address: '[RIVERSIDE_CAMPUS_ADDRESS]',
    summary: 'A practical training campus with commercial kitchens and hospitality facilities.',
    overview:
      'Riverside Campus is home to our hospitality and cookery programs. Training kitchens and service areas let students practise in an environment set up like a working venue.\n\nThe campus also offers business classes and shared student facilities.',
    timezone: 'UTC',
    image: media.campus.riverside,
    studyAreaSlugs: ['hospitality', 'business'],
    coordinates: null,
    contact: { phone: '[RIVERSIDE_CAMPUS_PHONE]', email: '[RIVERSIDE_CAMPUS_EMAIL]' },
    hours: [
      { label: 'Monday – Friday', value: '[OPENING_HOURS]' },
      { label: 'Weekends', value: 'Closed except for scheduled classes' },
    ],
    facilities: [
      { name: 'Commercial training kitchens', description: 'Industry-standard equipment for practical classes', icon: 'chef-hat' },
      { name: 'Training restaurant', description: 'Service practice in a realistic setting', icon: 'utensils' },
      { name: 'Classrooms', description: 'Theory classes and group work', icon: 'school' },
      { name: 'Student common room', description: 'Lockers, seating and a kitchenette', icon: 'coffee' },
    ],
    transport: ['[Nearest public transport options]', 'Riverside walking and cycling path'],
    parking: '[Parking options near Riverside Campus]',
    accessibility: ['Ground-floor access to kitchens and classrooms', 'Accessible bathroom on the ground floor'],
    directionsUrl: null,
    gallery: [media.facility.kitchen, media.facility.classroom, media.facility.lounge],
    admissionsContact: { name: 'Admissions team', email: '[ADMISSIONS_EMAIL]', phone: '[PHONE_NUMBER]' },
  },
  {
    id: 'campus-parkview',
    slug: 'parkview-campus',
    name: 'Parkview Campus',
    city: '[CITY]',
    address: '[PARKVIEW_CAMPUS_ADDRESS]',
    summary: 'A calm suburban campus with simulated care rooms for health and community courses.',
    overview:
      'Parkview Campus delivers our health and community services programs. Simulated care rooms let students practise skills safely before supervised placement.\n\nThe campus is set beside parkland, with outdoor seating and a quiet library space.',
    timezone: 'UTC',
    image: media.campus.parkview,
    studyAreaSlugs: ['health', 'english'],
    coordinates: null,
    contact: { phone: '[PARKVIEW_CAMPUS_PHONE]', email: '[PARKVIEW_CAMPUS_EMAIL]' },
    hours: [
      { label: 'Monday – Friday', value: '[OPENING_HOURS]' },
      { label: 'Weekends', value: 'Closed' },
    ],
    facilities: [
      { name: 'Simulated care rooms', description: 'Practise care skills with training equipment', icon: 'stethoscope' },
      { name: 'Library corner', description: 'Quiet study and course readers', icon: 'library' },
      { name: 'Outdoor seating', description: 'Garden area beside the park', icon: 'leaf' },
      { name: 'Campus Wi-Fi', description: 'Free wireless access for enrolled students', icon: 'wifi' },
    ],
    transport: ['[Nearest public transport options]', 'On-site car parking (limited)'],
    parking: 'Limited on-site parking — [parking rules and costs to be confirmed]',
    accessibility: ['Single-level building with step-free access', 'Accessible parking spaces near the entrance'],
    directionsUrl: null,
    gallery: [media.facility.careLab, media.facility.library, media.facility.classroom],
    admissionsContact: { name: 'Admissions team', email: '[ADMISSIONS_EMAIL]', phone: '[PHONE_NUMBER]' },
  },
]

import type { CampusRef, Department, OrientationSession, SupportService } from '@/api/types'
import { at, mondayOfMonth } from './time'

/**
 * DEMO DATA — support directory, orientation sessions and contact departments
 * (specification §5.18, §5.19, §5.26). Emails use the reserved example.com domain; phone numbers,
 * hours and any charges are placeholders until confirmed by campus operations.
 */

const CITY: CampusRef = { slug: 'city-campus', name: 'City Campus' }
const RIVERSIDE: CampusRef = { slug: 'riverside-campus', name: 'Riverside Campus' }
const PARKVIEW: CampusRef = { slug: 'parkview-campus', name: 'Parkview Campus' }

const WEEKDAYS = 'Monday to Friday, [OPENING_HOURS]'

/** "November 2026 intake" for an intake start date (YYYY-MM-DD). */
function intakeLabel(isoDay: string) {
  const month = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${isoDay}T00:00:00Z`),
  )
  return `${month} intake`
}

export const supportServices: SupportService[] = [
  {
    id: 'support-academic',
    issue: 'Study skills and academic progress',
    team: 'Academic skills team',
    assistance:
      'One-to-one study sessions, workshops on writing, referencing and exam preparation, and help making a plan if you fall behind.',
    contact: 'academic.support@example.com',
    hours: WEEKDAYS,
    requestMethod: 'Email, drop in to student support, or ask your trainer to refer you',
    charges: null,
    icon: 'book-open',
  },
  {
    id: 'support-language',
    issue: 'English language and study assistance',
    team: 'English language support',
    assistance:
      'Conversation practice, feedback on written work and help understanding assessment instructions and course materials.',
    contact: 'english.support@example.com',
    hours: '[Session times — to be confirmed]',
    requestMethod: 'Book a session by email or at the student support desk',
    charges: null,
    icon: 'languages',
  },
  {
    id: 'support-accessibility',
    issue: 'Disability, health conditions and learning adjustments',
    team: 'Accessibility and inclusion team',
    assistance:
      'A confidential conversation about your needs and a learning access plan, which may include assessment adjustments, accessible materials or assistive technology.',
    contact: 'accessibility@example.com',
    hours: WEEKDAYS,
    requestMethod: 'Email or request an appointment — you can also mention support needs in your application',
    charges: null,
    icon: 'accessibility',
  },
  {
    id: 'support-wellbeing',
    issue: 'Wellbeing and personal concerns',
    team: 'Wellbeing team',
    assistance:
      'Confidential short-term support for stress, homesickness or personal difficulties, and referrals to external health and counselling services.',
    contact: 'wellbeing@example.com',
    hours: 'By appointment, Monday to Friday',
    requestMethod: 'Email, phone or visit student support to make an appointment',
    charges: '[Any charges — to be confirmed]. External services you are referred to may charge their own fees.',
    icon: 'heart',
  },
  {
    id: 'support-administration',
    issue: 'Enrolment, timetables and student records',
    team: 'Student administration',
    assistance:
      'Updates to personal details, timetable questions, enrolment letters, deferral and withdrawal requests, and completion documents.',
    contact: 'student.admin@example.com',
    hours: WEEKDAYS,
    requestMethod: 'Email or visit campus reception — some requests need a form from the downloads page',
    charges: '[Fees for replacement documents, if any — to be confirmed]',
    icon: 'clipboard-list',
  },
  {
    id: 'support-fees',
    issue: 'Fees, payment plans and refunds',
    team: 'Finance team',
    assistance: 'Questions about invoices, due dates, instalment arrangements and refund requests.',
    contact: 'finance@example.com',
    hours: WEEKDAYS,
    requestMethod: 'Email the finance team with your student or application reference',
    charges: null,
    icon: 'wallet',
  },
  {
    id: 'support-international',
    issue: 'International student advice',
    team: 'International office',
    assistance:
      'Help with arrival, settling in, enrolment conditions and finding official information. Advisers explain our processes but cannot give migration advice.',
    contact: 'international@example.com',
    hours: WEEKDAYS,
    requestMethod: 'Email or book an appointment with an international student adviser',
    charges: null,
    icon: 'globe',
  },
  {
    id: 'support-complaints',
    issue: 'Complaints and appeals',
    team: 'Student experience team',
    assistance:
      'Guidance on raising a concern, lodging a formal complaint or appealing a decision, and information about external review options.',
    contact: 'feedback@example.com',
    hours: WEEKDAYS,
    requestMethod: 'Use the complaints and appeals form, or email the team to talk it through first',
    charges: null,
    icon: 'scale',
  },
]

const nextIntake = mondayOfMonth(1)
const followingIntake = mondayOfMonth(2)

const COORDINATOR = { name: 'Orientation coordinator, Student experience team', email: 'orientation@example.com' }

const COMMON_BRING = [
  'Photo identification',
  'Your enrolment confirmation (printed or on your phone)',
  'Original documents, if admissions has asked to see them',
  'Something to write with, or a laptop or tablet',
]

export const orientationSessions: OrientationSession[] = [
  {
    id: 'orientation-city-next',
    title: 'New student orientation — City Campus',
    intakeLabel: intakeLabel(nextIntake),
    campus: CITY,
    start: at(nextIntake, '09:30'),
    end: at(nextIntake, '13:00'),
    timezone: 'UTC',
    location: 'City Campus — main lecture room [room number to be confirmed]',
    topics: [
      'Welcome and introductions',
      'Your timetable and how classes run',
      'Assessment, attendance and academic integrity',
      'Student support and how to ask for help',
      'Logging in to student systems [systems to be confirmed]',
      'Campus tour, health, safety and emergency procedures',
    ],
    bring: COMMON_BRING,
    remoteUrl: 'https://example.com/orientation/city-campus-live',
    coordinator: COORDINATOR,
  },
  {
    id: 'orientation-riverside-next',
    title: 'New student orientation — Riverside Campus',
    intakeLabel: intakeLabel(nextIntake),
    campus: RIVERSIDE,
    start: at(nextIntake, '09:30'),
    end: at(nextIntake, '12:30'),
    timezone: 'UTC',
    location: 'Riverside Campus — training restaurant',
    topics: [
      'Welcome and introductions',
      'Kitchen safety induction and food safety rules',
      'Uniform, knife kit and personal protective equipment',
      'Your timetable, service periods and placement overview',
      'Student support and how to ask for help',
      'Campus tour and emergency procedures',
    ],
    bring: [...COMMON_BRING, 'Your uniform and enclosed, non-slip shoes, if you already have them'],
    remoteUrl: null,
    coordinator: COORDINATOR,
  },
  {
    id: 'orientation-parkview-following',
    title: 'New student orientation — Parkview Campus',
    intakeLabel: intakeLabel(followingIntake),
    campus: PARKVIEW,
    start: at(followingIntake, '10:00'),
    end: at(followingIntake, '13:00'),
    timezone: 'UTC',
    location: 'Parkview Campus — simulated care room and classroom 1',
    topics: [
      'Welcome and introductions',
      'Your timetable, simulated practice and placement requirements',
      'Pre-placement checks and how to complete them [requirements to be confirmed]',
      'Assessment, attendance and academic integrity',
      'Student support and how to ask for help',
      'Campus tour, infection control and emergency procedures',
    ],
    bring: [...COMMON_BRING, 'Any pre-placement check documents you already have'],
    remoteUrl: null,
    coordinator: COORDINATOR,
  },
]

export const departments: Department[] = [
  {
    id: 'dept-admissions',
    name: 'Admissions',
    description: 'Course advice, entry requirements, applications, intakes and credit transfer enquiries.',
    email: 'admissions@example.com',
    phone: '[ADMISSIONS_PHONE]',
    hours: WEEKDAYS,
    campus: CITY,
    topics: ['course', 'admissions'],
  },
  {
    id: 'dept-international',
    name: 'International office',
    description: 'Advice for international applicants and students, and enquiries from education agents.',
    email: 'international@example.com',
    phone: '[INTERNATIONAL_PHONE]',
    hours: WEEKDAYS,
    campus: CITY,
    topics: ['international', 'agent'],
  },
  {
    id: 'dept-student-support',
    name: 'Student support',
    description: 'Academic, wellbeing, accessibility and administrative support for enrolled students at every campus.',
    email: 'support@example.com',
    phone: '[SUPPORT_PHONE]',
    hours: WEEKDAYS,
    campus: null,
    topics: ['support'],
  },
  {
    id: 'dept-finance',
    name: 'Finance',
    description: 'Fees, invoices, payment instructions, instalment arrangements and refund requests.',
    email: 'finance@example.com',
    phone: '[FINANCE_PHONE]',
    hours: WEEKDAYS,
    campus: CITY,
    topics: ['fees'],
  },
  {
    id: 'dept-reception',
    name: 'Campus reception',
    description: 'General enquiries, campus visits, directions and lost property for all campuses.',
    email: 'reception@example.com',
    phone: '[PHONE_NUMBER]',
    hours: WEEKDAYS,
    campus: null,
    topics: ['campus', 'other'],
  },
]

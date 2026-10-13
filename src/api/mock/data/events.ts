import type { CampusRef, EventItem } from '@/api/types'
import { media } from './media'
import { orientationSessions } from './support'
import { at, daysFromToday } from './time'

/**
 * DEMO DATA — sample events dated relative to today: five upcoming and two past (specification §5.24).
 * Registration uses an enquiry note or a reserved example.com link; ticketing is out of scope for P1.
 */

const CITY: CampusRef = { slug: 'city-campus', name: 'City Campus' }
const RIVERSIDE: CampusRef = { slug: 'riverside-campus', name: 'Riverside Campus' }
const PARKVIEW: CampusRef = { slug: 'parkview-campus', name: 'Parkview Campus' }

const cityOrientation = orientationSessions[0]

export const events: EventItem[] = [
  /* Upcoming --------------------------------------------------------------------------------- */
  {
    id: 'event-international-info-session',
    slug: 'online-information-session-international-students',
    title: 'Online information session for international students',
    type: 'Information session',
    summary: 'Join the international office online to learn about courses, entry requirements, fees and how the application process works.',
    start: at(daysFromToday(8), '10:00'),
    end: at(daysFromToday(8), '11:00'),
    timezone: 'UTC',
    campus: null,
    location: 'Online — live video session (joining link sent after registration)',
    audience: 'Prospective international students, families and education agents',
    cost: 'Free',
    image: media.event[1],
    description: `This live online session is a chance to learn about studying at AIT as an international student and to ask our team your questions directly.

## What we will cover

- Courses open to international students and how to compare them
- Entry requirements and English language evidence
- Fees, additional costs and how payment instructions work
- The application process, from submission to outcome
- Planning your arrival and the support available once you are here

## Good to know

Our team can explain how our admissions and enrolment processes work. We cannot give migration advice or guarantee any visa or application outcome, but we will point you to official sources where relevant.

Live captions will be available [captioning arrangements — to be confirmed]. Please send any accessibility requests when you register.`,
    organiser: 'International office',
    registration: {
      url: 'https://example.com/events/international-information-session',
      deadline: at(daysFromToday(7), '17:00'),
      note: 'Register to receive the joining link by email.',
    },
    accessibilityContact: 'Contact international@example.com to request captions, an interpreter or other adjustments.',
  },
  {
    id: 'event-open-day-city',
    slug: 'open-day-city-campus',
    title: 'Open day at City Campus',
    type: 'Open day',
    summary: 'Tour City Campus, see our classrooms and computer lab, and talk with trainers and admissions staff about your study options.',
    start: at(daysFromToday(17), '10:00'),
    end: at(daysFromToday(17), '14:00'),
    timezone: 'UTC',
    campus: CITY,
    location: 'City Campus — main reception, [CITY_CAMPUS_ADDRESS]',
    audience: 'Prospective students, families and supporters',
    cost: 'Free',
    image: media.event[0],
    description: `Come and see where you could study. Our open day is a relaxed way to explore City Campus, meet trainers and get answers to your questions about courses and applications.

## On the day

- Guided campus tours, including classrooms, the library and the computer lab
- Short talks about business, information technology and English language programs
- Admissions advisers available to discuss entry requirements, intakes and fees
- Student support staff on hand to explain the help available

## Planning your visit

Drop in at any time between the listed hours — tours leave regularly from main reception. City Campus has a step-free entrance and lifts to all floors. If you need any other support on the day, please let us know beforehand.`,
    organiser: 'Admissions team',
    registration: {
      url: null,
      deadline: null,
      note: 'No registration needed — just drop in. [Optional registration method — to be confirmed]',
    },
    accessibilityContact: 'Contact admissions@example.com or [ADMISSIONS_PHONE] before the day to arrange access support.',
  },
  {
    id: 'event-orientation-city',
    slug: 'new-student-orientation-city-campus',
    title: `New student orientation — ${cityOrientation.intakeLabel}`,
    type: 'Orientation',
    summary: 'Welcome to AIT! Meet staff and classmates, learn how your course works and find out where to get help.',
    start: cityOrientation.start,
    end: cityOrientation.end,
    timezone: cityOrientation.timezone,
    campus: CITY,
    location: cityOrientation.location,
    audience: `New students starting at City Campus in the ${cityOrientation.intakeLabel}`,
    cost: 'Free',
    image: media.event[2],
    description: `Orientation is your introduction to studying at AIT. It is a chance to meet the people who will support you, get to know your classmates and settle in before classes begin.

## What we will cover

${cityOrientation.topics.map((topic) => `- ${topic}`).join('\n')}

## What to bring

${cityOrientation.bring.map((item) => `- ${item}`).join('\n')}

Full details for every campus are on the [orientation page](/student-support/orientation).`,
    organiser: 'Student experience team',
    registration: {
      url: null,
      deadline: null,
      note: 'New students receive orientation details with their enrolment information. [Attendance requirements — to be confirmed]',
    },
    accessibilityContact: 'Contact orientation@example.com to request adjustments, such as accessible seating, an interpreter or materials in another format.',
  },
  {
    id: 'event-academic-writing-workshop',
    slug: 'academic-writing-and-referencing-workshop',
    title: 'Academic writing and referencing workshop',
    type: 'Workshop',
    summary: 'A practical session for current students on planning written assessments, using sources well and referencing correctly.',
    start: at(daysFromToday(24), '14:00'),
    end: at(daysFromToday(24), '15:30'),
    timezone: 'UTC',
    campus: PARKVIEW,
    location: 'Parkview Campus — classroom 1',
    audience: 'Current students (all courses)',
    cost: 'Free',
    image: media.event[3],
    description: `Written assessments are much easier when you have a plan. This hands-on workshop walks through the process from reading the question to checking your final draft.

## You will practise

- Breaking down an assessment question
- Planning and structuring your answer
- Finding and using reliable sources
- Paraphrasing, quoting and summarising
- Referencing using [referencing style — to be confirmed]

## Bring

- A current assessment task, if you have one
- A laptop, or a notebook and pen

The workshop also explains how to keep your work your own — see the [academic integrity policy](/policies/academic-integrity) for more.`,
    organiser: 'Academic skills team',
    registration: {
      url: null,
      deadline: at(daysFromToday(22), '17:00'),
      note: 'Places are limited. Book by emailing academic.support@example.com.',
    },
    accessibilityContact: 'Contact academic.support@example.com to request workshop materials in an alternative format.',
  },
  {
    id: 'event-multicultural-afternoon',
    slug: 'multicultural-food-and-music-afternoon',
    title: 'Multicultural food and music afternoon',
    type: 'Cultural event',
    summary: 'Celebrate the many cultures in our community with food, music and activities at Riverside Campus.',
    start: at(daysFromToday(38), '12:00'),
    end: at(daysFromToday(38), '15:00'),
    timezone: 'UTC',
    campus: RIVERSIDE,
    location: 'Riverside Campus — courtyard and training restaurant',
    audience: 'Students, staff, families and friends',
    cost: 'Free',
    image: media.event[4],
    description: `Our students come from many backgrounds, and this afternoon is a chance to celebrate that together.

## What to expect

- Food stalls prepared by cookery students and volunteers
- Music and performances from students and staff
- Activities and games for all ages

## Get involved

Would you like to share a dish, a performance or a display from your culture? Contact the student experience team by [date — to be confirmed].

Ingredient lists will be available for every dish. Please tell staff about any allergies before eating.`,
    organiser: 'Student experience team',
    registration: { url: null, deadline: null, note: 'No registration needed — everyone is welcome.' },
    accessibilityContact: 'Contact events@example.com or [PHONE_NUMBER] to discuss access needs, including a quiet space during the event.',
  },

  /* Past ------------------------------------------------------------------------------------- */
  {
    id: 'event-careers-evening',
    slug: 'careers-and-further-study-evening',
    title: 'Careers and further study evening',
    type: 'Careers',
    summary: 'Students explored possible next steps after their course, with practical advice on CVs, interviews and further study options.',
    start: at(daysFromToday(-12), '17:30'),
    end: at(daysFromToday(-12), '19:30'),
    timezone: 'UTC',
    campus: CITY,
    location: 'City Campus — main lecture room',
    audience: 'Current students and recent graduates',
    cost: 'Free',
    image: media.event[5],
    description: `This evening session helped students think about their next steps after completing a course.

## Session topics

- Writing a clear CV and cover letter
- Preparing for interviews
- Understanding further study pathways and entry requirements
- Questions with trainers and admissions staff

## Please note

The session offered general guidance only. Pathways show possible next steps — further study depends on meeting each course's entry requirements, and employment outcomes are not guaranteed.`,
    organiser: 'Student experience team',
    registration: null,
    accessibilityContact: 'Contact events@example.com for a copy of the session slides in an accessible format.',
  },
  {
    id: 'event-open-kitchen-riverside',
    slug: 'open-kitchen-riverside-campus',
    title: 'Open kitchen at Riverside Campus',
    type: 'Open day',
    summary: 'Visitors toured the Riverside training kitchens, watched cookery demonstrations and spoke with hospitality trainers.',
    start: at(daysFromToday(-26), '10:00'),
    end: at(daysFromToday(-26), '13:00'),
    timezone: 'UTC',
    campus: RIVERSIDE,
    location: 'Riverside Campus — training kitchens',
    audience: 'Prospective hospitality and cookery students',
    cost: 'Free',
    image: media.event[0],
    description: `Visitors stepped inside the Riverside Campus training kitchens to see how our hospitality and cookery courses are taught.

## Highlights

- Live cookery demonstrations from our trainers
- Tours of the kitchens and training restaurant
- Information about practical training, uniforms and work placement

Missed it? Look out for future open days on our events page, or [contact admissions](/enquire?topic=course) to arrange a campus visit.`,
    organiser: 'Admissions team',
    registration: null,
    accessibilityContact: 'Contact admissions@example.com to ask about access arrangements for future campus visits.',
  },
]

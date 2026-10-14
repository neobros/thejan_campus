import type { IconName, ImageAsset, Tone } from '@/api/types'
import { hashString } from '@/lib/palette'
import { providedImages } from './images.generated'

/**
 * Image slots for the demo dataset. Each slot matches an entry in docs/IMAGE_PROMPTS.md.
 *
 * Delivered images live in /public/images as responsive WebP; `images.generated.ts` maps slot ids
 * to them and is produced by the optimiser script (see docs/IMAGE_PROMPTS.md → "How to deliver").
 * Slots without a file render a designed placeholder.
 */
function slot(id: string, alt: string, tone: Tone, icon: IconName, width = 1600, height = 1200): ImageAsset {
  const file = providedImages[id]
  return { slot: id, src: file?.src ?? null, srcSet: file?.srcSet, concept: file?.concept, alt, tone, icon, width, height }
}

export const media = {
  home: {
    hero: slot('home-hero', 'Students walking together across a sunlit campus courtyard', 'brand', 'graduation-cap', 2400, 1350),
    why: slot('home-why', 'Small group of students working together around a table in a bright classroom', 'gold', 'users'),
    support: slot('home-support', 'A student talking with a support adviser in a welcoming office', 'teal', 'life-buoy'),
  },
  /** Rotating home-page banners (16:9, headline space on the left). */
  banners: {
    nursing: slot('nursing-hero', 'Three nursing students in navy scrubs walking together through a bright corridor', 'brand', 'heart-pulse', 2400, 1350),
    practical: slot('nursing-practical-training', 'Nursing students practising patient assessment on a training mannequin under supervision', 'teal', 'stethoscope', 2400, 1350),
    support: slot('nursing-student-support', 'A student planning their study pathway with an adviser', 'gold', 'life-buoy', 2400, 1350),
    graduation: slot('nursing-graduation', 'Graduates in gowns celebrating together on graduation day', 'violet', 'graduation-cap', 2400, 1350),
    australia: slot('nursing-australia-pathway', 'A nurse looking out over a sunlit city skyline', 'sky', 'plane', 2400, 1350),
  },
  page: {
    about: slot('page-about', 'Main entrance of the campus building in morning light', 'brand', 'landmark'),
    team: slot('page-team', 'Teaching staff in conversation in a modern staff area', 'violet', 'users'),
    courses: slot('page-courses', 'Students studying with laptops and notebooks in a library', 'sky', 'book-open'),
    admissions: slot('page-admissions', 'Prospective student reviewing course information with an admissions adviser', 'gold', 'clipboard-list'),
    fees: slot('page-fees', 'Calculator, notebook and course brochure on a desk', 'emerald', 'wallet'),
    intakes: slot('page-intakes', 'Wall planner with highlighted start dates', 'sky', 'calendar'),
    scholarships: slot('page-scholarships', 'Student smiling while reading a letter at a desk', 'gold', 'award'),
    creditTransfer: slot('page-credit-transfer', 'Folder of certificates and transcripts on a table', 'violet', 'file-check'),
    international: slot('page-international', 'International students chatting outside the campus', 'teal', 'globe'),
    preArrival: slot('page-pre-arrival', 'Suitcase and travel documents ready for departure', 'sky', 'plane'),
    living: slot('page-living', 'Students relaxing in a city park near public transport', 'emerald', 'house'),
    agents: slot('page-agents', 'Education adviser meeting a student and parent', 'brand', 'handshake'),
    domestic: slot('page-domestic', 'Local students arriving at campus with backpacks', 'rose', 'map-pin'),
    studentLife: slot('page-student-life', 'Students laughing together at an outdoor campus event', 'rose', 'sparkles'),
    support: slot('page-support', 'Student support adviser helping a student at a help desk', 'teal', 'life-buoy'),
    orientation: slot('page-orientation', 'New students at an orientation welcome session', 'gold', 'compass'),
    resources: slot('page-resources', 'Student browsing documents on a tablet', 'slate', 'folder-open'),
    campuses: slot('page-campuses', 'Aerial view of a modern city campus', 'brand', 'building'),
    contact: slot('page-contact', 'Friendly reception desk at the campus entrance', 'sky', 'message-square'),
    news: slot('page-news', 'Campus noticeboard with announcements', 'slate', 'newspaper'),
    events: slot('page-events', 'Students gathered for a campus event', 'violet', 'ticket'),
    gallery: slot('page-gallery', 'Collage of campus moments', 'rose', 'images'),
  },
  category: {
    business: slot('category-business', 'Students presenting a business plan to their class', 'brand', 'briefcase'),
    english: slot('category-english', 'English language class in discussion around a table', 'violet', 'languages'),
    beauty: slot('category-beauty', 'Beauty therapy students practising treatments in a training salon', 'rose', 'sparkles'),
    hairdressing: slot('category-hairdressing', 'Hairdressing students styling hair in a training salon', 'gold', 'palette'),
    construction: slot('category-construction', 'Building and construction students on a training site', 'slate', 'building'),
    'civil-construction': slot('category-civil-construction', 'Civil design students working on plans at computer workstations', 'sky', 'compass'),
  },
  campus: {
    city: slot('campus-city', 'Exterior of City Campus on a busy street', 'brand', 'building', 1600, 1000),
    riverside: slot('campus-riverside', 'Riverside Campus building beside a walking path', 'teal', 'building', 1600, 1000),
    parkview: slot('campus-parkview', 'Parkview Campus entrance with landscaped gardens', 'emerald', 'building', 1600, 1000),
  },
  facility: {
    library: slot('facility-library', 'Quiet study area in the campus library', 'brand', 'library', 1200, 900),
    computerLab: slot('facility-computer-lab', 'Computer lab with rows of workstations', 'sky', 'monitor', 1200, 900),
    kitchen: slot('facility-kitchen', 'Commercial training kitchen with stainless benches', 'gold', 'chef-hat', 1200, 900),
    classroom: slot('facility-classroom', 'Flexible classroom with movable desks and a large screen', 'violet', 'school', 1200, 900),
    lounge: slot('facility-lounge', 'Student lounge with sofas and a kitchenette', 'rose', 'coffee', 1200, 900),
    careLab: slot('facility-care-lab', 'Simulated care room used for practical training', 'emerald', 'stethoscope', 1200, 900),
  },
  life: {
    clubs: slot('life-clubs', 'Students at a club meeting in a common room', 'rose', 'users', 1200, 900),
    events: slot('life-events', 'Students enjoying a cultural celebration on campus', 'gold', 'sparkles', 1200, 900),
    study: slot('life-study', 'Peer study group working in a library', 'sky', 'book-open', 1200, 900),
    community: slot('life-community', 'Students volunteering at a community garden', 'emerald', 'sprout', 1200, 900),
    sport: slot('life-sport', 'Friendly game of basketball between students', 'brand', 'trophy', 1200, 900),
  },
  news: [
    slot('news-1', 'Students collecting enrolment packs at an information desk', 'brand', 'newspaper', 1600, 900),
    slot('news-2', 'New computer lab with students at workstations', 'sky', 'laptop', 1600, 900),
    slot('news-3', 'Cookery students preparing a community lunch', 'gold', 'chef-hat', 1600, 900),
    slot('news-4', 'Students at a careers and pathways information session', 'violet', 'route', 1600, 900),
    slot('news-5', 'Volunteers planting trees in a campus garden', 'emerald', 'sprout', 1600, 900),
    slot('news-6', 'Library study space with new seating', 'teal', 'library', 1600, 900),
  ],
  event: [
    slot('event-open-day', 'Visitors touring campus during an open day', 'brand', 'door-open', 1600, 900),
    slot('event-info-session', 'Online information session shown on a laptop screen', 'sky', 'video', 1600, 900),
    slot('event-orientation', 'Welcome banner for new students at orientation', 'gold', 'compass', 1600, 900),
    slot('event-workshop', 'Students in a hands-on study skills workshop', 'violet', 'notebook-pen', 1600, 900),
    slot('event-culture', 'Students sharing food at a multicultural festival', 'rose', 'sparkles', 1600, 900),
    slot('event-careers', 'Students talking with employers at a careers fair', 'emerald', 'briefcase', 1600, 900),
  ],
  /** Appended slots for content pages without a fitting `page` slot (add prompts to docs/IMAGE_PROMPTS.md). */
  pageExtra: {
    accreditation: slot('page-accreditation', 'Framed certificates and registration documents on an office wall', 'brand', 'badge-check'),
    entryRequirements: slot('page-entry-requirements', 'Applicant checking documents against a checklist with an adviser', 'sky', 'list-checks'),
  },
  /** Appended slots used only by the gallery albums (add prompts to docs/IMAGE_PROMPTS.md). */
  gallery: {
    courtyard: slot('gallery-courtyard', 'Students chatting at outdoor tables in a shaded campus courtyard', 'emerald', 'leaf', 1200, 900),
    orientation: slot('gallery-orientation', 'New students meeting classmates during an orientation activity', 'gold', 'compass', 1200, 900),
    showcase: slot('gallery-cookery-showcase', 'Cookery students presenting plated dishes at a showcase lunch', 'gold', 'chef-hat', 1200, 900),
    welcomeVideo: slot('gallery-welcome-video', 'Still frame from a campus welcome video showing the main entrance', 'brand', 'video', 1600, 900),
  },
} as const

const categorySlots = {
  business: 'category-business',
  english: 'category-english',
  beauty: 'category-beauty',
  hairdressing: 'category-hairdressing',
  construction: 'category-construction',
  'civil-construction': 'category-civil-construction',
} as const

/** Crops used when several courses share their study-area photo, so sibling cards differ. */
const FOCUS_POINTS = ['50% 50%', '30% 45%', '70% 45%', '50% 30%', '40% 60%']

/**
 * Every course shows a photo: a dedicated `course-<slug>` file when one exists, otherwise its
 * study-area photo with a per-course crop (see docs/IMAGE_PROMPTS.md §2 for the course slots).
 */
export function courseImage(courseSlug: string, category: keyof typeof categorySlots, alt: string): ImageAsset {
  const base = media.category[category]
  const id = `course-${courseSlug}`
  const own = providedImages[id]
  const file = own ?? providedImages[categorySlots[category]]
  const focus = own ? undefined : FOCUS_POINTS[hashString(courseSlug) % FOCUS_POINTS.length]
  return { ...base, slot: id, alt, src: file?.src ?? null, srcSet: file?.srcSet, concept: file?.concept, focus }
}

/** Portraits and logos must be real, approved files — never generated. Placeholders show initials. */
export function portrait(name: string): ImageAsset {
  return { src: null, alt: `Portrait of ${name}`, tone: 'slate', icon: 'user', width: 800, height: 1000 }
}

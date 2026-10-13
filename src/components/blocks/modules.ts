import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { ModuleName } from '@/api/types'
import type { ModuleComponentProps } from './types'

type ModuleComponent = LazyExoticComponent<ComponentType<ModuleComponentProps>>

function named<M extends Record<string, unknown>>(loader: () => Promise<M>, name: keyof M & string): ModuleComponent {
  return lazy(() => loader().then((m) => ({ default: m[name] as ComponentType<ModuleComponentProps> })))
}

const courses = () => import('@/features/courses/modules')
const campuses = () => import('@/features/campuses/modules')
const people = () => import('@/features/people/modules')
const support = () => import('@/features/support/modules')
const news = () => import('@/features/news/modules')
const enquiry = () => import('@/features/enquiry/modules')

/** Dynamic CMS modules. Each feature area is one lazily loaded chunk. */
export const moduleRegistry: Record<ModuleName, ModuleComponent> = {
  courseSearch: named(courses, 'CourseSearchModule'),
  categoryGrid: named(courses, 'CategoryGridModule'),
  featuredCourses: named(courses, 'FeaturedCoursesModule'),
  intakeExplorer: named(courses, 'IntakeExplorerModule'),
  feeExplorer: named(courses, 'FeeExplorerModule'),
  campusList: named(campuses, 'CampusListModule'),
  galleryAlbums: named(campuses, 'GalleryAlbumsModule'),
  teamDirectory: named(people, 'TeamDirectoryModule'),
  accreditations: named(people, 'AccreditationsModule'),
  partnerStrip: named(people, 'PartnerStripModule'),
  agentsDirectory: named(people, 'AgentsDirectoryModule'),
  scholarships: named(people, 'ScholarshipsModule'),
  testimonials: named(people, 'TestimonialsModule'),
  supportDirectory: named(support, 'SupportDirectoryModule'),
  orientationSessions: named(support, 'OrientationSessionsModule'),
  downloads: named(support, 'DownloadsModule'),
  policies: named(support, 'PoliciesModule'),
  faqDirectory: named(support, 'FaqDirectoryModule'),
  contactDirectory: named(support, 'ContactDirectoryModule'),
  latestNews: named(news, 'LatestNewsModule'),
  upcomingEvents: named(news, 'UpcomingEventsModule'),
  enquiryForm: named(enquiry, 'EnquiryFormModule'),
  agentEnquiryForm: named(enquiry, 'AgentEnquiryFormModule'),
}

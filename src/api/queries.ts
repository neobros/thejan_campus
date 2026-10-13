import { keepPreviousData, queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { api } from './client'
import type { ArticleQuery, CourseQuery, EventQuery, FeatureFlags, FeeQuery, IntakeQuery, ResourceQuery } from './types'

const LONG = 10 * 60_000

/** Query option factories — use with useQuery/useSuspenseQuery or queryClient.ensureQueryData in loaders. */
export const queries = {
  settings: () => queryOptions({ queryKey: ['settings'], queryFn: () => api.getSettings(), staleTime: LONG }),
  navigation: () => queryOptions({ queryKey: ['navigation'], queryFn: () => api.getNavigation(), staleTime: LONG }),
  page: (path: string) => queryOptions({ queryKey: ['page', path], queryFn: () => api.getPage(path) }),

  categories: () => queryOptions({ queryKey: ['categories'], queryFn: () => api.listCategories(), staleTime: LONG }),
  category: (slug: string) => queryOptions({ queryKey: ['category', slug], queryFn: () => api.getCategory(slug) }),
  courses: (query: CourseQuery) =>
    queryOptions({ queryKey: ['courses', query], queryFn: () => api.listCourses(query), placeholderData: keepPreviousData }),
  courseFilters: () => queryOptions({ queryKey: ['course-filters'], queryFn: () => api.getCourseFilterOptions(), staleTime: LONG }),
  course: (slug: string) => queryOptions({ queryKey: ['course', slug], queryFn: () => api.getCourse(slug) }),
  courseOptions: () => queryOptions({ queryKey: ['course-options'], queryFn: () => api.listCourseOptions(), staleTime: 60_000 }),
  intakes: (query: IntakeQuery) =>
    queryOptions({ queryKey: ['intakes', query], queryFn: () => api.listIntakes(query), placeholderData: keepPreviousData }),
  fees: (query: FeeQuery) => queryOptions({ queryKey: ['fees', query], queryFn: () => api.listFees(query), placeholderData: keepPreviousData }),

  campuses: () => queryOptions({ queryKey: ['campuses'], queryFn: () => api.listCampuses(), staleTime: LONG }),
  campus: (slug: string) => queryOptions({ queryKey: ['campus', slug], queryFn: () => api.getCampus(slug) }),

  articles: (query: ArticleQuery) =>
    queryOptions({ queryKey: ['articles', query], queryFn: () => api.listArticles(query), placeholderData: keepPreviousData }),
  article: (slug: string) => queryOptions({ queryKey: ['article', slug], queryFn: () => api.getArticle(slug) }),
  events: (query: EventQuery) =>
    queryOptions({ queryKey: ['events', query], queryFn: () => api.listEvents(query), placeholderData: keepPreviousData }),
  event: (slug: string) => queryOptions({ queryKey: ['event', slug], queryFn: () => api.getEvent(slug) }),
  gallery: () => queryOptions({ queryKey: ['gallery'], queryFn: () => api.listGalleryAlbums() }),
  testimonials: () => queryOptions({ queryKey: ['testimonials'], queryFn: () => api.listTestimonials() }),

  staff: () => queryOptions({ queryKey: ['staff'], queryFn: () => api.listStaff() }),
  accreditations: () => queryOptions({ queryKey: ['accreditations'], queryFn: () => api.listAccreditations() }),
  agents: () => queryOptions({ queryKey: ['agents'], queryFn: () => api.listAgents() }),
  scholarships: () => queryOptions({ queryKey: ['scholarships'], queryFn: () => api.listScholarships() }),

  supportServices: () => queryOptions({ queryKey: ['support-services'], queryFn: () => api.listSupportServices() }),
  orientationSessions: () => queryOptions({ queryKey: ['orientation-sessions'], queryFn: () => api.listOrientationSessions() }),
  resources: (query: ResourceQuery) =>
    queryOptions({ queryKey: ['resources', query], queryFn: () => api.listResources(query), placeholderData: keepPreviousData }),
  policies: () => queryOptions({ queryKey: ['policies'], queryFn: () => api.listPolicies() }),
  policy: (slug: string) => queryOptions({ queryKey: ['policy', slug], queryFn: () => api.getPolicy(slug) }),
  faqs: () => queryOptions({ queryKey: ['faqs'], queryFn: () => api.listFaqs() }),
  departments: () => queryOptions({ queryKey: ['departments'], queryFn: () => api.listDepartments() }),

  search: (q: string) =>
    queryOptions({ queryKey: ['search', q], queryFn: () => api.search(q), enabled: q.trim().length > 1, placeholderData: keepPreviousData }),
}

/** Settings and navigation are loaded by the root route loader, so these never suspend in practice. */
export function useSettings() {
  return useSuspenseQuery(queries.settings()).data
}

export function useNavigationData() {
  return useSuspenseQuery(queries.navigation()).data
}

export function useFeature(feature?: keyof FeatureFlags) {
  const settings = useSettings()
  return !feature || settings.features[feature]
}

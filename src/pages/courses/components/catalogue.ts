import type { Audience, CourseFilterOptions, CourseQuery, CourseSort, DeliveryMode } from '@/api/types'
import { formatMonth } from '@/lib/format'

/** Results per page — divisible by 2 and 3 so grids always end on a full row. */
export const PAGE_SIZE = 12

export const FILTER_KEYS = ['q', 'category', 'level', 'campus', 'mode', 'audience', 'intake'] as const
export type FilterKey = (typeof FILTER_KEYS)[number]
export type CatalogueView = 'grid' | 'list'

export interface CatalogueState {
  q: string
  category: string
  level: string
  campus: string
  mode: DeliveryMode | ''
  audience: Audience | ''
  intake: string
  sort: CourseSort
  page: number
  view: CatalogueView
}

export type FilterValues = Pick<CatalogueState, Exclude<FilterKey, 'q'>>

export const EMPTY_FILTERS: FilterValues = { category: '', level: '', campus: '', mode: '', audience: '', intake: '' }

export const SORT_OPTIONS: { value: CourseSort; label: string }[] = [
  { value: 'title', label: 'Title (A–Z)' },
  { value: 'next-intake', label: 'Next intake' },
  { value: 'level', label: 'Qualification level' },
]

export const FILTER_LABELS: Record<FilterKey, string> = {
  q: 'Search',
  category: 'Study area',
  level: 'Qualification',
  campus: 'Campus',
  mode: 'Delivery',
  audience: 'Student type',
  intake: 'Intake',
}

const MODES: DeliveryMode[] = ['on-campus', 'online', 'blended']
const AUDIENCES: Audience[] = ['domestic', 'international']
const SORTS: CourseSort[] = ['title', 'next-intake', 'level']

export function isAudience(value: unknown): value is Audience {
  return AUDIENCES.includes(value as Audience)
}

/** Read (and validate) the catalogue state from the URL — the single source of truth. */
export function parseCatalogue(params: URLSearchParams): CatalogueState {
  const get = (key: string) => params.get(key)?.trim() ?? ''
  const mode = get('mode')
  const audience = get('audience')
  const sort = get('sort')
  const intake = get('intake')
  const page = Number.parseInt(get('page'), 10)
  return {
    q: get('q'),
    category: get('category'),
    level: get('level'),
    campus: get('campus'),
    mode: MODES.includes(mode as DeliveryMode) ? (mode as DeliveryMode) : '',
    audience: isAudience(audience) ? audience : '',
    intake: /^\d{4}-\d{2}$/.test(intake) ? intake : '',
    sort: SORTS.includes(sort as CourseSort) ? (sort as CourseSort) : 'title',
    page: Number.isFinite(page) && page > 1 ? page : 1,
    view: get('view') === 'list' ? 'list' : 'grid',
  }
}

/** The exact query used by both the route loader and the page (same cache key). */
export function toCourseQuery(state: CatalogueState): CourseQuery {
  const query: CourseQuery = { sort: state.sort, page: state.page, pageSize: PAGE_SIZE }
  if (state.q) query.q = state.q
  if (state.category) query.category = state.category
  if (state.level) query.level = state.level
  if (state.campus) query.campus = state.campus
  if (state.mode) query.mode = state.mode
  if (state.audience) query.audience = state.audience
  if (state.intake) query.intake = state.intake
  return query
}

export function activeFilterCount(state: Pick<CatalogueState, FilterKey>, includeSearch = true) {
  return FILTER_KEYS.filter((key) => (key === 'q' ? includeSearch : true) && state[key]).length
}

/** Human label for a filter value, falling back gracefully for values not in the option list. */
export function filterValueLabel(key: FilterKey, value: string, options?: CourseFilterOptions) {
  if (!value) return ''
  switch (key) {
    case 'q':
      return `“${value}”`
    case 'category':
      return options?.categories.find((o) => o.value === value)?.label ?? value
    case 'level':
      return options?.levels.find((o) => o.value === value)?.label ?? value
    case 'campus':
      return options?.campuses.find((o) => o.value === value)?.label ?? value
    case 'mode':
      return options?.modes.find((o) => o.value === value)?.label ?? value
    case 'audience':
      return options?.audiences.find((o) => o.value === value)?.label ?? value
    case 'intake':
      return `Starting ${options?.intakeMonths.find((o) => o.value === value)?.label ?? formatMonth(`${value}-01`)}`
  }
}

/* The loader blocks on the first results only when the catalogue is not already on screen, so
 * refining filters updates the URL instantly while the list keeps (and then animates) its results. */
let mountedCatalogues = 0

export function registerCatalogueMount() {
  mountedCatalogues += 1
  return () => {
    mountedCatalogues -= 1
  }
}

export function isCatalogueMounted() {
  return mountedCatalogues > 0
}

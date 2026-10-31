import type { ComponentType } from 'react'
import { createBrowserRouter, type LoaderFunction, type RouteObject } from 'react-router'
import { queries } from '@/api/queries'
import { RootLayout } from '@/components/layout/RootLayout'
import { setFormatLocale } from '@/lib/format'
import { BootScreen, RootErrorBoundary, RouteErrorBoundary } from '@/pages/errors'
import { queryClient } from './queryClient'

type PageModule = { default: ComponentType; loader?: LoaderFunction }

/** Lazy route: each page is its own chunk; a module may export a `loader`. */
function page(load: () => Promise<PageModule>): Pick<RouteObject, 'lazy'> {
  return {
    lazy: async () => {
      const module = await load()
      return module.loader ? { Component: module.default, loader: module.loader } : { Component: module.default }
    },
  }
}

const contentPage = () => import('@/pages/ContentPage')

/** CMS-driven pages (spec §4). Conditional pages 404 automatically when the CMS does not publish them. */
const CONTENT_PATHS = [
  'how-it-works',
  'about',
  'about/team',
  'partners',
  'admissions',
  'admissions/entry-requirements',
  'admissions/fees',
  'admissions/intakes',
  'admissions/scholarships',
  'admissions/credit-transfer',
  'international',
  'international/pre-arrival',
  'international/living-and-studying',
  'international/agents',
  'domestic',
  'student-life',
  'student-support',
  'student-support/orientation',
  'student-resources',
  'downloads',
  'policies',
  'faq',
  'campuses',
  'gallery',
  'contact',
  'privacy',
  'terms',
  'accessibility',
]

async function rootLoader() {
  const [settings] = await Promise.all([
    queryClient.ensureQueryData(queries.settings()),
    queryClient.ensureQueryData(queries.navigation()),
  ])
  setFormatLocale(settings.locale)
  return null
}

export const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    loader: rootLoader,
    shouldRevalidate: () => false,
    Component: RootLayout,
    ErrorBoundary: RootErrorBoundary,
    HydrateFallback: BootScreen,
    children: [
      {
        ErrorBoundary: RouteErrorBoundary,
        children: [
          { index: true, ...page(() => import('@/pages/HomePage')) },
          ...CONTENT_PATHS.map((path) => ({ path, ...page(contentPage) })),
          { path: 'courses', ...page(() => import('@/pages/courses/CoursesPage')) },
          { path: 'courses/category/:slug', ...page(() => import('@/pages/courses/CourseCategoryPage')) },
          { path: 'courses/:slug', ...page(() => import('@/pages/courses/CourseDetailPage')) },
          { path: 'campuses/:slug', ...page(() => import('@/pages/campuses/CampusDetailPage')) },
          { path: 'news', ...page(() => import('@/pages/news/NewsPage')) },
          { path: 'news/:slug', ...page(() => import('@/pages/news/ArticlePage')) },
          { path: 'events', ...page(() => import('@/pages/events/EventsPage')) },
          { path: 'events/:slug', ...page(() => import('@/pages/events/EventPage')) },
          { path: 'policies/:slug', ...page(() => import('@/pages/policies/PolicyPage')) },
          { path: 'apply', ...page(() => import('@/pages/apply/ApplyPage')) },
          { path: 'apply/confirmation', ...page(() => import('@/pages/apply/ApplyConfirmationPage')) },
          { path: 'enquire', ...page(() => import('@/pages/EnquirePage')) },
          { path: 'search', ...page(() => import('@/pages/SearchPage')) },
          { path: '*', ...page(() => import('@/pages/NotFoundPage')) },
        ],
      },
    ],
  },
])

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
          // Pre-launch: only Home and About AIT are live. Every other route shows the branded
          // Coming Soon screen until the remaining pages are ready to publish.
          { index: true, ...page(() => import('@/pages/HomePage')) },
          { path: 'about', ...page(() => import('@/pages/AboutPage')) },
          { path: '*', ...page(() => import('@/pages/ComingSoonPage')) },
        ],
      },
    ],
  },
])

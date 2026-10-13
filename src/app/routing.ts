import { useQuery } from '@tanstack/react-query'
import { data, type LoaderFunctionArgs } from 'react-router'
import { isNotFound } from '@/api/errors'
import { queries } from '@/api/queries'
import type { Page } from '@/api/types'
import { queryClient } from './queryClient'

/**
 * Bespoke pages (courses, news, events, apply…) can take optional hero copy, an image and extra
 * blocks from a CMS page with the same path. Call in the loader so the hero renders without a flash.
 */
export async function prefetchOptionalPage(path: string) {
  try {
    await queryClient.ensureQueryData(queries.page(path))
  } catch {
    /* optional — the page falls back to built-in copy */
  }
}

export function useOptionalPage(path: string): Page | undefined {
  return useQuery({ ...queries.page(path), retry: false, staleTime: 5 * 60_000 }).data
}

/** Path of the current request without leading/trailing slashes ("" for the home page). */
export function pathOf(request: Request) {
  return decodeURIComponent(new URL(request.url).pathname).replace(/^\/+|\/+$/g, '')
}

/** Convert API "not found" errors into a 404 route response so the error boundary shows the 404 page. */
export async function orNotFound<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise
  } catch (error) {
    if (isNotFound(error)) throw data('Not found', { status: 404 })
    throw error
  }
}

/** Shared loader for CMS-driven pages. */
export async function contentPageLoader({ request }: LoaderFunctionArgs) {
  const path = pathOf(request) || 'home'
  await orNotFound(queryClient.ensureQueryData(queries.page(path)))
  return { path }
}

export { queryClient }

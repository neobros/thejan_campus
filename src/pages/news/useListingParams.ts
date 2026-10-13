import { useCallback, useMemo } from 'react'
import { useLocation, useNavigation, useSearchParams } from 'react-router'

/**
 * URL filter state for listing pages (news, events, search). While a filter navigation is still
 * loading (the route loader prefetches the next results), the *pending* params are returned so
 * chips, tabs and selects respond instantly. `pending` lets the list dim itself meanwhile.
 */
export function useListingParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigation = useNavigation()
  const { pathname } = useLocation()
  const pendingLocation = navigation.state === 'loading' && navigation.location.pathname === pathname ? navigation.location : null
  const pendingSearch = pendingLocation?.search
  const params = useMemo(
    () => (pendingSearch !== undefined ? new URLSearchParams(pendingSearch) : searchParams),
    [pendingSearch, searchParams],
  )

  const update = useCallback(
    (changes: Record<string, string | null | undefined>) => {
      const next = new URLSearchParams(params)
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      setSearchParams(next, { replace: true, preventScrollReset: true })
    },
    [params, setSearchParams],
  )

  return { params, update, pending: pendingLocation !== null }
}

/** Positive integer page number from the URL (defaults to 1). */
export function pageParam(params: URLSearchParams) {
  const page = Number(params.get('page'))
  return Number.isInteger(page) && page > 1 ? page : 1
}

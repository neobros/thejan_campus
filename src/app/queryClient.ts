import { QueryClient } from '@tanstack/react-query'
import { isApiError } from '@/api/errors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,
      gcTime: 30 * 60_000,
      refetchOnWindowFocus: false,
      // Never retry "not found" or validation responses; retry transient failures twice.
      retry: (failureCount, error) => !(isApiError(error) && error.status < 500) && failureCount < 2,
    },
  },
})

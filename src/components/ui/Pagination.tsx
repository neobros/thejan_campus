import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocation } from 'react-router'
import { cn } from '@/lib/cn'
import { AppLink } from './AppLink'

function pageWindow(current: number, count: number): (number | 'gap')[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const pages = new Set([1, count, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b)
  const result: (number | 'gap')[] = []
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push('gap')
    result.push(page)
  })
  return result
}

/** Link-based pagination that keeps the other URL filters intact. */
export function Pagination({ page, pageCount, className, param = 'page' }: { page: number; pageCount: number; className?: string; param?: string }) {
  const location = useLocation()
  if (pageCount <= 1) return null
  const hrefFor = (target: number) => {
    const params = new URLSearchParams(location.search)
    if (target <= 1) params.delete(param)
    else params.set(param, String(target))
    const query = params.toString()
    return `${location.pathname}${query ? `?${query}` : ''}`
  }
  const item = 'grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-medium transition-colors'
  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1.5', className)}>
      {page > 1 ? (
        <AppLink href={hrefFor(page - 1)} className={cn(item, 'gap-1 text-ink-muted hover:bg-surface-muted hover:text-ink')} aria-label="Previous page">
          <ChevronLeft aria-hidden className="size-4" />
        </AppLink>
      ) : (
        <span className={cn(item, 'text-ink-subtle/50')} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}
      {pageWindow(page, pageCount).map((entry, i) =>
        entry === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-ink-subtle" aria-hidden>
            …
          </span>
        ) : (
          <AppLink
            key={entry}
            href={hrefFor(entry)}
            aria-current={entry === page ? 'page' : undefined}
            aria-label={`Page ${entry}`}
            className={cn(item, entry === page ? 'bg-primary text-on-primary shadow-sm' : 'text-ink-muted hover:bg-surface-muted hover:text-ink')}
          >
            {entry}
          </AppLink>
        ),
      )}
      {page < pageCount ? (
        <AppLink href={hrefFor(page + 1)} className={cn(item, 'text-ink-muted hover:bg-surface-muted hover:text-ink')} aria-label="Next page">
          <ChevronRight aria-hidden className="size-4" />
        </AppLink>
      ) : (
        <span className={cn(item, 'text-ink-subtle/50')} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  )
}

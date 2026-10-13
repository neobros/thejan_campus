import { ChevronRight, House } from 'lucide-react'
import { env } from '@/config/env'
import { cn } from '@/lib/cn'
import { JsonLd } from '@/lib/seo'
import { AppLink } from './AppLink'

export interface Crumb {
  label: string
  href?: string
}

export function Breadcrumbs({ items, className, onDark }: { items: Crumb[]; className?: string; onDark?: boolean }) {
  const trail: Crumb[] = [{ label: 'Home', href: '/' }, ...items]
  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight aria-hidden className={cn('size-3.5', onDark ? 'text-white/40' : 'text-ink-subtle/70')} />}
              {last || !crumb.href ? (
                <span aria-current={last ? 'page' : undefined} className={cn('font-medium', onDark ? 'text-white' : 'text-ink')}>
                  {crumb.label}
                </span>
              ) : (
                <AppLink
                  href={crumb.href}
                  className={cn(
                    'inline-flex items-center gap-1 rounded transition-colors',
                    onDark ? 'text-white/70 hover:text-white' : 'text-ink-muted hover:text-primary-ink',
                  )}
                >
                  {index === 0 && <House aria-hidden className="size-3.5" />}
                  {index === 0 ? <span className="sr-only sm:not-sr-only">{crumb.label}</span> : crumb.label}
                </AppLink>
              )}
            </li>
          )
        })}
      </ol>
      {env.siteUrl && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: trail
              .filter((c) => c.href)
              .map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: `${env.siteUrl}${c.href}` })),
          }}
        />
      )}
    </nav>
  )
}

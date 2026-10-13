import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('skeleton rounded-xl', className)} />
}

/** Accessible loading region: announces "Loading…" once, shows skeletons visually. */
export function LoadingRegion({ label = 'Loading', children, className }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">{label}…</span>
      {children}
    </div>
  )
}

export function CardGridSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <LoadingRegion className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl border border-line bg-surface">
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="space-y-3 p-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </LoadingRegion>
  )
}

export function EmptyState({
  icon: IconComponent = Info,
  title,
  description,
  actions,
  className,
}: {
  icon?: LucideIcon
  title: string
  description?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative overflow-hidden rounded-3xl border border-dashed border-line-strong/50 bg-surface px-6 py-14 text-center', className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-60 mask-fade-radial" />
      <div className="relative mx-auto max-w-md">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-primary-soft text-on-primary-soft ring-8 ring-primary-soft/40">
          <IconComponent aria-hidden className="size-6" />
        </div>
        <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
        {description && <div className="mt-2 text-ink-muted">{description}</div>}
        {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
      </div>
    </div>
  )
}

const calloutTones = {
  info: { icon: Info, box: 'border-primary/25 bg-primary-soft/60', icon_: 'text-primary-ink', title: 'text-ink' },
  success: { icon: CircleCheck, box: 'border-success/30 bg-success-soft', icon_: 'text-success', title: 'text-ink' },
  warning: { icon: TriangleAlert, box: 'border-warning/30 bg-warning-soft', icon_: 'text-warning', title: 'text-ink' },
  danger: { icon: CircleAlert, box: 'border-danger/30 bg-danger-soft', icon_: 'text-danger', title: 'text-ink' },
} as const

export type CalloutTone = keyof typeof calloutTones

export function Callout({
  tone = 'info',
  title,
  children,
  action,
  className,
  role,
}: {
  tone?: CalloutTone
  title?: ReactNode
  children?: ReactNode
  action?: ReactNode
  className?: string
  role?: 'alert' | 'status'
}) {
  const t = calloutTones[tone]
  const IconComponent = t.icon
  return (
    <div role={role} className={cn('flex gap-4 rounded-2xl border p-5 sm:p-6', t.box, className)}>
      <IconComponent aria-hidden className={cn('mt-0.5 size-5 shrink-0', t.icon_)} />
      <div className="min-w-0 flex-1">
        {title && <p className={cn('font-semibold', t.title)}>{title}</p>}
        {children && <div className={cn('text-[0.9375rem] leading-relaxed text-ink-muted', title && 'mt-1')}>{children}</div>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}

/** Inline error panel with retry, for failed data requests (spec §5.27 "unavailable services"). */
export function ErrorPanel({ title = 'This section could not be loaded', onRetry, className }: { title?: string; onRetry?: () => void; className?: string }) {
  return (
    <Callout
      tone="warning"
      role="alert"
      title={title}
      className={className}
      action={
        onRetry ? (
          <button type="button" onClick={onRetry} className="text-sm font-semibold text-primary-ink underline-offset-4 hover:underline">
            Try again
          </button>
        ) : undefined
      }
    >
      Please check your connection and try again. If the problem continues, contact us and we will help.
    </Callout>
  )
}

import { useQuery } from '@tanstack/react-query'
import { Award, CalendarCheck, CalendarClock, Check, ClipboardList, Mail, Minus, Scale } from 'lucide-react'
import { useState } from 'react'
import { queries } from '@/api/queries'
import type { Scholarship } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import type { ModuleComponentProps } from '@/components/blocks/types'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Tabs, TabsContent, TabsList } from '@/components/ui/Tabs'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import { daysUntil, formatDate, relativeDays } from '@/lib/format'
import { enquireHref } from '@/lib/links'
import { ContactText } from '@/features/support/components/contact'
import { Disclosure } from '@/features/support/components/Disclosure'

type Status = Scholarship['status']
type Filter = Status | 'all'

const STATUS: Record<Status, { label: string; tone: BadgeTone; tab: string }> = {
  open: { label: 'Open for applications', tone: 'success', tab: 'Open' },
  upcoming: { label: 'Opening soon', tone: 'accent', tab: 'Upcoming' },
  closed: { label: 'Closed', tone: 'neutral', tab: 'Closed' },
}

/** Dates win over a stale status: an expired round is always shown as closed (spec §5.11). */
function effectiveStatus(s: Scholarship): Status {
  if (s.status === 'closed' || daysUntil(s.closesAt) < 0) return 'closed'
  if (s.status === 'upcoming' || daysUntil(s.opensAt) > 0) return 'upcoming'
  return 'open'
}

function List({ items, icon, tone }: { items: string[]; icon: 'check' | 'minus'; tone: 'success' | 'muted' }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-ink-muted">
          <span
            aria-hidden
            className={cn('mt-1 grid size-5 shrink-0 place-items-center rounded-full', tone === 'success' ? 'bg-success-soft text-success' : 'bg-surface-muted text-ink-subtle ring-1 ring-line')}
          >
            {icon === 'check' ? <Check strokeWidth={3} className="size-3" /> : <Minus strokeWidth={3} className="size-3" />}
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

function Label({ children }: { children: string }) {
  return <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">{children}</h4>
}

function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  const status = effectiveStatus(scholarship)
  const closed = status === 'closed'
  const meta = STATUS[status]
  const days = daysUntil(scholarship.closesAt)
  return (
    <article
      className={cn(
        'overflow-hidden rounded-[1.75rem] border shadow-card transition-[box-shadow,border-color] duration-500',
        closed ? 'border-dashed border-line-strong/50 bg-surface-muted' : 'border-line bg-surface hover:border-primary/30 hover:shadow-card-hover',
      )}
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={meta.tone} dot>
            {meta.label}
          </Badge>
          <span className="text-sm text-ink-subtle">Offered by {scholarship.sponsor}</span>
        </div>
        <h3 className={cn('mt-3 font-display text-2xl font-semibold leading-tight sm:text-[1.75rem]', closed ? 'text-ink-muted' : 'text-ink')}>{scholarship.name}</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <div className={cn('rounded-2xl p-4', closed ? 'bg-surface' : 'bg-accent-soft')}>
            <p className={cn('text-xs font-semibold uppercase tracking-[0.14em]', closed ? 'text-ink-subtle' : 'text-on-accent-soft')}>Value</p>
            <p className="mt-1 font-semibold leading-snug text-ink">{scholarship.value}</p>
          </div>
          <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-line p-4 text-sm">
            <div>
              <dt className="inline-flex items-center gap-1.5 text-ink-subtle">
                <CalendarCheck aria-hidden className="size-3.5" />
                Opens
              </dt>
              <dd className="mt-0.5 font-semibold text-ink">
                <time dateTime={scholarship.opensAt}>{formatDate(scholarship.opensAt, 'medium')}</time>
              </dd>
            </div>
            <div>
              <dt className="inline-flex items-center gap-1.5 text-ink-subtle">
                <CalendarClock aria-hidden className="size-3.5" />
                Closes
              </dt>
              <dd className="mt-0.5 font-semibold text-ink">
                <time dateTime={scholarship.closesAt}>{formatDate(scholarship.closesAt, 'medium')}</time>
              </dd>
            </div>
            <p className="col-span-2 text-ink-muted">
              {closed
                ? 'This round has closed.'
                : status === 'upcoming'
                  ? `Applications open ${relativeDays(scholarship.opensAt)}.`
                  : days === 0
                    ? 'Closes today.'
                    : `Closes ${relativeDays(scholarship.closesAt)}.`}
            </p>
          </dl>
        </div>

        <div className="mt-7 grid gap-7 md:grid-cols-2">
          {scholarship.eligibility.length > 0 && (
            <section>
              <Label>Who can apply</Label>
              <List items={scholarship.eligibility} icon="check" tone={closed ? 'muted' : 'success'} />
            </section>
          )}
          {scholarship.covers.length > 0 && (
            <section>
              <Label>What it covers</Label>
              <List items={scholarship.covers} icon="check" tone={closed ? 'muted' : 'success'} />
            </section>
          )}
        </div>

        <section className="mt-7 rounded-2xl bg-canvas-alt p-5">
          <h4 className="inline-flex items-center gap-2 font-semibold text-ink">
            <ClipboardList aria-hidden className="size-4 text-primary-ink" />
            How to apply
          </h4>
          <p className="mt-2 leading-relaxed text-ink-muted">{scholarship.howToApply}</p>
        </section>

        <Disclosure label="Exclusions and selection process" className="mt-5">
          <div className="grid gap-6 rounded-2xl border border-line p-5 md:grid-cols-2">
            {scholarship.exclusions.length > 0 && (
              <section>
                <Label>Not covered</Label>
                <List items={scholarship.exclusions} icon="minus" tone="muted" />
              </section>
            )}
            <section>
              <h4 className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                <Scale aria-hidden className="size-3.5" />
                Selection process
              </h4>
              <p className="leading-relaxed text-ink-muted">{scholarship.selection}</p>
            </section>
          </div>
        </Disclosure>
      </div>
      <div className="flex flex-col gap-3 border-t border-line px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="flex items-start gap-2 text-ink-muted">
          <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
          <span>
            <span className="font-semibold text-ink">Questions? </span>
            <ContactText text={scholarship.contact} />
          </span>
        </p>
        {!closed && (
          <ButtonLink href={enquireHref({ topic: 'fees' })} variant="secondary" size="sm" className="shrink-0">
            Ask about this scholarship
          </ButtonLink>
        )}
      </div>
    </article>
  )
}

function ScholarshipList({ items, filter }: { items: Scholarship[]; filter: Filter }) {
  if (!items.length) {
    const word = filter === 'all' ? '' : `${STATUS[filter].tab.toLowerCase()} `
    return (
      <EmptyState
        icon={Award}
        title={`No ${word}scholarships right now`}
        description="New opportunities are listed here as soon as they are approved. Check the other tabs or ask us about funding options."
      />
    )
  }
  return (
    <Stagger className="space-y-6" immediate>
      {items.map((s) => (
        <StaggerItem key={s.id}>
          <ScholarshipCard scholarship={s} />
        </StaggerItem>
      ))}
    </Stagger>
  )
}

/** Approved scholarships with status tabs (spec §5.11). Closed rounds stay visible and clearly labelled. */
export function ScholarshipsModule({ block, className }: ModuleComponentProps) {
  const { data, isPending, isError, refetch } = useQuery(queries.scholarships())
  const [filter, setFilter] = useState<Filter>('all')
  const order: Record<Status, number> = { open: 0, upcoming: 1, closed: 2 }
  const scholarships = [...(data ?? [])].sort(
    (a, b) => order[effectiveStatus(a)] - order[effectiveStatus(b)] || a.closesAt.localeCompare(b.closesAt),
  )
  const count = (status: Filter) => (status === 'all' ? scholarships.length : scholarships.filter((s) => effectiveStatus(s) === status).length)
  const filters: Filter[] = ['all', 'open', 'upcoming', 'closed']

  return (
    <ModuleSection block={block} className={className}>
      {isPending ? (
        <LoadingRegion className="space-y-6">
          <Skeleton className="h-12 w-80 max-w-full rounded-full" />
          {Array.from({ length: 2 }, (_, i) => (
            <Skeleton key={i} className="h-96 rounded-[1.75rem]" />
          ))}
        </LoadingRegion>
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : scholarships.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No scholarships are available at the moment"
          description="Approved scholarships will be listed here with eligibility, key dates and how to apply. Ask our admissions team about other ways to plan your study costs."
          actions={
            <ButtonLink href={enquireHref({ topic: 'fees' })} variant="primary">
              Ask about funding
            </ButtonLink>
          }
        />
      ) : (
        <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
          <TabsList
            label="Scholarship status"
            value={filter}
            className="mb-8"
            options={filters.map((f) => ({ value: f, label: f === 'all' ? 'All' : STATUS[f].tab, count: count(f) }))}
          />
          {filters.map((f) => (
            <TabsContent key={f} value={f}>
              <ScholarshipList items={f === 'all' ? scholarships : scholarships.filter((s) => effectiveStatus(s) === f)} filter={f} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </ModuleSection>
  )
}

import { useQuery } from '@tanstack/react-query'
import { CalendarDays, CalendarX, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'
import type { LoaderFunctionArgs } from 'react-router'
import { queries } from '@/api/queries'
import type { EventQuery, EventSummary } from '@/api/types'
import { prefetchOptionalPage, queryClient, useOptionalPage } from '@/app/routing'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Dropdown } from '@/components/ui/Dropdown'
import { Pagination } from '@/components/ui/Pagination'
import { Section } from '@/components/ui/Section'
import { Tabs, TabsContent, TabsList } from '@/components/ui/Tabs'
import { EventCard } from '@/components/shared/cards'
import { PageHero } from '@/components/shared/PageHero'
import { cn } from '@/lib/cn'
import { formatMonth, timeZoneLabel } from '@/lib/format'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { Seo } from '@/lib/seo'
import { pageParam, useListingParams } from '@/pages/news/useListingParams'

type When = 'upcoming' | 'past'
const PAGE_SIZE = 12

function eventQuery(params: URLSearchParams): EventQuery & { when: When } {
  return {
    when: params.get('when') === 'past' ? 'past' : 'upcoming',
    campus: params.get('campus') || undefined,
    type: params.get('type') || undefined,
    page: pageParam(params),
    pageSize: PAGE_SIZE,
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const query = eventQuery(new URL(request.url).searchParams)
  await Promise.all([
    prefetchOptionalPage('events'),
    queryClient.prefetchQuery(queries.events(query)),
    queryClient.prefetchQuery(queries.events({ when: query.when, pageSize: 48 })),
  ])
  return null
}

/** Calendar month of an event in its own (campus) timezone. */
function monthKey(event: EventSummary) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: event.timezone, year: 'numeric', month: '2-digit' }).format(new Date(event.start))
}

function groupByMonth(events: EventSummary[]) {
  const groups: { key: string; label: string; events: EventSummary[] }[] = []
  for (const event of events) {
    const key = monthKey(event)
    const last = groups[groups.length - 1]
    if (last?.key === key) last.events.push(event)
    else groups.push({ key, label: formatMonth(`${key}-01`), events: [event] })
  }
  return groups
}

function EventResults({
  query,
  filtered,
  onClear,
}: {
  query: ReturnType<typeof eventQuery>
  filtered: boolean
  onClear: () => void
}) {
  const { pending } = useListingParams()
  const { data, isPending, isError, isPlaceholderData, refetch } = useQuery(queries.events(query))
  const past = query.when === 'past'
  const groups = useMemo(() => groupByMonth(data?.items ?? []), [data])

  if (isPending) {
    return (
      <LoadingRegion label="Loading events" className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-44 rounded-[1.75rem]" />
        ))}
      </LoadingRegion>
    )
  }
  if (isError) return <ErrorPanel title="Events could not be loaded" onRetry={() => refetch()} />

  if (data.items.length === 0) {
    if (filtered) {
      return (
        <EmptyState
          icon={CalendarX}
          title="No events match these filters"
          description={past ? 'Try another campus or event type.' : 'Try another campus or event type, or look back at past events.'}
          actions={
            <>
              <Button variant="primary" onClick={onClear}>
                Clear filters
              </Button>
              {!past && (
                <ButtonLink href="/events?when=past" variant="secondary" preventScrollReset>
                  Past events
                </ButtonLink>
              )}
            </>
          }
        />
      )
    }
    return past ? (
      <EmptyState icon={CalendarDays} title="No past events to show" description="Events appear here once they have finished." />
    ) : (
      <EmptyState
        icon={CalendarDays}
        title="No upcoming events"
        description="New open days, information sessions and workshops are added regularly. In the meantime, look back at recent events or ask us about a campus visit."
        actions={
          <>
            <ButtonLink href="/events?when=past" variant="secondary" preventScrollReset>
              Browse past events
            </ButtonLink>
            <ButtonLink href="/enquire?topic=campus" variant="primary">
              Ask about a visit
            </ButtonLink>
          </>
        }
      />
    )
  }

  const zones = [...new Set(data.items.map((e) => timeZoneLabel(e.timezone, new Date(e.start))))]
  const busy = pending || isPlaceholderData
  return (
    <div aria-busy={busy || undefined} className={cn('transition-opacity duration-300', busy && 'opacity-60')}>
      <p aria-live="polite" className="mb-8 text-sm text-ink-subtle">
        {data.total} {past ? 'past' : 'upcoming'} {data.total === 1 ? 'event' : 'events'} · Times shown in campus local time ({zones.join(', ')})
      </p>
      <div className="space-y-12">
        <AnimatePresence mode="popLayout" initial={false}>
          {groups.map((group) => (
            <motion.section
              key={group.key}
              layout
              aria-labelledby={`month-${group.key}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
              <h2 id={`month-${group.key}`} className="mb-5 flex items-center gap-4 font-display text-2xl font-semibold text-ink">
                {group.label}
                <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-line to-transparent" />
              </h2>
              <ul className="grid gap-5 lg:grid-cols-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  {group.events.map((event, index) => (
                    <motion.li
                      key={event.slug}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.05, ease: EASE_OUT_EXPO }}
                    >
                      <EventCard event={event} past={past} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </motion.section>
          ))}
        </AnimatePresence>
      </div>
      <Pagination page={data.page} pageCount={data.pageCount} className="mt-14" />
    </div>
  )
}

export default function EventsPage() {
  const cms = useOptionalPage('events')
  const { params, update } = useListingParams()
  const query = eventQuery(params)
  const { data: all } = useQuery(queries.events({ when: query.when, pageSize: 48 }))
  const filtered = Boolean(query.campus || query.type)

  const options = useMemo(() => {
    const campuses = new Map<string, string>()
    const types = new Set<string>()
    for (const event of all?.items ?? []) {
      if (event.campus) campuses.set(event.campus.slug, event.campus.name)
      types.add(event.type)
    }
    if (query.campus && !campuses.has(query.campus)) campuses.set(query.campus, query.campus)
    if (query.type) types.add(query.type)
    return {
      campuses: [...campuses.entries()].sort((a, b) => a[1].localeCompare(b[1])),
      types: [...types].sort((a, b) => a.localeCompare(b)),
    }
  }, [all, query.campus, query.type])

  const clear = () => update({ campus: null, type: null, page: null })
  const results = <EventResults query={query} filtered={filtered} onClear={clear} />

  return (
    <>
      <Seo
        title={cms?.seo?.title ?? cms?.title ?? 'Events'}
        description={cms?.seo?.description ?? cms?.summary ?? 'Open days, information sessions, workshops and student events.'}
        image={cms?.seo?.image}
      />
      <PageHero
        title={cms?.title ?? 'Events & *open days*'}
        eyebrow={cms?.eyebrow ?? 'Events'}
        summary={cms?.summary ?? 'Open days, information sessions, orientation and workshops across our campuses and online.'}
        breadcrumbs={[{ label: 'Events' }]}
        image={cms?.hero?.image}
        actions={cms?.hero?.actions}
      />

      <Section>
        <Tabs value={query.when} onValueChange={(value) => update({ when: value === 'past' ? 'past' : null, page: null })}>
          <div className="mb-8 flex flex-col gap-5 rounded-[1.75rem] border border-line bg-surface p-4 shadow-card sm:p-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Show</p>
              <TabsList<When>
                label="Upcoming or past events"
                value={query.when}
                options={[
                  { value: 'upcoming', label: 'Upcoming' },
                  { value: 'past', label: 'Past events' },
                ]}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end lg:min-w-[34rem]">
              <Dropdown
                label="Campus"
                value={query.campus ?? ''}
                onChange={(value) => update({ campus: value, page: null })}
                anyLabel="All campuses"
                options={options.campuses.map(([slug, name]) => ({ value: slug, label: name }))}
              />
              <Dropdown
                label="Event type"
                value={query.type ?? ''}
                onChange={(value) => update({ type: value, page: null })}
                anyLabel="All event types"
                options={options.types.map((type) => ({ value: type, label: type }))}
              />
              <Button
                variant="ghost"
                onClick={clear}
                disabled={!filtered}
                icon={<X aria-hidden className="size-4" />}
                className={cn('h-12', !filtered && 'invisible')}
                aria-hidden={!filtered || undefined}
                tabIndex={filtered ? undefined : -1}
              >
                Clear
              </Button>
            </div>
          </div>
          <TabsContent value="upcoming">{query.when === 'upcoming' && results}</TabsContent>
          <TabsContent value="past">{query.when === 'past' && results}</TabsContent>
        </Tabs>
      </Section>

      {cms && <BlockRenderer blocks={cms.blocks} />}
    </>
  )
}

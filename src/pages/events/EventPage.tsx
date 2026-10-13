import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import {
  Accessibility,
  ArrowLeft,
  CalendarClock,
  CalendarPlus,
  Clock,
  ExternalLink,
  Info,
  MapPin,
  Ticket,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useParams, type LoaderFunctionArgs } from 'react-router'
import { toast } from 'sonner'
import { queries, useSettings } from '@/api/queries'
import type { EventItem } from '@/api/types'
import { orNotFound, queryClient } from '@/app/routing'
import { AppLink } from '@/components/ui/AppLink'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Callout, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Markdown } from '@/components/ui/Markdown'
import { Section, SectionHeader } from '@/components/ui/Section'
import { SmartImage } from '@/components/ui/SmartImage'
import { EventCard } from '@/components/shared/cards'
import { Aurora, GridBackdrop } from '@/components/motion/effects'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { TextReveal } from '@/components/motion/TextReveal'
import { env } from '@/config/env'
import { cn } from '@/lib/cn'
import { dateParts, formatDateTime, formatDateTimeRange, formatTime, timeZoneCity, timeZoneLabel } from '@/lib/format'
import { enquireHref } from '@/lib/links'
import { JsonLd, plainText, Seo } from '@/lib/seo'
import { ContactText } from '@/pages/policies/ContactText'
import { buildIcs, downloadIcs } from './ics'

export async function loader({ params }: LoaderFunctionArgs) {
  await orNotFound(queryClient.ensureQueryData(queries.event(params.slug!)))
  return null
}

const isOnline = (event: EventItem) => !event.campus && /online|virtual|webinar/i.test(event.location)

function eventJsonLd(event: EventItem, organizer: string) {
  const url = env.siteUrl ? `${env.siteUrl}/events/${event.slug}` : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: plainText(event.title),
    description: event.summary,
    startDate: event.start,
    endDate: event.end,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: isOnline(event) ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
    location: isOnline(event)
      ? { '@type': 'VirtualLocation', url: event.registration?.url ?? url }
      : { '@type': 'Place', name: event.campus?.name ?? event.location, address: event.location },
    image: event.image.src ? [event.image.src.startsWith('/') && env.siteUrl ? `${env.siteUrl}${event.image.src}` : event.image.src] : undefined,
    organizer: { '@type': 'Organization', name: organizer, url: env.siteUrl || undefined },
    isAccessibleForFree: event.cost && /^free$/i.test(event.cost.trim()) ? true : undefined,
    url,
  }
}

function AddToCalendarButton({ event, className }: { event: EventItem; className?: string }) {
  const settings = useSettings()
  const onClick = () => {
    const pageUrl = `${window.location.origin}/events/${event.slug}`
    const ics = buildIcs(
      {
        uid: `${event.id}@${window.location.hostname || 'campus-website'}`,
        title: plainText(event.title),
        description: `${event.summary}\n\nOrganiser: ${event.organiser}\nDetails: ${pageUrl}`,
        location: event.location,
        url: pageUrl,
        start: event.start,
        end: event.end,
      },
      settings.name,
    )
    downloadIcs(event.slug, ics)
    toast.success('Calendar file downloaded', { description: 'Open it to add this event to your calendar.' })
  }
  return (
    <Button variant="secondary" onClick={onClick} icon={<CalendarPlus aria-hidden className="size-4" />} className={className}>
      Add to calendar
    </Button>
  )
}

function DateTile({ event, past }: { event: EventItem; past: boolean }) {
  const start = dateParts(event.start, event.timezone)
  const end = dateParts(event.end, event.timezone)
  const multiDay = start.day !== end.day || start.month !== end.month
  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-line bg-surface text-center shadow-float',
        past && 'opacity-90',
      )}
    >
      <div className={cn('px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em]', past ? 'bg-surface-muted text-ink-muted' : 'bg-primary text-on-primary')}>
        {start.month} {start.year}
      </div>
      <div className="px-6 pb-8 pt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-subtle">
          {start.weekday}
          {multiDay ? ` – ${end.weekday}` : ''}
        </p>
        <p className={cn('mt-1 font-display text-8xl font-semibold leading-none tracking-tight', past ? 'text-ink-muted' : 'text-ink')}>
          {start.day}
          {multiDay && <span className="text-5xl text-ink-subtle">–{end.day}</span>}
        </p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-surface-muted px-4 py-1.5 text-sm font-medium text-ink">
          <Clock aria-hidden className="size-4 text-ink-subtle" />
          {formatTime(event.start, event.timezone)} – {formatTime(event.end, event.timezone)}
        </p>
        <p className="mt-2 text-xs text-ink-subtle">
          {timeZoneCity(event.timezone)} time ({timeZoneLabel(event.timezone, new Date(event.start))})
        </p>
      </div>
      {past && (
        <p className="border-t border-line bg-surface-muted px-6 py-3 text-sm font-semibold text-ink-muted">This event has ended</p>
      )}
    </div>
  )
}

function DetailRow({ icon: IconComponent, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 py-4 first:pt-0 last:pb-0">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-on-primary-soft">
        <IconComponent aria-hidden className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">{label}</dt>
        <dd className="mt-1 text-[0.9375rem] leading-relaxed text-ink">{children}</dd>
      </div>
    </div>
  )
}

function Registration({ event, now }: { event: EventItem; now: number }) {
  const registration = event.registration
  const deadline = registration?.deadline
  const closed = deadline ? new Date(deadline).getTime() < now : false
  return (
    <>
      {registration?.url && !closed && (
        <ButtonLink href={registration.url} variant="accent" className="mb-3 w-full sm:w-auto" icon={<ExternalLink aria-hidden className="size-4" />}>
          Register for this event
        </ButtonLink>
      )}
      {deadline && (
        <p className={cn('text-sm', closed ? 'font-medium text-warning' : 'text-ink-muted')}>
          {closed ? 'Registration closed on ' : 'Register by '}
          {formatDateTime(deadline, event.timezone)}
        </p>
      )}
      {registration?.note && <p className="mt-1 text-sm text-ink-muted">{registration.note}</p>}
      {!registration?.url && (
        <AppLink
          href={enquireHref({ topic: event.campus ? 'campus' : 'other', campus: event.campus?.slug })}
          className="mt-2 inline-block text-sm font-semibold text-primary-ink underline-offset-4 hover:underline"
        >
          Ask us about this event
        </AppLink>
      )}
    </>
  )
}

function MoreEvents({ current }: { current: string }) {
  const { data, isPending, isError, refetch } = useQuery(queries.events({ when: 'upcoming', pageSize: 4 }))
  const others = (data?.items ?? []).filter((e) => e.slug !== current).slice(0, 3)
  if (!isPending && !isError && others.length === 0) return null
  return (
    <Section background="alt">
      <SectionHeader
        eyebrow="What’s on"
        heading="More upcoming events"
        action={
          <ButtonLink href="/events" variant="secondary" arrow>
            All events
          </ButtonLink>
        }
      />
      {isPending ? (
        <LoadingRegion label="Loading events" className="grid gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-48 rounded-[1.75rem]" />
          ))}
        </LoadingRegion>
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : (
        <Stagger className="grid gap-5 lg:grid-cols-3">
          {others.map((event) => (
            <StaggerItem key={event.slug} className="h-full">
              <EventCard event={event} className="sm:flex-col" />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </Section>
  )
}

export default function EventPage() {
  const { slug } = useParams()
  const { data: event } = useSuspenseQuery(queries.event(slug!))
  const settings = useSettings()
  const [now] = useState(() => Date.now())
  const past = new Date(event.end).getTime() < now
  const title = plainText(event.title)
  const tz = `${timeZoneCity(event.timezone)} time (${timeZoneLabel(event.timezone, new Date(event.start))})`
  const registrationOpen = !past && Boolean(event.registration?.url) && !(event.registration?.deadline && new Date(event.registration.deadline).getTime() < now)

  return (
    <>
      <Seo title={event.seo?.title ?? title} description={event.seo?.description ?? event.summary} image={event.seo?.image ?? event.image.src} noindex={event.seo?.noindex} />
      <JsonLd data={eventJsonLd(event, settings.name)} />

      <section className="relative isolate overflow-hidden border-b border-line bg-canvas-alt pb-14 pt-[calc(var(--header-h)+2rem)] sm:pb-20 sm:pt-[calc(var(--header-h)+3rem)]">
        <Aurora intensity="soft" className="-z-10" />
        <GridBackdrop className="-z-10 opacity-70" />
        <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal immediate y={8} duration={0.6}>
              <Breadcrumbs items={[{ label: 'Events', href: past ? '/events?when=past' : '/events' }, { label: title }]} className="mb-8" />
            </Reveal>
            <Reveal immediate y={10} delay={0.05} className="flex flex-wrap items-center gap-2">
              <Badge tone={past ? 'neutral' : 'accent'} size="md">
                <Ticket aria-hidden className="size-3.5" />
                {event.type}
              </Badge>
              {past && (
                <Badge tone="outline" size="md">
                  This event has ended
                </Badge>
              )}
              {event.cost && (
                <Badge tone="outline" size="md">
                  {event.cost}
                </Badge>
              )}
            </Reveal>
            <TextReveal
              text={event.title}
              delay={0.1}
              stagger={0.045}
              className="mt-6 font-display text-[2.25rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]"
            />
            <Reveal immediate y={16} delay={0.35}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">{event.summary}</p>
            </Reveal>
            <Reveal immediate y={16} delay={0.45}>
              <p className="mt-6 flex flex-col gap-2 text-[0.9375rem] text-ink-muted sm:flex-row sm:flex-wrap sm:gap-x-6">
                <span className="inline-flex items-start gap-2">
                  <CalendarClock aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
                  {formatDateTimeRange(event.start, event.end, event.timezone)}
                </span>
                <span className="inline-flex items-start gap-2">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
                  {event.campus ? event.campus.name : event.location}
                </span>
              </p>
            </Reveal>
            <Reveal immediate y={16} delay={0.5} className="mt-9 flex flex-wrap gap-3">
              {past ? (
                <ButtonLink href="/events" variant="primary" arrow size="lg">
                  See upcoming events
                </ButtonLink>
              ) : (
                <>
                  {registrationOpen && event.registration?.url && (
                    <ButtonLink href={event.registration.url} variant="accent" size="lg" icon={<ExternalLink aria-hidden className="size-4" />}>
                      Register
                    </ButtonLink>
                  )}
                  <AddToCalendarButton event={event} className="h-13 px-7 text-base" />
                </>
              )}
            </Reveal>
          </div>
          <Reveal immediate y={24} delay={0.3} className="lg:col-span-5">
            <DateTile event={event} past={past} />
          </Reveal>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-7">
            {past && (
              <Callout tone="warning" title="This event has ended" className="mb-8">
                Registration is closed. Browse <AppLink href="/events" className="font-semibold text-primary-ink underline underline-offset-4">upcoming events</AppLink> or{' '}
                <AppLink href={enquireHref({ topic: event.campus ? 'campus' : 'other', campus: event.campus?.slug })} className="font-semibold text-primary-ink underline underline-offset-4">
                  ask us
                </AppLink>{' '}
                about future dates.
              </Callout>
            )}
            <Reveal>
              <SmartImage image={event.image} sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[16/9] rounded-[1.75rem] ring-1 ring-line" />
            </Reveal>
            <Reveal className="mt-10">
              <Markdown size="lg">{event.description}</Markdown>
            </Reveal>
            <ButtonLink href={past ? '/events?when=past' : '/events'} variant="ghost" icon={<ArrowLeft aria-hidden className="size-4" />} className="-ml-3 mt-10">
              {past ? 'All past events' : 'All events'}
            </ButtonLink>
          </div>

          <aside className="lg:col-span-5">
            <Reveal className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-card sm:p-8 lg:sticky lg:top-28">
              <h2 className="font-display text-2xl font-semibold text-ink">Event details</h2>
              <dl className="mt-6 divide-y divide-line">
                <DetailRow icon={CalendarClock} label="When">
                  {formatDateTimeRange(event.start, event.end, event.timezone)}
                  <span className="block text-sm text-ink-subtle">Shown in {tz}</span>
                </DetailRow>
                <DetailRow icon={MapPin} label="Where">
                  {event.location}
                  {event.campus && (
                    <AppLink href={`/campuses/${event.campus.slug}`} className="mt-1 block text-sm font-semibold text-primary-ink underline-offset-4 hover:underline">
                      About {event.campus.name}
                    </AppLink>
                  )}
                </DetailRow>
                <DetailRow icon={Users} label="Who it’s for">
                  {event.audience}
                </DetailRow>
                {event.cost && (
                  <DetailRow icon={Wallet} label="Cost">
                    {event.cost}
                  </DetailRow>
                )}
                <DetailRow icon={UserRound} label="Organiser">
                  {event.organiser}
                </DetailRow>
                {!past && event.registration && (
                  <DetailRow icon={Ticket} label="Registration">
                    <Registration event={event} now={now} />
                  </DetailRow>
                )}
                {event.accessibilityContact && (
                  <DetailRow icon={Accessibility} label="Accessibility">
                    <ContactText text={event.accessibilityContact} />
                  </DetailRow>
                )}
              </dl>
              {!past && (
                <div className="mt-6 border-t border-line pt-6">
                  <AddToCalendarButton event={event} className="w-full sm:w-auto" />
                  <p className="mt-3 flex items-start gap-2 text-xs text-ink-subtle">
                    <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                    Downloads an .ics file for Google, Apple or Outlook calendars. It does not register you for the event.
                  </p>
                </div>
              )}
            </Reveal>
          </aside>
        </div>
      </Section>

      <MoreEvents current={event.slug} />
    </>
  )
}

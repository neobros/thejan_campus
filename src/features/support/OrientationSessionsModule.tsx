import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, BookOpen, CalendarDays, Check, Clock, Compass, Mail, MapPin, MonitorPlay, UserRound } from 'lucide-react'
import { useState } from 'react'
import { queries } from '@/api/queries'
import type { OrientationSession } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import type { ModuleComponentProps } from '@/components/blocks/types'
import { AppLink } from '@/components/ui/AppLink'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { dateParts, formatDateTimeRange, timeZoneLabel } from '@/lib/format'
import { enquireHref, isEmail } from '@/lib/links'

function SessionCard({ session, headingLevel: Heading }: { session: OrientationSession; headingLevel: 'h3' | 'h4' }) {
  const parts = dateParts(session.start, session.timezone)
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card transition-[box-shadow,border-color] duration-500 hover:border-primary/30 hover:shadow-card-hover">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-7">
        <div className="flex shrink-0 items-center gap-3 sm:block">
          <div className="grid size-20 place-items-center rounded-2xl bg-primary-soft text-center text-on-primary-soft transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
            <span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.16em]">{parts.month}</span>
              <span className="block font-display text-3xl font-semibold leading-none">{parts.day}</span>
              <span className="mt-0.5 block text-[11px]">{parts.weekday}</span>
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">{session.intakeLabel}</Badge>
            <Badge tone="outline">
              <MapPin aria-hidden className="size-3" />
              {session.campus.name}
            </Badge>
            {session.remoteUrl && (
              <Badge tone="brand">
                <MonitorPlay aria-hidden className="size-3" />
                Online option
              </Badge>
            )}
          </div>
          <Heading className="mt-3 font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">{session.title}</Heading>
          <dl className="mt-3 space-y-1.5 text-[0.9375rem] text-ink-muted">
            <div className="flex items-start gap-2">
              <dt className="sr-only">When</dt>
              <Clock aria-hidden className="mt-1 size-4 shrink-0 text-ink-subtle" />
              <dd>
                {formatDateTimeRange(session.start, session.end, session.timezone)}{' '}
                <span className="text-ink-subtle">({timeZoneLabel(session.timezone, new Date(session.start))})</span>
              </dd>
            </div>
            <div className="flex items-start gap-2">
              <dt className="sr-only">Where</dt>
              <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-ink-subtle" />
              <dd>{session.location}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid gap-6 border-t border-line bg-canvas-alt/60 p-5 sm:p-7 md:grid-cols-2">
        {session.topics.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">Session topics</p>
            <ol className="mt-3 space-y-2">
              {session.topics.map((topic, i) => (
                <li key={topic} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                  <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-surface text-[11px] font-semibold tabular-nums text-primary-ink ring-1 ring-line">
                    {i + 1}
                  </span>
                  {topic}
                </li>
              ))}
            </ol>
          </div>
        )}
        {session.bring.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">What to bring</p>
            <ul className="mt-3 space-y-2">
              {session.bring.map((item) => (
                <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                  <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                    <Check strokeWidth={3} className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p className="flex items-start gap-2 text-sm text-ink-muted">
          <UserRound aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
          <span>
            <span className="font-semibold text-ink">{session.coordinator.name}</span>
            {isEmail(session.coordinator.email) && (
              <>
                {' · '}
                <a href={`mailto:${session.coordinator.email}`} className="inline-flex items-center gap-1 font-medium text-primary-ink underline-offset-4 [overflow-wrap:anywhere] hover:underline">
                  <Mail aria-hidden className="size-3.5" />
                  {session.coordinator.email}
                </a>
              </>
            )}
            <span className="mt-0.5 block text-ink-subtle">Contact the coordinator about accessibility requests or adjustments.</span>
          </span>
        </p>
        {session.remoteUrl && (
          <ButtonLink href={session.remoteUrl} variant="secondary" size="sm" icon={<MonitorPlay aria-hidden className="size-4" />} className="shrink-0">
            Join online
          </ButtonLink>
        )}
      </div>
    </article>
  )
}

/** Upcoming orientation sessions by intake and campus (spec §5.19). Past sessions never show as upcoming. */
export function OrientationSessionsModule({ block, className }: ModuleComponentProps) {
  const { data, isPending, isError, refetch } = useQuery(queries.orientationSessions())
  const [now] = useState(() => Date.now())
  const sessions = (data ?? []).filter((s) => new Date(s.end).getTime() >= now).sort((a, b) => a.start.localeCompare(b.start))

  const groups: { label: string; sessions: OrientationSession[] }[] = []
  for (const session of sessions) {
    const group = groups.find((g) => g.label === session.intakeLabel)
    if (group) group.sessions.push(session)
    else groups.push({ label: session.intakeLabel, sessions: [session] })
  }
  const grouped = groups.length > 1

  const resources = (
    <Reveal className="mt-10 flex flex-col gap-4 rounded-3xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <p className="flex items-start gap-3 text-ink-muted">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-on-accent-soft">
          <BookOpen aria-hidden className="size-5" />
        </span>
        <span>
          <span className="block font-semibold text-ink">Prepare with the current handbook and calendar</span>
          <span className="text-sm">Term dates, rules and support contacts for your first weeks.</span>
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        <ButtonLink href="/downloads?type=handbook" variant="secondary" size="sm" icon={<BookOpen aria-hidden className="size-4" />}>
          Student handbook
        </ButtonLink>
        <ButtonLink href="/downloads?type=calendar" variant="secondary" size="sm" icon={<CalendarDays aria-hidden className="size-4" />}>
          Academic calendar
        </ButtonLink>
      </div>
    </Reveal>
  )

  return (
    <ModuleSection block={block} className={className}>
      {isPending ? (
        <LoadingRegion className="space-y-5">
          {Array.from({ length: 2 }, (_, i) => (
            <Skeleton key={i} className="h-80 rounded-[1.75rem]" />
          ))}
        </LoadingRegion>
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="Orientation dates for upcoming intakes will be published here"
          description="Session details are also sent with your enrolment information. If you have a question about orientation, our student support team can help."
          actions={
            <>
              <ButtonLink href="/downloads?type=handbook" variant="secondary">
                Student handbook
              </ButtonLink>
              <ButtonLink href={enquireHref({ topic: 'support' })} variant="primary">
                Ask about orientation
              </ButtonLink>
            </>
          }
        />
      ) : (
        <div className="space-y-12">
          {groups.map((group) => (
            <div key={group.label}>
              {grouped && (
                <Reveal y={12} className="mb-5 flex items-center gap-4">
                  <h3 className="font-display text-2xl font-semibold text-ink">{group.label}</h3>
                  <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-line-strong/50 to-transparent" />
                </Reveal>
              )}
              <Stagger className="space-y-5">
                {group.sessions.map((session) => (
                  <StaggerItem key={session.id}>
                    <SessionCard session={session} headingLevel={grouped ? 'h4' : 'h3'} />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ))}
        </div>
      )}
      {!isError && !isPending && sessions.length > 0 && resources}
      {!isPending && !isError && sessions.length > 0 && (
        <p className="mt-6 text-sm text-ink-subtle">
          Times are shown in each campus’s local time.{' '}
          <AppLink href="/student-support" className="inline-flex items-center gap-1 font-medium text-primary-ink underline-offset-4 hover:underline">
            Student support <ArrowUpRight aria-hidden className="size-3.5" />
          </AppLink>
        </p>
      )}
    </ModuleSection>
  )
}

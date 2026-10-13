import { useQuery } from '@tanstack/react-query'
import { CalendarClock, Layers, MapPin } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { queries } from '@/api/queries'
import type { Audience, IntakeListing } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import { moduleProp, type ModuleComponentProps } from '@/components/blocks/types'
import { AppLink } from '@/components/ui/AppLink'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { CardGridSkeleton, EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { SmartImage } from '@/components/ui/SmartImage'
import { SegmentedControl } from '@/components/ui/Tabs'
import { AUDIENCE_LABELS, MODE_LABELS } from '@/components/shared/labels'
import { IntakeStatusBadge } from '@/components/shared/status'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import { dateParts, formatDate, relativeDays, timeZoneLabel } from '@/lib/format'
import { applyHref, enquireHref } from '@/lib/links'
import { CardCarouselTrack, useCardCarousel } from './carousel'

/** Compact list row — used on campus pages where a card grid would be too heavy. */
export function IntakeRow({ intake, index = 0 }: { intake: IntakeListing; index?: number }) {
  const parts = dateParts(intake.startDate)
  const available = intake.status === 'open' || intake.status === 'limited'
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="group grid gap-4 rounded-3xl border border-line bg-surface p-4 transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-card-hover sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:p-5"
    >
      <div className="flex items-center gap-4 sm:block">
        <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary-soft text-center text-on-primary-soft transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">{parts.month}</span>
          <span className="-mt-1 font-display text-2xl font-semibold leading-none">{parts.day}</span>
        </div>
        <p className="text-sm text-ink-subtle sm:hidden">Starts {relativeDays(intake.startDate)}</p>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <IntakeStatusBadge status={intake.status} />
          <span className="text-xs font-medium text-ink-subtle">{intake.course.level}</span>
        </div>
        <h3 className="mt-1.5 font-semibold leading-snug text-ink">
          <ButtonLink href={`/courses/${intake.course.slug}`} variant="link" className="text-base text-ink hover:text-primary-ink">
            {intake.course.title}
          </ButtonLink>
        </h3>
        <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden className="size-3.5" />
            {intake.campus.name}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers aria-hidden className="size-3.5" />
            {MODE_LABELS[intake.deliveryMode]} · {AUDIENCE_LABELS[intake.audience]}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock aria-hidden className="size-3.5" />
            Apply by {formatDate(intake.applicationDeadline, 'medium')}
          </span>
        </p>
      </div>
      <div className="flex gap-2 sm:justify-end">
        {available ? (
          <ButtonLink
            href={applyHref({ course: intake.course.slug, campus: intake.campus.slug, audience: intake.audience, intake: intake.id })}
            size="sm"
            variant="primary"
          >
            Apply
          </ButtonLink>
        ) : null}
        <ButtonLink href={enquireHref({ course: intake.course.slug, campus: intake.campus.slug, audience: intake.audience })} size="sm" variant="secondary">
          Enquire
        </ButtonLink>
      </div>
    </motion.li>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Grouping: one entry per course + campus + start date; delivery modes and audiences are variants.
 * ---------------------------------------------------------------------------------------------- */

interface IntakeGroup {
  key: string
  course: IntakeListing['course']
  campus: IntakeListing['campus']
  startDate: string
  deadline: string
  status: IntakeListing['status']
  variants: IntakeListing[]
}

const STATUS_RANK: Record<IntakeListing['status'], number> = { open: 0, limited: 1, full: 2, closed: 3 }

function groupIntakes(rows: IntakeListing[]): IntakeGroup[] {
  const groups = new Map<string, IntakeGroup>()
  for (const row of rows) {
    const key = `${row.course.slug}|${row.campus.slug}|${row.startDate}`
    const group = groups.get(key)
    if (!group) {
      groups.set(key, {
        key,
        course: row.course,
        campus: row.campus,
        startDate: row.startDate,
        deadline: row.applicationDeadline,
        status: row.status,
        variants: [row],
      })
      continue
    }
    group.variants.push(row)
    if (row.applicationDeadline < group.deadline) group.deadline = row.applicationDeadline
    if (STATUS_RANK[row.status] < STATUS_RANK[group.status]) group.status = row.status
  }
  return [...groups.values()]
}

/** Image card for an intake — the same shell as CourseCard so the two home sections match. */
function IntakeCard({ group }: { group: IntakeGroup }) {
  const parts = dateParts(group.startDate)
  const available = group.variants.filter((v) => v.status === 'open' || v.status === 'limited')
  const audiences = [...new Set(group.variants.map((v) => v.audience))]
  const audience = audiences.length === 1 ? audiences[0] : undefined
  const single = available.length === 1 ? available[0] : null
  const apply = single
    ? applyHref({ course: group.course.slug, campus: group.campus.slug, audience: single.audience, intake: single.id })
    : applyHref({ course: group.course.slug, campus: group.campus.slug, audience })
  const options = [...new Set(group.variants.map((v) => `${MODE_LABELS[v.deliveryMode]} · ${AUDIENCE_LABELS[v.audience]}`))]

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-canvas hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover">
      <div className="relative aspect-[16/10] overflow-hidden">
        <SmartImage image={group.course.image} hoverZoom sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="size-full" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/35" />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <Badge tone="glass">{group.course.level}</Badge>
          <IntakeStatusBadge status={group.status} />
        </div>
        <div className="absolute bottom-4 left-4 flex items-end gap-3">
          <div className="grid min-w-16 place-items-center rounded-2xl bg-surface px-3 py-2 text-center shadow-float">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-ink">{parts.month}</span>
            <span className="-mt-0.5 font-display text-3xl font-semibold leading-none text-ink">{parts.day}</span>
          </div>
          <span className="mb-1 text-sm font-medium text-white drop-shadow">Starts {relativeDays(group.startDate)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink">{group.course.category.name}</p>
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-ink">
          <AppLink href={`/courses/${group.course.slug}`} className="after:absolute after:inset-0 after:z-10 after:rounded-[inherit] focus-visible:outline-none">
            {group.course.title}
          </AppLink>
        </h3>
        <dl className="mt-4 space-y-2 text-sm text-ink-muted">
          <div className="flex items-start gap-2">
            <dt className="sr-only">Campus</dt>
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
            <dd>{group.campus.name}</dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="sr-only">Application deadline</dt>
            <CalendarClock aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
            <dd>Apply by {formatDate(group.deadline, 'medium')}</dd>
          </div>
        </dl>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Study options">
          {options.map((label) => (
            <li key={label} className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-0.5 text-xs text-ink-muted">
              <Layers aria-hidden className="size-3" />
              {label}
            </li>
          ))}
        </ul>
        <div className="relative z-20 mt-auto flex gap-2 pt-6">
          {available.length > 0 && (
            <ButtonLink href={apply} size="sm" variant="primary" arrow>
              Apply
            </ButtonLink>
          )}
          <ButtonLink href={enquireHref({ course: group.course.slug, campus: group.campus.slug, audience })} size="sm" variant="secondary">
            Enquire
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}

/** Upcoming intakes, optionally filterable by course, campus and audience (spec §5.10). */
export function IntakeExplorerModule({ block, className }: ModuleComponentProps) {
  const fixedAudience = moduleProp<Audience | undefined>(block, 'audience', undefined)
  const fixedCourse = moduleProp<string | undefined>(block, 'course', undefined)
  const limit = moduleProp<number | undefined>(block, 'limit', undefined)
  const showFilters = moduleProp(block, 'showFilters', false)

  const [audience, setAudience] = useState<Audience | 'all'>(fixedAudience ?? 'all')
  const [course, setCourse] = useState(fixedCourse ?? '')
  const [campus, setCampus] = useState('')

  const { data: filters } = useQuery({ ...queries.courseFilters(), enabled: showFilters })
  const { data: courseOptions } = useQuery({ ...queries.courses({ pageSize: 48, sort: 'title' }), enabled: showFilters })
  const { data, isPending, isError, refetch } = useQuery(
    queries.intakes({ audience: audience === 'all' ? undefined : audience, course: course || undefined, campus: campus || undefined }),
  )

  const intakes = data ?? []
  const groups = groupIntakes(intakes)
  // Previews (e.g. the home page) show the next start date for different courses in a carousel.
  const preview = Boolean(limit)
  const visible = preview ? groups.filter((g, i, all) => all.findIndex((o) => o.course.slug === g.course.slug) === i).slice(0, limit) : groups
  const timezones = [...new Set(intakes.map((i) => i.timezone))]
  const carousel = useCardCarousel(visible.length)

  return (
    <ModuleSection
      block={block}
      className={className}
      action={
        preview ? (
          <ButtonLink href="/admissions/intakes" variant="secondary" arrow className="hidden sm:inline-flex">
            All intakes
          </ButtonLink>
        ) : undefined
      }
    >
      {showFilters && (
        <Reveal className="mb-8 grid gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-5 lg:grid-cols-[auto_1fr_1fr] lg:items-end">
          {!fixedAudience && filters && filters.audiences.length > 1 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Student type</p>
              <SegmentedControl
                label="Student type"
                value={audience}
                onChange={setAudience}
                options={[{ value: 'all', label: 'All' }, ...filters.audiences.map((a) => ({ value: a.value, label: AUDIENCE_LABELS[a.value] }))]}
              />
            </div>
          )}
          {!fixedCourse && (
            <Dropdown
              label="Course"
              value={course}
              onChange={setCourse}
              anyLabel="All courses"
              options={(courseOptions?.items ?? []).map((c) => ({ value: c.slug, label: c.title, hint: c.level }))}
            />
          )}
          <Dropdown label="Campus" value={campus} onChange={setCampus} anyLabel="All campuses" options={filters?.campuses ?? []} />
        </Reveal>
      )}

      {isPending ? (
        preview ? (
          <CardGridSkeleton count={3} />
        ) : (
          <LoadingRegion className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-96 rounded-[1.75rem]" />
            ))}
          </LoadingRegion>
        )
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : groups.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No upcoming intakes match"
          description="New dates are published regularly. Change the filters, or ask admissions about the next available start date."
          actions={
            <ButtonLink href={enquireHref({ topic: 'admissions', course: course || undefined })} variant="primary">
              Ask about intakes
            </ButtonLink>
          }
        />
      ) : preview ? (
        <>
          <p className="mb-4 text-sm text-ink-subtle">
            Next start dates across {visible.length} courses · campus local time ({timezones.map((tz) => timeZoneLabel(tz)).join(', ')})
          </p>
          <CardCarouselTrack carousel={carousel} label="Upcoming intakes">
            {visible.map((group) => (
              <IntakeCard key={group.key} group={group} />
            ))}
          </CardCarouselTrack>
        </>
      ) : (
        <>
          <p className="mb-6 text-sm text-ink-subtle" aria-live="polite">
            {groups.length} upcoming start {groups.length === 1 ? 'date' : 'dates'} · campus local time ({timezones.map((tz) => timeZoneLabel(tz)).join(', ')})
          </p>
          <ul className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3')}>
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((group, index) => (
                <motion.li
                  key={group.key}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <IntakeCard group={group} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </>
      )}
    </ModuleSection>
  )
}

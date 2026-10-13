import { ArrowRight, ArrowUpRight, CalendarDays, Clock, Layers, MapPin, Timer } from 'lucide-react'
import type { ArticleSummary, Audience, CampusSummary, CourseCategory, CourseSummary, EventSummary } from '@/api/types'
import { AppLink } from '@/components/ui/AppLink'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { SmartImage } from '@/components/ui/SmartImage'
import { Spotlight, Tilt } from '@/components/motion/effects'
import { CategoryArtwork } from './CategoryArtwork'
import { cn } from '@/lib/cn'
import { dateParts, formatDate, formatDateTimeRange, formatList, pluralize, timeZoneLabel } from '@/lib/format'
import { AUDIENCE_LABELS, MODE_LABELS } from './labels'
import { FeeAmount, IntakeStatusBadge } from './status'

const cardShell =
  'group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover'

/** Stretched link: the title is the accessible link; its ::after covers the whole card. */
const stretched = 'after:absolute after:inset-0 after:z-10 after:rounded-[inherit] focus-visible:outline-none'

/* ------------------------------------------------------------------------------------------------ */

export function CourseCard({
  course,
  audience,
  layout = 'grid',
  headingLevel: Heading = 'h3',
  className,
}: {
  course: CourseSummary
  /** When set, shows that audience's approved fee (or the contact-admissions message). */
  audience?: Audience
  layout?: 'grid' | 'list'
  headingLevel?: 'h2' | 'h3'
  className?: string
}) {
  const list = layout === 'list'
  const campuses = course.campuses.length > 2 ? pluralize(course.campuses.length, 'campus', 'campuses') : course.campuses.map((c) => c.name).join(', ')
  return (
    <article className={cn(cardShell, list && 'sm:flex-row', 'focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-canvas', className)}>
      <div className={cn('relative shrink-0 overflow-hidden', list ? 'aspect-[16/10] sm:aspect-auto sm:w-72' : 'aspect-[16/10]')}>
        {course.image.src ? (
          <SmartImage image={course.image} hoverZoom sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="size-full" />
        ) : (
          <CategoryArtwork slug={course.category.slug} tone={course.image.tone} icon={course.image.icon} />
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/35" />
        <div className="absolute inset-x-4 top-4 flex flex-wrap gap-2">
          <Badge tone="glass">{course.level}</Badge>
          {course.nextIntake?.status === 'limited' && <Badge tone="glass">Limited places</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink">{course.category.name}</p>
        <Heading className="mt-2 font-display text-xl font-semibold leading-snug text-ink">
          <AppLink href={`/courses/${course.slug}`} className={stretched}>
            {course.title}
          </AppLink>
        </Heading>
        {course.code && <p className="mt-1 font-mono text-xs text-ink-subtle">{course.code}</p>}
        <p className="mt-3 line-clamp-2 text-[0.9375rem] leading-relaxed text-ink-muted">{course.summary}</p>
        <dl className="mt-5 grid gap-x-4 gap-y-2.5 text-sm text-ink-muted sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <dt className="sr-only">Duration</dt>
            <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
            <dd>{course.duration}</dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="sr-only">Delivery</dt>
            <Layers aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
            <dd>{formatList(course.deliveryModes.map((m) => MODE_LABELS[m]))}</dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="sr-only">Campuses</dt>
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
            <dd>{campuses}</dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="sr-only">Next intake</dt>
            <CalendarDays aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
            <dd>{course.nextIntake ? formatDate(course.nextIntake.startDate, 'medium') : 'No upcoming intakes'}</dd>
          </div>
        </dl>
        {audience && (
          <div className="mt-5 rounded-2xl bg-surface-muted px-4 py-3">
            <p className="text-xs text-ink-subtle">{AUDIENCE_LABELS[audience]} tuition from</p>
            <FeeAmount fee={course.feeFrom[audience]} size="sm" />
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink">
            View course
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <span className="flex gap-1">
            {course.audiences.map((a) => (
              <Badge key={a} tone="outline">
                {AUDIENCE_LABELS[a]}
              </Badge>
            ))}
          </span>
        </div>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------------------------------------ */

export function CategoryCard({ category, featured, className }: { category: CourseCategory; featured?: boolean; className?: string }) {
  return (
    <Tilt className={cn('h-full', className)} max={featured ? 4 : 6}>
      <article
        className={cn(
          'theme-night group relative isolate flex h-full min-h-72 flex-col overflow-hidden rounded-[1.75rem] p-6 text-white shadow-card transition-shadow duration-500 hover:shadow-float sm:p-7',
          featured && 'min-h-[26rem]',
        )}
      >
        {category.image.src ? (
          <SmartImage image={category.image} hoverZoom iconless sizes="(min-width: 1024px) 40vw, 100vw" className="absolute inset-0 -z-20" />
        ) : (
          <CategoryArtwork slug={category.slug} tone={category.image.tone} icon={category.icon} className="-z-20" />
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#070b18]/90 via-[#070b18]/30 to-transparent" />

        <div className="flex items-start justify-between gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/14 ring-1 ring-white/25 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110">
            <Icon name={category.icon} className="size-5" />
          </span>
          <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur-md">
            {pluralize(category.courseCount, 'course')}
          </span>
        </div>

        <div className="mt-auto pt-20 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Study area</p>
          <h3 className={cn('mt-1.5 font-display font-semibold leading-[1.1]', featured ? 'text-3xl sm:text-[2.6rem]' : 'text-2xl')}>
            <AppLink href={`/courses/category/${category.slug}`} className={stretched}>
              {category.name}
            </AppLink>
          </h3>
          <p className={cn('mt-2.5 max-w-md text-[0.9375rem] leading-relaxed text-white/75', !featured && 'line-clamp-2')}>{category.summary}</p>
          <span className="relative mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
            Explore courses
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            <span aria-hidden className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold-300 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </span>
        </div>

        <span
          aria-hidden
          className="absolute right-6 top-20 grid size-11 place-items-center rounded-full bg-white text-[#0b1324] opacity-0 shadow-float transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0 group-hover:opacity-100 sm:-rotate-45 sm:translate-y-2 sm:group-hover:translate-y-0"
        >
          <ArrowUpRight className="size-5" />
        </span>
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/15 transition-[box-shadow] duration-500 group-hover:ring-white/35" />
      </article>
    </Tilt>
  )
}

/* ------------------------------------------------------------------------------------------------ */

export function CampusCard({ campus, className }: { campus: CampusSummary; className?: string }) {
  return (
    <Spotlight className={cn('h-full rounded-[1.75rem]', className)}>
      <article className={cardShell}>
        <div className="relative aspect-[16/10] overflow-hidden">
          <SmartImage image={campus.image} hoverZoom sizes="(min-width: 1024px) 33vw, 100vw" className="size-full" />
          <div className="absolute bottom-4 left-4">
            <Badge tone="glass">
              <MapPin aria-hidden className="size-3" />
              {campus.city}
            </Badge>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-2xl font-semibold text-ink">
            <AppLink href={`/campuses/${campus.slug}`} className={stretched}>
              {campus.name}
            </AppLink>
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{campus.summary}</p>
          {campus.studyAreas.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Study areas">
              {campus.studyAreas.map((area) => (
                <li key={area.slug}>
                  <Badge tone="brand">{area.name}</Badge>
                </li>
              ))}
            </ul>
          )}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-primary-ink">
            Campus details
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </Spotlight>
  )
}

/* ------------------------------------------------------------------------------------------------ */

export function ArticleCard({ article, className, headingLevel: Heading = 'h3' }: { article: ArticleSummary; className?: string; headingLevel?: 'h2' | 'h3' }) {
  return (
    <article className={cn(cardShell, className)}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <SmartImage image={article.image} hoverZoom sizes="(min-width: 1024px) 33vw, 100vw" className="size-full" />
        <div className="absolute left-4 top-4">
          <Badge tone="glass">{article.category}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-3 text-sm text-ink-subtle">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt.slice(0, 10), 'medium')}</time>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Timer aria-hidden className="size-3.5" />
            {article.readingMinutes} min read
          </span>
        </p>
        <Heading className="mt-3 font-display text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-primary-ink">
          <AppLink href={`/news/${article.slug}`} className={stretched}>
            {article.title}
          </AppLink>
        </Heading>
        <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-muted">{article.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary-ink">
          Read more
          <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------------------------------------ */

export function EventCard({ event, past, className, headingLevel: Heading = 'h3' }: { event: EventSummary; past?: boolean; className?: string; headingLevel?: 'h2' | 'h3' }) {
  const parts = dateParts(event.start, event.timezone)
  return (
    <article className={cn(cardShell, 'sm:flex-row', past && 'opacity-80', className)}>
      <div
        className={cn(
          'flex shrink-0 items-center gap-4 border-b border-line p-5 sm:w-28 sm:flex-col sm:justify-center sm:gap-0 sm:border-b-0 sm:border-r',
          past ? 'bg-surface-muted' : 'bg-primary-soft',
        )}
      >
        <span className={cn('text-xs font-semibold uppercase tracking-[0.16em]', past ? 'text-ink-subtle' : 'text-on-primary-soft')}>{parts.month}</span>
        <span className={cn('font-display text-4xl font-semibold leading-none', past ? 'text-ink-muted' : 'text-on-primary-soft')}>{parts.day}</span>
        <span className="text-xs text-ink-subtle sm:mt-1">{parts.weekday}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={past ? 'neutral' : 'accent'}>{event.type}</Badge>
          {past && <Badge tone="outline">Past event</Badge>}
          {event.cost && <Badge tone="outline">{event.cost}</Badge>}
        </div>
        <Heading className="mt-3 text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-primary-ink">
          <AppLink href={`/events/${event.slug}`} className={stretched}>
            {event.title}
          </AppLink>
        </Heading>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">{event.summary}</p>
        <dl className="mt-4 space-y-1.5 text-sm text-ink-muted">
          <div className="flex items-start gap-2">
            <dt className="sr-only">When</dt>
            <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
            <dd>
              {formatDateTimeRange(event.start, event.end, event.timezone)} <span className="text-ink-subtle">({timeZoneLabel(event.timezone, new Date(event.start))})</span>
            </dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="sr-only">Where</dt>
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
            <dd>{event.campus && !event.location.includes(event.campus.name) ? `${event.location}, ${event.campus.name}` : event.location}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

export { IntakeStatusBadge }

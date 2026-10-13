import {
  ArrowUpRight,
  BookOpenCheck,
  Briefcase,
  CalendarRange,
  Check,
  ClipboardCheck,
  Clock,
  FileCheck,
  FileText,
  GraduationCap,
  Hourglass,
  Languages,
  Layers,
  ListChecks,
  MapPin,
  Presentation,
  Signpost,
  Tag,
  Target,
  UserRound,
  Wrench,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import type { Audience, Course } from '@/api/types'
import { AppLink } from '@/components/ui/AppLink'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { Callout } from '@/components/ui/feedback'
import { Markdown } from '@/components/ui/Markdown'
import { Eyebrow } from '@/components/ui/Section'
import { SegmentedControl } from '@/components/ui/Tabs'
import { AUDIENCE_LONG_LABELS, MODE_LABELS, RESOURCE_TYPE_LABELS } from '@/components/shared/labels'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import { formatDate, formatFileSize, formatList } from '@/lib/format'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { offeringsFor, SECTION_LABELS, uniqueCampuses, uniqueModes, type SectionId } from './course-detail'

/* ------------------------------------------------------------------------------------------------
 * Shell
 * ---------------------------------------------------------------------------------------------- */

export function CourseSection({
  id,
  eyebrow,
  title,
  intro,
  action,
  children,
  className,
}: {
  id: SectionId
  eyebrow?: string
  title?: string
  intro?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  const headingId = `${id}-heading`
  return (
    <section id={id} aria-labelledby={headingId} className={cn('scroll-mt-[calc(var(--header-h)+5rem)] border-t border-line py-14 first:border-t-0 first:pt-2 sm:py-16', className)}>
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow && (
            <Reveal y={10}>
              <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
            </Reveal>
          )}
          <Reveal y={16} delay={0.04}>
            <h2 id={headingId} tabIndex={-1} className="font-display text-3xl font-semibold leading-tight text-ink outline-none sm:text-[2.125rem]">
              {title ?? SECTION_LABELS[id]}
            </h2>
          </Reveal>
          {intro && (
            <Reveal y={12} delay={0.08}>
              <div className="mt-3 text-[1.0625rem] leading-relaxed text-ink-muted">{intro}</div>
            </Reveal>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  )
}

function CheckList({ items, tone = 'success' }: { items: string[]; tone?: 'success' | 'brand' }) {
  return (
    <Stagger as="ul" stagger={0.05} className="space-y-3">
      {items.map((item) => (
        <StaggerItem as="li" key={item} className="flex gap-3">
          <span
            className={cn(
              'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
              tone === 'success' ? 'bg-success-soft text-success' : 'bg-primary-soft text-on-primary-soft',
            )}
          >
            <Check aria-hidden strokeWidth={3} className="size-3" />
          </span>
          <span className="leading-relaxed text-ink-muted">{item}</span>
        </StaggerItem>
      ))}
    </Stagger>
  )
}

function Panel({ icon: IconComponent, title, children, className }: { icon: typeof Check; title: string; children: ReactNode; className?: string }) {
  return (
    <Reveal className={cn('rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-7', className)}>
      <h3 className="flex items-center gap-3 text-lg font-semibold text-ink">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-on-primary-soft">
          <IconComponent aria-hidden className="size-5" />
        </span>
        {title}
      </h3>
      <div className="mt-5">{children}</div>
    </Reveal>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Overview
 * ---------------------------------------------------------------------------------------------- */

export function OverviewSection({ course }: { course: Course }) {
  return (
    <CourseSection id="overview" eyebrow="About this course" title="Course overview">
      <Reveal>
        <Markdown size="lg" className="max-w-none">
          {course.overview}
        </Markdown>
      </Reveal>
      {(course.intendedFor.length > 0 || course.purpose) && (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {course.intendedFor.length > 0 && (
            <Panel icon={UserRound} title="Who this course is for" className={cn(!course.purpose && 'md:col-span-2')}>
              <CheckList items={course.intendedFor} />
            </Panel>
          )}
          {course.purpose && (
            <Reveal delay={0.08} className={cn('relative overflow-hidden rounded-3xl bg-primary-soft p-6 sm:p-7', course.intendedFor.length === 0 && 'md:col-span-2')}>
              <Target aria-hidden className="absolute -right-6 -top-6 size-32 text-on-primary-soft opacity-10" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-on-primary-soft">Course purpose</h3>
              <p className="relative mt-4 font-display text-xl font-medium leading-snug text-ink sm:text-2xl">{course.purpose}</p>
            </Reveal>
          )}
        </div>
      )}
    </CourseSection>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Key facts
 * ---------------------------------------------------------------------------------------------- */

export function KeyFactsSection({ course, audience }: { course: Course; audience?: Audience }) {
  const offerings = offeringsFor(course, audience)
  const campuses = uniqueCampuses(course, offerings)
  const facts: { icon: typeof Check; label: string; value: ReactNode }[] = [
    { icon: Clock, label: 'Duration', value: course.duration },
    ...(course.holidayBreakdown ? [{ icon: CalendarRange, label: 'Study and holiday breakdown', value: course.holidayBreakdown }] : []),
    ...(course.studyPattern ? [{ icon: Hourglass, label: 'Study pattern', value: course.studyPattern }] : []),
    { icon: Layers, label: 'Delivery mode', value: formatList(uniqueModes(course, offerings).map((m) => MODE_LABELS[m])) },
    {
      icon: MapPin,
      label: campuses.length === 1 ? 'Campus' : 'Campuses',
      value: (
        <span className="flex flex-wrap gap-x-3 gap-y-1">
          {campuses.map((c) => (
            <AppLink key={c.slug} href={`/campuses/${c.slug}`} className="text-primary-ink underline-offset-4 hover:underline">
              {c.name}
            </AppLink>
          ))}
        </span>
      ),
    },
    { icon: Languages, label: 'Teaching language', value: course.teachingLanguage },
    { icon: GraduationCap, label: 'Qualification level', value: course.level },
    ...(course.code ? [{ icon: Tag, label: 'Course code', value: <span className="font-mono text-[0.9375rem]">{course.code}</span> }] : []),
  ]
  return (
    <CourseSection id="key-facts" eyebrow="At a glance" title="Key facts" intro={audience && course.audiences.length > 1 ? `Delivery and campuses shown for ${AUDIENCE_LONG_LABELS[audience].toLowerCase()}.` : undefined}>
      <Stagger as="dl" className="grid gap-4 sm:grid-cols-2">
        {facts.map((fact) => (
          <StaggerItem key={fact.label} className="flex items-start gap-4 rounded-3xl border border-line bg-surface p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface-muted text-primary-ink">
              <fact.icon aria-hidden className="size-5" />
            </span>
            <div className="min-w-0">
              <dt className="text-sm text-ink-subtle">{fact.label}</dt>
              <dd className="mt-0.5 font-medium leading-snug text-ink">{fact.value}</dd>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </CourseSection>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Learning outcomes
 * ---------------------------------------------------------------------------------------------- */

export function OutcomesSection({ course }: { course: Course }) {
  return (
    <CourseSection id="outcomes" eyebrow="What you will learn" title="Learning outcomes" intro="Skills and knowledge you will develop as you complete the course.">
      <Stagger as="ol" className="grid gap-4 sm:grid-cols-2">
        {course.outcomes.map((outcome, index) => (
          <StaggerItem as="li" key={outcome} className="group flex gap-4 rounded-3xl border border-line bg-surface p-5 transition-colors duration-300 hover:border-primary/30">
            <span aria-hidden className="font-display text-3xl font-semibold leading-none text-transparent [-webkit-text-stroke:1.25px_var(--accent)]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="leading-relaxed text-ink">{outcome}</span>
          </StaggerItem>
        ))}
      </Stagger>
    </CourseSection>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Curriculum
 * ---------------------------------------------------------------------------------------------- */

type ModuleFilter = 'all' | 'core' | 'elective'

export function CurriculumSection({ course }: { course: Course }) {
  const [filter, setFilter] = useState<ModuleFilter>('all')
  const core = course.modules.filter((m) => m.type === 'core').length
  const elective = course.modules.length - core
  const modules = filter === 'all' ? course.modules : course.modules.filter((m) => m.type === filter)
  const count = (n: number) => <span className="rounded-full bg-current/15 px-1.5 text-xs tabular-nums">{n}</span>

  return (
    <CourseSection
      id="curriculum"
      eyebrow="What you will study"
      title="Curriculum"
      intro={`${course.modules.length} ${course.modules.length === 1 ? 'module' : 'modules'}${elective ? ` · ${core} core and ${elective} elective` : ''}`}
      action={
        elective > 0 && core > 0 ? (
          <SegmentedControl<ModuleFilter>
            label="Show modules"
            size="sm"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: <>All {count(course.modules.length)}</> },
              { value: 'core', label: <>Core {count(core)}</> },
              { value: 'elective', label: <>Elective {count(elective)}</> },
            ]}
          />
        ) : undefined
      }
    >
      <ul className="space-y-3" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          {modules.map((module, index) => (
            <motion.li
              key={`${module.code ?? ''}-${module.title}`}
              layout="position"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.03, ease: EASE_OUT_EXPO }}
              className="grid gap-x-5 gap-y-2 rounded-3xl border border-line bg-surface p-5 sm:grid-cols-[7.5rem_1fr_auto] sm:items-start sm:p-6"
            >
              <span className="font-mono text-xs text-ink-subtle sm:pt-1">{module.code ?? <span className="sr-only">No module code</span>}</span>
              <div className="min-w-0">
                <h3 className="font-semibold leading-snug text-ink">{module.title}</h3>
                {module.summary && <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">{module.summary}</p>}
              </div>
              <Badge tone={module.type === 'core' ? 'brand' : 'accent'} className="w-fit sm:mt-0.5">
                {module.type === 'core' ? 'Core' : 'Elective'}
              </Badge>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {course.moduleNote && (
        <Reveal className="mt-6">
          <Callout title="About modules">{course.moduleNote}</Callout>
        </Reveal>
      )}
    </CourseSection>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Entry requirements
 * ---------------------------------------------------------------------------------------------- */

export function EntrySection({ course, audience }: { course: Course; audience?: Audience }) {
  const e = course.entryRequirements
  const notes = audience ? (e.audienceNotes[audience] ?? []) : []
  const groups = [
    { title: 'Academic', icon: GraduationCap, items: e.academic },
    { title: 'English language', icon: Languages, items: e.language },
    { title: 'Prerequisites', icon: ListChecks, items: e.prerequisites },
    { title: 'Evidence you will need', icon: FileCheck, items: e.evidence },
  ].filter((g) => g.items.length > 0)

  return (
    <CourseSection
      id="entry-requirements"
      eyebrow="Can I apply?"
      title="Entry requirements"
      intro="These course-specific requirements take precedence over general admissions guidance. Admissions staff review every application individually."
    >
      {e.general.length > 0 && (
        <Reveal className="mb-5 rounded-3xl border border-line bg-surface p-6 sm:p-7">
          <h3 className="mb-4 font-semibold text-ink">General requirements</h3>
          <CheckList items={e.general} tone="brand" />
        </Reveal>
      )}
      {groups.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2">
          {groups.map((group) => (
            <Panel key={group.title} icon={group.icon} title={group.title}>
              <CheckList items={group.items} tone="brand" />
            </Panel>
          ))}
        </div>
      )}
      {e.age && (
        <Reveal className="mt-5 flex items-start gap-4 rounded-3xl border border-line bg-surface p-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-on-primary-soft">
            <UserRound aria-hidden className="size-5" />
          </span>
          <div>
            <h3 className="font-semibold text-ink">Minimum age</h3>
            <p className="mt-1 text-ink-muted">{e.age}</p>
          </div>
        </Reveal>
      )}
      <AnimatePresence mode="wait" initial={false}>
        {audience && notes.length > 0 && (
          <motion.div key={audience} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mt-5">
            <Callout title={`For ${AUDIENCE_LONG_LABELS[audience].toLowerCase()}`}>
              <ul className="list-disc space-y-1 pl-5">
                {notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </Callout>
          </motion.div>
        )}
      </AnimatePresence>
      <Reveal className="mt-6">
        <ButtonLink href="/admissions/entry-requirements" variant="link" arrow>
          General entry requirements and document guidance
        </ButtonLink>
      </Reveal>
    </CourseSection>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Delivery & assessment
 * ---------------------------------------------------------------------------------------------- */

export function DeliverySection({ course }: { course: Course }) {
  const { teachingMethods, assessmentTypes, practical } = course.delivery
  return (
    <CourseSection id="delivery" eyebrow="How you will learn" title="Delivery and assessment">
      <div className="grid gap-5 md:grid-cols-2">
        {teachingMethods.length > 0 && (
          <Panel icon={Presentation} title="Teaching methods">
            <CheckList items={teachingMethods} tone="brand" />
          </Panel>
        )}
        {assessmentTypes.length > 0 && (
          <Panel icon={ClipboardCheck} title="Assessment">
            <ul className="flex flex-wrap gap-2">
              {assessmentTypes.map((type) => (
                <li key={type} className="rounded-full border border-line bg-surface-muted px-3.5 py-1.5 text-sm font-medium text-ink">
                  {type}
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
      {practical && (
        <Reveal className="mt-5 flex items-start gap-4 rounded-3xl bg-accent-soft p-6">
          <Wrench aria-hidden className="mt-0.5 size-5 shrink-0 text-on-accent-soft" />
          <div>
            <h3 className="font-semibold text-ink">Practical components</h3>
            <p className="mt-1 leading-relaxed text-ink-muted">{practical}</p>
          </div>
        </Reveal>
      )}
    </CourseSection>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Placement
 * ---------------------------------------------------------------------------------------------- */

export function PlacementSection({ course }: { course: Course }) {
  const placement = course.placement
  if (!placement) return null
  const rows = [
    { label: 'Duration', value: placement.duration },
    { label: 'Before placement', value: placement.prerequisites },
    { label: 'Costs', value: placement.costs },
    { label: 'Arranged by', value: placement.arrangedBy },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value))
  return (
    <CourseSection id="placement" eyebrow="Work-based learning" title="Placement">
      <Reveal className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
        <div className="flex flex-wrap items-start gap-4 border-b border-line p-6 sm:p-7">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-on-primary">
            <Briefcase aria-hidden className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <Badge tone={placement.required ? 'warning' : 'neutral'} dot>
              {placement.required ? 'Required to complete the course' : 'Optional'}
            </Badge>
            <p className="mt-3 leading-relaxed text-ink">{placement.summary}</p>
          </div>
        </div>
        {rows.length > 0 && (
          <dl className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0">
            {rows.map((row, index) => (
              <div key={row.label} className={cn('p-6 sm:p-7', index >= 2 && 'sm:border-t sm:border-line', index % 2 === 0 && 'sm:border-r sm:border-line')}>
                <dt className="text-sm text-ink-subtle">{row.label}</dt>
                <dd className="mt-1 leading-relaxed text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Reveal>
    </CourseSection>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Credit & prior learning
 * ---------------------------------------------------------------------------------------------- */

export function CreditSection({ course, showLink }: { course: Course; showLink: boolean }) {
  const credit = course.creditTransfer
  if (!credit) return null
  return (
    <CourseSection id="credit" eyebrow="Recognising what you already know" title="Credit and prior learning">
      <div className="grid gap-5 md:grid-cols-5">
        <Reveal className="rounded-3xl border border-line bg-surface p-6 sm:p-7 md:col-span-3">
          <Badge tone={credit.available ? 'success' : 'neutral'} dot>
            {credit.available ? 'Credit may be available' : 'Not currently available for this course'}
          </Badge>
          <p className="mt-4 leading-relaxed text-ink">{credit.summary}</p>
          <p className="mt-4 text-sm leading-relaxed text-ink-subtle">
            Each request is assessed individually. Final credit decisions are made by authorised academic staff and may change your course length and fees.
          </p>
          {showLink && (
            <ButtonLink href="/admissions/credit-transfer" variant="link" arrow className="mt-5">
              How credit transfer works
            </ButtonLink>
          )}
        </Reveal>
        {credit.evidence.length > 0 && (
          <Panel icon={BookOpenCheck} title="Evidence to provide" className="md:col-span-2">
            <CheckList items={credit.evidence} tone="brand" />
          </Panel>
        )}
      </div>
    </CourseSection>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Further study & careers
 * ---------------------------------------------------------------------------------------------- */

export function PathwaysSection({ course }: { course: Course }) {
  const { furtherStudy, careers, disclaimer } = course.pathways
  return (
    <CourseSection id="pathways" eyebrow="Where it can lead" title="Further study and careers">
      <div className={cn('grid gap-5', furtherStudy.length > 0 && careers.length > 0 && 'md:grid-cols-2')}>
        {furtherStudy.length > 0 && (
          <Panel icon={Signpost} title="Possible further study">
            <ul className="space-y-3">
              {furtherStudy.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-ink-muted">
                  <ArrowUpRight aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-ink" />
                  {item}
                </li>
              ))}
            </ul>
          </Panel>
        )}
        {careers.length > 0 && (
          <Panel icon={Briefcase} title="Possible career directions">
            <ul className="flex flex-wrap gap-2">
              {careers.map((career) => (
                <li key={career} className="rounded-full bg-primary-soft px-3.5 py-1.5 text-sm font-medium text-on-primary-soft">
                  {career}
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
      {disclaimer && (
        <Reveal className="mt-5">
          <Callout tone="warning" title="Pathways are not guarantees">
            {disclaimer}
          </Callout>
        </Reveal>
      )}
    </CourseSection>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Downloads
 * ---------------------------------------------------------------------------------------------- */

export function DownloadsSection({ course }: { course: Course }) {
  return (
    <CourseSection id="downloads" eyebrow="Take it with you" title="Downloads" intro="Current approved versions. Check the effective date before relying on a document.">
      <Stagger as="ul" className="space-y-3">
        {course.downloads.map((resource) => (
          <StaggerItem as="li" key={resource.id}>
            <a
              href={resource.file.url}
              download
              className="group flex items-start gap-4 rounded-3xl border border-line bg-surface p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover sm:items-center sm:p-6"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-surface-muted text-primary-ink transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                <FileText aria-hidden className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink">{resource.title}</span>
                  <Badge tone="neutral">{RESOURCE_TYPE_LABELS[resource.type]}</Badge>
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{resource.purpose}</span>
                <span className="mt-2 block text-xs text-ink-subtle">
                  {resource.file.format} · {formatFileSize(resource.file.sizeBytes)} · {resource.file.language} · Version {resource.version} · Effective{' '}
                  {formatDate(resource.effectiveDate, 'medium')}
                </span>
              </span>
              <span className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-ink sm:inline-flex">
                Download
                <span className="sr-only">
                  {' '}
                  {resource.title} ({resource.file.format}, {formatFileSize(resource.file.sizeBytes)})
                </span>
              </span>
            </a>
          </StaggerItem>
        ))}
      </Stagger>
    </CourseSection>
  )
}

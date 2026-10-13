import { CalendarDays, Clock, Languages, Layers, MapPin } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode, Ref } from 'react'
import type { Audience, Course, ImageAsset } from '@/api/types'
import { AppLink } from '@/components/ui/AppLink'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ButtonLink } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Section'
import { SmartImage } from '@/components/ui/SmartImage'
import { SegmentedControl } from '@/components/ui/Tabs'
import { AUDIENCE_LABELS, AUDIENCE_LONG_LABELS, MODE_LABELS } from '@/components/shared/labels'
import { Aurora, GridBackdrop } from '@/components/motion/effects'
import { Reveal } from '@/components/motion/Reveal'
import { TextReveal } from '@/components/motion/TextReveal'
import { formatDate, formatList } from '@/lib/format'
import { applyHref, enquireHref } from '@/lib/links'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { nextOpenIntake, offeringsFor, uniqueCampuses, uniqueModes } from './course-detail'

/** Domestic / International switch — drives fees, intakes, entry notes and the apply links. */
export function AudienceSwitch({
  course,
  audience,
  onChange,
  size = 'md',
  className,
}: {
  course: Course
  audience?: Audience
  onChange: (audience: Audience) => void
  size?: 'sm' | 'md'
  className?: string
}) {
  if (course.audiences.length < 2 || !audience) return null
  return (
    <SegmentedControl<Audience>
      label="Student type"
      size={size}
      value={audience}
      onChange={onChange}
      className={className}
      options={course.audiences.map((a) => ({ value: a, label: AUDIENCE_LABELS[a] }))}
    />
  )
}

function HeroImage({ image }: { image: ImageAsset }) {
  return (
    <div className="relative mx-auto max-w-xl lg:max-w-none">
      <motion.div
        aria-hidden
        className="absolute -right-4 -top-4 h-[85%] w-[80%] rounded-[2.25rem] bg-gradient-to-br from-primary/25 via-accent/20 to-transparent sm:-right-6 sm:-top-6"
        initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.2 }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-5 -left-5 size-24 animate-float-slow rounded-full bg-dots opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 0.6 }}
      />
      <motion.div
        className="relative overflow-hidden rounded-[2rem] shadow-float ring-1 ring-line"
        initial={{ clipPath: 'inset(100% 0% 0% 0% round 2rem)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)' }}
        transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.15 }}
      >
        <motion.div initial={{ scale: 1.18 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: EASE_OUT_EXPO, delay: 0.15 }}>
          <SmartImage image={image} priority sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/3]" />
        </motion.div>
      </motion.div>
    </div>
  )
}

function Fact({ icon: IconComponent, label, children }: { icon: typeof Clock; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 bg-surface p-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-on-primary-soft">
        <IconComponent aria-hidden className="size-[1.125rem]" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">{label}</dt>
        <dd className="mt-1 text-[0.9375rem] font-medium leading-snug text-ink">{children}</dd>
      </div>
    </div>
  )
}

export function CourseHero({
  course,
  audience,
  unavailableAudience,
  onAudienceChange,
  actionsRef,
}: {
  course: Course
  audience?: Audience
  unavailableAudience?: Audience
  onAudienceChange: (audience: Audience) => void
  actionsRef: Ref<HTMLDivElement>
}) {
  const offerings = offeringsFor(course, audience)
  const next = nextOpenIntake(offerings)
  const modes = uniqueModes(course, offerings)
  const campuses = uniqueCampuses(course, offerings)

  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-canvas-alt pb-12 pt-[calc(var(--header-h)+2rem)] sm:pb-16 sm:pt-[calc(var(--header-h)+3rem)]">
      <Aurora intensity="soft" className="-z-10" />
      <GridBackdrop className="-z-10 opacity-70" />

      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal immediate y={8} duration={0.6}>
            <Breadcrumbs
              items={[
                { label: 'Courses', href: '/courses' },
                { label: course.category.name, href: `/courses/category/${course.category.slug}` },
                { label: course.title },
              ]}
              className="mb-8"
            />
          </Reveal>
          <Reveal immediate y={10} delay={0.05}>
            <Eyebrow className="mb-5">
              <AppLink href={`/courses/category/${course.category.slug}`} className="hover:underline hover:underline-offset-4">
                {course.category.name}
              </AppLink>
            </Eyebrow>
          </Reveal>
          <TextReveal text={course.title} delay={0.1} className="font-display text-[2.5rem] font-semibold leading-[1.04] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]" />
          <Reveal immediate y={12} delay={0.3}>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {course.code && (
                <Badge tone="outline" size="md" className="font-mono">
                  <span className="sr-only">Course code </span>
                  {course.code}
                </Badge>
              )}
              <Badge tone="brand" size="md">
                {course.level}
              </Badge>
              <Badge tone="accent" size="md">
                {course.category.name}
              </Badge>
              {course.audiences.length === 1 && (
                <Badge tone="neutral" size="md">
                  For {AUDIENCE_LONG_LABELS[course.audiences[0]].toLowerCase()}
                </Badge>
              )}
            </div>
          </Reveal>
          <Reveal immediate y={16} delay={0.35}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">{course.summary}</p>
          </Reveal>

          {course.audiences.length > 1 && audience && (
            <Reveal immediate y={16} delay={0.42}>
              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-sm font-semibold text-ink">Show details for</p>
                <AudienceSwitch course={course} audience={audience} onChange={onAudienceChange} size="sm" />
              </div>
            </Reveal>
          )}
          {unavailableAudience && audience && (
            <p className="mt-4 text-sm text-ink-muted">
              This course is not offered to {AUDIENCE_LONG_LABELS[unavailableAudience].toLowerCase()}. Showing details for{' '}
              {AUDIENCE_LONG_LABELS[audience].toLowerCase()}.
            </p>
          )}

          <Reveal immediate y={16} delay={0.5}>
            <div ref={actionsRef} className="mt-9 flex flex-wrap items-center gap-3">
              {next ? (
                <>
                  <ButtonLink href={applyHref({ course: course.slug, audience })} variant="accent" size="lg" arrow>
                    Apply now
                  </ButtonLink>
                  <ButtonLink href={enquireHref({ course: course.slug, audience })} variant="secondary" size="lg">
                    Enquire
                  </ButtonLink>
                </>
              ) : (
                <ButtonLink href={enquireHref({ course: course.slug, audience })} variant="primary" size="lg" arrow>
                  Ask about the next intake
                </ButtonLink>
              )}
            </div>
          </Reveal>
        </div>

        <div className="relative lg:col-span-5">
          <HeroImage image={course.image} />
        </div>
      </div>

      <div className="container-page mt-12 sm:mt-14">
        <Reveal immediate y={24} delay={0.6}>
          <dl className="grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line shadow-card sm:grid-cols-2 lg:grid-cols-5 sm:[&>div:last-child]:col-span-2 lg:[&>div:last-child]:col-span-1">
            <Fact icon={Clock} label="Duration">
              {course.duration}
            </Fact>
            <Fact icon={Layers} label="Delivery">
              {formatList(modes.map((m) => MODE_LABELS[m]))}
            </Fact>
            <Fact icon={MapPin} label={campuses.length === 1 ? 'Campus' : 'Campuses'}>
              {campuses.map((c) => c.name).join(', ')}
            </Fact>
            <Fact icon={CalendarDays} label="Next intake">
              {next ? (
                <>
                  {formatDate(next.startDate, 'medium')}
                  <span className="block text-sm font-normal text-ink-subtle">{next.campus.name}</span>
                </>
              ) : (
                <span className="text-ink-muted">No intakes open right now</span>
              )}
            </Fact>
            <Fact icon={Languages} label="Taught in">
              {course.teachingLanguage}
            </Fact>
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

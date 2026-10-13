import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { Check, GraduationCap, Info, MapPin, Route, SlidersHorizontal } from 'lucide-react'
import { useParams, type LoaderFunctionArgs } from 'react-router'
import { queries } from '@/api/queries'
import { orNotFound, queryClient } from '@/app/routing'
import { AppLink } from '@/components/ui/AppLink'
import { ButtonLink } from '@/components/ui/Button'
import { CardGridSkeleton, EmptyState, ErrorPanel } from '@/components/ui/feedback'
import { Icon } from '@/components/ui/Icon'
import { Markdown } from '@/components/ui/Markdown'
import { Section, SectionHeader } from '@/components/ui/Section'
import { CourseCard } from '@/components/shared/cards'
import { CtaBanner } from '@/components/shared/CtaBanner'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { pluralize } from '@/lib/format'
import { coursesHref, enquireHref } from '@/lib/links'
import { Seo } from '@/lib/seo'

const courseQuery = (slug: string) => queries.courses({ category: slug, sort: 'level', pageSize: 48 })

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug!
  // The course list is fetched in parallel so the page renders complete; it falls back to its own
  // loading/error state if that request fails.
  await Promise.all([
    orNotFound(queryClient.ensureQueryData(queries.category(slug))),
    queryClient.ensureQueryData(courseQuery(slug)).catch(() => undefined),
  ])
  return null
}

export default function CourseCategoryPage() {
  const { slug = '' } = useParams()
  const { data: category } = useSuspenseQuery(queries.category(slug))
  const { data, isPending, isError, refetch } = useQuery(courseQuery(slug))
  const courses = [...(data?.items ?? [])].sort((a, b) => a.levelRank - b.levelRank || a.title.localeCompare(b.title))

  const levels = [...new Map(courses.map((c) => [c.level, { level: c.level, rank: c.levelRank, count: courses.filter((x) => x.level === c.level).length }])).values()].sort(
    (a, b) => a.rank - b.rank,
  )
  const campuses = [...new Map(courses.flatMap((c) => c.campuses).map((c) => [c.slug, c])).values()]

  return (
    <>
      <Seo title={category.seo?.title ?? category.name} description={category.seo?.description ?? category.summary} image={category.seo?.image ?? category.image.src} />
      <PageHero
        title={category.name}
        eyebrow="Study area"
        summary={category.summary}
        image={category.image}
        breadcrumbs={[{ label: 'Courses', href: '/courses' }, { label: category.name }]}
        actions={[
          { label: courses.length ? `View ${pluralize(courses.length, 'course')}` : 'Browse all courses', href: courses.length ? '#courses' : '/courses', variant: 'primary' },
          { label: 'Talk to an adviser', href: enquireHref({ topic: 'course' }), variant: 'secondary' },
        ]}
      >
        {courses.length > 0 && (
          <ul className="flex flex-wrap gap-2 text-sm text-ink-muted">
            <li className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 backdrop-blur">
              <Icon name={category.icon} className="size-4 text-primary-ink" />
              {pluralize(courses.length, 'course')}
            </li>
            {levels.length > 0 && (
              <li className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 backdrop-blur">
                <GraduationCap aria-hidden className="size-4 text-primary-ink" />
                {levels.length > 1 ? `${levels[0].level} to ${levels[levels.length - 1].level}` : levels[0].level}
              </li>
            )}
            {campuses.length > 0 && (
              <li className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 backdrop-blur">
                <MapPin aria-hidden className="size-4 text-primary-ink" />
                {campuses.length > 2 ? pluralize(campuses.length, 'campus', 'campuses') : campuses.map((c) => c.name).join(' & ')}
              </li>
            )}
          </ul>
        )}
      </PageHero>

      {/* Introduction + who it suits */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeader eyebrow="About this study area" heading={`Studying ${category.name}`} className="mb-8 sm:mb-8" />
            <Reveal>
              <Markdown size="lg">{category.description}</Markdown>
            </Reveal>
          </div>
          {category.suitableFor.length > 0 && (
            <Reveal delay={0.1} className="lg:col-span-5">
              <div className="rounded-[1.75rem] border border-line bg-surface p-7 shadow-card sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-ink">Who it suits</h2>
                <Stagger as="ul" stagger={0.06} className="mt-6 space-y-4">
                  {category.suitableFor.map((item) => (
                    <StaggerItem as="li" key={item} className="flex gap-3">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                        <Check aria-hidden strokeWidth={3} className="size-3.5" />
                      </span>
                      <span className="leading-relaxed text-ink-muted">{item}</span>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </Reveal>
          )}
        </div>
      </Section>

      {/* Courses */}
      <Section background="alt" id="courses" className="scroll-mt-4">
        <SectionHeader
          eyebrow="Available courses"
          heading={`Courses in ${category.name}`}
          intro="Ordered from introductory to advanced. Each course page lists its own entry requirements, fees and intakes."
          action={
            courses.length > 0 ? (
              <ButtonLink href={coursesHref({ category: category.slug })} variant="secondary" icon={<SlidersHorizontal aria-hidden className="size-4" />}>
                Filter these courses
              </ButtonLink>
            ) : undefined
          }
        />
        {isPending ? (
          <CardGridSkeleton count={3} />
        ) : isError ? (
          <ErrorPanel title="Courses could not be loaded" onRetry={() => refetch()} />
        ) : courses.length === 0 ? (
          <EmptyState
            title="No courses are published in this study area yet"
            description="New courses are added regularly. Browse the full catalogue or ask our admissions team about upcoming options."
            actions={
              <>
                <ButtonLink href="/courses" variant="primary">
                  Browse all courses
                </ButtonLink>
                <ButtonLink href={enquireHref({ topic: 'course' })} variant="secondary">
                  Make an enquiry
                </ButtonLink>
              </>
            }
          />
        ) : (
          <>
            {levels.length > 1 && (
              <Reveal className="mb-8">
                <ul className="flex flex-wrap gap-2" aria-label="Browse by qualification level">
                  {levels.map((level) => (
                    <li key={level.level}>
                      <AppLink
                        href={coursesHref({ category: category.slug, level: level.level })}
                        className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink-muted transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-ink"
                      >
                        {level.level}
                        <span className="rounded-full bg-surface-muted px-1.5 text-xs tabular-nums">{level.count}</span>
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            <Stagger as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <StaggerItem as="li" key={course.slug}>
                  <CourseCard course={course} />
                </StaggerItem>
              ))}
            </Stagger>
          </>
        )}
      </Section>

      {/* General pathways */}
      {category.pathways.length > 0 && (
        <Section>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeader
                eyebrow="Study pathways"
                heading="Where this study area can lead"
                intro="General options across this study area. Each course lists its own pathways."
                className="mb-0 sm:mb-0"
              />
            </div>
            <div className="lg:col-span-7">
              <Stagger as="ol" className="space-y-4">
                {category.pathways.map((pathway, index) => (
                  <StaggerItem as="li" key={pathway} className="flex items-start gap-4 rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-on-primary-soft">
                      <Route aria-hidden className="size-5" />
                      <span className="sr-only">Pathway {index + 1}</span>
                    </span>
                    <p className="pt-2 leading-relaxed text-ink">{pathway}</p>
                  </StaggerItem>
                ))}
              </Stagger>
              <Reveal>
                <p className="mt-6 flex gap-2.5 text-sm leading-relaxed text-ink-subtle">
                  <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                  Pathways describe possible next steps, not guaranteed outcomes. Entry to further study depends on meeting that course’s requirements, and not every
                  pathway applies to every course.
                </p>
              </Reveal>
            </div>
          </div>
        </Section>
      )}

      <Section className={category.pathways.length > 0 ? 'pt-0 sm:pt-0 lg:pt-0' : undefined}>
        <CtaBanner
          eyebrow={`Questions about ${category.name}?`}
          heading="Talk to an admissions adviser"
          body="Tell us about your goals and experience, and we will help you compare courses, entry requirements and intakes."
          actions={[
            { label: 'Make an enquiry', href: enquireHref({ topic: 'course' }), variant: 'accent' },
            { label: 'Browse all courses', href: '/courses', variant: 'secondary' },
          ]}
        />
      </Section>
    </>
  )
}

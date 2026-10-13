import { useSuspenseQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { useParams, useSearchParams, type LoaderFunctionArgs } from 'react-router'
import { useFeature, useSettings, queries } from '@/api/queries'
import type { Audience } from '@/api/types'
import { orNotFound, queryClient } from '@/app/routing'
import { ButtonLink } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { AUDIENCE_LONG_LABELS } from '@/components/shared/labels'
import { CourseCard } from '@/components/shared/cards'
import { CtaBanner } from '@/components/shared/CtaBanner'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'
import { env } from '@/config/env'
import { applyHref, coursesHref, enquireHref } from '@/lib/links'
import { JsonLd, Seo } from '@/lib/seo'
import { nextOpenIntake, offeringsFor, resolveAudience, sectionsFor } from './components/course-detail'
import { CourseHero } from './components/CourseHero'
import { CourseSectionNav } from './components/CourseSectionNav'
import {
  CreditSection,
  CurriculumSection,
  DeliverySection,
  DownloadsSection,
  EntrySection,
  KeyFactsSection,
  OutcomesSection,
  OverviewSection,
  PathwaysSection,
  PlacementSection,
} from './components/CourseSections'
import { FeesSection, IntakesSection, MobileActionBar, PlanStudyCard } from './components/CoursePlanning'
import { useViewportPosition } from './components/hooks'

export async function loader({ params }: LoaderFunctionArgs) {
  await orNotFound(queryClient.ensureQueryData(queries.course(params.slug!)))
  return null
}

export default function CourseDetailPage() {
  const { slug = '' } = useParams()
  const { data: course } = useSuspenseQuery(queries.course(slug))
  const settings = useSettings()
  const creditPageEnabled = useFeature('creditTransfer')
  const [searchParams, setSearchParams] = useSearchParams()
  const { audience, unavailable } = resolveAudience(course, searchParams.get('audience'))

  const setAudience = useCallback(
    (next: Audience) =>
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          params.set('audience', next)
          return params
        },
        { replace: true, preventScrollReset: true },
      ),
    [setSearchParams],
  )

  const sections = useMemo(() => sectionsFor(course), [course])
  const has = (id: (typeof sections)[number]) => sections.includes(id)

  const bodyRef = useRef<HTMLDivElement>(null)
  const heroActionsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const heroActions = useViewportPosition(heroActionsRef)
  const cta = useViewportPosition(ctaRef)
  const canApply = Boolean(nextOpenIntake(offeringsFor(course, audience)))

  return (
    <>
      <Seo title={course.seo?.title ?? course.title} description={course.seo?.description ?? course.summary} image={course.seo?.image ?? course.image.src} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          description: course.seo?.description ?? course.summary,
          ...(course.code ? { courseCode: course.code } : {}),
          ...(env.siteUrl ? { url: `${env.siteUrl}/courses/${course.slug}` } : {}),
          inLanguage: course.teachingLanguage,
          provider: { '@type': 'Organization', name: settings.name, ...(env.siteUrl ? { url: env.siteUrl } : {}) },
        }}
      />

      <CourseHero course={course} audience={audience} unavailableAudience={unavailable} onAudienceChange={setAudience} actionsRef={heroActionsRef} />

      {/* Polite announcement when the student type changes (fees, intakes and notes update). */}
      <p aria-live="polite" className="sr-only">
        {audience && searchParams.get('audience') ? `Showing fees, intakes and entry notes for ${AUDIENCE_LONG_LABELS[audience].toLowerCase()}.` : ''}
      </p>

      <div ref={bodyRef} className="relative">
        <CourseSectionNav ids={sections} progressTarget={bodyRef} />

        <div className="container-page grid gap-12 pb-8 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-8">
            <OverviewSection course={course} />
            <KeyFactsSection course={course} audience={audience} />
            {has('outcomes') && <OutcomesSection course={course} />}
            {has('curriculum') && <CurriculumSection course={course} />}
            {has('entry-requirements') && <EntrySection course={course} audience={audience} />}
            {has('delivery') && <DeliverySection course={course} />}
            {has('placement') && <PlacementSection course={course} />}
            {has('fees') && <FeesSection course={course} audience={audience} onAudienceChange={setAudience} />}
            {has('intakes') && <IntakesSection course={course} audience={audience} onAudienceChange={setAudience} />}
            {has('credit') && <CreditSection course={course} showLink={creditPageEnabled} />}
            {has('pathways') && <PathwaysSection course={course} />}
            {has('downloads') && <DownloadsSection course={course} />}
          </div>
          <aside aria-label="Plan your study" className="hidden lg:col-span-4 lg:block">
            <PlanStudyCard course={course} audience={audience} onAudienceChange={setAudience} />
          </aside>
        </div>

        {has('related') && (
          <Section id="related" background="alt" aria-labelledby="related-heading" className="scroll-mt-[calc(var(--header-h)+5rem)]">
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">Keep exploring</p>
                <h2 id="related-heading" tabIndex={-1} className="mt-3 font-display text-3xl font-semibold text-ink outline-none sm:text-4xl">
                  Related courses
                </h2>
              </div>
              <ButtonLink href={coursesHref({ category: course.category.slug })} variant="secondary" arrow>
                More in {course.category.name}
              </ButtonLink>
            </div>
            <Stagger as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {course.related.map((related) => (
                <StaggerItem as="li" key={related.slug}>
                  <CourseCard course={related} audience={audience && related.audiences.includes(audience) ? audience : undefined} />
                </StaggerItem>
              ))}
            </Stagger>
          </Section>
        )}
      </div>

      <Section>
        <div ref={ctaRef}>
          <CtaBanner
            eyebrow="Next step"
            heading={canApply ? 'Ready to apply?' : 'Plan your start date'}
            body={
              canApply
                ? 'Choose your campus and intake, then submit your application for admissions review. Not sure yet? Ask us anything about this course.'
                : 'There are no intakes open for applications right now. Our admissions team can tell you when the next dates are published.'
            }
            actions={[
              ...(canApply ? [{ label: 'Apply now', href: applyHref({ course: course.slug, audience }), variant: 'accent' as const }] : []),
              { label: 'Make an enquiry', href: enquireHref({ course: course.slug, audience }), variant: canApply ? ('secondary' as const) : ('accent' as const) },
            ]}
          />
        </div>
      </Section>

      <MobileActionBar course={course} audience={audience} visible={heroActions === 'above' && cta === 'below'} />
    </>
  )
}

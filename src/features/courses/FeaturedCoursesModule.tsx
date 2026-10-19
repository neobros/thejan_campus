import { useQuery } from '@tanstack/react-query'
import { queries } from '@/api/queries'
import type { Audience } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import { moduleProp, type ModuleComponentProps } from '@/components/blocks/types'
import { ButtonLink } from '@/components/ui/Button'
import { CardGridSkeleton, EmptyState, ErrorPanel } from '@/components/ui/feedback'
import { Reveal } from '@/components/motion/Reveal'
import { CardCarouselTrack, useCardCarousel } from './carousel'
import { CourseCard } from '@/components/shared/cards'
import { coursesHref } from '@/lib/links'

/** Course showcase. `layout: "grid"` shows every course in a 3-per-row grid (revealed on scroll); the default is a horizontal carousel. */
export function FeaturedCoursesModule({ block, className }: ModuleComponentProps) {
  const audience = moduleProp<Audience | undefined>(block, 'audience', undefined)
  const category = moduleProp<string | undefined>(block, 'category', undefined)
  const layout = moduleProp<'grid' | 'carousel'>(block, 'layout', 'carousel')
  const isGrid = layout === 'grid'
  const limit = moduleProp(block, 'limit', isGrid ? 48 : 6)
  const { data, isPending, isError, refetch } = useQuery(queries.courses({ audience, category, pageSize: 48 }))
  const courses = [...(data?.items ?? [])].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, limit)
  const carousel = useCardCarousel(courses.length)

  return (
    <ModuleSection
      block={block}
      className={className}
      action={
        <ButtonLink href={coursesHref({ audience, category })} variant="secondary" arrow className="hidden sm:inline-flex">
          Browse all
        </ButtonLink>
      }
    >
      {isPending ? (
        <CardGridSkeleton count={isGrid ? 6 : 3} />
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : courses.length === 0 ? (
        <EmptyState title="No courses to show yet" description="Please check back soon or browse the full catalogue." />
      ) : isGrid ? (
        // Each card reveals on its own as it scrolls in — a single tall Stagger container
        // can fail to trigger for a long grid, leaving every card stuck invisible.
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <Reveal key={course.slug} as="li" y={24} delay={(i % 3) * 0.08} className="h-full">
              <CourseCard course={course} audience={audience} />
            </Reveal>
          ))}
        </ul>
      ) : (
        <CardCarouselTrack carousel={carousel} label="Featured courses">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} audience={audience} />
          ))}
        </CardCarouselTrack>
      )}
    </ModuleSection>
  )
}

import { useQuery } from '@tanstack/react-query'
import { queries } from '@/api/queries'
import type { Audience } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import { moduleProp, type ModuleComponentProps } from '@/components/blocks/types'
import { ButtonLink } from '@/components/ui/Button'
import { CardGridSkeleton, EmptyState, ErrorPanel } from '@/components/ui/feedback'
import { CardCarouselTrack, useCardCarousel } from './carousel'
import { CourseCard } from '@/components/shared/cards'
import { coursesHref } from '@/lib/links'

/** Horizontally scrolling course carousel (shares its UI with the intake explorer). */
export function FeaturedCoursesModule({ block, className }: ModuleComponentProps) {
  const audience = moduleProp<Audience | undefined>(block, 'audience', undefined)
  const category = moduleProp<string | undefined>(block, 'category', undefined)
  const limit = moduleProp(block, 'limit', 6)
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
        <CardGridSkeleton count={3} />
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : courses.length === 0 ? (
        <EmptyState title="No courses to show yet" description="Please check back soon or browse the full catalogue." />
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

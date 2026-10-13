import { useQuery } from '@tanstack/react-query'
import { CalendarDays } from 'lucide-react'
import { queries } from '@/api/queries'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import { moduleProp, type ModuleComponentProps } from '@/components/blocks/types'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { EventCard } from '@/components/shared/cards'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'

export function UpcomingEventsModule({ block, className }: ModuleComponentProps) {
  const limit = moduleProp(block, 'limit', 3)
  const { data, isPending, isError, refetch } = useQuery(queries.events({ when: 'upcoming', pageSize: limit }))
  return (
    <ModuleSection
      block={block}
      className={className}
      action={
        <ButtonLink href="/events" variant="secondary" arrow>
          All events
        </ButtonLink>
      }
    >
      {isPending ? (
        <LoadingRegion className="space-y-4">
          {Array.from({ length: limit }, (_, i) => (
            <Skeleton key={i} className="h-36 rounded-[1.75rem]" />
          ))}
        </LoadingRegion>
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No upcoming events right now"
          description="New events are added regularly — check back soon or browse past events."
          actions={
            <ButtonLink href="/events?when=past" variant="secondary">
              Past events
            </ButtonLink>
          }
        />
      ) : (
        <Stagger className="grid gap-4 lg:grid-cols-1">
          {data.items.map((event) => (
            <StaggerItem key={event.slug}>
              <EventCard event={event} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </ModuleSection>
  )
}

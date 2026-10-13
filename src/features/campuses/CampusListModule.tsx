import { useQuery } from '@tanstack/react-query'
import { Building } from 'lucide-react'
import { queries } from '@/api/queries'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import type { ModuleComponentProps } from '@/components/blocks/types'
import { CardGridSkeleton, EmptyState, ErrorPanel } from '@/components/ui/feedback'
import { CampusCard } from '@/components/shared/cards'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'

export function CampusListModule({ block, className }: ModuleComponentProps) {
  const { data, isPending, isError, refetch } = useQuery(queries.campuses())
  return (
    <ModuleSection block={block} className={className}>
      {isPending ? (
        <CardGridSkeleton count={3} />
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : data.length === 0 ? (
        <EmptyState icon={Building} title="Campus information is coming soon" description="Contact us for location details." />
      ) : (
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((campus) => (
            <StaggerItem key={campus.slug}>
              <CampusCard campus={campus} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </ModuleSection>
  )
}

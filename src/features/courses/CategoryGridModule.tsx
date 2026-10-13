import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { queries } from '@/api/queries'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import type { ModuleComponentProps } from '@/components/blocks/types'
import { AppLink } from '@/components/ui/AppLink'
import { ButtonLink } from '@/components/ui/Button'
import { CardGridSkeleton, ErrorPanel } from '@/components/ui/feedback'
import { CategoryCard } from '@/components/shared/cards'
import { Aurora, CountUp } from '@/components/motion/effects'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'

const SPAN_SM = ['', 'sm:col-span-1', 'sm:col-span-2'] as const
const SPAN_LG = ['', 'lg:col-span-1', 'lg:col-span-2', 'lg:col-span-3', 'lg:col-span-4'] as const

/** Closing tile that completes the bento grid and leads to the full catalogue. */
function BrowseAllTile({ total, className }: { total: number; className?: string }) {
  return (
    <AppLink
      href="/courses"
      className={cn(
        'theme-night group relative isolate flex min-h-56 flex-col justify-between overflow-hidden rounded-[1.75rem] p-6 text-white shadow-card ring-1 ring-white/10 transition-shadow duration-500 hover:shadow-float sm:p-7',
        className,
      )}
    >
      <Aurora className="-z-10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-40 mask-fade-radial [--grid-color:rgb(255_255_255/0.06)] [--grid-size:32px]" />
      <div aria-hidden className="absolute -right-16 -top-16 size-56 rounded-full border border-white/10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-125" />
      <div aria-hidden className="absolute -right-4 -top-4 size-32 rounded-full border border-white/10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300">Full catalogue</p>
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-5xl font-semibold leading-none sm:text-6xl">
            <CountUp value={total} />
          </p>
          <p className="mt-2 text-white/75">courses to compare by level, campus, fees and intake</p>
        </div>
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-[#0b1324] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:scale-110">
          <ArrowRight aria-hidden className="size-5" />
        </span>
      </div>
    </AppLink>
  )
}

/**
 * Study areas as a bento grid: the first area takes a 2×2 tile, the rest fill in, and a
 * "browse all" tile completes the last row so no tile is stretched into an awkward banner.
 */
export function CategoryGridModule({ block, className }: ModuleComponentProps) {
  const { data, isPending, isError, refetch } = useQuery(queries.categories())
  const categories = data?.filter((c) => c.courseCount > 0) ?? []
  const total = categories.reduce((sum, c) => sum + c.courseCount, 0)

  // Cells used by the tiles: the featured tile occupies 4, each other tile 1.
  const cells = 4 + Math.max(0, categories.length - 1)
  const leftoverLg = (4 - (cells % 4)) % 4 || 4
  const leftoverSm = (2 - (cells % 2)) % 2 || 2

  return (
    <ModuleSection
      block={block}
      className={className}
      action={
        <ButtonLink href="/courses" variant="secondary" arrow>
          All courses
        </ButtonLink>
      }
    >
      {isPending ? (
        <CardGridSkeleton count={4} />
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : (
        <Stagger className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <StaggerItem key={category.slug} className={cn(index === 0 && 'sm:col-span-2 lg:row-span-2')}>
              <CategoryCard category={category} featured={index === 0} className="h-full" />
            </StaggerItem>
          ))}
          <StaggerItem className={cn(SPAN_SM[leftoverSm], SPAN_LG[leftoverLg])}>
            <BrowseAllTile total={total} className="h-full" />
          </StaggerItem>
        </Stagger>
      )}
    </ModuleSection>
  )
}

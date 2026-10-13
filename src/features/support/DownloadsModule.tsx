import { useQuery } from '@tanstack/react-query'
import { FolderOpen, RotateCcw } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { queries, useSettings } from '@/api/queries'
import type { Audience, ResourceType } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import { moduleProp, type ModuleComponentProps } from '@/components/blocks/types'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { SegmentedControl } from '@/components/ui/Tabs'
import { AUDIENCE_LABELS, RESOURCE_TYPE_LABELS } from '@/components/shared/labels'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import { pluralize } from '@/lib/format'
import { enquireHref } from '@/lib/links'
import { ChipGroup, FilterPanel, ResultCount, SearchField } from './components/filters'
import { ResourceRow } from './components/ResourceRow'

const TYPES = Object.keys(RESOURCE_TYPE_LABELS) as ResourceType[]
const AUDIENCES: Audience[] = ['domestic', 'international']

const asType = (value: string | null): ResourceType | undefined => (value && TYPES.includes(value as ResourceType) ? (value as ResourceType) : undefined)
const asAudience = (value: string | null): Audience | undefined =>
  value && AUDIENCES.includes(value as Audience) ? (value as Audience) : undefined

function RowsSkeleton() {
  return (
    <LoadingRegion className="space-y-3">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center gap-5 rounded-3xl border border-line bg-surface p-5">
          <Skeleton className="size-14 rounded-2xl" />
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </div>
          <Skeleton className="hidden h-9 w-28 rounded-full sm:block" />
        </div>
      ))}
    </LoadingRegion>
  )
}

/**
 * Resource library (spec §5.20). With `showFilters`, type/audience/keyword filters live in the URL
 * (`?type=`, `?audience=`, `?q=` — the site search links here with `?q=`). Fixed `type`/`audience`
 * props pre-filter without showing controls.
 */
export function DownloadsModule({ block, className }: ModuleComponentProps) {
  const fixedType = asType(moduleProp<string | null>(block, 'type', null))
  const fixedAudience = asAudience(moduleProp<string | null>(block, 'audience', null))
  const showFilters = moduleProp(block, 'showFilters', false)
  const { features } = useSettings()
  const enabledAudiences = AUDIENCES.filter((a) => features[a])

  const [params, setParams] = useSearchParams()
  const urlType = showFilters ? asType(params.get('type')) : undefined
  const urlAudience = showFilters ? asAudience(params.get('audience')) : undefined
  const urlQ = showFilters ? (params.get('q') ?? '').trim() : ''

  const type = fixedType ?? urlType
  const audience = fixedAudience ?? (urlAudience && enabledAudiences.includes(urlAudience) ? urlAudience : undefined)

  const setParam = useCallback(
    (key: 'type' | 'audience' | 'q', value: string | undefined) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (value) next.set(key, value)
          else next.delete(key)
          return next
        },
        { replace: true, preventScrollReset: true },
      ),
    [setParams],
  )

  // The keyword box keeps local state (so fast typing is never lost) and syncs to the URL after a pause.
  const [term, setTerm] = useState(urlQ)
  const [seenQ, setSeenQ] = useState(urlQ)
  if (urlQ !== seenQ) {
    setSeenQ(urlQ)
    if (urlQ !== term.trim()) setTerm(urlQ)
  }
  useEffect(() => {
    if (!showFilters) return
    const next = term.trim()
    if (next === urlQ) return
    const timer = setTimeout(() => setParam('q', next || undefined), 300)
    return () => clearTimeout(timer)
  }, [term, urlQ, showFilters, setParam])

  const base = useQuery({ ...queries.resources({ type: fixedType, audience: fixedAudience }), enabled: showFilters })
  const { data, isPending, isError, isPlaceholderData, refetch } = useQuery(queries.resources({ type, audience, q: urlQ || undefined }))
  const resources = data ?? []

  const presentTypes = TYPES.filter((t) => base.data?.some((r) => r.type === t))
  const showTypeFilter = showFilters && !fixedType && presentTypes.length > 1
  const showAudienceFilter = showFilters && !fixedAudience && enabledAudiences.length > 1
  const filtered = Boolean(urlType || urlAudience || urlQ)
  const total = base.data?.length

  const clearAll = () => {
    setTerm('')
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const key of ['type', 'audience', 'q']) next.delete(key)
        return next
      },
      { replace: true, preventScrollReset: true },
    )
  }

  const noun = type ? RESOURCE_TYPE_LABELS[type].toLowerCase() : 'document'

  return (
    <ModuleSection
      block={block}
      className={className}
      action={
        !showFilters ? (
          <ButtonLink href={fixedType ? `/downloads?type=${fixedType}` : '/downloads'} variant="secondary" arrow>
            All downloads
          </ButtonLink>
        ) : undefined
      }
    >
      {showFilters && (
        <Reveal>
          <FilterPanel>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <SearchField label="Search documents" value={term} onChange={setTerm} placeholder="e.g. handbook, refund, calendar" />
              {showAudienceFilter && (
                <div className="min-w-0">
                  <p className="mb-2 text-sm font-semibold text-ink">Student type</p>
                  <SegmentedControl
                    label="Student type"
                    value={audience ?? 'all'}
                    onChange={(value) => setParam('audience', value === 'all' ? undefined : value)}
                    options={[{ value: 'all', label: 'All' }, ...enabledAudiences.map((a) => ({ value: a, label: AUDIENCE_LABELS[a] }))]}
                  />
                </div>
              )}
            </div>
            {showTypeFilter && (
              <div className="mt-5 border-t border-line pt-4">
                <p className="mb-2.5 text-sm font-semibold text-ink">Document type</p>
                <ChipGroup
                  label="Document type"
                  value={urlType ?? 'all'}
                  onChange={(value) => setParam('type', value === 'all' ? undefined : value)}
                  options={[{ value: 'all', label: 'All types' }, ...presentTypes.map((t) => ({ value: t, label: RESOURCE_TYPE_LABELS[t] }))]}
                />
              </div>
            )}
          </FilterPanel>
        </Reveal>
      )}

      {isPending ? (
        <RowsSkeleton />
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : (
        <>
          {showFilters && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <ResultCount>
                {filtered && total !== undefined
                  ? `Showing ${resources.length} of ${pluralize(total, 'document')}`
                  : `${pluralize(resources.length, 'document')} available`}
              </ResultCount>
              {filtered && (
                <Button variant="ghost" size="sm" onClick={clearAll} icon={<RotateCcw aria-hidden className="size-3.5" />}>
                  Clear filters
                </Button>
              )}
            </div>
          )}
          {resources.length === 0 ? (
            filtered ? (
              <EmptyState
                icon={FolderOpen}
                title="No documents match your filters"
                description="Try another keyword or document type, or clear the filters to see everything that is published."
                actions={
                  <>
                    <Button variant="secondary" onClick={clearAll}>
                      Clear filters
                    </Button>
                    <ButtonLink href={enquireHref({ topic: 'support' })} variant="primary">
                      Ask for a document
                    </ButtonLink>
                  </>
                }
              />
            ) : (
              <EmptyState
                icon={FolderOpen}
                title={`No ${noun}s are published yet`}
                description="Current approved documents will appear here. If you need something now, our team can help."
                actions={
                  <ButtonLink href={enquireHref({ topic: 'support' })} variant="primary">
                    Contact student support
                  </ButtonLink>
                }
              />
            )
          ) : (
            <Reveal>
              <ul aria-busy={isPlaceholderData || undefined} className={cn('space-y-3 transition-opacity duration-300', isPlaceholderData && 'opacity-60')}>
                <AnimatePresence initial={false} mode="popLayout">
                  {resources.map((resource, index) => (
                    <ResourceRow key={resource.id} resource={resource} query={urlQ} index={index} />
                  ))}
                </AnimatePresence>
              </ul>
            </Reveal>
          )}
        </>
      )}
    </ModuleSection>
  )
}

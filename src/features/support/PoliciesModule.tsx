import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ScrollText } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useDeferredValue, useState } from 'react'
import { queries } from '@/api/queries'
import type { PolicySummary } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import type { ModuleComponentProps } from '@/components/blocks/types'
import { AppLink } from '@/components/ui/AppLink'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Reveal } from '@/components/motion/Reveal'
import { formatDate, pluralize } from '@/lib/format'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { enquireHref } from '@/lib/links'
import { ChipGroup, FilterPanel, Highlight, ResultCount, SearchField } from './components/filters'
import { listItemMotion } from './components/motion'
import { matchesQuery } from './components/search'

function PolicyCard({ policy, query, index }: { policy: PolicySummary; query: string; index: number }) {
  return (
    <motion.li {...listItemMotion(index)} className="h-full">
      <article className="group relative flex h-full flex-col rounded-3xl border border-line bg-surface p-6 shadow-card transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-canvas hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface-muted text-primary-ink transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
            <ScrollText aria-hidden className="size-5" />
          </span>
          <div className="min-w-0">
            <h4 className="text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-primary-ink">
              <AppLink href={`/policies/${policy.slug}`} className="after:absolute after:inset-0 after:z-10 after:rounded-[inherit] focus-visible:outline-none">
                <Highlight text={policy.title} query={query} />
              </AppLink>
            </h4>
            <p className="mt-1.5 line-clamp-3 leading-relaxed text-ink-muted">{policy.summary}</p>
          </div>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <dl className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-subtle">
            <div className="flex gap-1">
              <dt>Version</dt>
              <dd className="font-medium text-ink-muted">{policy.version}</dd>
            </div>
            <div className="flex gap-1">
              <dt>Effective</dt>
              <dd className="font-medium text-ink-muted">
                <time dateTime={policy.effectiveDate}>{formatDate(policy.effectiveDate, 'medium')}</time>
              </dd>
            </div>
          </dl>
          <ArrowRight aria-hidden className="size-4 text-primary-ink transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </article>
    </motion.li>
  )
}

/** Policy index grouped by category with search and category chips (spec §5.21). */
export function PoliciesModule({ block, className }: ModuleComponentProps) {
  const { data, isPending, isError, refetch } = useQuery(queries.policies())
  const [term, setTerm] = useState('')
  const [category, setCategory] = useState('all')
  const query = useDeferredValue(term)
  const policies = data ?? []

  const categories = [...new Set(policies.map((p) => p.category))].sort((a, b) => a.localeCompare(b))
  const searched = policies.filter((p) => matchesQuery(query, p.title, p.summary, p.category, p.owner))
  const activeCategory = categories.includes(category) ? category : 'all'
  const visible = searched.filter((p) => activeCategory === 'all' || p.category === activeCategory)
  const groups = categories
    .map((name) => ({ name, items: visible.filter((p) => p.category === name).sort((a, b) => a.title.localeCompare(b.title)) }))
    .filter((g) => g.items.length > 0)
  const filtered = Boolean(query.trim()) || activeCategory !== 'all'

  const clear = () => {
    setTerm('')
    setCategory('all')
  }

  return (
    <ModuleSection block={block} className={className}>
      {isPending ? (
        <LoadingRegion className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-24 rounded-3xl md:col-span-2" />
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-44 rounded-3xl" />
          ))}
        </LoadingRegion>
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : policies.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="Policies will be published here"
          description="Approved policies appear on this page once they are finalised. Contact us if you need information about a policy now."
          actions={
            <ButtonLink href={enquireHref({ topic: 'support' })} variant="primary">
              Contact us
            </ButtonLink>
          }
        />
      ) : (
        <>
          <Reveal>
            <FilterPanel>
              <SearchField label="Search policies" value={term} onChange={setTerm} placeholder="e.g. refunds, appeals, attendance" className="max-w-xl" />
              {categories.length > 1 && (
                <div className="mt-5 border-t border-line pt-4">
                  <p className="mb-2.5 text-sm font-semibold text-ink">Category</p>
                  <ChipGroup
                    label="Policy category"
                    value={activeCategory}
                    onChange={setCategory}
                    options={[
                      { value: 'all', label: 'All', count: searched.length },
                      ...categories.map((c) => ({ value: c, label: c, count: searched.filter((p) => p.category === c).length })),
                    ]}
                  />
                </div>
              )}
            </FilterPanel>
          </Reveal>
          <ResultCount className="mb-6">
            {filtered ? `Showing ${visible.length} of ${pluralize(policies.length, 'policy', 'policies')}` : `${pluralize(policies.length, 'current policy', 'current policies')}`}
          </ResultCount>
          {groups.length === 0 ? (
            <EmptyState
              icon={ScrollText}
              title="No policies match your search"
              description="Try a different word or category. Student support can also explain which policy applies to your situation."
              actions={
                <>
                  <Button variant="secondary" onClick={clear}>
                    Clear filters
                  </Button>
                  <ButtonLink href={enquireHref({ topic: 'support' })} variant="primary">
                    Ask student support
                  </ButtonLink>
                </>
              }
            />
          ) : (
            <div className="space-y-12">
              <AnimatePresence initial={false} mode="popLayout">
                {groups.map((group) => (
                  <motion.section
                    key={group.name}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                    aria-labelledby={`${block.id}-${group.name}`.replace(/[^\w-]/g, '-')}
                  >
                    <div className="mb-5 flex items-center gap-4">
                      <h3 id={`${block.id}-${group.name}`.replace(/[^\w-]/g, '-')} className="font-display text-2xl font-semibold text-ink">
                        {group.name}
                      </h3>
                      <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium tabular-nums text-ink-subtle ring-1 ring-inset ring-line">
                        {group.items.length}
                      </span>
                      <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-line-strong/50 to-transparent" />
                    </div>
                    <ul className="grid gap-4 md:grid-cols-2">
                      <AnimatePresence initial={false} mode="popLayout">
                        {group.items.map((policy, index) => (
                          <PolicyCard key={policy.id} policy={policy} query={query} index={index} />
                        ))}
                      </AnimatePresence>
                    </ul>
                  </motion.section>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </ModuleSection>
  )
}

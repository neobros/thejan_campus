import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, List, SearchX } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, type MouseEvent } from 'react'
import { useSearchParams, type LoaderFunctionArgs } from 'react-router'
import { queries } from '@/api/queries'
import { prefetchOptionalPage, queryClient, useOptionalPage } from '@/app/routing'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Button, ButtonLink } from '@/components/ui/Button'
import { CardGridSkeleton, EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Select } from '@/components/ui/form'
import { Pagination } from '@/components/ui/Pagination'
import { SegmentedControl } from '@/components/ui/Tabs'
import { CourseCard } from '@/components/shared/cards'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import { pluralize } from '@/lib/format'
import { enquireHref } from '@/lib/links'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { Seo } from '@/lib/seo'
import { ActiveFilterChips, FilterDrawer, FilterFields, FiltersButton, SearchBox } from './components/CatalogueFilters'
import {
  activeFilterCount,
  FILTER_KEYS,
  isCatalogueMounted,
  parseCatalogue,
  registerCatalogueMount,
  SORT_OPTIONS,
  toCourseQuery,
  type CatalogueView,
  type FilterKey,
  type FilterValues,
} from './components/catalogue'
import { prefersReducedMotion, useStickyTop, useViewportPosition } from './components/hooks'

export async function loader({ request }: LoaderFunctionArgs) {
  const query = toCourseQuery(parseCatalogue(new URL(request.url).searchParams))
  const results = queryClient.ensureQueryData(queries.courses(query)).catch(() => undefined)
  await Promise.all([
    prefetchOptionalPage('courses'),
    queryClient.ensureQueryData(queries.courseFilters()).catch(() => undefined),
    // Arriving on the page: wait for the first results so it renders complete. Refining filters on
    // the page: don't hold the URL back — the list keeps its previous results and animates.
    isCatalogueMounted() ? undefined : results,
  ])
  return null
}

type Patch = Partial<Record<FilterKey | 'sort' | 'view' | 'page', string | undefined>>

export default function CoursesPage() {
  const cms = useOptionalPage('courses')
  const [searchParams, setSearchParams] = useSearchParams()
  const state = parseCatalogue(searchParams)
  const query = toCourseQuery(state)

  const { data: options, isError: filtersFailed, refetch: refetchFilters } = useQuery(queries.courseFilters())
  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = useQuery(queries.courses(query))

  useEffect(() => registerCatalogueMount(), [])

  const sidebarRef = useRef<HTMLDivElement>(null)
  useStickyTop(sidebarRef)
  const resultsRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const toolbarPosition = useViewportPosition(toolbarRef)

  const update = useCallback(
    (patch: Patch, { resetPage = true, push = false } = {}) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(patch)) {
            if (value) next.set(key, value)
            else next.delete(key)
          }
          if (resetPage) next.delete('page')
          return next
        },
        { replace: !push, preventScrollReset: true },
      )
    },
    [setSearchParams],
  )

  const clearAll = () => update(Object.fromEntries(FILTER_KEYS.map((key) => [key, undefined])))
  const applyFilters = (values: FilterValues) => update({ ...values })
  const removeFilter = (key: FilterKey) => {
    update({ [key]: undefined })
    // The chip disappears — keep keyboard focus somewhere sensible.
    requestAnimationFrame(() => searchInputRef.current?.focus({ preventScroll: true }))
  }

  /* Pagination links would reset the scroll to the top of the page; keep the visitor in the
   * results instead (the shared component stays in charge of rendering and hrefs). */
  const onPaginationClick = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest('a')
    if (!anchor || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const target = new URL(anchor.href).searchParams.get('page') ?? undefined
    update({ page: target && target !== '1' ? target : undefined }, { resetPage: false, push: true })
    resultsRef.current?.scrollIntoView({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  const filterCount = activeFilterCount(state, false)
  const total = data?.total ?? 0
  const items = data?.items ?? []
  const audience = state.audience || undefined
  const from = data ? (data.page - 1) * data.pageSize + 1 : 0
  const to = data ? from + items.length - 1 : 0
  const updating = isFetching && isPlaceholderData

  const drawer = (floating?: boolean) => (
    <FilterDrawer
      state={state}
      options={options}
      onApply={applyFilters}
      trigger={<FiltersButton count={filterCount} className={cn(floating && 'h-12 border-transparent bg-ink px-5 text-canvas shadow-float hover:bg-ink hover:text-canvas')} />}
    />
  )

  return (
    <>
      <Seo title={cms?.seo?.title ?? 'Courses'} description={cms?.seo?.description ?? cms?.summary ?? 'Search and filter courses by study area, qualification level, campus, delivery mode, student type and intake.'} image={cms?.seo?.image} />
      <PageHero
        title={cms?.title ?? 'Find your *course*'}
        eyebrow={cms?.eyebrow ?? 'Courses'}
        summary={cms?.summary ?? 'Search and filter courses by study area, qualification level, campus, delivery mode, student type and intake.'}
        image={cms?.hero?.image}
        actions={cms?.hero?.actions}
        breadcrumbs={[{ label: 'Courses' }]}
      />

      <section aria-labelledby="catalogue-heading" className="bg-canvas py-12 sm:py-16 lg:py-20">
        <h2 id="catalogue-heading" className="sr-only">
          Course catalogue
        </h2>
        <div className="container-page grid gap-10 lg:grid-cols-[17.5rem_minmax(0,1fr)] xl:gap-14">
          {/* Desktop: sticky sidebar, filters apply instantly. */}
          <aside aria-labelledby="filters-heading" className="hidden lg:block">
            <div
              ref={sidebarRef}
              className="sticky top-[calc(var(--sticky-top,4.5rem)+1.5rem)] max-h-[calc(100svh-var(--sticky-top,4.5rem)-3rem)] overflow-y-auto overscroll-contain rounded-[1.75rem] border border-line bg-surface p-6 shadow-card transition-[top] scrollbar-none"
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 id="filters-heading" className="font-display text-xl font-semibold text-ink">
                  Filter courses
                </h2>
                {filterCount > 0 && (
                  <button type="button" onClick={clearAll} className="text-sm font-semibold text-primary-ink underline-offset-4 hover:underline">
                    Clear
                  </button>
                )}
              </div>
              {filtersFailed ? (
                <ErrorPanel title="Filters could not be loaded" onRetry={() => refetchFilters()} className="p-4 sm:p-4" />
              ) : (
                <FilterFields options={options} values={state} onChange={(key, value) => update({ [key]: value || undefined })} />
              )}
            </div>
          </aside>

          <div ref={resultsRef} className="min-w-0 scroll-mt-6">
            <Reveal immediate y={16} delay={0.2}>
              <SearchBox value={state.q} onCommit={(q) => update({ q: q || undefined })} busy={updating} inputRef={searchInputRef} />
            </Reveal>

            <div ref={toolbarRef} className="mt-5 flex flex-wrap items-center gap-3">
              <div className="lg:hidden">{drawer()}</div>
              <p aria-live="polite" aria-atomic="true" className="mr-auto text-[0.9375rem] text-ink-muted">
                {isPending ? (
                  'Loading courses…'
                ) : isError ? (
                  ''
                ) : total === 0 ? (
                  'No courses found'
                ) : data && data.pageCount > 1 ? (
                  <>
                    Showing <strong className="font-semibold text-ink">{from}–{to}</strong> of <strong className="font-semibold text-ink">{pluralize(total, 'course')}</strong>
                  </>
                ) : (
                  <strong className="font-semibold text-ink">{pluralize(total, 'course')}</strong>
                )}
              </p>
              <label className="flex items-center gap-2 text-sm text-ink-muted">
                <span className="hidden sm:inline">Sort by</span>
                <span className="sr-only sm:hidden">Sort by</span>
                <Select value={state.sort} onChange={(event) => update({ sort: event.target.value === 'title' ? undefined : event.target.value })} className="h-11 w-auto min-w-[10.5rem] rounded-full pl-4 text-sm">
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </label>
              <SegmentedControl<CatalogueView>
                label="Results layout"
                value={state.view}
                onChange={(view) => update({ view: view === 'grid' ? undefined : view }, { resetPage: false })}
                className="[&>button]:px-3"
                options={[
                  { value: 'grid', label: <><LayoutGrid aria-hidden className="size-4" /><span className="sr-only">Grid view</span></> },
                  { value: 'list', label: <><List aria-hidden className="size-4" /><span className="sr-only">List view</span></> },
                ]}
              />
            </div>

            <ActiveFilterChips state={state} options={options} onRemove={removeFilter} onClearAll={clearAll} />

            <div className="mt-8" aria-busy={updating || undefined}>
              {isPending ? (
                state.view === 'list' ? (
                  <LoadingRegion className="space-y-5">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Skeleton key={i} className="h-56 rounded-[1.75rem]" />
                    ))}
                  </LoadingRegion>
                ) : (
                  <CardGridSkeleton count={4} className="lg:grid-cols-2" />
                )
              ) : isError ? (
                <ErrorPanel title="Courses could not be loaded" onRetry={() => refetch()} />
              ) : items.length === 0 ? (
                <EmptyState
                  icon={SearchX}
                  title={activeFilterCount(state) > 0 ? 'No courses match your search' : 'Courses will be published soon'}
                  description={
                    activeFilterCount(state) > 0
                      ? 'Try removing a filter or searching for a broader term. Our admissions team can also help you compare suitable courses.'
                      : 'Please check back soon, or ask our admissions team about upcoming study options.'
                  }
                  actions={
                    <>
                      {activeFilterCount(state) > 0 && <Button onClick={clearAll}>Clear all filters</Button>}
                      <ButtonLink href={enquireHref({ topic: 'course', audience })} variant="secondary">
                        Ask an adviser
                      </ButtonLink>
                    </>
                  }
                />
              ) : (
                <motion.ul
                  key={state.view}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: updating ? 0.55 : 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn('grid gap-6', state.view === 'grid' ? 'sm:grid-cols-2' : 'grid-cols-1')}
                >
                  <AnimatePresence initial={false} mode="popLayout">
                    {items.map((course, index) => (
                      <motion.li
                        key={course.slug}
                        layout="position"
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.04, ease: EASE_OUT_EXPO }}
                      >
                        <CourseCard course={course} audience={audience} layout={state.view} />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </div>

            {data && (
              <div onClickCapture={onPaginationClick}>
                <Pagination page={data.page} pageCount={data.pageCount} className="mt-12" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile: once the toolbar scrolls away, keep filters one tap away. */}
      <AnimatePresence>
        {toolbarPosition === 'above' && (
          <motion.div
            key="floating-filters"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className="no-print fixed bottom-5 left-1/2 z-40 -translate-x-1/2 lg:hidden"
          >
            {drawer(true)}
          </motion.div>
        )}
      </AnimatePresence>

      {cms?.blocks && cms.blocks.length > 0 && <BlockRenderer blocks={cms.blocks} />}
    </>
  )
}

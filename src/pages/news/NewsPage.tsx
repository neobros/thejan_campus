import { useQuery } from '@tanstack/react-query'
import { Newspaper } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useMemo } from 'react'
import type { LoaderFunctionArgs } from 'react-router'
import { queries } from '@/api/queries'
import type { ArticleQuery } from '@/api/types'
import { prefetchOptionalPage, queryClient, useOptionalPage } from '@/app/routing'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Button } from '@/components/ui/Button'
import { CardGridSkeleton, EmptyState, ErrorPanel, Skeleton } from '@/components/ui/feedback'
import { Pagination } from '@/components/ui/Pagination'
import { Section } from '@/components/ui/Section'
import { ArticleCard } from '@/components/shared/cards'
import { PageHero } from '@/components/shared/PageHero'
import { cn } from '@/lib/cn'
import { pluralize } from '@/lib/format'
import { EASE_OUT_EXPO, springSnappy } from '@/lib/motion'
import { Seo } from '@/lib/seo'
import { FeaturedStory } from './articleParts'
import { pageParam, useListingParams } from './useListingParams'

const PAGE_SIZE = 7 // one featured story + a grid of six on the first page

function articleQuery(params: URLSearchParams): ArticleQuery {
  return { category: params.get('category') || undefined, page: pageParam(params), pageSize: PAGE_SIZE }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const params = new URL(request.url).searchParams
  await Promise.all([
    prefetchOptionalPage('news'),
    queryClient.prefetchQuery(queries.articles(articleQuery(params))),
    queryClient.prefetchQuery(queries.articles({ pageSize: 48 })),
  ])
  return null
}

function CategoryChips({ categories, value, total, onChange }: { categories: { name: string; count: number }[]; value?: string; total: number; onChange: (category?: string) => void }) {
  const options = [{ name: undefined, label: 'All news', count: total }, ...categories.map((c) => ({ name: c.name, label: c.name, count: c.count }))]
  return (
    <LayoutGroup id="news-categories">
      <div role="group" aria-label="Filter news by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
        {options.map((option) => {
          const active = option.name === value
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.name)}
              className={cn(
                'relative isolate inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors',
                active ? 'border-primary text-on-primary' : 'border-line bg-surface text-ink-muted hover:border-line-strong/60 hover:text-ink',
              )}
            >
              {active && <motion.span layoutId="news-chip" transition={springSnappy} className="absolute inset-0 -z-10 rounded-full bg-primary" />}
              {option.label}
              <span className={cn('rounded-full px-1.5 text-xs tabular-nums', active ? 'bg-white/20' : 'bg-surface-muted')}>{option.count}</span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}

export default function NewsPage() {
  const cms = useOptionalPage('news')
  const { params, update, pending } = useListingParams()
  const query = articleQuery(params)
  const { data, isPending, isError, isPlaceholderData, refetch } = useQuery(queries.articles(query))
  const { data: all } = useQuery(queries.articles({ pageSize: 48 }))

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const article of all?.items ?? []) counts.set(article.category, (counts.get(article.category) ?? 0) + 1)
    return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name))
  }, [all])

  const page = data?.page ?? 1
  const [lead, ...rest] = data?.items ?? []
  const featured = page === 1 ? lead : undefined
  const grid = page === 1 ? rest : (data?.items ?? [])
  const busy = pending || isPlaceholderData

  return (
    <>
      <Seo title={cms?.seo?.title ?? cms?.title ?? 'News'} description={cms?.seo?.description ?? cms?.summary ?? 'News, announcements and stories.'} image={cms?.seo?.image} />
      <PageHero
        title={cms?.title ?? 'News & *stories*'}
        eyebrow={cms?.eyebrow ?? 'News'}
        summary={cms?.summary ?? 'Announcements from our campuses and stories from our students and staff.'}
        breadcrumbs={[{ label: 'News' }]}
        image={cms?.hero?.image}
        actions={cms?.hero?.actions}
      />

      <Section>
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {categories.length > 1 ? (
            <CategoryChips categories={categories} value={query.category} total={all?.total ?? 0} onChange={(category) => update({ category, page: null })} />
          ) : all ? null : (
            <Skeleton className="h-10 w-80 rounded-full" />
          )}
          {data && (
            <p aria-live="polite" className="shrink-0 text-sm text-ink-subtle">
              {pluralize(data.total, 'article')}
              {query.category ? ` in ${query.category}` : ''}
            </p>
          )}
        </div>

        {isPending ? (
          <div className="space-y-8">
            <Skeleton className="h-[27rem] rounded-[2rem]" />
            <CardGridSkeleton count={3} />
          </div>
        ) : isError ? (
          <ErrorPanel title="News could not be loaded" onRetry={() => refetch()} />
        ) : data.items.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title={query.category ? `No ${query.category.toLowerCase()} articles yet` : 'No news yet'}
            description="Announcements and stories will appear here as they are published."
            actions={
              query.category ? (
                <Button variant="secondary" onClick={() => update({ category: null, page: null })}>
                  Show all news
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div aria-busy={busy || undefined} className={cn('transition-opacity duration-300', busy && 'opacity-60')}>
            <AnimatePresence mode="popLayout" initial={false}>
              {featured && (
                <motion.div
                  key={featured.slug}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                  className="mb-8"
                >
                  <FeaturedStory article={featured} />
                </motion.div>
              )}
            </AnimatePresence>
            {grid.length > 0 && (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {grid.map((article, index) => (
                    <motion.li
                      key={article.slug}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.55, delay: Math.min(index, 6) * 0.05, ease: EASE_OUT_EXPO }}
                    >
                      <ArticleCard article={article} headingLevel="h2" />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
            <Pagination page={page} pageCount={data.pageCount} className="mt-14" />
          </div>
        )}
      </Section>

      {cms && <BlockRenderer blocks={cms.blocks} />}
    </>
  )
}

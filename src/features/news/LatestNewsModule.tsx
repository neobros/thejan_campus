import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Newspaper } from 'lucide-react'
import { queries } from '@/api/queries'
import type { ArticleSummary } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import { moduleProp, type ModuleComponentProps } from '@/components/blocks/types'
import { AppLink } from '@/components/ui/AppLink'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { CardGridSkeleton, EmptyState, ErrorPanel } from '@/components/ui/feedback'
import { SmartImage } from '@/components/ui/SmartImage'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { formatDate } from '@/lib/format'

function FeaturedArticle({ article }: { article: ArticleSummary }) {
  return (
    <article className="theme-night group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[2rem] p-7 sm:p-9 lg:h-full">
      <SmartImage image={article.image} hoverZoom iconless className="absolute inset-0 -z-20" sizes="(min-width: 1024px) 55vw, 100vw" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#070b18] via-[#070b18]/60 to-transparent" />
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="glass">{article.category}</Badge>
        <span className="text-sm text-white/70">{formatDate(article.publishedAt.slice(0, 10), 'medium')}</span>
      </div>
      <h3 className="mt-4 max-w-xl font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
        <AppLink href={`/news/${article.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {article.title}
        </AppLink>
      </h3>
      <p className="mt-3 line-clamp-2 max-w-xl text-white/75">{article.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
        Read story <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </article>
  )
}

function CompactArticle({ article }: { article: ArticleSummary }) {
  return (
    <article className="group relative flex gap-5 rounded-3xl border border-line bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover">
      <SmartImage image={article.image} hoverZoom className="aspect-square w-28 shrink-0 rounded-2xl sm:w-32" sizes="128px" />
      <div className="min-w-0 py-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink">{article.category}</p>
        <h3 className="mt-1.5 line-clamp-2 font-semibold leading-snug text-ink transition-colors group-hover:text-primary-ink">
          <AppLink href={`/news/${article.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {article.title}
          </AppLink>
        </h3>
        <p className="mt-2 text-sm text-ink-subtle">{formatDate(article.publishedAt.slice(0, 10), 'medium')}</p>
      </div>
    </article>
  )
}

/** Latest published news in a magazine layout: one lead story plus a short list. */
export function LatestNewsModule({ block, className }: ModuleComponentProps) {
  const limit = moduleProp(block, 'limit', 3)
  const { data, isPending, isError, refetch } = useQuery(queries.articles({ pageSize: limit }))
  const [lead, ...rest] = data?.items ?? []
  return (
    <ModuleSection
      block={block}
      className={className}
      action={
        <ButtonLink href="/news" variant="secondary" arrow>
          All news
        </ButtonLink>
      }
    >
      {isPending ? (
        <CardGridSkeleton count={3} />
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : !lead ? (
        <EmptyState icon={Newspaper} title="No news yet" description="Announcements and stories will appear here." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <FeaturedArticle article={lead} />
          </Reveal>
          <Stagger className="flex flex-col gap-4 lg:col-span-5">
            {rest.map((article) => (
              <StaggerItem key={article.slug}>
                <CompactArticle article={article} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      )}
    </ModuleSection>
  )
}

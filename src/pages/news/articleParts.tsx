import { ArrowRight, BadgeCheck, Link2, PenLine, Share2, Timer } from 'lucide-react'
import { toast } from 'sonner'
import type { ArticleSummary } from '@/api/types'
import { AppLink } from '@/components/ui/AppLink'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SmartImage } from '@/components/ui/SmartImage'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'

/** Separates verified institutional announcements from editorial stories (spec §5.24). */
export function ArticleKindBadge({ kind, className }: { kind: ArticleSummary['kind']; className?: string }) {
  return kind === 'announcement' ? (
    <Badge tone="brand" className={className}>
      <BadgeCheck aria-hidden className="size-3.5" />
      Official announcement
    </Badge>
  ) : (
    <Badge tone="accent" className={className}>
      <PenLine aria-hidden className="size-3.5" />
      Story
    </Badge>
  )
}

/** Large lead story at the top of the news listing. */
export function FeaturedStory({ article }: { article: ArticleSummary }) {
  return (
    <article className="group relative grid overflow-hidden rounded-[2rem] border border-line bg-surface shadow-card transition-[box-shadow,border-color] duration-500 focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-canvas hover:border-primary/30 hover:shadow-card-hover lg:grid-cols-12">
      <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[27rem]">
        <SmartImage image={article.image} hoverZoom priority sizes="(min-width: 1024px) 58vw, 100vw" className="absolute inset-0" />
        <div className="absolute left-5 top-5">
          <Badge tone="glass">Latest</Badge>
        </div>
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-5">
        <div className="flex flex-wrap items-center gap-2">
          <ArticleKindBadge kind={article.kind} />
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink">{article.category}</span>
        </div>
        <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.12] text-ink transition-colors group-hover:text-primary-ink sm:text-4xl">
          <AppLink href={`/news/${article.slug}`} className="after:absolute after:inset-0 after:z-10 after:rounded-[inherit] focus-visible:outline-none">
            {article.title}
          </AppLink>
        </h2>
        <p className="mt-4 line-clamp-3 text-lg leading-relaxed text-ink-muted">{article.summary}</p>
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-subtle">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt.slice(0, 10))}</time>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Timer aria-hidden className="size-3.5" />
            {article.readingMinutes} min read
          </span>
          {article.author && (
            <>
              <span aria-hidden>·</span>
              <span>{article.author}</span>
            </>
          )}
        </p>
        <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink">
          Read the full story
          <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  )
}

async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    return
  }
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const ok = document.execCommand('copy')
  area.remove()
  if (!ok) throw new Error('Copy failed')
}

/** Copy link (with toast) and the native share sheet where the browser supports it. */
export function ShareActions({ title, text, className, stacked }: { title: string; text?: string; className?: string; stacked?: boolean }) {
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  const url = () => `${window.location.origin}${window.location.pathname}`

  const copy = async () => {
    try {
      await copyText(url())
      toast.success('Link copied to your clipboard')
    } catch {
      toast.error('We couldn’t copy the link', { description: url() })
    }
  }

  const share = async () => {
    try {
      await navigator.share({ title, text, url: url() })
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) void copy()
    }
  }

  return (
    <div role="group" aria-label="Share this article" className={cn('no-print flex flex-wrap gap-2', stacked && 'flex-col items-start', className)}>
      <Button variant="secondary" size="sm" onClick={copy} icon={<Link2 aria-hidden className="size-4" />}>
        Copy link
      </Button>
      {canShare && (
        <Button variant="secondary" size="sm" onClick={share} icon={<Share2 aria-hidden className="size-4" />}>
          Share
        </Button>
      )}
    </div>
  )
}

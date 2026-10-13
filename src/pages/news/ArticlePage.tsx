import { useSuspenseQuery } from '@tanstack/react-query'
import { ArrowLeft, CalendarDays, Timer, UserRound } from 'lucide-react'
import { useMemo } from 'react'
import { useParams, type LoaderFunctionArgs } from 'react-router'
import { queries, useSettings } from '@/api/queries'
import type { Article } from '@/api/types'
import { orNotFound, queryClient } from '@/app/routing'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ButtonLink } from '@/components/ui/Button'
import { Markdown, markdownHeadings } from '@/components/ui/Markdown'
import { Section, SectionHeader } from '@/components/ui/Section'
import { SmartImage } from '@/components/ui/SmartImage'
import { ArticleCard } from '@/components/shared/cards'
import { Aurora, GridBackdrop, ScrollProgress } from '@/components/motion/effects'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { TextReveal } from '@/components/motion/TextReveal'
import { env } from '@/config/env'
import { formatDate } from '@/lib/format'
import { JsonLd, plainText, Seo } from '@/lib/seo'
import { OnThisPage, OnThisPageDisclosure } from '@/pages/policies/OnThisPage'
import { ArticleKindBadge, ShareActions } from './articleParts'

export async function loader({ params }: LoaderFunctionArgs) {
  await orNotFound(queryClient.ensureQueryData(queries.article(params.slug!)))
  return null
}

const absolute = (src: string) => (src.startsWith('/') && env.siteUrl ? `${env.siteUrl}${src}` : src)

function articleJsonLd(article: Article, publisher: string) {
  const author = article.author
    ? { '@type': /team|office|department|services|unit/i.test(article.author) ? 'Organization' : 'Person', name: article.author }
    : { '@type': 'Organization', name: publisher }
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: plainText(article.title),
    description: article.summary,
    datePublished: article.publishedAt,
    author,
    publisher: { '@type': 'Organization', name: publisher },
    image: article.image.src ? [absolute(article.image.src)] : undefined,
    articleSection: article.category,
    mainEntityOfPage: env.siteUrl ? `${env.siteUrl}/news/${article.slug}` : undefined,
  }
}

function ArticleHero({ article }: { article: Article }) {
  const title = plainText(article.title)
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line bg-canvas-alt pb-36 pt-[calc(var(--header-h)+2rem)] sm:pb-52 sm:pt-[calc(var(--header-h)+3rem)]">
        <Aurora intensity="soft" className="-z-10" />
        <GridBackdrop className="-z-10 opacity-70" />
        <div className="container-page">
          <div className="max-w-4xl">
            <Reveal immediate y={8} duration={0.6}>
              <Breadcrumbs items={[{ label: 'News', href: '/news' }, { label: title }]} className="mb-8" />
            </Reveal>
            <Reveal immediate y={10} delay={0.05} className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral">{article.category}</Badge>
              <ArticleKindBadge kind={article.kind} />
            </Reveal>
            <TextReveal
              text={article.title}
              delay={0.1}
              stagger={0.04}
              className="mt-6 font-display text-[2.25rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]"
            />
            <Reveal immediate y={16} delay={0.35}>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted sm:text-xl">{article.summary}</p>
            </Reveal>
            <Reveal immediate y={16} delay={0.45}>
              <dl className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
                <div className="inline-flex items-center gap-2">
                  <dt className="sr-only">Published</dt>
                  <CalendarDays aria-hidden className="size-4 text-ink-subtle" />
                  <dd>
                    <time dateTime={article.publishedAt}>{formatDate(article.publishedAt.slice(0, 10))}</time>
                  </dd>
                </div>
                {article.author && (
                  <div className="inline-flex items-center gap-2">
                    <dt className="sr-only">Author</dt>
                    <UserRound aria-hidden className="size-4 text-ink-subtle" />
                    <dd>{article.author}</dd>
                  </div>
                )}
                <div className="inline-flex items-center gap-2">
                  <dt className="sr-only">Reading time</dt>
                  <Timer aria-hidden className="size-4 text-ink-subtle" />
                  <dd>{article.readingMinutes} min read</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>
      <div className="container-page relative z-10 -mt-28 sm:-mt-40">
        <Reveal immediate y={32} delay={0.3} as="figure">
          <SmartImage
            image={article.image}
            priority
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="aspect-[16/10] rounded-[2rem] shadow-float ring-1 ring-line sm:aspect-[21/9]"
          />
        </Reveal>
      </div>
    </>
  )
}

export default function ArticlePage() {
  const { slug } = useParams()
  const { data: article } = useSuspenseQuery(queries.article(slug!))
  const settings = useSettings()
  const headings = useMemo(() => markdownHeadings(article.body), [article.body])
  const hasToc = headings.length >= 2
  const title = plainText(article.title)

  return (
    <>
      <ScrollProgress />
      <Seo
        title={article.seo?.title ?? title}
        description={article.seo?.description ?? article.summary}
        image={article.seo?.image ?? article.image.src}
        noindex={article.seo?.noindex}
        type="article"
      />
      <JsonLd data={articleJsonLd(article, settings.name)} />
      <ArticleHero article={article} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <aside className="no-print hidden lg:col-span-3 lg:block">
            <div className="sticky top-28 space-y-10">
              {hasToc && <OnThisPage headings={headings} />}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">Share</p>
                <ShareActions title={title} text={article.summary} stacked />
              </div>
            </div>
          </aside>
          <article className="min-w-0 lg:col-span-9">
            {hasToc && <OnThisPageDisclosure headings={headings} className="mb-8 lg:hidden" />}
            <Reveal>
              <Markdown size="lg">{article.body}</Markdown>
            </Reveal>
            <footer className="mt-14 max-w-[72ch] border-t border-line pt-8">
              <p className="text-sm text-ink-subtle">
                {article.kind === 'announcement' ? `Official announcement from ${settings.name}` : 'Story'}
                {article.author ? ` · ${article.author}` : ''} · Published {formatDate(article.publishedAt.slice(0, 10))}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <ShareActions title={title} text={article.summary} className="lg:hidden" />
                <ButtonLink href="/news" variant="ghost" icon={<ArrowLeft aria-hidden className="size-4" />} className="-ml-3">
                  All news
                </ButtonLink>
              </div>
            </footer>
          </article>
        </div>
      </Section>

      {article.related.length > 0 && (
        <Section background="alt">
          <SectionHeader
            eyebrow="Keep reading"
            heading="Related news"
            action={
              <ButtonLink href="/news" variant="secondary" arrow>
                All news
              </ButtonLink>
            }
          />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {article.related.map((related) => (
              <StaggerItem key={related.slug} className="h-full">
                <ArticleCard article={related} />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}
    </>
  )
}

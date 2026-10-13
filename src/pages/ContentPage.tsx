import { useSuspenseQuery } from '@tanstack/react-query'
import { useLoaderData } from 'react-router'
import { queries } from '@/api/queries'
import type { Page } from '@/api/types'
import { contentPageLoader } from '@/app/routing'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { markdownHeadings, Markdown } from '@/components/ui/Markdown'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/motion/Reveal'
import { formatDate } from '@/lib/format'
import { plainText, Seo } from '@/lib/seo'
import type { Crumb } from '@/components/ui/Breadcrumbs'

export const loader = contentPageLoader

const SECTION_LABELS: Record<string, string> = {
  about: 'About',
  admissions: 'Admissions',
  international: 'International',
  'student-support': 'Student support',
}

/** Breadcrumb trail from the page path, e.g. "admissions/fees" → Admissions › Fees. */
function crumbsFor(page: Page): Crumb[] {
  const title = plainText(page.title)
  const parts = page.slug.split('/')
  if (parts.length === 1) return [{ label: title }]
  const parentPath = parts.slice(0, -1).join('/')
  return [{ label: SECTION_LABELS[parentPath] ?? parentPath, href: `/${parentPath}` }, { label: title }]
}

/** Long-form layout (policies, legal pages): narrow prose with an "On this page" list. */
function ArticleLayout({ page }: { page: Page }) {
  const body = page.blocks
    .filter((b) => b.type === 'richText')
    .map((b) => (b.type === 'richText' ? `${b.heading ? `## ${b.heading}\n\n` : ''}${b.body}` : ''))
    .join('\n\n')
  const headings = markdownHeadings(body)
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-12">
        {headings.length > 1 && (
          <aside className="lg:col-span-3">
            <nav aria-label="On this page" className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">On this page</p>
              <ul className="mt-4 space-y-1 border-l border-line">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-ink-muted transition-colors hover:border-accent hover:text-ink">
                      {h.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
        <Reveal className={headings.length > 1 ? 'lg:col-span-9' : 'lg:col-span-12'}>
          <Markdown>{body}</Markdown>
          <p className="mt-12 border-t border-line pt-6 text-sm text-ink-subtle">Last updated {formatDate(page.updatedAt.slice(0, 10))}</p>
        </Reveal>
      </div>
    </Section>
  )
}

export default function ContentPage() {
  const { path } = useLoaderData() as { path: string }
  const { data: page } = useSuspenseQuery(queries.page(path))
  const otherBlocks = page.layout === 'article' ? page.blocks.filter((b) => b.type !== 'richText') : page.blocks

  return (
    <>
      <Seo title={page.seo?.title ?? page.title} description={page.seo?.description ?? page.summary} noindex={page.seo?.noindex} image={page.seo?.image} />
      <PageHero
        title={page.title}
        eyebrow={page.eyebrow}
        summary={page.summary}
        breadcrumbs={crumbsFor(page)}
        image={page.hero?.image}
        actions={page.hero?.actions}
      />
      {page.layout === 'article' && <ArticleLayout page={page} />}
      <BlockRenderer blocks={otherBlocks} />
    </>
  )
}

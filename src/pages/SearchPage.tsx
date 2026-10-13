import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  BookOpen,
  Building,
  CalendarDays,
  CircleQuestionMark,
  Download,
  FileText,
  Lightbulb,
  Newspaper,
  ScrollText,
  Search,
  SearchX,
  type LucideIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'
import { Form } from 'react-router'
import { queries } from '@/api/queries'
import type { SearchResult, SearchResultType } from '@/api/types'
import { prefetchOptionalPage, useOptionalPage } from '@/app/routing'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { RESULT_LABELS } from '@/components/layout/SearchDialog'
import { AppLink } from '@/components/ui/AppLink'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Section } from '@/components/ui/Section'
import { Tabs, TabsList } from '@/components/ui/Tabs'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { Seo } from '@/lib/seo'
import { useListingParams } from '@/pages/news/useListingParams'

export async function loader() {
  await prefetchOptionalPage('search')
  return null
}

const TYPE_ORDER: SearchResultType[] = ['course', 'page', 'campus', 'article', 'event', 'resource', 'policy', 'faq']

const TYPE_META: Record<SearchResultType, { icon: LucideIcon; tone: BadgeTone }> = {
  course: { icon: BookOpen, tone: 'brand' },
  page: { icon: FileText, tone: 'neutral' },
  campus: { icon: Building, tone: 'accent' },
  article: { icon: Newspaper, tone: 'neutral' },
  event: { icon: CalendarDays, tone: 'accent' },
  resource: { icon: Download, tone: 'outline' },
  policy: { icon: ScrollText, tone: 'outline' },
  faq: { icon: CircleQuestionMark, tone: 'neutral' },
}

const SUGGESTED = [
  { label: 'Browse all courses', text: 'Search and filter by study area, level and campus', href: '/courses', icon: BookOpen },
  { label: 'How to apply', text: 'Admissions steps, entry requirements and documents', href: '/admissions', icon: FileText },
  { label: 'Fees', text: 'Tuition, additional costs and payment information', href: '/admissions/fees', icon: ScrollText },
  { label: 'Upcoming intakes', text: 'Start dates and application deadlines', href: '/admissions/intakes', icon: CalendarDays },
  { label: 'Campuses', text: 'Locations, facilities and opening hours', href: '/campuses', icon: Building },
  { label: 'Student support', text: 'Help with study, wellbeing and services', href: '/student-support', icon: CircleQuestionMark },
]

const POPULAR = ['fees', 'intakes', 'international', 'refund', 'orientation', 'entry requirements']

function termsOf(query: string) {
  return [...new Set(query.toLowerCase().split(/\s+/).filter((t) => t.length > 1))].sort((a, b) => b.length - a.length)
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Wraps matched query terms in <mark>. Text stays React text nodes — nothing is injected as HTML. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>
  const parts = text.split(new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi'))
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark key={index} className="rounded-sm bg-accent-soft px-0.5 text-on-accent-soft">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

function SearchForm({ q }: { q: string }) {
  return (
    <Form method="get" action="/search" role="search" aria-label="Search the website" className="flex max-w-2xl items-center gap-2 rounded-full border border-line-strong/60 bg-surface p-1.5 shadow-card transition-[box-shadow,border-color] focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
      <Search aria-hidden className="ml-3 size-5 shrink-0 text-ink-subtle sm:ml-4" />
      <label htmlFor="site-search" className="sr-only">
        Search courses, pages, campuses, news, events and documents
      </label>
      <input
        key={q}
        id="site-search"
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Search courses, policies, campuses…"
        enterKeyHint="search"
        autoComplete="off"
        className="h-12 min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-ink-subtle focus:outline-none sm:h-14 sm:text-lg [&::-webkit-search-cancel-button]:hidden"
      />
      <Button type="submit" size="lg" className="h-12 px-5 sm:h-14 sm:px-7">
        Search
      </Button>
    </Form>
  )
}

function EmptyQuery({ short }: { short: boolean }) {
  return (
    <div>
      {short && <p className="mb-8 text-ink-muted">Type at least two characters to search.</p>}
      <Reveal>
        <h2 className="font-display text-2xl font-semibold text-ink">Popular destinations</h2>
      </Reveal>
      <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUGGESTED.map((item) => (
          <StaggerItem key={item.href} className="h-full">
            <AppLink
              href={item.href}
              className="group flex h-full gap-4 rounded-3xl border border-line bg-surface p-5 shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-on-primary-soft transition-colors group-hover:bg-primary group-hover:text-on-primary">
                <item.icon aria-hidden className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 font-semibold text-ink">
                  {item.label}
                  <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="mt-1 block text-sm text-ink-muted">{item.text}</span>
              </span>
            </AppLink>
          </StaggerItem>
        ))}
      </Stagger>
      <Reveal className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-subtle">Popular searches</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {POPULAR.map((term) => (
            <li key={term}>
              <AppLink
                href={`/search?q=${encodeURIComponent(term)}`}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-sm text-ink-muted transition-colors hover:border-primary/40 hover:text-ink"
              >
                <Search aria-hidden className="size-3.5" />
                {term}
              </AppLink>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  )
}

function ResultItem({ result, terms, index }: { result: SearchResult; terms: string[]; index: number }) {
  const meta = TYPE_META[result.type]
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.03, ease: EASE_OUT_EXPO }}
      className="group relative flex gap-4 rounded-3xl border border-line bg-surface p-5 transition-[border-color,box-shadow] duration-300 focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-canvas hover:border-primary/30 hover:shadow-card-hover sm:gap-5 sm:p-6"
    >
      <span className="hidden size-11 shrink-0 place-items-center rounded-2xl bg-surface-muted text-ink-muted transition-colors group-hover:bg-primary-soft group-hover:text-on-primary-soft sm:grid">
        <meta.icon aria-hidden className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={meta.tone}>{RESULT_LABELS[result.type]}</Badge>
          {result.meta && <span className="text-sm text-ink-subtle">{result.meta}</span>}
        </div>
        <h2 className="mt-2 font-display text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-primary-ink">
          <AppLink href={result.href} className="after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none">
            <Highlight text={result.title} terms={terms} />
          </AppLink>
        </h2>
        {result.excerpt && (
          <p className="mt-1.5 line-clamp-2 leading-relaxed text-ink-muted">
            <Highlight text={result.excerpt} terms={terms} />
          </p>
        )}
      </div>
      <ArrowRight aria-hidden className="mt-1 hidden size-5 shrink-0 text-ink-subtle transition-transform group-hover:translate-x-1 group-hover:text-primary-ink sm:block" />
    </motion.li>
  )
}

function Results({ term, type, onType }: { term: string; type: string | null; onType: (type: string | null) => void }) {
  const { data, isPending, isError, isPlaceholderData, isFetching, refetch } = useQuery(queries.search(term))
  const terms = useMemo(() => termsOf(term), [term])

  const counts = useMemo(() => {
    const map = new Map<SearchResultType, number>()
    for (const result of data ?? []) map.set(result.type, (map.get(result.type) ?? 0) + 1)
    return map
  }, [data])

  if (isError && !isFetching) {
    return <ErrorPanel title="Search is temporarily unavailable" onRetry={() => refetch()} />
  }

  if (isPending || isPlaceholderData || !data) {
    return (
      <LoadingRegion label={`Searching for “${term}”`} className="space-y-3">
        <Skeleton className="mb-6 h-10 w-full max-w-md rounded-full" />
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex gap-5 rounded-3xl border border-line bg-surface p-6">
            <Skeleton className="hidden size-11 rounded-2xl sm:block" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </LoadingRegion>
    )
  }

  if (data.length === 0) {
    return (
      <>
        <p aria-live="polite" className="sr-only">
          No results for {term}
        </p>
        <EmptyState
          icon={SearchX}
          title={`No results for “${term}”`}
          description={
            <ul className="mx-auto mt-3 max-w-sm space-y-1.5 text-left text-sm">
              {['Check the spelling of your search', 'Try fewer or more general words', 'Search for a course name, study area or campus'].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-ink" />
                  {tip}
                </li>
              ))}
            </ul>
          }
          actions={
            <>
              <ButtonLink href="/courses" variant="primary">
                Browse courses
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Contact us
              </ButtonLink>
            </>
          }
        />
      </>
    )
  }

  const types = TYPE_ORDER.filter((t) => counts.has(t))
  const active = type && types.includes(type as SearchResultType) ? (type as SearchResultType) : 'all'
  const visible = active === 'all' ? data : data.filter((r) => r.type === active)

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-ink-muted">
          <span className="font-semibold text-ink">{data.length}</span> {data.length === 1 ? 'result' : 'results'} for “{term}”
          {active !== 'all' && ` · showing ${visible.length} ${RESULT_LABELS[active].toLowerCase()}`}
        </p>
      </div>
      {types.length > 1 && (
        <Tabs value={active} onValueChange={(value) => onType(value === 'all' ? null : value)} className="mb-8">
          <TabsList<'all' | SearchResultType>
            label="Filter results by type"
            size="sm"
            value={active}
            options={[{ value: 'all', label: 'All', count: data.length }, ...types.map((t) => ({ value: t, label: RESULT_LABELS[t], count: counts.get(t) }))]}
          />
        </Tabs>
      )}
      <ol aria-label="Search results" className={cn('space-y-3')}>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((result, index) => (
            <ResultItem key={`${result.type}-${result.href}`} result={result} terms={terms} index={index} />
          ))}
        </AnimatePresence>
      </ol>
      <p className="mt-10 text-sm text-ink-subtle">Search covers published courses, pages, campuses, news, events, documents, policies and FAQs.</p>
    </div>
  )
}

export default function SearchPage() {
  const cms = useOptionalPage('search')
  const { params, update } = useListingParams()
  const q = params.get('q') ?? ''
  const term = q.trim()

  return (
    <>
      <Seo title={term ? `Search: ${term}` : 'Search'} description={cms?.seo?.description ?? cms?.summary} noindex />
      <PageHero
        title={cms?.title ?? 'Search'}
        eyebrow={cms?.eyebrow}
        summary={cms?.summary ?? 'Search published courses, pages, campuses, news, events, documents and policies.'}
        breadcrumbs={[{ label: 'Search' }]}
      >
        <SearchForm q={q} />
      </PageHero>

      <Section>
        {term.length < 2 ? <EmptyQuery short={term.length === 1} /> : <Results term={term} type={params.get('type')} onType={(type) => update({ type })} />}
      </Section>

      {cms && cms.blocks.length > 0 && <BlockRenderer blocks={cms.blocks} />}
    </>
  )
}

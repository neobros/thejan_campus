import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, MessageSquare, SearchX } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { useDeferredValue, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { queries } from '@/api/queries'
import type { Faq, FaqCategory } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import { moduleProp, type ModuleComponentProps } from '@/components/blocks/types'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'
import { AppLink } from '@/components/ui/AppLink'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Markdown } from '@/components/ui/Markdown'
import { FAQ_CATEGORY_LABELS } from '@/components/shared/labels'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import { pluralize } from '@/lib/format'
import { ChipGroup, Highlight, ResultCount, SearchField } from './components/filters'
import { matchesQuery, stripMarkdown } from './components/search'

const CATEGORY_ORDER = Object.keys(FAQ_CATEGORY_LABELS) as FaqCategory[]

function FaqAnswer({ faq }: { faq: Faq }) {
  return (
    <>
      <Markdown size="sm" className="max-w-none">
        {faq.answer}
      </Markdown>
      {faq.links.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Related pages">
          {faq.links.map((link) => (
            <li key={link.href + link.label}>
              <AppLink
                href={link.href}
                className="group/l inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-sm font-medium text-primary-ink transition-colors hover:border-primary/40 hover:bg-primary-soft"
              >
                {link.label}
                <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-300 group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" />
              </AppLink>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

/**
 * FAQ directory (spec §5.22): optional search, category chips with counts and an accordion.
 * Deep links (`/faq#<faq.id>`, used by the site search) open and scroll to the matching question.
 */
export function FaqDirectoryModule({ block, className }: ModuleComponentProps) {
  const allowed = moduleProp<FaqCategory[] | null>(block, 'categories', null)
  const showSearch = moduleProp(block, 'showSearch', false)
  const { data, isPending, isError, refetch } = useQuery(queries.faqs())
  const { hash, key } = useLocation()
  const reduceMotion = useReducedMotion()

  const [term, setTerm] = useState('')
  const [category, setCategory] = useState<FaqCategory | 'all'>('all')
  const [open, setOpen] = useState<string[]>([])
  const query = useDeferredValue(showSearch ? term : '')

  const scoped = (data ?? [])
    .filter((f) => !allowed?.length || allowed.includes(f.category))
    .sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category))
  const categories = CATEGORY_ORDER.filter((c) => scoped.some((f) => f.category === c))
  const searched = scoped.filter((f) => matchesQuery(query, f.question, stripMarkdown(f.answer), FAQ_CATEGORY_LABELS[f.category]))
  const activeCategory = category !== 'all' && categories.includes(category) ? category : 'all'
  const visible = searched.filter((f) => activeCategory === 'all' || f.category === activeCategory)
  const showChips = categories.length > 1
  const showMeta = showChips && (activeCategory === 'all' || Boolean(query.trim()))

  // Deep link: reveal the targeted question (reset filters, open it), then scroll and focus it.
  const targetId = decodeURIComponent(hash.replace(/^#/, ''))
  const token = `${key}#${targetId}`
  const [handled, setHandled] = useState<{ token: string; id: string } | null>(null)
  if (targetId && handled?.token !== token && scoped.some((f) => f.id === targetId)) {
    setHandled({ token, id: targetId })
    setTerm('')
    setCategory('all')
    setOpen((current) => (current.includes(targetId) ? current : [...current, targetId]))
  }
  useEffect(() => {
    if (!handled) return
    // Wait for the panel to open and for the route announcer to finish moving focus to <main>.
    const timer = setTimeout(() => {
      const item = document.getElementById(handled.id)
      if (!item) return
      item.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true })
      item.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    }, 180)
    return () => clearTimeout(timer)
  }, [handled, reduceMotion])

  const clear = () => {
    setTerm('')
    setCategory('all')
  }
  const filtered = Boolean(query.trim()) || activeCategory !== 'all'
  const sidebar = showSearch || showChips

  return (
    <ModuleSection block={block} className={className}>
      {isPending ? (
        <LoadingRegion className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </LoadingRegion>
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : scoped.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Answers are on the way"
          description="We are preparing answers to common questions. In the meantime, our team is happy to help."
          actions={
            <ButtonLink href="/enquire" variant="primary">
              Ask a question
            </ButtonLink>
          }
        />
      ) : (
        <div className={cn(sidebar ? 'grid gap-8 lg:grid-cols-12 lg:gap-12' : 'max-w-4xl')}>
          {sidebar && (
            <div className="lg:col-span-4">
              <Reveal className="space-y-6 lg:sticky lg:top-28">
                {showSearch && (
                  <SearchField label="Search questions" value={term} onChange={setTerm} placeholder="e.g. documents, payment, intake" />
                )}
                {showChips && (
                  <div>
                    <p className="mb-2.5 text-sm font-semibold text-ink">Topics</p>
                    <ChipGroup
                      label="FAQ topic"
                      value={activeCategory}
                      onChange={setCategory}
                      options={[
                        { value: 'all', label: 'All', count: searched.length },
                        ...categories.map((c) => ({ value: c, label: FAQ_CATEGORY_LABELS[c], count: searched.filter((f) => f.category === c).length })),
                      ]}
                    />
                  </div>
                )}
                <div className="hidden rounded-3xl border border-line bg-surface p-5 lg:block">
                  <p className="font-semibold text-ink">Can’t find your answer?</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">Send us a question and the right team will reply using the details you provide.</p>
                  <ButtonLink href="/enquire" variant="link" arrow className="mt-3 text-sm">
                    Make an enquiry
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          )}
          <div className={cn(sidebar && 'lg:col-span-8')}>
            {(showSearch || showChips) && (
              <ResultCount className="mb-4">
                {filtered ? `${pluralize(visible.length, 'question')} found` : `${pluralize(scoped.length, 'question')}`}
              </ResultCount>
            )}
            {visible.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No questions match your search"
                description="Try a different word or topic, or ask us directly — we are happy to help."
                actions={
                  <>
                    <Button variant="secondary" onClick={clear}>
                      Clear search
                    </Button>
                    <ButtonLink href="/enquire" variant="primary">
                      Ask a question
                    </ButtonLink>
                  </>
                }
              />
            ) : (
              <Reveal>
                <Accordion type="multiple" value={open} onValueChange={setOpen}>
                  {visible.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      id={faq.id}
                      value={faq.id}
                      title={<Highlight text={faq.question} query={query} />}
                      meta={showMeta ? FAQ_CATEGORY_LABELS[faq.category] : undefined}
                    >
                      <FaqAnswer faq={faq} />
                    </AccordionItem>
                  ))}
                </Accordion>
              </Reveal>
            )}
            <p className={cn('mt-6 text-sm text-ink-subtle', sidebar && 'lg:hidden')}>
              Still have a question?{' '}
              <AppLink href="/enquire" className="font-semibold text-primary-ink underline-offset-4 hover:underline">
                Make an enquiry
              </AppLink>
            </p>
          </div>
        </div>
      )}
    </ModuleSection>
  )
}

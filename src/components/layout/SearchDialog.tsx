import { useQuery } from '@tanstack/react-query'
import { ArrowRight, CornerDownLeft, LoaderCircle, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Dialog } from 'radix-ui'
import { createContext, useContext, useEffect, useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { queries } from '@/api/queries'
import type { SearchResult, SearchResultType } from '@/api/types'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui/Badge'

export const RESULT_LABELS: Record<SearchResultType, string> = {
  course: 'Course',
  page: 'Page',
  campus: 'Campus',
  article: 'News',
  event: 'Event',
  resource: 'Download',
  policy: 'Policy',
  faq: 'FAQ',
}

const QUICK_LINKS = [
  { label: 'All courses', href: '/courses' },
  { label: 'How to apply', href: '/admissions' },
  { label: 'Fees', href: '/admissions/fees' },
  { label: 'Upcoming intakes', href: '/admissions/intakes' },
  { label: 'Student support', href: '/student-support' },
  { label: 'Contact', href: '/contact' },
]

function useDebounced<T>(value: T, delay = 200) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

const OpenSearchContext = createContext<() => void>(() => {})

/** Opens the quick-search dialog. Any trigger in the header can call it. */
export const useOpenSearch = () => useContext(OpenSearchContext)

/**
 * A header search affordance. `bar` renders a full search field (top utility strip on desktop);
 * `icon` renders a compact round button (main bar, and when the strip scrolls away). Both open the
 * same quick-search dialog, so the keyboard shortcut and dialog live once in `SearchProvider`.
 */
export function SearchTrigger({
  variant = 'icon',
  onDark,
  className,
}: {
  variant?: 'bar' | 'icon'
  onDark?: boolean
  className?: string
}) {
  const open = useOpenSearch()
  if (variant === 'bar') {
    return (
      <button
        type="button"
        onClick={open}
        aria-label="Search the website"
        aria-keyshortcuts="Control+K"
        className={cn(
          'group inline-flex h-8 items-center gap-2.5 rounded-full border pl-3 pr-1.5 text-[0.8125rem] transition-colors',
          onDark
            ? 'border-white/20 bg-white/[0.06] text-white/70 hover:border-white/30 hover:bg-white/[0.12]'
            : 'border-line bg-surface text-ink-subtle hover:border-line-strong hover:text-ink-muted',
          className,
        )}
      >
        <Search aria-hidden className="size-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
        <span className="flex-1 truncate text-left">Search courses, campuses…</span>
        <kbd
          className={cn(
            'inline-flex items-center rounded px-1.5 py-0.5 font-sans text-[11px] font-medium',
            onDark ? 'bg-white/10 text-white/70' : 'bg-surface-muted text-ink-subtle',
          )}
        >
          Ctrl K
        </kbd>
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Search"
      aria-keyshortcuts="Control+K"
      className={cn(
        'group grid size-10 place-items-center rounded-full transition-colors',
        onDark ? 'text-white hover:bg-white/10' : 'text-ink-muted hover:bg-surface-muted hover:text-ink',
        className,
      )}
    >
      <Search aria-hidden className="size-[1.1rem] transition-transform duration-300 group-hover:scale-110" />
    </button>
  )
}

/** Quick search (Ctrl/⌘ K or "/"). Full results live at /search. Wrap the header so triggers can open it. */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [term, setTerm] = useState('')
  const [active, setActive] = useState(0)
  const debounced = useDebounced(term.trim())
  const navigate = useNavigate()
  const listId = useId()
  const { data, isFetching } = useQuery({ ...queries.search(debounced), enabled: open && debounced.length > 1 })
  const results: SearchResult[] = debounced.length > 1 ? (data ?? []).slice(0, 8) : []

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target?.closest('input, textarea, select, [contenteditable="true"]')
      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => setActive(0), [debounced])

  const go = (href: string) => {
    setOpen(false)
    setTerm('')
    navigate(href, { viewTransition: true })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const total = results.length + (debounced.length > 1 ? 1 : 0)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((i) => (total ? (i + 1) % total : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => (total ? (i - 1 + total) % total : 0))
    } else if (event.key === 'Enter' && debounced.length > 1) {
      event.preventDefault()
      go(active < results.length ? results[active].href : `/search?q=${encodeURIComponent(debounced)}`)
    }
  }

  return (
    <OpenSearchContext.Provider value={() => setOpen(true)}>
      {children}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-[80] bg-[#070b18]/50 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  className="fixed left-1/2 top-[10vh] z-[81] w-[min(40rem,calc(100vw-1.5rem))] -translate-x-1/2 overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-float outline-none"
                  initial={{ opacity: 0, y: -16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                >
                  <Dialog.Title className="sr-only">Search the website</Dialog.Title>
                  <div className="flex items-center gap-3 border-b border-line px-5">
                    {isFetching ? (
                      <LoaderCircle aria-hidden className="size-5 animate-spin text-primary-ink" />
                    ) : (
                      <Search aria-hidden className="size-5 text-ink-subtle" />
                    )}
                    <input
                      autoFocus
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="Search courses, campuses, policies…"
                      aria-label="Search"
                      role="combobox"
                      aria-expanded={results.length > 0}
                      aria-controls={listId}
                      aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
                      className="h-16 min-w-0 flex-1 bg-transparent text-lg text-ink placeholder:text-ink-subtle focus:outline-none"
                    />
                    <Dialog.Close
                      className="grid size-9 place-items-center rounded-full text-ink-subtle hover:bg-surface-muted hover:text-ink"
                      aria-label="Close search"
                    >
                      <X aria-hidden className="size-4" />
                    </Dialog.Close>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto p-2">
                    {debounced.length < 2 ? (
                      <div className="p-3">
                        <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">Popular pages</p>
                        <div className="flex flex-wrap gap-2">
                          {QUICK_LINKS.map((link) => (
                            <button
                              key={link.href}
                              type="button"
                              onClick={() => go(link.href)}
                              className="rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-muted transition-colors hover:border-primary/50 hover:text-ink"
                            >
                              {link.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <ul id={listId} role="listbox" aria-label="Search results">
                        {results.map((result, index) => (
                          <li
                            key={`${result.type}-${result.href}`}
                            id={`${listId}-${index}`}
                            role="option"
                            aria-selected={index === active}
                            onMouseEnter={() => setActive(index)}
                            onClick={() => go(result.href)}
                            className={cn(
                              'flex cursor-pointer items-start gap-3 rounded-2xl px-3 py-3 transition-colors',
                              index === active ? 'bg-surface-muted' : 'hover:bg-surface-muted/60',
                            )}
                          >
                            <Badge tone={result.type === 'course' ? 'brand' : 'neutral'} className="mt-0.5 shrink-0">
                              {RESULT_LABELS[result.type]}
                            </Badge>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-ink">{result.title}</span>
                              <span className="line-clamp-1 text-sm text-ink-subtle">{result.excerpt}</span>
                            </span>
                            {index === active && <CornerDownLeft aria-hidden className="mt-1 size-4 shrink-0 text-ink-subtle" />}
                          </li>
                        ))}
                        <li
                          id={`${listId}-${results.length}`}
                          role="option"
                          aria-selected={active === results.length}
                          onMouseEnter={() => setActive(results.length)}
                          onClick={() => go(`/search?q=${encodeURIComponent(debounced)}`)}
                          className={cn(
                            'mt-1 flex cursor-pointer items-center justify-between rounded-2xl px-3 py-3 text-sm font-semibold text-primary-ink',
                            active === results.length ? 'bg-primary-soft' : 'hover:bg-primary-soft/60',
                          )}
                        >
                          {results.length ? `See all results for “${debounced}”` : `No quick matches — search everything for “${debounced}”`}
                          <ArrowRight aria-hidden className="size-4" />
                        </li>
                      </ul>
                    )}
                  </div>
                  <div className="hidden items-center gap-4 border-t border-line bg-canvas-alt px-5 py-2.5 text-xs text-ink-subtle sm:flex">
                    <span>↑↓ to move</span>
                    <span>Enter to open</span>
                    <span>Esc to close</span>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </OpenSearchContext.Provider>
  )
}

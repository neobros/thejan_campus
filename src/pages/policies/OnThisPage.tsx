import { ChevronDown, ListTree } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useId, useState } from 'react'
import { cn } from '@/lib/cn'
import { springSnappy } from '@/lib/motion'

export interface TocHeading {
  id: string
  title: string
}

/** Tracks which heading the reader is currently in (the last heading above the reading line). */
function useActiveHeading(headings: TocHeading[]) {
  const [active, setActive] = useState(headings[0]?.id)
  useEffect(() => {
    const elements = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => el !== null)
    if (!elements.length) return
    let frame = 0
    const update = () => {
      frame = 0
      const line = 140
      let current = elements[0].id
      for (const el of elements) {
        if (el.getBoundingClientRect().top - line <= 0) current = el.id
        else break
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) current = elements[elements.length - 1].id
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [headings])
  return active
}

function TocList({ headings, active, indicator }: { headings: TocHeading[]; active?: string; indicator?: string }) {
  return (
    <ul className="space-y-0.5 border-l border-line">
      {headings.map((h) => {
        const current = h.id === active
        return (
          <li key={h.id} className="relative">
            {indicator && current && (
              <motion.span aria-hidden layoutId={indicator} transition={springSnappy} className="absolute -left-px inset-y-1 w-0.5 rounded-full bg-accent" />
            )}
            <a
              href={`#${h.id}`}
              aria-current={current ? 'true' : undefined}
              className={cn(
                'block py-1.5 pl-4 text-sm leading-snug transition-colors hover:text-ink',
                current ? 'font-medium text-ink' : 'text-ink-muted',
              )}
            >
              {h.title}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

/** Sticky "On this page" navigation with scroll-spy (desktop). */
export function OnThisPage({ headings, className }: { headings: TocHeading[]; className?: string }) {
  const active = useActiveHeading(headings)
  const id = useId()
  return (
    <nav aria-label="On this page" className={cn('no-print', className)}>
      <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
        <ListTree aria-hidden className="size-3.5" />
        On this page
      </p>
      <TocList headings={headings} active={active} indicator={`toc-${id}`} />
    </nav>
  )
}

/** Collapsible "On this page" list for small screens. */
export function OnThisPageDisclosure({ headings, className }: { headings: TocHeading[]; className?: string }) {
  return (
    <details className={cn('no-print group rounded-2xl border border-line bg-surface', className)}>
      <summary className="flex list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <ListTree aria-hidden className="size-4 text-ink-subtle" />
          On this page
          <span className="font-normal text-ink-subtle">({headings.length} sections)</span>
        </span>
        <ChevronDown aria-hidden className="size-4 text-ink-subtle transition-transform group-open:rotate-180" />
      </summary>
      <nav aria-label="On this page" className="px-5 pb-4">
        <TocList headings={headings} />
      </nav>
    </details>
  )
}

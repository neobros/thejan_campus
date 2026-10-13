import { LayoutGroup, motion, useScroll, useSpring } from 'motion/react'
import { useEffect, useId, useRef, useState, type MouseEvent, type RefObject } from 'react'
import { cn } from '@/lib/cn'
import { springSnappy } from '@/lib/motion'
import { SECTION_LABELS, type SectionId } from './course-detail'
import { prefersReducedMotion, useStickyTop } from './hooks'

/** Height of the sticky bar (h-14) — sections and the sidebar offset themselves by it. */
const NAV_HEIGHT = 56

function useScrollSpy(ids: SectionId[]) {
  const [active, setActive] = useState<SectionId | undefined>(undefined)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.3
      let current: SectionId | undefined
      for (const id of ids) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= line) current = id
      }
      // At the very bottom of the page, the last section wins even if it is short.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom && current) current = ids[ids.length - 1]
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
  }, [ids])
  return active
}

/** Horizontal, scrollable in-page navigation with scroll-spy and a sliding indicator. */
export function CourseSectionNav({ ids, progressTarget }: { ids: SectionId[]; progressTarget: RefObject<HTMLElement | null> }) {
  const barRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const layoutId = useId()
  useStickyTop(barRef)
  const active = useScrollSpy(ids)

  const { scrollYProgress } = useScroll({ target: progressTarget, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  // Keep the active link visible inside the horizontal scroller.
  useEffect(() => {
    const list = listRef.current
    const link = active ? list?.querySelector<HTMLElement>(`[data-section="${active}"]`) : null
    if (!list || !link) return
    const left = link.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2
    list.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [active])

  const go = (event: MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    const headerVisible = target.getBoundingClientRect().top < 0 // scrolling up reveals the header
    const header = document.querySelector<HTMLElement>('.site-header')
    const headerOffset = headerVisible && header ? header.offsetHeight - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-top-h')) || 0) : 0
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - headerOffset - 24
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    // Shareable deep link without a router navigation (keeps the router's history state).
    window.history.replaceState(window.history.state, '', `#${id}`)
    target.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true })
  }

  return (
    <div
      ref={barRef}
      className="no-print sticky top-[var(--sticky-top,4.5rem)] z-30 border-b border-line bg-canvas/85 backdrop-blur-xl backdrop-saturate-150"
    >
      <nav aria-label="Course sections" className="container-page">
        <LayoutGroup id={layoutId}>
          <ul ref={listRef} className="-mx-2 flex h-14 items-center gap-1 overflow-x-auto px-2 scrollbar-none mask-fade-x sm:mask-none">
            {ids.map((id) => {
              const current = id === active
              return (
                <li key={id} className="shrink-0">
                  <a
                    href={`#${id}`}
                    data-section={id}
                    aria-current={current ? 'true' : undefined}
                    onClick={(event) => go(event, id)}
                    className={cn(
                      'relative isolate inline-flex h-9 items-center whitespace-nowrap rounded-full px-3.5 text-sm font-medium transition-colors duration-200',
                      current ? 'text-on-primary' : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {current && <motion.span layoutId="course-nav-pill" transition={springSnappy} className="absolute inset-0 -z-10 rounded-full bg-primary shadow-sm" />}
                    {SECTION_LABELS[id]}
                  </a>
                </li>
              )
            })}
          </ul>
        </LayoutGroup>
      </nav>
      <motion.div aria-hidden style={{ scaleX: progress }} className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-gradient-to-r from-primary via-accent to-primary" />
    </div>
  )
}

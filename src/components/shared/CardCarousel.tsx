import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Children, useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode, type RefObject } from 'react'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'

/**
 * Horizontal card carousel shared by the home-page modules: snap scrolling, mouse drag, keyboard
 * scrolling, and a centred control row (prev / position dots / next) below the cards. Use the hook
 * once per module and pass the result to <CarouselTrack> (the cards + controls).
 */
interface DragProps {
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void
  onClickCapture: (event: MouseEvent<HTMLDivElement>) => void
}

export interface Carousel {
  trackRef: RefObject<HTMLDivElement | null>
  edges: { start: boolean; end: boolean }
  /** Current page (group of visible cards), 0-based. */
  index: number
  /** Number of distinct scroll positions — one dot each. */
  pages: number
  scrollBy: (direction: 1 | -1) => void
  scrollTo: (page: number) => void
  /** Spread onto the scrolling track to enable mouse click-and-drag scrolling. */
  dragProps: DragProps
}

const GAP = 24 // matches gap-6 on the track

function cardStep(el: HTMLElement) {
  const card = el.querySelector<HTMLElement>('[data-card]')
  return card ? card.offsetWidth + GAP : el.clientWidth
}

export function useCardCarousel(itemCount: number): Carousel {
  const trackRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ start: true, end: false, index: 0, pages: 1 })

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const update = () => {
      const step = cardStep(el)
      const visible = Math.max(1, Math.round(el.clientWidth / step))
      const pages = Math.max(1, itemCount - visible + 1)
      const index = Math.min(pages - 1, Math.max(0, Math.round(el.scrollLeft / step)))
      setState({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8, index, pages })
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [itemCount])

  const scrollBy = (direction: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: direction * cardStep(el), behavior: 'smooth' })
  }

  const scrollTo = (page: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: page * cardStep(el), behavior: 'smooth' })
  }

  // Click-and-drag to scroll with a mouse. Window listeners (added on pointer-down) keep the drag
  // alive even over the card links; touch/trackpad already scroll natively so they are skipped.
  const dragMoved = useRef(false)
  const dragProps: DragProps = {
    onPointerDown(event) {
      const el = trackRef.current
      if (!el || event.pointerType === 'touch' || event.button !== 0) return
      const startX = event.clientX
      const startLeft = el.scrollLeft
      let moved = false
      el.style.scrollBehavior = 'auto' // follow the cursor 1:1 instead of smooth-animating
      document.body.style.userSelect = 'none'

      const onMove = (move: globalThis.PointerEvent) => {
        const dx = move.clientX - startX
        if (!moved && Math.abs(dx) > 5) moved = true
        if (moved) el.scrollLeft = startLeft - dx
      }
      const onUp = () => {
        el.style.scrollBehavior = ''
        document.body.style.userSelect = ''
        dragMoved.current = moved
        // The click that may follow fires first and is swallowed below; clear the flag either way
        // so a drag ending on empty space can't suppress the next genuine click.
        if (moved) setTimeout(() => (dragMoved.current = false), 0)
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    // Swallow the click that ends a drag so a card link doesn't navigate.
    onClickCapture(event) {
      if (dragMoved.current) {
        event.preventDefault()
        event.stopPropagation()
        dragMoved.current = false
      }
    },
  }

  return { trackRef, edges: { start: state.start, end: state.end }, index: state.index, pages: state.pages, scrollBy, scrollTo, dragProps }
}

function ArrowButton({ carousel, label, dir }: { carousel: Carousel; label: string; dir: 1 | -1 }) {
  return (
    <button
      type="button"
      onClick={() => carousel.scrollBy(dir)}
      disabled={dir === -1 ? carousel.edges.start : carousel.edges.end}
      aria-label={dir === -1 ? `Previous ${label}` : `Next ${label}`}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink transition-all hover:border-primary hover:bg-primary hover:text-on-primary disabled:pointer-events-none disabled:opacity-40"
    >
      {dir === -1 ? <ChevronLeft aria-hidden className="size-5" /> : <ChevronRight aria-hidden className="size-5" />}
    </button>
  )
}

/** Centred control row below the cards: prev · position dots · next. */
function CarouselPager({ carousel, label }: { carousel: Carousel; label: string }) {
  if (carousel.pages <= 1) return null
  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <ArrowButton carousel={carousel} label={label} dir={-1} />
      <div className="flex items-center gap-2" role="tablist" aria-label={`${label} position`}>
        {Array.from({ length: carousel.pages }, (_, i) => {
          const current = i === carousel.index
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={current}
              aria-label={`Go to ${label} ${i + 1} of ${carousel.pages}`}
              onClick={() => carousel.scrollTo(i)}
              className={cn(
                'h-2.5 rounded-full transition-all duration-300',
                current ? 'w-7 bg-accent' : 'w-2.5 bg-line hover:bg-ink-subtle',
              )}
            />
          )
        })}
      </div>
      <ArrowButton carousel={carousel} label={label} dir={1} />
    </div>
  )
}

export function CarouselTrack({
  carousel,
  label,
  children,
  itemClassName,
}: {
  carousel: Carousel
  label: string
  children: ReactNode
  itemClassName?: string
}) {
  return (
    <>
      <Stagger>
        <div
          ref={carousel.trackRef}
          tabIndex={0}
          role="region"
          aria-label={`${label} (scroll horizontally, or drag)`}
          {...carousel.dragProps}
          className="-mx-4 flex cursor-grab snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto scroll-smooth px-4 pb-2 pt-2 scrollbar-none focus-visible:outline-offset-4 active:cursor-grabbing sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8"
        >
          {Children.map(children, (child) =>
            child == null ? null : (
              <StaggerItem data-card className={cn('w-[86%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]', itemClassName)}>
                {child}
              </StaggerItem>
            ),
          )}
        </div>
      </Stagger>
      <CarouselPager carousel={carousel} label={label} />
    </>
  )
}

import { useEffect, useLayoutEffect, useState, type RefObject } from 'react'

/**
 * Keeps `--sticky-top` on the element equal to the visible bottom edge of the fixed site header.
 * The header hides when scrolling down and slides back when scrolling up (500 ms transform), so
 * sticky bars and sidebars follow it frame by frame instead of leaving a gap or hiding under it.
 */
export function useStickyTop(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const header = document.querySelector<HTMLElement>('.site-header')
    let frame = 0
    let until = 0
    let last = -1
    const measure = () => {
      const bottom = header ? Math.max(0, Math.round(header.getBoundingClientRect().bottom)) : 0
      if (bottom !== last) {
        last = bottom
        element.style.setProperty('--sticky-top', `${bottom}px`)
      }
    }
    const tick = () => {
      measure()
      frame = performance.now() < until ? requestAnimationFrame(tick) : 0
    }
    const follow = () => {
      until = performance.now() + 700
      if (!frame) frame = requestAnimationFrame(tick)
    }
    measure()
    window.addEventListener('scroll', follow, { passive: true })
    window.addEventListener('resize', follow)
    return () => {
      window.removeEventListener('scroll', follow)
      window.removeEventListener('resize', follow)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref])
}

/** Debounced copy of a value. */
export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

/** Tracks a CSS media query. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const list = window.matchMedia(query)
    const onChange = () => setMatches(list.matches)
    onChange()
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/**
 * Where an element sits relative to the viewport: "above" once scrolled past, "below" before it is
 * reached, "visible" otherwise. Used to show floating action bars only when they add something.
 */
export function useViewportPosition(ref: RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState<'above' | 'visible' | 'below'>('visible')
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPosition('visible')
      else setPosition(entry.boundingClientRect.top < 0 ? 'above' : 'below')
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return position
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

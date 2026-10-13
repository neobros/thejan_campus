import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigation } from 'react-router'
import { cn } from '@/lib/cn'

export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-float transition-transform focus:translate-y-0"
    >
      Skip to main content
    </a>
  )
}

/** Thin progress bar at the top of the viewport while a route (and its data) loads. */
export function RouteProgress() {
  const navigation = useNavigation()
  const loading = navigation.state !== 'idle'
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setVisible(true), 120) // avoid flashing for instant navigations
      return () => clearTimeout(timer)
    }
    setVisible(false)
  }, [loading])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="route-progress"
          aria-hidden
          className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_12px] shadow-accent/60"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 0.85, transition: { duration: 6, ease: [0.1, 0.9, 0.2, 1] } }}
          exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.35 } }}
        />
      )}
    </AnimatePresence>
  )
}

/** Floating "back to top" button with a ring showing scroll progress. */
export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 })
  const [visible, setVisible] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setVisible(y > 900))
  const circumference = 2 * Math.PI * 20
  const ringRef = useRef<SVGCircleElement>(null)
  useMotionValueEvent(progress, 'change', (value) => {
    ringRef.current?.setAttribute('stroke-dashoffset', String(circumference * (1 - value)))
  })

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    document.getElementById('main')?.focus({ preventScroll: true })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 360, damping: 26 }}
          className={cn(
            'no-print fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full border border-line bg-surface/90 text-ink shadow-float backdrop-blur-md transition-colors hover:text-primary-ink sm:bottom-8 sm:right-8',
          )}
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden>
            <circle cx="24" cy="24" r="20" fill="none" stroke="var(--line)" strokeWidth="2.5" />
            <circle
              ref={ringRef}
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
            />
          </svg>
          <ArrowUp aria-hidden className="relative size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Moves content slightly slower/faster than the page while it scrolls past. */
export function Parallax({ children, offset = 60, className }: { children: ReactNode; offset?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset])
  return (
    <motion.div ref={ref} style={reduced ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  )
}

/** Counts up to a (real, derived) number when scrolled into view. */
export function CountUp({ value, duration = 1.6, className }: { value: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()
  useEffect(() => {
    const node = ref.current
    if (!node || !inView) return
    if (reduced) {
      node.textContent = value.toLocaleString()
      return
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = Math.round(latest).toLocaleString()
      },
    })
    return () => controls.stop()
  }, [inView, value, duration, reduced])
  return (
    <span ref={ref} className={className}>
      {reduced ? value.toLocaleString() : 0}
    </span>
  )
}

/** Infinite horizontal scroller (pauses on hover; static for reduced motion). */
export function Marquee({ children, duration = 40, className }: { children: ReactNode; duration?: number; className?: string }) {
  return (
    <div className={cn('group relative flex overflow-hidden mask-fade-x', className)} style={{ '--marquee-duration': `${duration}s` } as CSSProperties}>
      <div className="flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  )
}

/** Card wrapper with a soft light that follows the pointer. */
export function Spotlight({ children, className, color = 'var(--primary)' }: { children: ReactNode; className?: string; color?: string }) {
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }
  return (
    <div onPointerMove={onPointerMove} className={cn('group/spot relative', className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(480px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, ${color} 16%, transparent), transparent 45%)`,
        }}
      />
      {children}
    </div>
  )
}

/** Slow-moving glow blobs for hero and CTA backgrounds (pure CSS transforms — cheap to animate). */
export function Aurora({ className, intensity = 'strong' }: { className?: string; intensity?: 'strong' | 'soft' }) {
  const soft = intensity === 'soft'
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute -left-[20%] -top-[35%] aspect-square w-[75%] animate-aurora rounded-full will-change-transform"
        style={{ background: `radial-gradient(closest-side, rgb(59 91 219 / ${soft ? 0.18 : 0.55}), transparent)` }}
      />
      <div
        className="absolute -bottom-[45%] -right-[15%] aspect-square w-[65%] animate-aurora rounded-full will-change-transform [animation-delay:-9s]"
        style={{ background: `radial-gradient(closest-side, rgb(242 170 46 / ${soft ? 0.14 : 0.3}), transparent)` }}
      />
      <div
        className="absolute left-[30%] top-[10%] aspect-square w-[45%] animate-aurora rounded-full will-change-transform [animation-delay:-16s]"
        style={{ background: `radial-gradient(closest-side, rgb(124 58 237 / ${soft ? 0.12 : 0.32}), transparent)` }}
      />
    </div>
  )
}

/** Thin reading-progress bar pinned under the header. */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className={cn('fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-primary via-accent to-primary', className)}
    />
  )
}

/** Drawn check mark for success states. */
export function AnimatedCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 52" className={cn('size-16', className)} aria-hidden>
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M15 27.5l7 7 15-16"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
}

/**
 * 3D tilt that follows the pointer (fine pointers only). Also publishes `--px`/`--py` (−1..1) on
 * the element so children can add parallax, e.g. `[translate:calc(var(--px)*10px)_calc(var(--py)*10px)]`.
 */
export function Tilt({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const reduced = useReducedMotion()
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 220, damping: 22, mass: 0.6 })
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22, mass: 0.6 })

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const py = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    rotateY.set(px * max)
    rotateX.set(-py * max)
    event.currentTarget.style.setProperty('--px', px.toFixed(3))
    event.currentTarget.style.setProperty('--py', py.toFixed(3))
  }
  const onPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    rotateX.set(0)
    rotateY.set(0)
    event.currentTarget.style.setProperty('--px', '0')
    event.currentTarget.style.setProperty('--py', '0')
  }

  return (
    <motion.div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 1100 }}
      className={cn('[transform-style:preserve-3d] will-change-transform', className)}
    >
      {children}
    </motion.div>
  )
}

/** Decorative masked grid used behind page heroes. */
export function GridBackdrop({ className }: { className?: string }) {
  return <div aria-hidden className={cn('pointer-events-none absolute inset-0 bg-grid mask-fade-radial', className)} />
}

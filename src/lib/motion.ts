import type { Transition, Variants } from 'motion/react'

/** Shared motion language: quick to start, long gentle settle. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const

export const springSoft: Transition = { type: 'spring', stiffness: 260, damping: 30, mass: 0.8 }
export const springSnappy: Transition = { type: 'spring', stiffness: 420, damping: 34 }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
}

export function stagger(staggerChildren = 0.08, delayChildren = 0): Variants {
  return { hidden: {}, show: { transition: { staggerChildren, delayChildren } } }
}

/** Viewport settings for scroll reveals: animate once, a little before fully in view. */
export const inViewOnce = { once: true, amount: 0.2, margin: '0px 0px -60px 0px' } as const

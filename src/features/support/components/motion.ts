import type { MotionProps } from 'motion/react'
import { EASE_OUT_EXPO } from '@/lib/motion'

/** Props for list items inside `<AnimatePresence mode="popLayout">` that filter in and out. */
export function listItemMotion(index = 0): MotionProps {
  return {
    layout: true,
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.97, transition: { duration: 0.18 } },
    transition: { duration: 0.45, delay: Math.min(index, 8) * 0.035, ease: EASE_OUT_EXPO },
  }
}

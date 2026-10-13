import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_OUT_EXPO, fadeUp, inViewOnce, stagger as staggerVariants } from '@/lib/motion'

type RevealTag = 'div' | 'section' | 'li' | 'ul' | 'ol' | 'article' | 'header' | 'footer' | 'span' | 'p' | 'figure' | 'aside' | 'dl'

interface RevealProps {
  as?: RevealTag
  children?: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  x?: number
  scale?: number
  blur?: boolean
  /** Animate on mount instead of when scrolled into view (use for above-the-fold content). */
  immediate?: boolean
  id?: string
}

/** Fade/slide content in as it enters the viewport. */
export function Reveal({
  as = 'div',
  children,
  className,
  delay = 0,
  duration = 0.8,
  y = 24,
  x = 0,
  scale = 1,
  blur = false,
  immediate = false,
  id,
}: RevealProps) {
  const Tag = motion[as] as typeof motion.div
  const hidden = { opacity: 0, y, x, scale, ...(blur ? { filter: 'blur(10px)' } : {}) }
  const shown = { opacity: 1, y: 0, x: 0, scale: 1, ...(blur ? { filter: 'blur(0px)' } : {}) }
  return (
    <Tag
      id={id}
      className={className}
      initial={hidden}
      {...(immediate ? { animate: shown } : { whileInView: shown, viewport: inViewOnce })}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </Tag>
  )
}

interface StaggerProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'whileInView' | 'animate'> {
  as?: RevealTag
  stagger?: number
  delay?: number
  immediate?: boolean
}

/** Parent that reveals its <StaggerItem> children one after another. */
export function Stagger({ as = 'div', stagger = 0.08, delay = 0, immediate = false, children, ...rest }: StaggerProps) {
  const Tag = motion[as] as typeof motion.div
  return (
    <Tag
      variants={staggerVariants(stagger, delay)}
      initial="hidden"
      {...(immediate ? { animate: 'show' } : { whileInView: 'show', viewport: inViewOnce })}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function StaggerItem({ as = 'div', children, ...rest }: Omit<HTMLMotionProps<'div'>, 'variants'> & { as?: RevealTag }) {
  const Tag = motion[as] as typeof motion.div
  return (
    <Tag variants={fadeUp} {...rest}>
      {children}
    </Tag>
  )
}

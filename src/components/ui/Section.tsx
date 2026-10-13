import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from '@/components/motion/Reveal'

export type SectionBackground = 'default' | 'alt' | 'night'

const backgrounds: Record<SectionBackground, string> = {
  default: 'bg-canvas',
  alt: 'bg-canvas-alt',
  night: 'theme-night',
}

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: SectionBackground
  spacing?: 'sm' | 'md' | 'lg' | 'none'
  /** Render children inside the standard page container (default true). */
  contained?: boolean
}

export function Section({ background = 'default', spacing = 'md', contained = true, className, children, ...rest }: SectionProps) {
  return (
    <section
      className={cn(
        'relative',
        backgrounds[background],
        spacing === 'sm' && 'py-10 sm:py-12',
        spacing === 'md' && 'py-16 sm:py-20 lg:py-24',
        spacing === 'lg' && 'py-20 sm:py-28 lg:py-32',
        className,
      )}
      {...rest}
    >
      {contained ? <div className="container-page">{children}</div> : children}
    </section>
  )
}

export interface SectionHeaderProps {
  eyebrow?: ReactNode
  heading?: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  /** Optional link/button aligned to the right on wide screens. */
  action?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  id?: string
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-ink', className)}>
      <span aria-hidden className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
      {children}
    </p>
  )
}

export function SectionHeader({ eyebrow, heading, intro, align = 'left', action, as: Heading = 'h2', className, id }: SectionHeaderProps) {
  if (!eyebrow && !heading && !intro) return null
  const centered = align === 'center'
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-6 sm:mb-14',
        centered ? 'items-center text-center' : 'lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-3xl', centered && 'mx-auto')}>
        {eyebrow && (
          <Reveal y={12}>
            <Eyebrow className={cn('mb-4', centered && 'justify-center')}>{eyebrow}</Eyebrow>
          </Reveal>
        )}
        {heading && (
          <Reveal y={20} delay={0.05}>
            <Heading id={id} className="font-display text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl lg:text-[2.75rem]">
              {heading}
            </Heading>
          </Reveal>
        )}
        {intro && (
          <Reveal y={16} delay={0.12}>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{intro}</p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal y={12} delay={0.15} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  )
}

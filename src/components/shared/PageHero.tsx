import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import type { Action, ImageAsset } from '@/api/types'
import { cn } from '@/lib/cn'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'
import { ActionButtons } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Section'
import { SmartImage } from '@/components/ui/SmartImage'
import { Aurora, GridBackdrop } from '@/components/motion/effects'
import { Reveal } from '@/components/motion/Reveal'
import { TextReveal } from '@/components/motion/TextReveal'

export interface PageHeroProps {
  title: string
  eyebrow?: string
  summary?: ReactNode
  breadcrumbs?: Crumb[]
  image?: ImageAsset | null
  actions?: Action[]
  /** Extra content under the summary (badges, quick facts…). */
  children?: ReactNode
  /** Replaces the image column (e.g. a summary card). */
  aside?: ReactNode
  className?: string
}

/** Standard top-of-page hero. Pads itself below the fixed header. */
export function PageHero({ title, eyebrow, summary, breadcrumbs, image, actions, children, aside, className }: PageHeroProps) {
  const hasSide = Boolean(image || aside)
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden border-b border-line bg-canvas-alt pb-14 pt-[calc(var(--header-h)+2rem)] sm:pb-20 sm:pt-[calc(var(--header-h)+3rem)]',
        className,
      )}
    >
      <Aurora intensity="soft" className="-z-10" />
      <GridBackdrop className="-z-10 opacity-70" />

      <div className={cn('container-page grid items-center gap-12', hasSide && 'lg:grid-cols-12 lg:gap-16')}>
        <div className={cn(hasSide ? 'lg:col-span-7' : 'max-w-4xl')}>
          {breadcrumbs && (
            <Reveal immediate y={8} duration={0.6}>
              <Breadcrumbs items={breadcrumbs} className="mb-8" />
            </Reveal>
          )}
          {eyebrow && (
            <Reveal immediate y={10} delay={0.05}>
              <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
            </Reveal>
          )}
          <TextReveal
            text={title}
            delay={0.1}
            className="font-display text-[2.5rem] font-semibold leading-[1.04] tracking-tight text-ink sm:text-5xl lg:text-[3.75rem]"
          />
          {summary && (
            <Reveal immediate y={16} delay={0.35}>
              <div className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">{summary}</div>
            </Reveal>
          )}
          {children && (
            <Reveal immediate y={16} delay={0.45}>
              <div className="mt-7">{children}</div>
            </Reveal>
          )}
          {actions && actions.length > 0 && (
            <Reveal immediate y={16} delay={0.5}>
              <ActionButtons actions={actions} className="mt-9" />
            </Reveal>
          )}
        </div>

        {hasSide && (
          <div className="relative lg:col-span-5">
            {aside ? (
              <Reveal immediate y={24} delay={0.3}>
                {aside}
              </Reveal>
            ) : (
              image && <HeroImage image={image} />
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function HeroImage({ image }: { image: ImageAsset }) {
  return (
    <div className="relative mx-auto max-w-xl lg:max-w-none">
      <motion.div
        aria-hidden
        className="absolute -right-4 -top-4 h-[85%] w-[80%] rounded-[2.25rem] bg-gradient-to-br from-primary/25 via-accent/20 to-transparent sm:-right-6 sm:-top-6"
        initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.2 }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-5 -left-5 size-24 rounded-full bg-dots opacity-70 animate-float-slow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 0.6 }}
      />
      <motion.div
        className="relative overflow-hidden rounded-[2rem] shadow-float ring-1 ring-line"
        initial={{ clipPath: 'inset(100% 0% 0% 0% round 2rem)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)' }}
        transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.15 }}
      >
        <motion.div initial={{ scale: 1.18 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: EASE_OUT_EXPO, delay: 0.15 }}>
          <SmartImage image={image} priority sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/3]" />
        </motion.div>
      </motion.div>
    </div>
  )
}

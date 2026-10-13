import { motion, useInView, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import type { BlockProps } from './types'

function StepItem({ index, title, text, meta }: { index: number; title: string; text: string; meta?: string }) {
  const ref = useRef<HTMLLIElement>(null)
  const reached = useInView(ref, { margin: '0px 0px -45% 0px' })
  return (
    <li ref={ref} className="relative pb-12 pl-20 last:pb-0 sm:pl-24">
      <motion.span
        aria-hidden
        className={cn(
          'absolute left-0 top-0 grid size-14 place-items-center rounded-2xl border font-display text-xl font-semibold transition-colors duration-500 sm:size-16',
          reached
            ? 'border-primary bg-primary text-on-primary shadow-lg shadow-primary/30'
            : 'border-line bg-surface text-ink-subtle',
        )}
        animate={{ scale: reached ? 1 : 0.9 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {index + 1}
      </motion.span>
      <Reveal x={24} y={0}>
        {meta && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink">{meta}</p>}
        <h3 className="pt-2 text-xl font-semibold text-ink sm:pt-3">
          <span className="sr-only">Step {index + 1}: </span>
          {title}
        </h3>
        <p className="mt-2 max-w-xl leading-relaxed text-ink-muted">{text}</p>
      </Reveal>
    </li>
  )
}

/** Numbered process with a line that fills as you scroll through the steps. */
export function StepsBlock({ block, className }: BlockProps<'steps'>) {
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return (
    <Section background={block.background} className={className} id={block.id}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} className="mb-0 sm:mb-0" />
          </div>
        </div>
        <div className="relative lg:col-span-7">
          <div aria-hidden className="absolute bottom-8 left-7 top-8 w-px bg-line sm:left-8" />
          <motion.div aria-hidden style={{ scaleY: fill }} className="absolute bottom-8 left-7 top-8 w-px origin-top bg-gradient-to-b from-primary via-accent to-primary sm:left-8" />
          <ol ref={listRef} className="relative">
            {block.items.map((item, index) => (
              <StepItem key={item.title} index={index} title={item.title} text={item.text} meta={item.meta} />
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}

export function TimelineBlock({ block, className }: BlockProps<'timeline'>) {
  return (
    <Section background={block.background} className={className} id={block.id}>
      <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
      <ol className="relative mx-auto max-w-4xl">
        <span aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-line-strong/50 to-transparent md:left-1/2" />
        {block.items.map((item, index) => {
          const right = index % 2 === 1
          return (
            <li key={`${item.label}-${item.title}`} className="relative pb-12 last:pb-0">
              <span aria-hidden className="absolute left-4 top-2 size-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-accent-soft md:left-1/2" />
              <Reveal
                x={right ? 32 : -32}
                y={0}
                className={cn('pl-12 md:w-1/2 md:pl-0', right ? 'md:ml-auto md:pl-12' : 'md:pr-12 md:text-right')}
              >
                <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-accent-ink">{item.label}</p>
                <h3 className="mt-2 text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{item.text}</p>
              </Reveal>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}

import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { queries } from '@/api/queries'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import type { ModuleComponentProps } from '@/components/blocks/types'
import { cn } from '@/lib/cn'
import { EASE_OUT_EXPO } from '@/lib/motion'

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/**
 * Consented testimonials only (spec §5.1). The section is omitted entirely when there are none.
 * No auto-advance: visitors move between quotes themselves.
 */
export function TestimonialsModule({ block, className }: ModuleComponentProps) {
  const { data } = useQuery(queries.testimonials())
  const [[index, direction], setState] = useState<[number, number]>([0, 0])
  if (!data?.length) return null
  const current = data[index % data.length]
  const go = (delta: number) => setState(([i]) => [(i + delta + data.length) % data.length, delta])

  return (
    <ModuleSection block={block} className={className} align="center">
      <div className="relative mx-auto max-w-4xl">
        <Quote aria-hidden className="absolute -top-6 left-0 size-20 rotate-180 text-accent/25 sm:-left-10" />
        <div className="relative min-h-72 overflow-hidden rounded-[2.25rem] border border-line bg-surface px-6 py-12 text-center shadow-card sm:px-14 sm:py-14" aria-live="polite">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.figure
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: direction * -60, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
            >
              <blockquote className="font-display text-2xl font-medium leading-snug text-ink sm:text-[2rem] sm:leading-[1.3]">“{current.quote}”</blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-4">
                <span aria-hidden className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-primary to-brand-800 font-semibold text-white">
                  {initials(current.name)}
                </span>
                <span className="text-left">
                  <span className="block font-semibold text-ink">{current.name}</span>
                  <span className="block text-sm text-ink-subtle">{current.context}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        {data.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="grid size-11 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-primary hover:bg-primary hover:text-on-primary"
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <div className="flex gap-2">
              {data.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  aria-label={`Show testimonial ${i + 1} of ${data.length}`}
                  aria-current={i === index ? 'true' : undefined}
                  className={cn('h-2 rounded-full transition-all duration-500', i === index ? 'w-8 bg-primary' : 'w-2 bg-line-strong/50 hover:bg-line-strong')}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="grid size-11 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-primary hover:bg-primary hover:text-on-primary"
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
          </div>
        )}
      </div>
    </ModuleSection>
  )
}

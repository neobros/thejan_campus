import { Check } from 'lucide-react'
import { ActionButtons } from '@/components/ui/Button'
import { Markdown } from '@/components/ui/Markdown'
import { Eyebrow, Section } from '@/components/ui/Section'
import { SmartImage } from '@/components/ui/SmartImage'
import { Parallax } from '@/components/motion/effects'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import type { BlockProps } from './types'

/** Image beside text, with a parallax image and layered frame. */
export function SplitBlock({ block, className }: BlockProps<'split'>) {
  const imageLeft = block.imageSide === 'left'
  return (
    <Section background={block.background} className={className} id={block.id}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal x={imageLeft ? -40 : 40} y={0} className={cn('relative', imageLeft ? 'lg:order-1' : 'lg:order-2')}>
          <div aria-hidden className={cn('absolute -inset-4 -z-0 rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-transparent to-accent/20 sm:-inset-6', imageLeft ? 'rotate-[-2deg]' : 'rotate-[2deg]')} />
          <div className="relative overflow-hidden rounded-[2rem] shadow-float ring-1 ring-line">
            <Parallax offset={30}>
              <SmartImage image={block.image} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] scale-110" />
            </Parallax>
          </div>
        </Reveal>
        <div className={cn(imageLeft ? 'lg:order-2' : 'lg:order-1')}>
          {block.eyebrow && (
            <Reveal y={12}>
              <Eyebrow className="mb-4">{block.eyebrow}</Eyebrow>
            </Reveal>
          )}
          <Reveal y={20} delay={0.05}>
            <h2 className="font-display text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl lg:text-[2.75rem]">{block.heading}</h2>
          </Reveal>
          <Reveal y={16} delay={0.1}>
            <Markdown className="mt-5" size="lg">
              {block.body}
            </Markdown>
          </Reveal>
          {block.bullets && block.bullets.length > 0 && (
            <Stagger as="ul" stagger={0.06} delay={0.15} className="mt-7 grid gap-3 sm:grid-cols-2">
              {block.bullets.map((bullet) => (
                <StaggerItem as="li" key={bullet} className="flex items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
                    <Check aria-hidden strokeWidth={3} className="size-3" />
                  </span>
                  <span className="text-[0.9375rem] font-medium text-ink">{bullet}</span>
                </StaggerItem>
              ))}
            </Stagger>
          )}
          <Reveal y={16} delay={0.2}>
            <ActionButtons actions={block.actions} size="md" className="mt-9" />
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

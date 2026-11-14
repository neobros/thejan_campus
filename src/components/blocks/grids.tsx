import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import type { PanelTone } from '@/api/types'
import { AppLink } from '@/components/ui/AppLink'
import { Icon } from '@/components/ui/Icon'
import { SmartImage } from '@/components/ui/SmartImage'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Spotlight } from '@/components/motion/effects'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import type { BlockProps } from './types'

const columnClasses = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const

// Soft background tones for coloured panels (Vision/Mission/Values, outcomes).
const toneClass: Record<PanelTone, string> = {
  rose: 'bg-rose-50 ring-rose-100 dark:bg-rose-950/30 dark:ring-rose-900/40',
  blue: 'bg-sky-50 ring-sky-100 dark:bg-sky-950/30 dark:ring-sky-900/40',
  amber: 'bg-amber-50 ring-amber-100 dark:bg-amber-950/30 dark:ring-amber-900/40',
  emerald: 'bg-emerald-50 ring-emerald-100 dark:bg-emerald-950/30 dark:ring-emerald-900/40',
}
const toneCycle: PanelTone[] = ['rose', 'blue', 'amber', 'emerald']

export function FeatureGridBlock({ block, className }: BlockProps<'featureGrid'>) {
  const variant = block.variant ?? 'cards'
  const columns = columnClasses[block.columns ?? 3]

  const grid = (
    <Stagger className={cn('grid gap-5', columns, variant === 'icons' && 'gap-x-8 gap-y-12')}>
      {block.items.map((item, index) => {
        const tone = item.tone ?? toneCycle[index % toneCycle.length]
        const iconBadge =
          variant === 'numbered' ? (
            <span className="font-display text-5xl font-semibold leading-none text-transparent [-webkit-text-stroke:1.5px_var(--accent)]">
              {String(index + 1).padStart(2, '0')}
            </span>
          ) : (
            item.icon && (
              <span
                className={cn(
                  'grid place-items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  variant === 'panels'
                    ? 'size-16 rounded-2xl bg-white text-accent shadow-sm ring-1 ring-black/5 group-hover:scale-105 dark:bg-white/10'
                    : variant === 'icons'
                      ? 'size-14 rounded-2xl bg-gradient-to-br from-primary to-brand-800 text-white shadow-lg shadow-primary/25 group-hover:-rotate-6 group-hover:scale-110'
                      : 'size-16 rounded-2xl bg-accent-soft text-accent group-hover:bg-accent group-hover:text-on-accent',
                )}
              >
                <Icon name={item.icon} className={variant === 'icons' ? 'size-6' : 'size-8'} />
              </span>
            )
          )
        const body = (
          <>
            {iconBadge}
            <h3 className={cn('font-semibold text-ink', variant === 'icons' ? 'mt-6 text-lg' : 'mt-5 text-lg')}>{item.title}</h3>
            <p className="mt-2 leading-relaxed text-ink-muted">{item.text}</p>
            {item.href && variant !== 'cards' && (
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-ink">
                {item.linkLabel ?? 'Learn more'}
                <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            )}
            {/* Red circular arrow button, like the mockup, for linked cards. */}
            {item.href && variant === 'cards' && (
              <span
                aria-hidden
                className="mt-6 grid size-10 place-items-center rounded-full bg-accent text-on-accent shadow-sm transition-transform duration-300 group-hover:translate-x-1"
              >
                <ArrowRight className="size-5" />
              </span>
            )}
          </>
        )
        const cardClass =
          variant === 'icons'
            ? 'group relative'
            : variant === 'panels'
              ? cn('group relative h-full rounded-3xl p-7 ring-1 transition-all duration-500 hover:-translate-y-1', toneClass[tone])
              : 'group relative h-full overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover'
        // Cards can carry a photo thumbnail (matches the AIT programme cards); content is then padded inside.
        const content =
          variant === 'cards' ? (
            <>
              {item.image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SmartImage image={item.image} hoverZoom sizes="(min-width: 1024px) 28vw, 90vw" className="size-full" />
                </div>
              )}
              <div className="p-7">{body}</div>
            </>
          ) : (
            body
          )
        return (
          <StaggerItem key={item.title} className="h-full">
            {variant === 'icons' || variant === 'panels' ? (
              <div className={cardClass}>{item.href ? <AppLink href={item.href} className="block">{body}</AppLink> : body}</div>
            ) : (
              <Spotlight className="h-full rounded-3xl">
                {item.href ? (
                  <AppLink href={item.href} className={cn(cardClass, 'block')}>
                    {content}
                  </AppLink>
                ) : (
                  <div className={cardClass}>{content}</div>
                )}
              </Spotlight>
            )}
          </StaggerItem>
        )
      })}
    </Stagger>
  )

  if (block.aside) {
    return (
      <Section background={block.background} className={className} id={block.id}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} className="mb-0 sm:mb-0" />
            </div>
          </div>
          <div className="lg:col-span-8">{grid}</div>
        </div>
      </Section>
    )
  }
  return (
    <Section background={block.background} className={className} id={block.id}>
      <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
      {grid}
    </Section>
  )
}

export function LinkCardsBlock({ block, className }: BlockProps<'linkCards'>) {
  if (!block.items.length) return null
  return (
    <Section background={block.background} className={className} id={block.id}>
      <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
      <Stagger className={cn('grid gap-4', block.items.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2')}>
        {block.items.map((item) => (
          <StaggerItem key={`${item.href}|${item.title}`}>
            <AppLink
              href={item.href}
              className="group relative flex h-full items-start gap-4 overflow-hidden rounded-3xl border border-line bg-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-500 group-hover:scale-x-100"
              />
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface-muted text-primary-ink transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                <Icon name={item.icon ?? 'route'} className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-ink">{item.title}</span>
                  <ArrowUpRight aria-hidden className="size-5 shrink-0 text-ink-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-ink" />
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-ink-muted">{item.text}</span>
              </span>
            </AppLink>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}

export function ChecklistBlock({ block, className }: BlockProps<'checklist'>) {
  return (
    <Section background={block.background} className={className} id={block.id}>
      <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
      <div className={cn('grid gap-5', block.groups.length > 1 && 'md:grid-cols-2')}>
        {block.groups.map((group, g) => (
          <Reveal key={group.title ?? g} delay={g * 0.08} className="rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-8">
            {group.title && <h3 className="mb-5 font-display text-xl font-semibold text-ink">{group.title}</h3>}
            <Stagger as="ul" stagger={0.05} className="space-y-3.5">
              {group.items.map((item) => (
                <StaggerItem as="li" key={item} className="flex gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                    <Check aria-hidden strokeWidth={3} className="size-3" />
                  </span>
                  <span className="leading-relaxed text-ink-muted">{item}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        ))}
      </div>
      {block.note && (
        <Reveal>
          <p className="mt-6 text-sm text-ink-subtle">{block.note}</p>
        </Reveal>
      )}
    </Section>
  )
}

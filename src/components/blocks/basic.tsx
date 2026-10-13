import { Quote } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Callout } from '@/components/ui/feedback'
import { Icon } from '@/components/ui/Icon'
import { Markdown } from '@/components/ui/Markdown'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { CtaBanner } from '@/components/shared/CtaBanner'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'
import { cn } from '@/lib/cn'
import type { BlockProps } from './types'

export function RichTextBlock({ block, className }: BlockProps<'richText'>) {
  return (
    <Section background={block.background} className={className} id={block.id}>
      <div className={cn(block.width === 'wide' ? 'max-w-5xl' : 'max-w-3xl')}>
        <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} className="mb-8 sm:mb-10" />
        <Reveal>
          <Markdown className={cn(block.width === 'wide' && 'max-w-none')}>{block.body}</Markdown>
        </Reveal>
      </div>
    </Section>
  )
}

export function IntroBlock({ block, className }: BlockProps<'intro'>) {
  const highlights = block.highlights ?? []
  return (
    <Section background={block.background} className={className} id={block.id}>
      <div className={cn('grid gap-12', highlights.length > 0 && 'lg:grid-cols-12 lg:gap-16')}>
        <div className={cn(highlights.length > 0 ? 'lg:col-span-7' : 'max-w-4xl')}>
          <Reveal>
            <p className="font-display text-2xl font-medium leading-snug text-ink sm:text-[2rem] sm:leading-[1.3]">{block.lead}</p>
          </Reveal>
          {block.body && (
            <Reveal delay={0.1}>
              <Markdown className="mt-6">{block.body}</Markdown>
            </Reveal>
          )}
        </div>
        {highlights.length > 0 && (
          <Stagger className="grid content-start gap-4 sm:grid-cols-2 lg:col-span-5">
            {highlights.map((item) => (
              <StaggerItem key={item.label} className="rounded-3xl border border-line bg-surface p-6 shadow-card">
                {item.icon && (
                  <span className="mb-4 grid size-10 place-items-center rounded-xl bg-accent-soft text-on-accent-soft">
                    <Icon name={item.icon} className="size-5" />
                  </span>
                )}
                <p className="font-display text-2xl font-semibold text-ink">{item.value}</p>
                <p className="mt-1 text-sm text-ink-muted">{item.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </Section>
  )
}

export function CalloutBlock({ block, className }: BlockProps<'callout'>) {
  return (
    <Section background={block.background} spacing="sm" className={className} id={block.id}>
      <Reveal className="mx-auto max-w-4xl">
        <Callout
          tone={block.tone}
          title={block.title}
          action={
            block.action ? (
              <ButtonLink href={block.action.href} variant="link" arrow>
                {block.action.label}
              </ButtonLink>
            ) : undefined
          }
        >
          <Markdown size="sm" className="max-w-none prose-p:my-1">
            {block.body}
          </Markdown>
        </Callout>
      </Reveal>
    </Section>
  )
}

export function QuoteBlock({ block, className }: BlockProps<'quote'>) {
  return (
    <Section background={block.background} className={className} id={block.id}>
      <Reveal className="relative mx-auto max-w-4xl text-center">
        <Quote aria-hidden className="mx-auto size-12 rotate-180 text-accent" />
        <blockquote className="mt-6 font-display text-2xl font-medium italic leading-snug text-ink sm:text-4xl sm:leading-tight">
          “{block.quote}”
        </blockquote>
        <p className="mt-6 font-semibold text-ink">{block.attribution}</p>
        {block.role && <p className="text-sm text-ink-subtle">{block.role}</p>}
      </Reveal>
    </Section>
  )
}

export function CtaBlock({ block, className }: BlockProps<'cta'>) {
  return (
    <Section background={block.background} className={className} id={block.id}>
      <CtaBanner eyebrow={block.eyebrow} heading={block.heading} body={block.body} actions={block.actions} />
    </Section>
  )
}

export function TableBlock({ block, className }: BlockProps<'table'>) {
  return (
    <Section background={block.background} className={className} id={block.id}>
      <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
      <Reveal>
        {/* Wide screens: a real table. */}
        <div className="hidden overflow-hidden rounded-3xl border border-line bg-surface shadow-card md:block">
          <table className="w-full border-collapse text-left text-[0.9375rem]">
            {block.caption && <caption className="sr-only">{block.caption}</caption>}
            <thead className="bg-surface-muted">
              <tr>
                {block.columns.map((column) => (
                  <th key={column} scope="col" className="px-5 py-4 text-sm font-semibold text-ink">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-t border-line transition-colors hover:bg-surface-muted/50">
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row" className="px-5 py-4 align-top font-semibold text-ink">
                        {cell}
                      </th>
                    ) : (
                      <td key={c} className="px-5 py-4 align-top text-ink-muted">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Small screens: one card per row. */}
        <ul className="space-y-3 md:hidden">
          {block.rows.map((row, r) => (
            <li key={r} className="rounded-2xl border border-line bg-surface p-5">
              <p className="font-semibold text-ink">{row[0]}</p>
              <dl className="mt-3 space-y-2 text-sm">
                {row.slice(1).map((cell, c) => (
                  <div key={c}>
                    <dt className="text-ink-subtle">{block.columns[c + 1]}</dt>
                    <dd className="text-ink-muted">{cell}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        {block.caption && <p className="mt-3 text-sm text-ink-subtle">{block.caption}</p>}
      </Reveal>
    </Section>
  )
}

export function FaqsBlock({ block, className }: BlockProps<'faqs'>) {
  return (
    <Section background={block.background} className={className} id={block.id}>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeader eyebrow={block.eyebrow ?? 'FAQs'} heading={block.heading ?? 'Common questions'} intro={block.intro} className="mb-0 sm:mb-0" />
            <Reveal delay={0.2}>
              <ButtonLink href="/faq" variant="link" arrow className="mt-6">
                All FAQs
              </ButtonLink>
            </Reveal>
          </div>
        </div>
        <Reveal className="lg:col-span-8">
          <Accordion type="single" collapsible>
            {block.items.map((item, i) => (
              <AccordionItem key={i} value={`q-${i}`} title={item.question}>
                <Markdown size="sm" className="max-w-none">
                  {item.answer}
                </Markdown>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  )
}

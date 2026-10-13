import { Suspense } from 'react'
import type { Block } from '@/api/types'
import { CardGridSkeleton } from '@/components/ui/feedback'
import { Section } from '@/components/ui/Section'
import { CalloutBlock, CtaBlock, FaqsBlock, IntroBlock, QuoteBlock, RichTextBlock, TableBlock } from './basic'
import { ChecklistBlock, FeatureGridBlock, LinkCardsBlock } from './grids'
import { moduleRegistry } from './modules'
import { StepsBlock, TimelineBlock } from './sequences'
import { SplitBlock } from './split'
import type { ModuleBlock } from './types'

function ModuleRenderer({ block, className }: { block: ModuleBlock; className?: string }) {
  const Component = moduleRegistry[block.module]
  if (!Component) return null
  return (
    <Suspense
      fallback={
        <Section background={block.background} className={className}>
          <CardGridSkeleton count={3} />
        </Section>
      }
    >
      <Component block={block} className={className} />
    </Suspense>
  )
}

function renderBlock(block: Block, className?: string) {
  switch (block.type) {
    case 'richText':
      return <RichTextBlock block={block} className={className} />
    case 'intro':
      return <IntroBlock block={block} className={className} />
    case 'featureGrid':
      return <FeatureGridBlock block={block} className={className} />
    case 'steps':
      return <StepsBlock block={block} className={className} />
    case 'checklist':
      return <ChecklistBlock block={block} className={className} />
    case 'split':
      return <SplitBlock block={block} className={className} />
    case 'table':
      return <TableBlock block={block} className={className} />
    case 'callout':
      return <CalloutBlock block={block} className={className} />
    case 'linkCards':
      return <LinkCardsBlock block={block} className={className} />
    case 'timeline':
      return <TimelineBlock block={block} className={className} />
    case 'quote':
      return <QuoteBlock block={block} className={className} />
    case 'cta':
      return <CtaBlock block={block} className={className} />
    case 'faqs':
      return <FaqsBlock block={block} className={className} />
    case 'module':
      return <ModuleRenderer block={block} className={className} />
    default:
      return null
  }
}

/** Renders CMS blocks in order. Adjacent sections with the same background share padding. */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        const background = block.background ?? 'default'
        const previous = index > 0 ? (blocks[index - 1].background ?? 'default') : null
        const joined = previous === background && block.type !== 'callout'
        return <div key={block.id}>{renderBlock(block, joined ? 'pt-0!' : undefined)}</div>
      })}
    </>
  )
}

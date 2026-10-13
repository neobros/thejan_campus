import type { ReactNode } from 'react'
import { Section, SectionHeader } from '@/components/ui/Section'
import type { ModuleBlock } from './types'

/** Standard section wrapper for dynamic modules: background, spacing and CMS heading. */
export function ModuleSection({
  block,
  className,
  action,
  align,
  children,
}: {
  block: ModuleBlock
  className?: string
  action?: ReactNode
  align?: 'left' | 'center'
  children: ReactNode
}) {
  return (
    <Section background={block.background} className={className} id={block.id}>
      <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} action={action} align={align} />
      {children}
    </Section>
  )
}

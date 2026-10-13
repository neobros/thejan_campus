import { ModuleSection } from '@/components/blocks/ModuleSection'
import type { ModuleComponentProps } from '@/components/blocks/types'
import { Callout } from '@/components/ui/feedback'
import { Reveal } from '@/components/motion/Reveal'
import { EnquiryForm } from './EnquiryForm'

/** Education agent enquiry (spec §5.15, §7): organisation, contact, country, message and consent. */
export function AgentEnquiryFormModule({ block, className }: ModuleComponentProps) {
  return (
    <ModuleSection block={block} className={className}>
      <Reveal className="mx-auto max-w-3xl">
        <Callout tone="info" title="An enquiry is not an approval" className="mb-6">
          Asking about an agent agreement does not create an agreement or an approved listing. Agents appear in our directory only after an
          agreement has been signed and approved.
        </Callout>
        <div className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-card sm:p-10">
          <EnquiryForm variant="agent" headingLevel={block.heading ? 'h3' : 'h2'} />
        </div>
      </Reveal>
    </ModuleSection>
  )
}

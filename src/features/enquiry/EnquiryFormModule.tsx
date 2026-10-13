import { ModuleSection } from '@/components/blocks/ModuleSection'
import { moduleProp, type ModuleComponentProps } from '@/components/blocks/types'
import { Reveal } from '@/components/motion/Reveal'
import { EnquiryForm } from './EnquiryForm'

/** CMS enquiry form (spec §5.26). Optional `props.topic` pre-selects the enquiry topic. */
export function EnquiryFormModule({ block, className }: ModuleComponentProps) {
  const topic = moduleProp<string | undefined>(block, 'topic', undefined)
  return (
    <ModuleSection block={block} className={className}>
      <Reveal className="mx-auto max-w-3xl rounded-[1.75rem] border border-line bg-surface p-6 shadow-card sm:p-10">
        <EnquiryForm context={{ topic }} headingLevel={block.heading ? 'h3' : 'h2'} />
      </Reveal>
    </ModuleSection>
  )
}

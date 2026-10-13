import { useQuery } from '@tanstack/react-query'
import { BadgeCheck, Handshake } from 'lucide-react'
import { queries } from '@/api/queries'
import type { ModuleComponentProps } from '@/components/blocks/types'
import { AppLink } from '@/components/ui/AppLink'
import { Section } from '@/components/ui/Section'
import { SmartImage } from '@/components/ui/SmartImage'
import { Marquee } from '@/components/motion/effects'
import { Reveal } from '@/components/motion/Reveal'

/**
 * Verified recognitions and partners as a slow marquee. Logos appear only when an approved logo
 * file exists; otherwise the name is shown. Omitted when there is nothing verified to show.
 */
export function PartnerStripModule({ block, className }: ModuleComponentProps) {
  const { data } = useQuery(queries.accreditations())
  if (!data?.length) return null
  return (
    <Section background={block.background} spacing="sm" className={className} id={block.id}>
      <Reveal className="flex flex-col items-center gap-6">
        {block.eyebrow && <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle">{block.eyebrow}</p>}
        <Marquee duration={45} className="w-full">
          {data.map((item) => (
            <AppLink
              key={item.id}
              href="/about/accreditation"
              className="mx-3 flex h-16 shrink-0 items-center gap-3 rounded-2xl border border-line bg-surface px-5 text-ink-muted grayscale transition-all hover:border-primary/40 hover:text-ink hover:grayscale-0"
            >
              {item.logo?.src ? (
                <SmartImage image={item.logo} className="h-8 w-28 [&_img]:object-contain" />
              ) : item.kind === 'partnership' ? (
                <Handshake aria-hidden className="size-5 text-primary-ink" />
              ) : (
                <BadgeCheck aria-hidden className="size-5 text-primary-ink" />
              )}
              <span className="whitespace-nowrap text-sm font-medium">{item.name}</span>
            </AppLink>
          ))}
        </Marquee>
      </Reveal>
    </Section>
  )
}

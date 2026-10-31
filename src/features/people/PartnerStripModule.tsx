import { useQuery } from '@tanstack/react-query'
import { BadgeCheck, Handshake } from 'lucide-react'
import { queries } from '@/api/queries'
import { moduleProp, type ModuleComponentProps } from '@/components/blocks/types'
import { cn } from '@/lib/cn'
import { AppLink } from '@/components/ui/AppLink'
import { Section, SectionHeader } from '@/components/ui/Section'
import { SmartImage } from '@/components/ui/SmartImage'
import { Marquee } from '@/components/motion/effects'
import { Reveal } from '@/components/motion/Reveal'

/** An education partner shown with its logo. `href`, when present, links out to the partner's own site. */
interface Partner {
  name: string
  logo: string
  width: number
  height: number
  href?: string
}

const CARD =
  'flex h-20 items-center rounded-2xl border border-line bg-white px-6 shadow-card ring-1 ring-black/5 sm:h-24 sm:px-8'

function PartnerLogo({ p, big }: { p: Partner; big?: boolean }) {
  return (
    <img
      src={p.logo}
      alt={p.name}
      width={p.width}
      height={p.height}
      loading="lazy"
      decoding="async"
      className={cn('w-auto object-contain', big ? 'h-12 max-w-[16rem] sm:h-14 sm:max-w-[20rem]' : 'h-10 max-w-[9rem] sm:h-12 sm:max-w-[11rem]')}
    />
  )
}

/** One logo card — a link when the partner has a website, otherwise a plain card. */
function PartnerCard({ p, className }: { p: Partner; className?: string }) {
  if (p.href) {
    return (
      <AppLink
        href={p.href}
        aria-label={p.name}
        className={cn(CARD, 'transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-card-hover', className)}
      >
        <PartnerLogo p={p} />
      </AppLink>
    )
  }
  return (
    <div className={cn(CARD, className)}>
      <PartnerLogo p={p} />
    </div>
  )
}

/**
 * Education partners / verified recognitions.
 * - When the block supplies `props.partners` (and optionally a `props.lead` logo shown above them),
 *   each partner's logo sits on a light card that links out to the partner's site where a URL exists.
 *   The card stays white because logos can be dark or full-colour.
 * - Otherwise it falls back to a slow marquee of the accreditations list (logo if approved, else name).
 */
export function PartnerStripModule({ block, className }: ModuleComponentProps) {
  const partners = moduleProp<Partner[]>(block, 'partners', [])
  const lead = moduleProp<Partner | null>(block, 'lead', null)
  const marquee = moduleProp<boolean>(block, 'marquee', false)
  const { data } = useQuery(queries.accreditations())

  if (partners.length > 0 || lead) {
    return (
      <Section background={block.background} spacing="md" className={className} id={block.id}>
        <SectionHeader align="center" eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
        {lead && (
          <Reveal className="mb-10 flex justify-center">
            <div className="flex h-24 items-center rounded-2xl border border-line bg-white px-8 shadow-card ring-1 ring-black/5 sm:h-28 sm:px-10">
              <PartnerLogo p={lead} big />
            </div>
          </Reveal>
        )}
        {marquee ? (
          // Logos rotate in a continuous loop; it pauses on hover and stops for reduced-motion visitors.
          <Reveal>
            <Marquee duration={36} className="w-full">
              {partners.map((p) => (
                <PartnerCard key={p.name} p={p} className="mx-3 shrink-0" />
              ))}
            </Marquee>
          </Reveal>
        ) : (
          <Reveal className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {partners.map((p) => (
              <PartnerCard key={p.name} p={p} />
            ))}
          </Reveal>
        )}
      </Section>
    )
  }

  if (!data?.length) return null
  return (
    <Section background={block.background} spacing="sm" className={className} id={block.id}>
      <Reveal className="flex flex-col items-center gap-6">
        {block.eyebrow && <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle">{block.eyebrow}</p>}
        <Marquee duration={45} className="w-full">
          {data.map((item) => (
            <AppLink
              key={item.id}
              href="/partners"
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

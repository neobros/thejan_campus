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

/** An education partner shown with its logo, or just its name when no logo is on record yet. */
interface Partner {
  name: string
  logo?: string
  width?: number
  height?: number
  href?: string
}

const CARD =
  'flex h-20 items-center rounded-2xl border border-line bg-white px-6 shadow-card ring-1 ring-black/5 sm:h-24 sm:px-8'

function PartnerLogo({ p, size = 'md' }: { p: Partner; size?: 'sm' | 'md' | 'lg' }) {
  if (!p.logo) {
    return (
      <span className={cn('font-display font-semibold tracking-tight text-ink', size === 'lg' ? 'text-xl sm:text-2xl' : size === 'sm' ? 'text-sm sm:text-base' : 'text-base sm:text-lg')}>
        {p.name}
      </span>
    )
  }
  const imgSize =
    size === 'lg'
      ? 'h-12 max-w-[16rem] sm:h-14 sm:max-w-[20rem]'
      : size === 'sm'
        ? 'h-7 max-w-[6.5rem] sm:h-8 sm:max-w-[8rem]'
        : 'h-10 max-w-[9rem] sm:h-12 sm:max-w-[11rem]'
  return <img src={p.logo} alt={p.name} width={p.width} height={p.height} loading="lazy" decoding="async" className={cn('w-auto object-contain', imgSize)} />
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

/** A compact logo chip used inside grouped columns. */
function PartnerChip({ p }: { p: Partner }) {
  const chip = 'flex h-14 items-center justify-center rounded-xl border border-line bg-white px-3.5 ring-1 ring-black/5'
  if (p.href) {
    return (
      <AppLink href={p.href} aria-label={p.name} className={cn(chip, 'transition-transform duration-300 hover:-translate-y-0.5')}>
        <PartnerLogo p={p} size="sm" />
      </AppLink>
    )
  }
  return (
    <div className={chip}>
      <PartnerLogo p={p} size="sm" />
    </div>
  )
}

/** A labelled group of partners shown as one of several side-by-side columns. */
interface PartnerGroup {
  label: string
  pill?: 'navy' | 'red'
  partners: Partner[]
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
  // `pill`: show the group label as a filled badge (navy for awarding, red for delivery).
  const pill = moduleProp<'navy' | 'red' | null>(block, 'pill', null)
  // `groups`: several labelled partner columns shown side by side in one section.
  const groups = moduleProp<PartnerGroup[]>(block, 'groups', [])
  const { data } = useQuery(queries.accreditations())

  if (groups.length > 0) {
    return (
      <Section background={block.background} spacing="md" className={className} id={block.id}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Heading on the left. */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} className="mb-0 sm:mb-0" />
            </div>
          </div>
          {/* Labelled logo rows on the right. */}
          <div className="space-y-10 lg:col-span-8">
            {groups.map((g) => (
              <Reveal key={g.label}>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] shadow-sm',
                    g.pill === 'red' ? 'bg-accent text-on-accent' : 'bg-primary text-on-primary',
                  )}
                >
                  {g.label}
                </span>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {g.partners.map((p) => (
                    <PartnerChip key={p.name} p={p} />
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    )
  }

  if (partners.length > 0 || lead) {
    return (
      <Section background={block.background} spacing="md" className={className} id={block.id}>
        {pill ? (
          <>
            {(block.heading || block.intro) && <SectionHeader align="center" heading={block.heading} intro={block.intro} />}
            {block.eyebrow && (
              <Reveal className="mb-8 flex justify-center">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] shadow-sm',
                    pill === 'navy' ? 'bg-primary text-on-primary' : 'bg-accent text-on-accent',
                  )}
                >
                  {block.eyebrow}
                </span>
              </Reveal>
            )}
          </>
        ) : (
          <SectionHeader align="center" eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
        )}
        {lead && (
          <Reveal className="mb-10 flex justify-center">
            <div className="flex h-24 items-center rounded-2xl border border-line bg-white px-8 shadow-card ring-1 ring-black/5 sm:h-28 sm:px-10">
              <PartnerLogo p={lead} size="lg" />
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

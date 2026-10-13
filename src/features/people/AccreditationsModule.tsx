import { useQuery } from '@tanstack/react-query'
import { Award, BadgeCheck, ExternalLink, Handshake, Landmark, ShieldCheck, Users, type LucideIcon } from 'lucide-react'
import { queries } from '@/api/queries'
import type { Accreditation } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import type { ModuleComponentProps } from '@/components/blocks/types'
import { AppLink } from '@/components/ui/AppLink'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { Callout, EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { SmartImage } from '@/components/ui/SmartImage'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { daysUntil, formatDate } from '@/lib/format'

type Kind = Accreditation['kind']

const KINDS: { kind: Kind; label: string; heading: string; icon: LucideIcon; explain: string }[] = [
  {
    kind: 'registration',
    label: 'Registration',
    heading: 'Registrations',
    icon: Landmark,
    explain: 'Approval from an authorised body to operate as an education provider, where the jurisdiction requires it.',
  },
  {
    kind: 'accreditation',
    label: 'Accreditation',
    heading: 'Accreditations',
    icon: ShieldCheck,
    explain: 'Formal recognition of specific courses or qualifications by an authorised body. It applies only to the courses named.',
  },
  {
    kind: 'awarding-body',
    label: 'Awarding body',
    heading: 'Awarding bodies',
    icon: Award,
    explain: 'The organisation that issues your qualification when you successfully complete your course.',
  },
  {
    kind: 'partnership',
    label: 'Teaching partnership',
    heading: 'Teaching partnerships',
    icon: Handshake,
    explain:
      'Organisations that help deliver or support part of a course or activity. A teaching partnership is not an accreditation and does not change who awards your qualification.',
  },
  {
    kind: 'membership',
    label: 'Membership',
    heading: 'Memberships',
    icon: Users,
    explain: 'Professional or industry associations we belong to. Membership is not an endorsement or accreditation of our courses.',
  },
]

function validity(item: Accreditation) {
  if (item.validFrom && item.validTo) return `${formatDate(item.validFrom, 'medium')} – ${formatDate(item.validTo, 'medium')}`
  if (item.validFrom) return `From ${formatDate(item.validFrom, 'medium')}`
  if (item.validTo) return `Until ${formatDate(item.validTo, 'medium')}`
  return null
}

function AccreditationCard({ item, label, icon: KindIcon }: { item: Accreditation; label: string; icon: LucideIcon }) {
  const valid = validity(item)
  return (
    <article className="group flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-6 shadow-card transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-4">
        {item.logo?.src ? (
          <SmartImage image={item.logo} className="h-14 w-32 rounded-xl bg-transparent [&_img]:object-contain [&_img]:object-left" sizes="128px" />
        ) : (
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-on-primary-soft transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
            <KindIcon aria-hidden className="size-6" />
          </span>
        )}
        <Badge tone={item.kind === 'partnership' || item.kind === 'membership' ? 'neutral' : 'brand'}>{label}</Badge>
      </div>
      <h4 className="mt-5 font-display text-xl font-semibold leading-snug text-ink">{item.name}</h4>
      <p className="mt-2 leading-relaxed text-ink-muted">{item.description}</p>
      {(item.identifier || valid) && (
        <dl className="mt-5 grid gap-3 rounded-2xl bg-surface-muted p-4 text-sm">
          {item.identifier && (
            <div>
              <dt className="text-ink-subtle">Identifier</dt>
              <dd className="mt-0.5 font-mono text-[0.8125rem] font-medium text-ink [overflow-wrap:anywhere]">{item.identifier}</dd>
            </div>
          )}
          {valid && (
            <div>
              <dt className="text-ink-subtle">Valid</dt>
              <dd className="mt-0.5 font-medium text-ink">{valid}</dd>
            </div>
          )}
        </dl>
      )}
      {item.evidenceUrl && (
        <div className="mt-auto pt-5">
          <AppLink
            href={item.evidenceUrl}
            className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-primary-ink underline-offset-4 hover:underline"
          >
            View the official record<span className="sr-only"> for {item.name}</span>
            <ExternalLink aria-hidden className="size-3.5" />
          </AppLink>
        </div>
      )}
    </article>
  )
}

/** Verified registrations, accreditations, awarding bodies, partnerships and memberships (spec §5.4). */
export function AccreditationsModule({ block, className }: ModuleComponentProps) {
  const { data, isPending, isError, refetch } = useQuery(queries.accreditations())
  // Only current relationships are shown: anything whose validity has ended is hidden.
  const items = (data ?? []).filter((item) => !item.validTo || daysUntil(item.validTo) >= 0)
  const groups = KINDS.map((meta) => ({ ...meta, items: items.filter((i) => i.kind === meta.kind) })).filter((g) => g.items.length > 0)

  return (
    <ModuleSection block={block} className={className}>
      {isPending ? (
        <LoadingRegion className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-64 rounded-[1.75rem]" />
          ))}
        </LoadingRegion>
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : groups.length === 0 ? (
        <EmptyState
          icon={BadgeCheck}
          title="Verified details will appear here"
          description="Registration, accreditation and partnership details are published only once they have been verified."
          actions={
            <ButtonLink href="/contact" variant="secondary">
              Contact us
            </ButtonLink>
          }
        />
      ) : (
        <>
          <Reveal>
            <Callout tone="info" title="Only verified, current relationships are listed" className="mb-12">
              Each item shows its relationship type, any official identifier and the dates it applies. Where an official public record exists, we link to it so
              you can check the details yourself.
            </Callout>
          </Reveal>
          <div className="space-y-14">
            {groups.map((group) => {
              const GroupIcon = group.icon
              return (
                <section key={group.kind} className="grid gap-6 lg:grid-cols-12 lg:gap-10" aria-labelledby={`${block.id}-${group.kind}`}>
                  <Reveal className="lg:col-span-4">
                    <div className="lg:sticky lg:top-28">
                      <span className="grid size-11 place-items-center rounded-2xl bg-accent-soft text-on-accent-soft">
                        <GroupIcon aria-hidden className="size-5" />
                      </span>
                      <h3 id={`${block.id}-${group.kind}`} className="mt-4 font-display text-2xl font-semibold text-ink">
                        {group.heading}
                      </h3>
                      <p className="mt-2 leading-relaxed text-ink-muted">{group.explain}</p>
                    </div>
                  </Reveal>
                  <Stagger className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
                    {group.items.map((item) => (
                      <StaggerItem key={item.id} className="h-full">
                        <AccreditationCard item={item} label={group.label} icon={group.icon} />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </section>
              )
            })}
          </div>
        </>
      )}
    </ModuleSection>
  )
}

import { useQuery } from '@tanstack/react-query'
import { Clock, LifeBuoy, Receipt, Send, Users } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useDeferredValue, useState } from 'react'
import { queries } from '@/api/queries'
import type { SupportService } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import type { ModuleComponentProps } from '@/components/blocks/types'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/motion/Reveal'
import { pluralize } from '@/lib/format'
import { enquireHref } from '@/lib/links'
import { ContactValue } from './components/contact'
import { EmergencyNotice } from './components/EmergencyNotice'
import { Highlight, ResultCount, SearchField } from './components/filters'
import { listItemMotion } from './components/motion'
import { matchesQuery } from './components/search'

function ServiceCard({ service, query, index }: { service: SupportService; query: string; index: number }) {
  return (
    <motion.li {...listItemMotion(index)} className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-on-primary-soft">
          <Icon name={service.icon ?? 'life-buoy'} className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-snug text-ink">
            <Highlight text={service.issue} query={query} />
          </h3>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-accent-ink">
            <Users aria-hidden className="size-3.5" />
            {service.team}
          </p>
        </div>
      </div>
      <p className="mt-4 leading-relaxed text-ink-muted">{service.assistance}</p>
      <dl className="mt-5 grid gap-3 border-t border-line pt-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-ink">Contact</dt>
          <dd className="mt-0.5 text-ink-muted">
            <ContactValue value={service.contact} />
          </dd>
        </div>
        <div>
          <dt className="inline-flex items-center gap-1.5 font-semibold text-ink">
            <Clock aria-hidden className="size-3.5 text-ink-subtle" />
            Hours
          </dt>
          <dd className="mt-0.5 text-ink-muted">{service.hours}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="inline-flex items-center gap-1.5 font-semibold text-ink">
            <Send aria-hidden className="size-3.5 text-ink-subtle" />
            How to request help
          </dt>
          <dd className="mt-0.5 text-ink-muted">{service.requestMethod}</dd>
        </div>
        {service.charges && (
          <div className="sm:col-span-2 rounded-2xl bg-surface-muted px-4 py-3">
            <dt className="inline-flex items-center gap-1.5 font-semibold text-ink">
              <Receipt aria-hidden className="size-3.5 text-ink-subtle" />
              Charges and referral limits
            </dt>
            <dd className="mt-0.5 text-ink-muted">{service.charges}</dd>
          </div>
        )}
      </dl>
    </motion.li>
  )
}

function ServiceTable({ services, query, showCharges }: { services: SupportService[]; query: string; showCharges: boolean }) {
  return (
    <div className="hidden overflow-hidden rounded-3xl border border-line bg-surface shadow-card lg:block">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <caption className="sr-only">Student support directory: issue, team, assistance, contact, hours and how to request help</caption>
        <thead className="bg-surface-muted">
          <tr>
            {['Issue', 'Team', 'Available assistance', 'Contact', 'Hours', 'How to request', ...(showCharges ? ['Charges'] : [])].map((col, i) => (
              <th
                key={col}
                scope="col"
                className={
                  i === 0 ? 'w-[18%] px-5 py-4 font-semibold text-ink' : i === 2 ? 'w-[24%] px-4 py-4 font-semibold text-ink' : 'px-4 py-4 font-semibold text-ink'
                }
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <motion.tr
              key={service.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="border-t border-line align-top transition-colors hover:bg-surface-muted/50"
            >
              <th scope="row" className="px-5 py-4 font-semibold text-ink">
                <span className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-on-primary-soft">
                    <Icon name={service.icon ?? 'life-buoy'} className="size-4" />
                  </span>
                  <span className="pt-1.5 leading-snug">
                    <Highlight text={service.issue} query={query} />
                  </span>
                </span>
              </th>
              <td className="px-4 py-4 font-medium text-ink">{service.team}</td>
              <td className="px-4 py-4 leading-relaxed text-ink-muted">{service.assistance}</td>
              <td className="px-4 py-4 text-ink-muted">
                <ContactValue value={service.contact} />
              </td>
              <td className="px-4 py-4 text-ink-muted">{service.hours}</td>
              <td className="px-4 py-4 leading-relaxed text-ink-muted">{service.requestMethod}</td>
              {showCharges && <td className="px-4 py-4 leading-relaxed text-ink-muted">{service.charges ?? <span className="text-ink-subtle">None listed</span>}</td>}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Support table: issue → team → assistance → contact → hours → request method (spec §5.18), then emergency guidance. */
export function SupportDirectoryModule({ block, className }: ModuleComponentProps) {
  const { data, isPending, isError, refetch } = useQuery(queries.supportServices())
  const [term, setTerm] = useState('')
  const query = useDeferredValue(term)
  const services = data ?? []
  const visible = services.filter((s) => matchesQuery(query, s.issue, s.team, s.assistance, s.requestMethod))
  const showCharges = visible.some((s) => s.charges)

  return (
    <ModuleSection block={block} className={className}>
      {isPending ? (
        <LoadingRegion className="space-y-3">
          <Skeleton className="h-12 max-w-md rounded-xl" />
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-3xl" />
          ))}
        </LoadingRegion>
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : services.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="Support contacts are being updated"
          description="Our student support team can still help — send us a message and we will point you to the right person."
          actions={
            <ButtonLink href={enquireHref({ topic: 'support' })} variant="primary">
              Ask student support
            </ButtonLink>
          }
        />
      ) : (
        <Reveal>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <SearchField
              label="What do you need help with?"
              value={term}
              onChange={setTerm}
              placeholder="e.g. wellbeing, fees, timetable"
              className="w-full sm:max-w-md"
            />
            <ResultCount className="sm:pb-3">
              {query.trim() ? `${pluralize(visible.length, 'topic')} found` : `${pluralize(services.length, 'support topic')}`}
            </ResultCount>
          </div>
          {visible.length === 0 ? (
            <EmptyState
              icon={LifeBuoy}
              title="No support topics match your search"
              description="Try a different word, or ask student support and we will point you to the right team."
              actions={
                <>
                  <Button variant="secondary" onClick={() => setTerm('')}>
                    Clear search
                  </Button>
                  <ButtonLink href={enquireHref({ topic: 'support' })} variant="primary">
                    Ask student support
                  </ButtonLink>
                </>
              }
            />
          ) : (
            <>
              <ServiceTable services={visible} query={query} showCharges={showCharges} />
              <ul className="grid gap-4 md:grid-cols-2 lg:hidden">
                <AnimatePresence initial={false} mode="popLayout">
                  {visible.map((service, index) => (
                    <ServiceCard key={service.id} service={service} query={query} index={index} />
                  ))}
                </AnimatePresence>
              </ul>
            </>
          )}
        </Reveal>
      )}
      <Reveal className="mt-10">
        <EmergencyNotice />
      </Reveal>
    </ModuleSection>
  )
}

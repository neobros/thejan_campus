import { useQuery } from '@tanstack/react-query'
import { Globe, Handshake, Languages, Mail, MapPin, Phone, RotateCcw } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useDeferredValue, useId, useState } from 'react'
import { queries } from '@/api/queries'
import type { Agent } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import type { ModuleComponentProps } from '@/components/blocks/types'
import { AppLink } from '@/components/ui/AppLink'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Dropdown } from '@/components/ui/Dropdown'
import { Reveal } from '@/components/motion/Reveal'
import { pluralize } from '@/lib/format'
import { isDialable, isEmail, telHref } from '@/lib/links'
import { FilterPanel, Highlight, ResultCount, SearchField } from '@/features/support/components/filters'
import { listItemMotion } from '@/features/support/components/motion'
import { hostname, matchesQuery } from '@/features/support/components/search'

const contactLink = 'inline-flex min-h-8 items-center gap-2 font-medium text-primary-ink underline-offset-4 [overflow-wrap:anywhere] hover:underline'

function AgentCard({ agent, query, index }: { agent: Agent; query: string; index: number }) {
  const email = isEmail(agent.email) ? agent.email : null
  const phone = isDialable(agent.phone) ? agent.phone : null
  return (
    <motion.li {...listItemMotion(index)} className="h-full">
      <article className="flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-6 shadow-card transition-[box-shadow,border-color] duration-500 hover:border-primary/30 hover:shadow-card-hover">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-on-primary-soft">
            <Globe aria-hidden className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold leading-snug text-ink">
              <Highlight text={agent.name} query={query} />
            </h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-muted">
              <MapPin aria-hidden className="size-3.5 shrink-0 text-ink-subtle" />
              <span>
                {agent.city ? (
                  <>
                    <Highlight text={agent.city} query={query} />,{' '}
                  </>
                ) : null}
                {agent.country}
              </span>
            </p>
          </div>
        </div>
        {agent.languages.length > 0 && (
          <div className="mt-4 flex items-start gap-2 text-sm text-ink-muted">
            <Languages aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
            <p>
              <span className="sr-only">Languages: </span>
              {agent.languages.map((language, i) => (
                <span key={language}>
                  {i > 0 && ', '}
                  <Highlight text={language} query={query} />
                </span>
              ))}
            </p>
          </div>
        )}
        {(email || phone || agent.website) && (
          <ul className="mt-auto space-y-1 border-t border-line pt-4 text-sm" aria-label={`Contact ${agent.name}`}>
            {email && (
              <li>
                <a href={`mailto:${email}`} className={contactLink}>
                  <Mail aria-hidden className="size-4 shrink-0" />
                  {email}
                </a>
              </li>
            )}
            {phone && (
              <li>
                <a href={telHref(phone)} className={contactLink}>
                  <Phone aria-hidden className="size-4 shrink-0" />
                  {phone}
                </a>
              </li>
            )}
            {agent.website && (
              <li>
                <AppLink href={agent.website} className={contactLink}>
                  <Globe aria-hidden className="size-4 shrink-0" />
                  {hostname(agent.website)}
                </AppLink>
              </li>
            )}
          </ul>
        )}
      </article>
    </motion.li>
  )
}

/** Approved education agents by country with search (spec §5.15). Direct applications are always possible. */
export function AgentsDirectoryModule({ block, className }: ModuleComponentProps) {
  const { data, isPending, isError, refetch } = useQuery(queries.agents())
  const [country, setCountry] = useState('')
  const [term, setTerm] = useState('')
  const query = useDeferredValue(term)
  const selectId = useId()
  const agents = data ?? []

  const countries = [...new Set(agents.map((a) => a.country))].sort((a, b) => a.localeCompare(b))
  const activeCountry = countries.includes(country) ? country : ''
  const visible = agents.filter(
    (a) => (!activeCountry || a.country === activeCountry) && matchesQuery(query, a.name, a.city, a.country, ...a.languages),
  )
  const filtered = Boolean(activeCountry || query.trim())
  const clear = () => {
    setCountry('')
    setTerm('')
  }

  const directNote = (
    <Reveal className="mt-8 flex flex-col gap-4 rounded-3xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <p className="flex items-start gap-3 text-ink-muted">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-on-accent-soft">
          <Handshake aria-hidden className="size-5" />
        </span>
        <span>
          <span className="block font-semibold text-ink">You can always apply directly</span>
          <span className="text-sm">Using an agent is optional. Only our admissions team can make admissions decisions.</span>
        </span>
      </p>
      <ButtonLink href="/apply" variant="primary" size="sm" arrow className="shrink-0">
        Apply directly
      </ButtonLink>
    </Reveal>
  )

  return (
    <ModuleSection block={block} className={className}>
      {isPending ? (
        <LoadingRegion className="space-y-5">
          <Skeleton className="h-24 rounded-3xl" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-56 rounded-[1.75rem]" />
            ))}
          </div>
        </LoadingRegion>
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : agents.length === 0 ? (
        <EmptyState
            icon={Handshake}
            title="No approved agents are listed yet"
            description="Agents appear here only once they have a current agreement with us. You do not need an agent to apply."
            actions={
              <ButtonLink href="/apply" variant="primary" arrow>
                Apply directly
              </ButtonLink>
            }
          />
      ) : (
        <>
          <Reveal>
            <FilterPanel className="grid gap-4 md:grid-cols-[minmax(0,16rem)_1fr] md:items-end">
              <div className="flex flex-col gap-2">
                <label htmlFor={selectId} className="text-sm font-semibold text-ink">
                  Country
                </label>
                <Dropdown
                  id={selectId}
                  value={activeCountry}
                  onChange={setCountry}
                  anyLabel={`All countries (${agents.length})`}
                  options={countries.map((c) => ({ value: c, label: c, hint: String(agents.filter((a) => a.country === c).length) }))}
                />
              </div>
              <SearchField label="Search by name, city or language" value={term} onChange={setTerm} placeholder="e.g. Mumbai, Spanish" />
            </FilterPanel>
          </Reveal>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <ResultCount>{filtered ? `Showing ${visible.length} of ${pluralize(agents.length, 'agent')}` : `${pluralize(agents.length, 'approved agent')}`}</ResultCount>
            {filtered && (
              <Button variant="ghost" size="sm" onClick={clear} icon={<RotateCcw aria-hidden className="size-3.5" />}>
                Clear filters
              </Button>
            )}
          </div>
          {visible.length === 0 ? (
            <EmptyState
              icon={Globe}
              title="No agents match your search"
              description={
                <>
                  Try another country or keyword. If there is no agent near you, you can apply directly or{' '}
                  <AppLink href="/enquire?topic=international" className="font-semibold text-primary-ink underline-offset-4 hover:underline">
                    ask our international office
                  </AppLink>
                  .
                </>
              }
              actions={
                <Button variant="secondary" onClick={clear}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((agent, index) => (
                  <AgentCard key={agent.id} agent={agent} query={query} index={index} />
                ))}
              </AnimatePresence>
            </ul>
          )}
          {directNote}
        </>
      )}
    </ModuleSection>
  )
}

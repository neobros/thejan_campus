import { useQuery } from '@tanstack/react-query'
import { ChevronDown, Info, LoaderCircle, Receipt, Search } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useDeferredValue, useId, useState } from 'react'
import { useSearchParams } from 'react-router'
import { queries } from '@/api/queries'
import type { Audience, FeeListing, FeeSchedule } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import { moduleProp, type ModuleComponentProps } from '@/components/blocks/types'
import { AppLink } from '@/components/ui/AppLink'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Dropdown } from '@/components/ui/Dropdown'
import { SegmentedControl } from '@/components/ui/Tabs'
import { AUDIENCE_LABELS, AUDIENCE_LONG_LABELS, FEE_BASIS_LABELS, MODE_LABELS, NO_FEE_MESSAGE } from '@/components/shared/labels'
import { FeeAmount } from '@/components/shared/status'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import { formatDate, formatMoney, pluralize } from '@/lib/format'
import { enquireHref } from '@/lib/links'
import { EASE_OUT_EXPO } from '@/lib/motion'

interface CourseGroup {
  course: FeeListing['course']
  rows: FeeListing[]
}

function groupByCourse(rows: FeeListing[]): CourseGroup[] {
  const map = new Map<string, CourseGroup>()
  for (const row of rows) {
    const group = map.get(row.course.slug)
    if (group) group.rows.push(row)
    else map.set(row.course.slug, { course: row.course, rows: [row] })
  }
  return [...map.values()]
    .map((g) => ({ ...g, rows: [...g.rows].sort((a, b) => a.campus.name.localeCompare(b.campus.name) || a.deliveryMode.localeCompare(b.deliveryMode)) }))
    .sort((a, b) => a.course.title.localeCompare(b.course.title))
}

function validity(fee: FeeSchedule) {
  return `${formatDate(fee.validFrom, 'medium')} – ${fee.validTo ? formatDate(fee.validTo, 'medium') : 'until further notice'}`
}

function AdditionalCostsToggle({ fee, open, onToggle, controls }: { fee: FeeSchedule; open: boolean; onToggle: () => void; controls: string }) {
  if (!fee.additional.length) return <span className="text-sm text-ink-subtle">None listed</span>
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-soft"
    >
      {pluralize(fee.additional.length, 'additional cost')}
      <ChevronDown aria-hidden className={cn('size-4 transition-transform duration-300', open && 'rotate-180')} />
    </button>
  )
}

function AdditionalCostsList({ fee, id }: { fee: FeeSchedule; id: string }) {
  return (
    <motion.div
      id={id}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
      className="overflow-hidden"
    >
      <ul className="mt-1 divide-y divide-line rounded-2xl border border-line bg-surface">
        {fee.additional.map((item) => (
          <li key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 px-4 py-2.5 text-sm">
            <span className="text-ink">
              {item.label}
              {item.note && <span className="block text-xs text-ink-subtle">{item.note}</span>}
            </span>
            <span className="font-semibold tabular-nums text-ink">
              {formatMoney(item.amount, item.currency)}
              {item.basis && <span className="ml-1 font-normal text-ink-subtle">{FEE_BASIS_LABELS[item.basis]}</span>}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function MissingFee({ row }: { row: FeeListing }) {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-[0.9375rem] text-ink-muted">{NO_FEE_MESSAGE}</span>
      <AppLink
        href={enquireHref({ topic: 'fees', course: row.course.slug, campus: row.campus.slug, audience: row.audience })}
        className="text-sm font-semibold text-primary-ink underline-offset-4 hover:underline"
      >
        Ask admissions
      </AppLink>
    </span>
  )
}

function CourseLink({ group, audience }: { group: CourseGroup; audience: Audience }) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <AppLink href={`/courses/${group.course.slug}?audience=${audience}#fees`} className="font-semibold text-ink underline-offset-4 hover:text-primary-ink hover:underline">
        {group.course.title}
      </AppLink>
      <span className="text-sm font-normal text-ink-subtle">
        {group.course.level}
        {group.course.code && <span className="font-mono text-xs"> · {group.course.code}</span>}
      </span>
    </span>
  )
}

/** Approved fees by course, campus and delivery mode for one student audience (spec §5.9). */
export function FeeExplorerModule({ block, className }: ModuleComponentProps) {
  const fixedAudience = moduleProp<Audience | undefined>(block, 'audience', undefined)
  const fixedCourse = moduleProp<string | undefined>(block, 'course', undefined)
  const [searchParams] = useSearchParams()
  const urlAudience = searchParams.get('audience')
  const ids = useId()

  const { data: filters } = useQuery(queries.courseFilters())
  const audienceOptions = filters?.audiences.map((a) => a.value) ?? []
  const [chosen, setChosen] = useState<Audience | undefined>(urlAudience === 'domestic' || urlAudience === 'international' ? urlAudience : undefined)
  const audience: Audience | undefined = fixedAudience ?? (chosen && (!filters || audienceOptions.includes(chosen)) ? chosen : audienceOptions[0])

  const [campus, setCampus] = useState('')
  const [term, setTerm] = useState('')
  const deferredTerm = useDeferredValue(term)
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())

  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = useQuery({
    ...queries.fees({ audience, campus: campus || undefined, course: fixedCourse }),
    enabled: Boolean(audience),
  })

  const terms = deferredTerm.toLowerCase().split(/\s+/).filter(Boolean)
  const groups = groupByCourse(data ?? []).filter((g) => {
    if (!terms.length) return true
    const haystack = `${g.course.title} ${g.course.code ?? ''} ${g.course.level}`.toLowerCase()
    return terms.every((t) => haystack.includes(t))
  })
  const currencies = [...new Set((data ?? []).flatMap((r) => (r.fee ? [r.fee.tuition.currency] : [])))]
  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const hasFilters = Boolean(campus || term)
  const clear = () => {
    setCampus('')
    setTerm('')
  }

  return (
    <ModuleSection block={block} className={className}>
      <Reveal className="mb-6 grid gap-4 rounded-3xl border border-line bg-surface p-4 shadow-card sm:p-5 lg:grid-cols-[auto_minmax(0,14rem)_minmax(0,1fr)] lg:items-end">
        {!fixedAudience && audienceOptions.length > 1 && audience && (
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">Student type</p>
            <SegmentedControl<Audience>
              label="Student type"
              value={audience}
              onChange={setChosen}
              options={audienceOptions.map((a) => ({ value: a, label: AUDIENCE_LABELS[a] }))}
            />
          </div>
        )}
        <Dropdown label="Campus" value={campus} onChange={setCampus} anyLabel="All campuses" options={filters?.campuses ?? []} />
        {!fixedCourse && (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">Find a course</span>
            <span className="relative block">
              <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" />
              <input
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Course name, code or level"
                className="h-12 w-full rounded-xl border border-line-strong bg-surface pl-11 pr-4 text-[0.9375rem] text-ink placeholder:text-ink-subtle/80 hover:border-ink/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
              />
            </span>
          </label>
        )}
      </Reveal>

      {!audience || isPending ? (
        <LoadingRegion label="Loading fees" className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-20 rounded-3xl" />
          ))}
        </LoadingRegion>
      ) : isError ? (
        <ErrorPanel title="Fees could not be loaded" onRetry={() => refetch()} />
      ) : groups.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No fees match your filters"
          description="Try another campus or course name. If you cannot find your course, our admissions team can confirm current fees."
          actions={
            <>
              {hasFilters && <Button onClick={clear}>Clear filters</Button>}
              <ButtonLink href={enquireHref({ topic: 'fees', audience })} variant="secondary">
                Ask about fees
              </ButtonLink>
            </>
          }
        />
      ) : (
        <div className={cn('transition-opacity duration-300', isFetching && isPlaceholderData && 'opacity-60')} aria-busy={isFetching || undefined}>
          <p className="mb-4 flex items-center gap-2 text-sm text-ink-subtle" aria-live="polite">
            {isFetching && isPlaceholderData && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
            {pluralize(groups.length, 'course')} · fees for {AUDIENCE_LONG_LABELS[audience].toLowerCase()}
          </p>

          {/* md and up: a real table, one row group per course. */}
          <div className="hidden overflow-hidden rounded-3xl border border-line bg-surface shadow-card md:block">
            <table className="w-full border-collapse text-left text-[0.9375rem]">
              <caption className="sr-only">
                Current approved fees for {AUDIENCE_LONG_LABELS[audience].toLowerCase()} by course, campus and delivery mode
              </caption>
              <thead className="bg-surface-muted text-sm">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-ink">Campus</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-ink">Delivery</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-ink">Tuition</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-ink">Valid</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-ink">Additional costs</th>
                </tr>
              </thead>
              {groups.map((group) => (
                <tbody key={group.course.slug} className="border-t border-line">
                  <tr className="bg-canvas-alt/60">
                    <th scope="colgroup" colSpan={5} className="px-5 pb-2 pt-4 font-normal">
                      <CourseLink group={group} audience={audience} />
                    </th>
                  </tr>
                  {group.rows.map((row) => {
                    const panelId = `${ids}-${row.offeringId}`
                    const open = expanded.has(row.offeringId)
                    return (
                      <FeeTableRows key={row.offeringId} row={row} open={open} panelId={panelId} onToggle={() => toggle(row.offeringId)} />
                    )
                  })}
                </tbody>
              ))}
            </table>
          </div>

          {/* Below md: one card per course. */}
          <ul className="space-y-4 md:hidden">
            {groups.map((group) => (
              <li key={group.course.slug} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
                <div className="border-b border-line bg-canvas-alt/60 px-5 py-4">
                  <h3>
                    <CourseLink group={group} audience={audience} />
                  </h3>
                </div>
                <ul className="divide-y divide-line">
                  {group.rows.map((row) => {
                    const panelId = `${ids}-m-${row.offeringId}`
                    const open = expanded.has(row.offeringId)
                    return (
                      <li key={row.offeringId} className="space-y-2 px-5 py-4">
                        <p className="text-sm font-medium text-ink">
                          {row.campus.name} <span className="text-ink-subtle">· {MODE_LABELS[row.deliveryMode]}</span>
                        </p>
                        {row.fee ? (
                          <>
                            <FeeAmount fee={row.fee.tuition} />
                            <p className="text-xs text-ink-subtle">Valid {validity(row.fee)}</p>
                            <AdditionalCostsToggle fee={row.fee} open={open} onToggle={() => toggle(row.offeringId)} controls={panelId} />
                            <AnimatePresence initial={false}>{open && <AdditionalCostsList fee={row.fee} id={panelId} />}</AnimatePresence>
                          </>
                        ) : (
                          <MissingFee row={row} />
                        )}
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 flex gap-2.5 text-sm leading-relaxed text-ink-subtle">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
        <span>
          {currencies.length === 1 ? `All amounts are in ${currencies[0]}` : 'Amounts are shown in the currency listed with each fee'} and apply to the dates shown. Tuition is not
          payable when you apply — if your application is successful, your written offer or enrolment documents include the amount due, due dates and how to pay.
        </span>
      </p>
    </ModuleSection>
  )
}

function FeeTableRows({ row, open, panelId, onToggle }: { row: FeeListing; open: boolean; panelId: string; onToggle: () => void }) {
  return (
    <>
      <tr className="border-t border-line/70 transition-colors hover:bg-surface-muted/40">
        <td className="px-5 py-4 align-top text-ink">{row.campus.name}</td>
        <td className="px-5 py-4 align-top text-ink-muted">{MODE_LABELS[row.deliveryMode]}</td>
        {row.fee ? (
          <>
            <td className="px-5 py-4 align-top">
              <FeeAmount fee={row.fee.tuition} size="sm" />
            </td>
            <td className="px-5 py-4 align-top text-sm text-ink-muted">{validity(row.fee)}</td>
            <td className="px-5 py-3 align-top">
              <AdditionalCostsToggle fee={row.fee} open={open} onToggle={onToggle} controls={panelId} />
            </td>
          </>
        ) : (
          <td colSpan={3} className="px-5 py-4 align-top">
            <MissingFee row={row} />
          </td>
        )}
      </tr>
      <AnimatePresence initial={false}>
        {open && row.fee && (
          <motion.tr key="costs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <td colSpan={5} className="px-5 pb-4 pt-0">
              <AdditionalCostsList fee={row.fee} id={panelId} />
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  )
}

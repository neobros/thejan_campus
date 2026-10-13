import { useQuery } from '@tanstack/react-query'
import { LoaderCircle, Search, SlidersHorizontal, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Dialog } from 'radix-ui'
import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type FormEvent, type ReactNode, type Ref } from 'react'
import { queries } from '@/api/queries'
import type { CourseFilterOptions } from '@/api/types'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { Field } from '@/components/ui/form'
import { cn } from '@/lib/cn'
import { pluralize } from '@/lib/format'
import { springSnappy } from '@/lib/motion'
import {
  EMPTY_FILTERS,
  FILTER_KEYS,
  FILTER_LABELS,
  filterValueLabel,
  toCourseQuery,
  type CatalogueState,
  type FilterKey,
  type FilterValues,
} from './catalogue'
import { useMediaQuery } from './hooks'

type FilterChange = (key: keyof FilterValues, value: string) => void

/* ------------------------------------------------------------------------------------------------
 * Filter controls (shared by the desktop sidebar and the mobile drawer)
 * ---------------------------------------------------------------------------------------------- */

function ChipRadioGroup({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  const name = useId()
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {[{ value: '', label: 'Any' }, ...options].map((option) => (
          <label
            key={option.value || 'any'}
            className={cn(
              'relative inline-flex h-9 cursor-pointer select-none items-center rounded-full border px-3.5 text-sm font-medium transition-colors duration-200',
              'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus',
              value === option.value
                ? 'border-primary bg-primary text-on-primary shadow-sm'
                : 'border-line bg-surface text-ink-muted hover:border-primary/40 hover:text-ink',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function FilterSelect({
  label,
  value,
  anyLabel,
  options,
  onChange,
}: {
  label: string
  value: string
  anyLabel: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  // Keep an unknown URL value selectable (e.g. an intake month that has since closed).
  const list = value && !options.some((o) => o.value === value) ? [...options, { value, label: value }] : options
  return (
    <Field label={label}>
      {(control) => <Dropdown {...control} value={value} onChange={onChange} anyLabel={anyLabel} options={list} size="sm" />}
    </Field>
  )
}

export function FilterFields({ options, values, onChange }: { options?: CourseFilterOptions; values: FilterValues; onChange: FilterChange }) {
  return (
    <div className="space-y-6">
      {options && options.audiences.length > 1 && (
        <ChipRadioGroup
          legend="Student type"
          value={values.audience}
          options={options.audiences.map((a) => ({ value: a.value, label: a.label.replace(/ students$/i, '') }))}
          onChange={(value) => onChange('audience', value)}
        />
      )}
      <FilterSelect label="Study area" anyLabel="Any study area" value={values.category} options={options?.categories ?? []} onChange={(v) => onChange('category', v)} />
      <FilterSelect label="Qualification level" anyLabel="Any level" value={values.level} options={options?.levels ?? []} onChange={(v) => onChange('level', v)} />
      <FilterSelect label="Campus" anyLabel="Any campus" value={values.campus} options={options?.campuses ?? []} onChange={(v) => onChange('campus', v)} />
      <ChipRadioGroup legend="Delivery mode" value={values.mode} options={options?.modes ?? []} onChange={(value) => onChange('mode', value)} />
      <FilterSelect
        label="Intake (open for applications)"
        anyLabel="Any start month"
        value={values.intake}
        options={options?.intakeMonths ?? []}
        onChange={(v) => onChange('intake', v)}
      />
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Search box: typing is local; the URL is updated after a pause (or on Enter).
 * ---------------------------------------------------------------------------------------------- */

export function SearchBox({
  value,
  onCommit,
  busy,
  inputRef,
}: {
  value: string
  onCommit: (q: string) => void
  busy?: boolean
  inputRef?: Ref<HTMLInputElement>
}) {
  const id = useId()
  const [term, setTerm] = useState(value)
  const [synced, setSynced] = useState(value)
  const [committed, setCommitted] = useState(value)

  // URL changed from elsewhere (back/forward, chip removed, clear all) → reflect it in the box,
  // but never clobber what the visitor is still typing after one of our own debounced commits.
  if (value !== synced) {
    setSynced(value)
    if (value !== committed) {
      setTerm(value)
      setCommitted(value)
    }
  }

  const commit = (next: string) => {
    const trimmed = next.trim()
    setCommitted(trimmed)
    if (trimmed !== value) onCommit(trimmed)
  }

  // Debounce: commit 300 ms after the last keystroke.
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const onType = (next: string) => {
    setTerm(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => commit(next), 300)
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    clearTimeout(timer.current)
    commit(term)
  }

  return (
    <form onSubmit={onSubmit} className="relative" aria-label="Search courses">
      <label htmlFor={id} className="sr-only">
        Search courses
      </label>
      <span aria-hidden className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-subtle">
        {busy ? <LoaderCircle className="size-5 animate-spin text-primary-ink" /> : <Search className="size-5" />}
      </span>
      <input
        ref={inputRef}
        id={id}
        type="search"
        value={term}
        onChange={(event) => onType(event.target.value)}
        placeholder="Search by course name, code or topic"
        autoComplete="off"
        enterKeyHint="search"
        className="h-14 w-full rounded-full border border-line-strong/60 bg-surface pl-13 pr-14 text-base text-ink shadow-card transition-[border-color,box-shadow] placeholder:text-ink-subtle hover:border-ink/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 [&::-webkit-search-cancel-button]:hidden"
      />
      <AnimatePresence>
        {term && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => {
              clearTimeout(timer.current)
              setTerm('')
              commit('')
            }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-subtle transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <X aria-hidden className="size-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </form>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Active filter chips
 * ---------------------------------------------------------------------------------------------- */

export function ActiveFilterChips({
  state,
  options,
  onRemove,
  onClearAll,
}: {
  state: CatalogueState
  options?: CourseFilterOptions
  onRemove: (key: FilterKey) => void
  onClearAll: () => void
}) {
  const active = FILTER_KEYS.filter((key) => state[key])
  return (
    <AnimatePresence initial={false}>
      {active.length > 0 && (
        <motion.div
          key="chips"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="mr-1 text-sm text-ink-subtle">Active filters:</span>
            <ul className="contents">
              <AnimatePresence initial={false} mode="popLayout">
                {active.map((key) => {
                  const label = filterValueLabel(key, state[key], options)
                  return (
                    <motion.li
                      key={key}
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={springSnappy}
                    >
                      <button
                        type="button"
                        onClick={() => onRemove(key)}
                        aria-label={`Remove filter ${FILTER_LABELS[key]}: ${label}`}
                        className="group inline-flex h-9 items-center gap-1.5 rounded-full border border-primary/25 bg-primary-soft pl-3.5 pr-2 text-sm font-medium text-on-primary-soft transition-colors hover:border-primary/50"
                      >
                        <span className="text-on-primary-soft/70">{FILTER_LABELS[key]}:</span>
                        <span className="max-w-[14rem] truncate">{label}</span>
                        <span className="grid size-5 place-items-center rounded-full transition-colors group-hover:bg-primary group-hover:text-on-primary">
                          <X aria-hidden className="size-3.5" />
                        </span>
                      </button>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ul>
            <motion.button
              layout
              type="button"
              onClick={onClearAll}
              className="ml-1 h-9 rounded-full px-3 text-sm font-semibold text-primary-ink underline-offset-4 hover:underline"
            >
              Clear all
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Mobile drawer — edits a draft and applies it in one go.
 * ---------------------------------------------------------------------------------------------- */

export function FilterDrawer({
  state,
  options,
  onApply,
  trigger,
}: {
  state: CatalogueState
  options?: CourseFilterOptions
  onApply: (values: FilterValues) => void
  trigger: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<FilterValues>(EMPTY_FILTERS)
  const wide = useMediaQuery('(min-width: 40rem)')

  const onOpenChange = (next: boolean) => {
    if (next) setDraft({ category: state.category, level: state.level, campus: state.campus, mode: state.mode, audience: state.audience, intake: state.intake })
    setOpen(next)
  }

  // Live count for the draft so "Show N courses" is honest before applying.
  const { data: preview, isFetching } = useQuery({
    ...queries.courses({ ...toCourseQuery({ ...state, ...draft, page: 1 }), pageSize: 1 }),
    enabled: open,
  })
  const count = preview?.total
  const draftCount = Object.values(draft).filter(Boolean).length

  const panel = wide
    ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }
    : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div className="fixed inset-0 z-[70] bg-night/55 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                {...panel}
                transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                className={cn(
                  'fixed z-[71] flex flex-col bg-canvas shadow-float outline-none',
                  wide ? 'inset-y-0 right-0 w-full max-w-md rounded-l-[2rem]' : 'inset-x-0 bottom-0 max-h-[88svh] rounded-t-[2rem]',
                )}
              >
                {!wide && <span aria-hidden className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-line-strong/40" />}
                <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
                  <Dialog.Title className="font-display text-2xl font-semibold text-ink">Filter courses</Dialog.Title>
                  <Dialog.Close className="grid size-10 place-items-center rounded-full text-ink hover:bg-surface-muted" aria-label="Close filters">
                    <X aria-hidden className="size-5" />
                  </Dialog.Close>
                </div>
                <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
                  <FilterFields options={options} values={draft} onChange={(key, value) => setDraft((d) => ({ ...d, [key]: value }))} />
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-line bg-canvas-alt px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <Button variant="secondary" onClick={() => setDraft(EMPTY_FILTERS)} disabled={draftCount === 0}>
                    Clear
                  </Button>
                  <Button
                    variant="primary"
                    loading={isFetching && count === undefined}
                    onClick={() => {
                      onApply(draft)
                      setOpen(false)
                    }}
                  >
                    <span aria-live="polite">{count === undefined ? 'Apply filters' : count === 0 ? 'No matches — apply anyway' : `Show ${pluralize(count, 'course')}`}</span>
                  </Button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

/** "Filters" trigger with the active count badge. */
export function FiltersButton({ count, className, ...rest }: { count: number; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-full border border-line-strong/80 bg-surface px-4 text-[0.9375rem] font-semibold text-ink transition-colors hover:border-ink/50 hover:bg-surface-muted',
        className,
      )}
    >
      <SlidersHorizontal aria-hidden className="size-4" />
      Filters
      {count > 0 && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs font-semibold tabular-nums text-on-primary">
          {count}
          <span className="sr-only"> active</span>
        </span>
      )}
    </button>
  )
}


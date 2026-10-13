import { Search, X } from 'lucide-react'
import { LayoutGroup, motion } from 'motion/react'
import { Fragment, useId, useRef, type ReactNode } from 'react'
import { Input } from '@/components/ui/form'
import { cn } from '@/lib/cn'
import { springSnappy } from '@/lib/motion'
import { normalizeText } from './search'

/** Labelled search box with a clear button (touch target ≥ 40px). */
export function SearchField({
  label,
  value,
  onChange,
  placeholder,
  className,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  hint?: ReactNode
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" />
        <Input
          ref={input}
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="pl-11 pr-12 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('')
              input.current?.focus()
            }}
            aria-label="Clear search"
            className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-ink-subtle transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <X aria-hidden className="size-4" />
          </button>
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-ink-subtle">
          {hint}
        </p>
      )}
    </div>
  )
}

export interface ChipOption<T extends string> {
  value: T
  label: ReactNode
  count?: number
}

/** Wrapping filter chips (toggle buttons, exactly one pressed) with a sliding active pill. */
export function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string
  options: ChipOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  const id = useId()
  return (
    <LayoutGroup id={id}>
      <fieldset className={cn('flex min-w-0 flex-wrap gap-2', className)}>
        <legend className="sr-only">{label}</legend>
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cn(
                'relative isolate inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200',
                active ? 'border-primary text-on-primary' : 'border-line bg-surface text-ink-muted hover:border-primary/40 hover:text-ink',
              )}
            >
              {active && <motion.span layoutId="chip-pill" transition={springSnappy} className="absolute inset-0 -z-10 rounded-full bg-primary shadow-sm" />}
              {option.label}
              {option.count !== undefined && (
                <span className={cn('rounded-full px-1.5 text-xs tabular-nums', active ? 'bg-white/20' : 'bg-surface-muted text-ink-subtle')}>
                  <span className="sr-only">(</span>
                  {option.count}
                  <span className="sr-only">)</span>
                </span>
              )}
            </button>
          )
        })}
      </fieldset>
    </LayoutGroup>
  )
}

/** Polite live region for result counts. */
export function ResultCount({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p aria-live="polite" aria-atomic="true" className={cn('text-sm text-ink-subtle', className)}>
      {children}
    </p>
  )
}

/** Highlights each query word inside `text`. */
export function Highlight({ text, query }: { text: string; query: string }) {
  const terms = normalizeText(query).split(/\s+/).filter((t) => t.length > 1)
  if (!terms.length) return <>{text}</>
  // Normalising keeps string length for Latin text without combining marks; fall back if it would not.
  const plain = normalizeText(text)
  if (plain.length !== text.length) return <>{text}</>
  const marks: [number, number][] = []
  for (const term of terms) {
    let from = 0
    for (let at = plain.indexOf(term, from); at !== -1; at = plain.indexOf(term, from)) {
      marks.push([at, at + term.length])
      from = at + term.length
    }
  }
  if (!marks.length) return <>{text}</>
  marks.sort((a, b) => a[0] - b[0])
  const merged: [number, number][] = []
  for (const mark of marks) {
    const last = merged[merged.length - 1]
    if (last && mark[0] <= last[1]) last[1] = Math.max(last[1], mark[1])
    else merged.push([...mark])
  }
  const parts: ReactNode[] = []
  let cursor = 0
  merged.forEach(([start, end], i) => {
    if (start > cursor) parts.push(<Fragment key={`t${i}`}>{text.slice(cursor, start)}</Fragment>)
    parts.push(
      <mark key={`m${i}`} className="rounded-sm bg-accent-soft px-0.5 text-on-accent-soft">
        {text.slice(start, end)}
      </mark>,
    )
    cursor = end
  })
  if (cursor < text.length) parts.push(<Fragment key="end">{text.slice(cursor)}</Fragment>)
  return <>{parts}</>
}

/** Panel that holds a module's filter controls. */
export function FilterPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-6 rounded-3xl border border-line bg-surface p-4 shadow-card sm:p-5', className)}>{children}</div>
}

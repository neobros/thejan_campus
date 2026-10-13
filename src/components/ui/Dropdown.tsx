import { Check, ChevronDown } from 'lucide-react'
import { Select } from 'radix-ui'
import { useId, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface DropdownOption {
  value: string
  label: string
  /** Secondary text shown to the right of the label (e.g. a count). */
  hint?: string
  icon?: ReactNode
}

/** Radix Select forbids empty item values, so the "any" option uses a sentinel internally. */
const ANY = '__any__'

export interface DropdownProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  /** Label for the "no filter" option (value ""). Omit to make a choice required. */
  anyLabel?: string
  /** Shown while nothing is selected and there is no `anyLabel`. */
  placeholder?: string
  /** Renders a visible label above the control. */
  label?: ReactNode
  /** "field" matches form inputs; "bare" is the inline style used in the hero course finder. */
  variant?: 'field' | 'bare'
  size?: 'sm' | 'md'
  /** Highlights the control when a non-default value is selected (default true for "field"). */
  highlightActive?: boolean
}

/**
 * Animated, keyboard-accessible dropdown (typeahead, arrow keys, Home/End) used for filters and
 * finders. Forms that need native validation keep using the plain <Select> from ./form.
 */
export function Dropdown({
  value,
  onChange,
  options,
  anyLabel,
  placeholder = 'Select…',
  label,
  variant = 'field',
  size = 'md',
  highlightActive,
  className,
  id: idProp,
  disabled,
  ...rest
}: DropdownProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const known = options.some((o) => o.value === value)
  // Keep an unknown value (e.g. from a shared URL) selectable rather than silently dropping it.
  const list = value && !known ? [...options, { value, label: value }] : options
  const active = Boolean(value)
  const highlight = highlightActive ?? variant === 'field'

  return (
    <div className={cn('min-w-0', variant === 'field' && 'flex flex-col gap-2')}>
      {label && (
        <label htmlFor={id} className={cn('block text-sm font-semibold text-ink', variant === 'bare' && 'text-xs text-ink-subtle')}>
          {label}
        </label>
      )}
      <Select.Root value={value || (anyLabel !== undefined ? ANY : '')} onValueChange={(next) => onChange(next === ANY ? '' : next)} disabled={disabled}>
        <Select.Trigger
          id={id}
          className={cn(
            'group/dd flex w-full items-center justify-between gap-2 text-left text-ink transition-[border-color,box-shadow,background-color] duration-200 outline-none',
            'data-[placeholder]:text-ink-subtle disabled:cursor-not-allowed disabled:opacity-60',
            variant === 'field' &&
              cn(
                'rounded-xl border border-line-strong bg-surface px-4 shadow-[inset_0_1px_2px_rgb(0_0_0/0.04)] hover:border-ink/40',
                'focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15 data-[state=open]:border-primary data-[state=open]:ring-4 data-[state=open]:ring-primary/15',
                size === 'sm' ? 'h-10 text-sm' : 'h-12 text-[0.9375rem]',
                highlight && active && 'border-primary/70 bg-primary-soft/40',
              ),
            variant === 'bare' && 'mt-0.5 rounded-lg text-[0.9375rem] font-medium focus-visible:ring-2 focus-visible:ring-primary/40',
            className,
          )}
          {...rest}
        >
          <span className="min-w-0 flex-1 truncate">
            <Select.Value placeholder={placeholder} />
          </span>
          <Select.Icon asChild>
            <ChevronDown
              aria-hidden
              className={cn(
                'size-4 shrink-0 text-ink-subtle transition-transform duration-300 group-data-[state=open]/dd:rotate-180',
                variant === 'bare' && 'group-hover/dd:text-ink',
              )}
            />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={8}
            collisionPadding={12}
            className={cn(
              'dd-content z-[90] max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-line bg-surface/95 p-1.5 shadow-float backdrop-blur-xl',
              'data-[state=open]:animate-dd-in data-[state=closed]:animate-dd-out',
            )}
          >
            <Select.ScrollUpButton className="flex h-6 items-center justify-center text-ink-subtle">
              <ChevronDown aria-hidden className="size-4 rotate-180" />
            </Select.ScrollUpButton>
            <Select.Viewport className="max-h-80">
              {anyLabel !== undefined && <Item value={ANY} label={anyLabel} index={0} muted />}
              {list.map((option, i) => (
                <Item key={option.value} value={option.value} label={option.label} hint={option.hint} icon={option.icon} index={i + (anyLabel !== undefined ? 1 : 0)} />
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex h-6 items-center justify-center text-ink-subtle">
              <ChevronDown aria-hidden className="size-4" />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}

function Item({ value, label, hint, icon, index, muted }: { value: string; label: string; hint?: string; icon?: ReactNode; index: number; muted?: boolean }) {
  return (
    <Select.Item
      value={value}
      style={{ animationDelay: `${Math.min(index, 14) * 18}ms` }}
      className={cn(
        'dd-item relative flex cursor-pointer select-none items-center gap-2.5 rounded-xl py-2.5 pl-3 pr-9 text-[0.9375rem] outline-none transition-colors',
        'data-[highlighted]:bg-primary-soft data-[highlighted]:text-on-primary-soft data-[state=checked]:font-semibold data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        muted ? 'text-ink-muted' : 'text-ink',
      )}
    >
      {icon && <span className="grid size-6 shrink-0 place-items-center text-primary-ink">{icon}</span>}
      <Select.ItemText>{label}</Select.ItemText>
      {hint && <span className="ml-auto text-xs tabular-nums text-ink-subtle">{hint}</span>}
      <Select.ItemIndicator className="absolute right-3 grid size-5 place-items-center rounded-full bg-primary text-on-primary">
        <Check aria-hidden strokeWidth={3} className="size-3" />
      </Select.ItemIndicator>
    </Select.Item>
  )
}

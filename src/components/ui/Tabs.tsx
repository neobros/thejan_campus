import { LayoutGroup, motion } from 'motion/react'
import { Tabs as Primitive } from 'radix-ui'
import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { springSnappy } from '@/lib/motion'

export interface TabOption<T extends string = string> {
  value: T
  label: ReactNode
  count?: number
}

export const Tabs = Primitive.Root
export const TabsContent = ({ className, ...props }: ComponentProps<typeof Primitive.Content>) => (
  <Primitive.Content className={cn('focus-visible:outline-none', className)} {...props} />
)

/** Pill tab list with a sliding indicator. Use inside <Tabs value onValueChange>. */
export function TabsList<T extends string>({
  options,
  value,
  label,
  className,
  size = 'md',
}: {
  options: TabOption<T>[]
  value: T
  label: string
  className?: string
  size?: 'sm' | 'md'
}) {
  const id = useId()
  return (
    <LayoutGroup id={id}>
      <Primitive.List
        aria-label={label}
        className={cn('inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 scrollbar-none', className)}
      >
        {options.map((option) => {
          const active = option.value === value
          return (
            <Primitive.Trigger
              key={option.value}
              value={option.value}
              className={cn(
                'relative isolate inline-flex shrink-0 items-center gap-2 rounded-full font-medium transition-colors',
                size === 'sm' ? 'h-8 px-3.5 text-sm' : 'h-10 px-5 text-[0.9375rem]',
                active ? 'text-on-primary' : 'text-ink-muted hover:text-ink',
              )}
            >
              {active && <motion.span layoutId="tab-pill" transition={springSnappy} className="absolute inset-0 -z-10 rounded-full bg-primary shadow-sm" />}
              {option.label}
              {option.count !== undefined && (
                <span className={cn('rounded-full px-1.5 text-xs tabular-nums', active ? 'bg-white/20' : 'bg-surface-muted')}>{option.count}</span>
              )}
            </Primitive.Trigger>
          )
        })}
      </Primitive.List>
    </LayoutGroup>
  )
}

/**
 * Same look as TabsList but as a radio group — for filters that do not switch panels
 * (e.g. Domestic / International fee view).
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
  size = 'md',
}: {
  options: TabOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  className?: string
  size?: 'sm' | 'md'
}) {
  const id = useId()
  return (
    <LayoutGroup id={id}>
      <div role="radiogroup" aria-label={label} className={cn('inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 scrollbar-none', className)}>
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={cn(
                'relative isolate inline-flex shrink-0 items-center gap-2 rounded-full font-medium transition-colors',
                size === 'sm' ? 'h-8 px-3.5 text-sm' : 'h-10 px-5 text-[0.9375rem]',
                active ? 'text-on-primary' : 'text-ink-muted hover:text-ink',
              )}
            >
              {active && <motion.span layoutId="segment-pill" transition={springSnappy} className="absolute inset-0 -z-10 rounded-full bg-primary shadow-sm" />}
              {option.label}
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}

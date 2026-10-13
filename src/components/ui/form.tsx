import { Check, ChevronDown, CircleAlert } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, type InputHTMLAttributes, type ReactNode, type Ref, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface ControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  'aria-required'?: boolean
}

/**
 * Label + control + hint + error, with ids wired for screen readers. The control is supplied as a
 * render prop so it works with react-hook-form's `register()`.
 */
export function Field({
  label,
  hint,
  error,
  required,
  optional,
  className,
  children,
}: {
  label: ReactNode
  hint?: ReactNode
  error?: string
  required?: boolean
  /** Show an "Optional" tag (preferred over asterisks for clarity). */
  optional?: boolean
  className?: string
  children: (control: ControlProps) => ReactNode
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-semibold text-ink">
        <span>
          {label}
          {required && (
            <span aria-hidden className="ml-0.5 text-danger">
              *
            </span>
          )}
        </span>
        {optional && <span className="text-xs font-normal text-ink-subtle">Optional</span>}
      </label>
      {children({
        id,
        'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? true : undefined,
        'aria-required': required || undefined,
      })}
      {hint && (
        <p id={hintId} className="text-sm text-ink-subtle">
          {hint}
        </p>
      )}
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-start gap-1.5 text-sm font-medium text-danger"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

const controlBase =
  'w-full rounded-xl border border-line-strong bg-surface text-[0.9375rem] text-ink shadow-[inset_0_1px_2px_rgb(0_0_0/0.04)] transition-[border-color,box-shadow] placeholder:text-ink-subtle/80 hover:border-ink/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/15'

export function Input({ className, ref, ...props }: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} className={cn(controlBase, 'h-12 px-4', className)} {...props} />
}

export function Textarea({ className, ref, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> }) {
  return <textarea ref={ref} className={cn(controlBase, 'min-h-32 resize-y px-4 py-3 leading-relaxed', className)} {...props} />
}

export function Select({
  className,
  children,
  ref,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { ref?: Ref<HTMLSelectElement> }) {
  return (
    <div className="relative">
      <select ref={ref} className={cn(controlBase, 'h-12 appearance-none pl-4 pr-11', className)} {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" />
    </div>
  )
}

/** Native checkbox with a custom box; label content is clickable. */
export function Checkbox({
  label,
  description,
  className,
  ref,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: ReactNode; description?: ReactNode; ref?: Ref<HTMLInputElement> }) {
  return (
    <label className={cn('group/cb flex cursor-pointer items-start gap-3', props.disabled && 'cursor-not-allowed opacity-60', className)}>
      <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
        <input
          ref={ref}
          type="checkbox"
          className="peer size-5 cursor-pointer appearance-none rounded-md border border-line-strong bg-surface transition-colors checked:border-primary checked:bg-primary hover:border-ink/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-[invalid=true]:border-danger"
          {...props}
        />
        <Check aria-hidden strokeWidth={3} className="pointer-events-none absolute size-3.5 scale-50 text-on-primary opacity-0 transition-all peer-checked:scale-100 peer-checked:opacity-100" />
      </span>
      <span className="text-[0.9375rem] leading-snug text-ink">
        {label}
        {description && <span className="mt-1 block text-sm text-ink-subtle">{description}</span>}
      </span>
    </label>
  )
}

/** Large selectable card backed by a native radio input. */
export function RadioCard({
  label,
  description,
  icon,
  className,
  ref,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: ReactNode; description?: ReactNode; icon?: ReactNode; ref?: Ref<HTMLInputElement> }) {
  return (
    <label
      className={cn(
        'group/rc relative flex cursor-pointer items-start gap-3.5 rounded-2xl border border-line-strong/60 bg-surface p-4 transition-all hover:border-primary/60 has-[:checked]:border-primary has-[:checked]:bg-primary-soft/50 has-[:checked]:shadow-[0_0_0_3px] has-[:checked]:shadow-primary/15 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-55',
        className,
      )}
    >
      <input ref={ref} type="radio" className="peer sr-only" {...props} />
      {icon && <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-muted text-primary-ink group-has-[:checked]/rc:bg-primary group-has-[:checked]/rc:text-on-primary">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-sm text-ink-muted">{description}</span>}
      </span>
      <span
        aria-hidden
        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-line-strong transition-colors group-has-[:checked]/rc:border-primary group-has-[:checked]/rc:bg-primary"
      >
        <span className="size-2 scale-0 rounded-full bg-white transition-transform group-has-[:checked]/rc:scale-100" />
      </span>
    </label>
  )
}

/** Visually grouped set of fields with a legend. */
export function Fieldset({ legend, description, children, className }: { legend: ReactNode; description?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <fieldset className={cn('min-w-0', className)}>
      <legend className="text-sm font-semibold text-ink">{legend}</legend>
      {description && <p className="mt-1 text-sm text-ink-subtle">{description}</p>}
      <div className="mt-3">{children}</div>
    </fieldset>
  )
}

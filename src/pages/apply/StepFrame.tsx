import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { STEPS } from './schema'

/** Props every step receives from the wizard. */
export interface StepNavProps {
  index: number
  /** Move focus to the step heading on mount (true after the visitor changes step). */
  focusHeading: boolean
  saving: boolean
  /** Go back one step, keeping unsaved values in memory. */
  onBack?: (values?: unknown) => void
}

export function StepFrame({
  index,
  focusHeading,
  intro,
  children,
}: {
  index: number
  focusHeading: boolean
  intro?: ReactNode
  children: ReactNode
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (focusHeading) headingRef.current?.focus({ preventScroll: true })
  }, [focusHeading])
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink">
        Step {index + 1} of {STEPS.length}
      </p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-2 font-display text-2xl font-semibold text-ink focus:outline-none sm:text-3xl">
        {STEPS[index].heading}
      </h2>
      {intro && <div className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-muted">{intro}</div>}
      <div className="mt-8">{children}</div>
    </div>
  )
}

export function StepFooter({
  onBack,
  saving,
  submitLabel = 'Save and continue',
  savingLabel = 'Saving…',
  submitIcon,
  note,
}: {
  onBack?: () => void
  saving: boolean
  submitLabel?: string
  savingLabel?: string
  submitIcon?: ReactNode
  note?: ReactNode
}) {
  return (
    <div className="mt-10 border-t border-line pt-6">
      {note && <div className="mb-5 text-sm text-ink-subtle">{note}</div>}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {onBack ? (
          <Button variant="ghost" onClick={onBack} disabled={saving} icon={<ArrowLeft aria-hidden className="size-4" />}>
            Back
          </Button>
        ) : (
          <span aria-hidden />
        )}
        <Button type="submit" size="lg" loading={saving} arrow={!submitIcon} icon={submitIcon}>
          {saving ? savingLabel : submitLabel}
        </Button>
      </div>
    </div>
  )
}

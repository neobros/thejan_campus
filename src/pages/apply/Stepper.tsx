import { Check, Lock } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { springSoft } from '@/lib/motion'

interface StepperProps {
  steps: readonly { key: string; title: string }[]
  current: number
  /** Furthest step reached — later steps cannot be selected yet. */
  furthest: number
  onSelect: (index: number) => void
}

/** Desktop: horizontal stepper with an animated progress line. Mobile: compact "Step 2 of 7" bar. */
export function Stepper({ steps, current, furthest, onSelect }: StepperProps) {
  const count = steps.length
  const half = 50 / count
  return (
    <nav aria-label="Application steps">
      {/* Compact (mobile) */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <p className="font-semibold text-ink">
            Step {current + 1} of {count}
            <span className="font-normal text-ink-muted"> · {steps[current].title}</span>
          </p>
          <p className="tabular-nums text-ink-subtle" aria-hidden>
            {Math.round(((current + 1) / count) * 100)}%
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Application progress"
          aria-valuemin={1}
          aria-valuemax={count}
          aria-valuenow={current + 1}
          aria-valuetext={`Step ${current + 1} of ${count}: ${steps[current].title}`}
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted"
        >
          <motion.div
            className="h-full origin-left rounded-full bg-gradient-to-r from-primary to-accent"
            initial={false}
            animate={{ scaleX: (current + 1) / count }}
            transition={springSoft}
          />
        </div>
      </div>

      {/* Full (tablet/desktop) */}
      <div className="relative hidden md:block">
        <div aria-hidden className="absolute top-5 h-0.5 -translate-y-1/2 rounded-full bg-line" style={{ left: `${half}%`, right: `${half}%` }}>
          <motion.div
            className="h-full origin-left rounded-full bg-primary"
            initial={false}
            animate={{ scaleX: furthest / (count - 1) }}
            transition={springSoft}
          />
        </div>
        <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
        {steps.map((step, index) => {
          const isCurrent = index === current
          const done = index < furthest && !isCurrent
          const locked = index > furthest
          return (
            <li key={step.key} className="relative flex justify-center">
              <button
                type="button"
                onClick={() => onSelect(index)}
                disabled={locked}
                aria-current={isCurrent ? 'step' : undefined}
                className="group flex flex-col items-center gap-2 rounded-xl px-1 pb-1 text-center disabled:cursor-not-allowed"
              >
                <span
                  className={cn(
                    'relative grid size-10 place-items-center rounded-full border text-sm font-semibold transition-[background-color,border-color,color,box-shadow] duration-300',
                    isCurrent && 'border-primary bg-primary text-on-primary shadow-[0_0_0_5px] shadow-primary/15',
                    done && 'border-primary bg-primary-soft text-on-primary-soft group-hover:bg-primary group-hover:text-on-primary',
                    !isCurrent && !done && !locked && 'border-line-strong bg-surface text-ink group-hover:border-primary',
                    locked && 'border-line bg-surface text-ink-subtle',
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {done ? (
                      <motion.span key="done" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Check aria-hidden strokeWidth={3} className="size-4" />
                      </motion.span>
                    ) : (
                      <motion.span key="number" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.2 }}>
                        {index + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1 text-xs font-medium leading-tight lg:text-sm',
                    isCurrent ? 'text-ink' : locked ? 'text-ink-subtle' : 'text-ink-muted group-hover:text-ink',
                  )}
                >
                  {locked && <Lock aria-hidden className="size-3 shrink-0" />}
                  {step.title}
                </span>
                <span className="sr-only">{isCurrent ? ' (current step)' : done ? ' (completed)' : locked ? ' (not yet available)' : ''}</span>
              </button>
            </li>
          )
        })}
        </ol>
      </div>
    </nav>
  )
}

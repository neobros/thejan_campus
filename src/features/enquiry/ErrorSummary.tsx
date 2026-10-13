import { CircleAlert } from 'lucide-react'
import { motion } from 'motion/react'
import type { Ref } from 'react'
import { cn } from '@/lib/cn'
import type { ErrorItem } from './formErrors'

/**
 * Summary of validation problems shown at the top of a form (WCAG 3.3.1). Each item moves focus to
 * the related control. Announced via role="alert" when it appears.
 */
export function ErrorSummary({
  items,
  onSelect,
  title = 'Please check the following',
  className,
  ref,
}: {
  items: ErrorItem[]
  onSelect: (key: string) => void
  title?: string
  className?: string
  ref?: Ref<HTMLDivElement>
}) {
  if (items.length === 0) return null
  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      role="alert"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('rounded-2xl border border-danger/30 bg-danger-soft p-5 focus:outline-none', className)}
    >
      <p className="flex items-center gap-2 font-semibold text-ink">
        <CircleAlert aria-hidden className="size-5 shrink-0 text-danger" />
        {title}
      </p>
      <ul className="mt-3 space-y-1.5 pl-7 text-[0.9375rem]">
        {items.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => onSelect(item.key)}
              className="text-left font-medium text-danger underline decoration-1 underline-offset-4 hover:decoration-2"
            >
              {item.message}
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

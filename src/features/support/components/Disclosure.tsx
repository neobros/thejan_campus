import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { EASE_OUT_EXPO } from '@/lib/motion'

/** Accessible show/hide section (button with aria-expanded) with a smooth height animation. */
export function Disclosure({
  label,
  children,
  className,
  defaultOpen = false,
}: {
  label: ReactNode
  children: ReactNode
  className?: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="group/dis inline-flex min-h-10 items-center gap-2 rounded-full text-sm font-semibold text-primary-ink underline-offset-4 hover:underline"
      >
        <span className={cn('grid size-6 place-items-center rounded-full bg-primary-soft text-on-primary-soft transition-transform duration-300', open && 'rotate-180')}>
          <ChevronDown aria-hidden className="size-3.5" />
        </span>
        {label}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

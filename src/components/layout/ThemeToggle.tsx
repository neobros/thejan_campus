import { Monitor, Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { MouseEvent } from 'react'
import { cn } from '@/lib/cn'
import { useTheme, type ThemePreference } from '@/lib/theme'

function centerOf(event: MouseEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

/** Header toggle: switches between light and dark with a circular reveal from the button. */
export function ThemeToggle({ onDark, className }: { onDark?: boolean; className?: string }) {
  const { theme, setPreference } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      onClick={(event) => setPreference(next, centerOf(event))}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={cn(
        'relative grid size-10 place-items-center overflow-hidden rounded-full transition-colors',
        onDark ? 'text-white hover:bg-white/10' : 'text-ink-muted hover:bg-surface-muted hover:text-ink',
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ y: 0, rotate: 0, opacity: 1, scale: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="grid place-items-center"
        >
          {theme === 'dark' ? <Moon aria-hidden className="size-[1.15rem]" /> : <Sun aria-hidden className="size-[1.15rem]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

const options: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

/** Three-way switch (light / dark / follow system) for the footer and mobile menu. */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { preference, setPreference } = useTheme()
  return (
    <div role="radiogroup" aria-label="Colour theme" className={cn('inline-flex gap-1 rounded-full border border-line bg-surface p-1', className)}>
      {options.map(({ value, label, icon: IconComponent }) => {
        const active = preference === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={(event) => setPreference(value, centerOf(event))}
            className={cn(
              'relative isolate inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors',
              active ? 'text-ink' : 'text-ink-subtle hover:text-ink',
            )}
          >
            {active && (
              <motion.span
                layoutId="theme-switcher-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-0 -z-10 rounded-full bg-surface-muted ring-1 ring-line"
              />
            )}
            <IconComponent aria-hidden className="size-3.5" />
            {label}
          </button>
        )
      })}
    </div>
  )
}

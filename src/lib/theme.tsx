import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { readString, writeString } from './storage'

export type Theme = 'light' | 'dark'
export type ThemePreference = Theme | 'system'

const STORAGE_KEY = 'campus-theme'
const THEME_COLORS: Record<Theme, string> = { light: '#faf9f6', dark: '#070b14' }

interface ThemeContextValue {
  /** What the visitor chose. */
  preference: ThemePreference
  /** What is actually shown. */
  theme: Theme
  /** Switch theme; `origin` (viewport px) centres the circular reveal on the control that was used. */
  setPreference: (next: ThemePreference, origin?: { x: number; y: number }) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const systemQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

function readPreference(): ThemePreference {
  const stored = readString(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'light' // default theme for first-time visitors
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readPreference)
  const [systemTheme, setSystemTheme] = useState<Theme>(() => (systemQuery().matches ? 'dark' : 'light'))
  const theme: Theme = preference === 'system' ? systemTheme : preference

  useEffect(() => {
    const query = systemQuery()
    const onChange = () => setSystemTheme(query.matches ? 'dark' : 'light')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useLayoutEffect(() => applyTheme(theme), [theme])

  const setPreference = useCallback(
    (next: ThemePreference, origin?: { x: number; y: number }) => {
      // Store 'system' explicitly too, so an unset preference can default to light for new visitors.
      writeString(STORAGE_KEY, next)

      const nextTheme: Theme = next === 'system' ? (systemQuery().matches ? 'dark' : 'light') : next
      const commit = () => flushSync(() => setPreferenceState(next))

      if (nextTheme === theme || typeof document.startViewTransition !== 'function' || prefersReducedMotion()) {
        commit()
        return
      }

      const root = document.documentElement
      root.dataset.vt = 'theme'
      const transition = document.startViewTransition(commit)
      transition.ready
        .then(() => {
          const x = origin?.x ?? window.innerWidth / 2
          const y = origin?.y ?? 0
          const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
          root.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
          )
        })
        .catch(() => {
          /* transition skipped — theme is still applied */
        })
      transition.finished.finally(() => {
        delete root.dataset.vt
      })
    },
    [theme],
  )

  const value = useMemo(() => ({ preference, theme, setPreference }), [preference, theme, setPreference])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}

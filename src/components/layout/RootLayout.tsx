import { useEffect, useRef, useState } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { Toaster } from 'sonner'
import { useTheme } from '@/lib/theme'
import { BackToTop, RouteProgress, SkipLink } from './chrome'
import { Footer } from './Footer'
import { Header } from './Header'

/**
 * After client-side navigation, move focus to <main> and announce the new page title so screen
 * reader users know the page changed.
 */
function useRouteAnnouncer() {
  const { pathname } = useLocation()
  const first = useRef(true)
  const [announcement, setAnnouncement] = useState('')
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const timer = setTimeout(() => {
      document.getElementById('main')?.focus({ preventScroll: true })
      setAnnouncement(document.title)
    }, 80)
    return () => clearTimeout(timer)
  }, [pathname])
  return announcement
}

export function RootLayout() {
  const announcement = useRouteAnnouncer()
  const { theme } = useTheme()
  return (
    <>
      <SkipLink />
      <RouteProgress />
      <Header />
      <main id="main" tabIndex={-1} className="min-h-[60vh] outline-none">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <Toaster theme={theme} position="bottom-center" richColors closeButton />
      <ScrollRestoration />
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>
    </>
  )
}

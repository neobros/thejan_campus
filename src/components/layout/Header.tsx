import { Mail, Phone } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { useNavigationData, useSettings } from '@/api/queries'
import { cn } from '@/lib/cn'
import { isDialable, isEmail, telHref } from '@/lib/links'
import { useTheme } from '@/lib/theme'
import { AppLink } from '@/components/ui/AppLink'
import { ButtonLink } from '@/components/ui/Button'
import { DesktopNav } from './DesktopNav'
import { Logo } from './Logo'
import { MobileNav } from './MobileNav'
import { SearchProvider, SearchTrigger } from './SearchDialog'
import { ThemeToggle } from './ThemeToggle'

/** Routes whose hero is a dark, full-bleed image — the header starts transparent with light text. */
const DARK_HERO_ROUTES = new Set(['/'])

function useScrollState(locked: boolean) {
  const [state, setState] = useState({ scrolled: false, hidden: false })
  const lastY = useRef(0)
  useLayoutEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - lastY.current
      setState((prev) => {
        const scrolled = y > 12
        let hidden = prev.hidden
        if (locked || y < 240) hidden = false
        else if (delta > 6) hidden = true
        else if (delta < -6) hidden = false
        return prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden }
      })
      lastY.current = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [locked])
  return state
}

export function Header() {
  const { pathname } = useLocation()
  const navigation = useNavigationData()
  const settings = useSettings()
  const { theme } = useTheme()
  const [menuValue, setMenuValue] = useState('')
  const { scrolled, hidden } = useScrollState(menuValue !== '')
  const topRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const [topHeight, setTopHeight] = useState(0)

  // Publish header heights as CSS variables (heroes pad themselves by --header-h).
  useLayoutEffect(() => {
    const top = topRef.current
    const header = headerRef.current
    if (!top || !header) return
    const measure = () => {
      const t = top.offsetHeight
      setTopHeight(t)
      document.documentElement.style.setProperty('--header-top-h', `${t}px`)
      document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(top)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => setMenuValue(''), [pathname])

  const solid = scrolled || menuValue !== ''
  const onDark = DARK_HERO_ROUTES.has(pathname) && !solid
  // Hidden: move fully out of view, including the bar's shadow and the CTA glow.
  const offset = hidden ? 'calc(-100% - 2.5rem)' : scrolled ? `-${topHeight}px` : '0px'

  return (
    <SearchProvider>
    <header
      ref={headerRef}
      className="site-header no-print fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ transform: `translateY(${offset})` }}
    >
      <div ref={topRef}>
        <div
          className={cn(
            'hidden border-b text-[0.8125rem] transition-colors duration-300 xl:block',
            onDark ? 'border-white/10 text-white/70' : 'border-line bg-canvas text-ink-muted',
          )}
        >
          <div className="container-page flex h-9 items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {isDialable(settings.contact.phone) ? (
                <a href={telHref(settings.contact.phone)} className="inline-flex items-center gap-1.5 hover:text-current">
                  <Phone aria-hidden className="size-3.5" />
                  {settings.contact.phone}
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <Phone aria-hidden className="size-3.5" />
                  {settings.contact.phone}
                </span>
              )}
              {isEmail(settings.contact.email) ? (
                <a href={`mailto:${settings.contact.email}`} className="inline-flex items-center gap-1.5">
                  <Mail aria-hidden className="size-3.5" />
                  {settings.contact.email}
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <Mail aria-hidden className="size-3.5" />
                  {settings.contact.email}
                </span>
              )}
            </div>
            <div className="flex items-center gap-5">
              <SearchTrigger variant="bar" onDark={onDark} className="w-[19rem]" />
              <nav aria-label="Utility">
                <ul className="flex items-center gap-5">
                  {navigation.utility.map((link) => (
                    <li key={link.href}>
                      <AppLink href={link.href} className={cn('transition-colors', onDark ? 'hover:text-white' : 'hover:text-ink')}>
                        {link.label}
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className={cn(
            'absolute inset-0 -z-10 transition-all duration-500',
            solid ? 'border-b border-line bg-canvas/85 shadow-[0_8px_30px_-18px_rgb(0_0_0/0.25)] backdrop-blur-xl backdrop-saturate-150' : 'border-b border-transparent',
          )}
        />
        <div className="container-page flex h-[4.25rem] items-center gap-3 sm:h-[4.5rem]">
          {/* Brand identity: AIT logo (primary) + full name. */}
          <div className="mr-auto flex shrink-0 items-center xl:mr-2">
            <Logo onDark={onDark || theme === 'dark'} />
            <span
              className={cn(
                'ml-3 hidden border-l pl-3 text-[0.8rem] font-semibold uppercase leading-[1.15] tracking-[0.04em] xl:inline-block',
                onDark || theme === 'dark' ? 'border-white/25' : 'border-line-strong/50',
              )}
            >
              <span className={cn('animate-gradient', onDark ? 'text-shimmer-white' : 'text-shimmer-ink')}>
                Australian Institute
                <br />
                of Technology
              </span>
            </span>
          </div>
          <div className="hidden min-w-0 flex-1 justify-center px-2 xl:flex">
            <DesktopNav items={navigation.main} onDark={onDark} value={menuValue} onValueChange={setMenuValue} />
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            {/* Compact search for mobile/tablet, and on desktop once the search bar in the top strip scrolls away. */}
            <SearchTrigger variant="icon" onDark={onDark} className={cn(!scrolled && 'xl:hidden')} />
            <ThemeToggle onDark={onDark} />
            <ButtonLink href="/enquire" size="sm" variant="accent" className="ml-1 hidden sm:inline-flex">
              Enquire Now
            </ButtonLink>
            <MobileNav onDark={onDark} />
          </div>
        </div>
      </div>
    </header>
    </SearchProvider>
  )
}

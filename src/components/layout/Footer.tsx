import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useNavigationData, useSettings } from '@/api/queries'
import { isDialable, isEmail, telHref } from '@/lib/links'
import { AppLink } from '@/components/ui/AppLink'
import { SocialIcon, socialLabel } from '@/components/ui/SocialIcon'
import { Aurora } from '@/components/motion/effects'
import { Reveal } from '@/components/motion/Reveal'
import { Logo } from './Logo'
import { ThemeSwitcher } from './ThemeToggle'

export function Footer() {
  const settings = useSettings()
  const navigation = useNavigationData()
  const year = new Date().getFullYear()
  const { contact } = settings

  return (
    <footer className="theme-night no-print relative isolate overflow-hidden">
      <Aurora intensity="soft" className="opacity-70" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.35] mask-fade-bottom" style={{ '--grid-color': 'rgb(255 255 255 / 0.05)' } as CSSProperties} />

      <div className="container-page relative pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Logo onDark />
            <p className="mt-5 max-w-sm leading-relaxed text-ink-muted">{settings.tagline}</p>
            <ul className="mt-6 space-y-3 text-[0.9375rem] text-ink-muted">
              <li className="flex gap-3">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>{contact.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                {isDialable(contact.phone) ? (
                  <a className="hover:text-ink" href={telHref(contact.phone)}>
                    {contact.phone}
                  </a>
                ) : (
                  <span>{contact.phone}</span>
                )}
              </li>
              <li className="flex gap-3">
                <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                {isEmail(contact.email) ? (
                  <a className="hover:text-ink" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                ) : (
                  <span>{contact.email}</span>
                )}
              </li>
              <li className="flex gap-3">
                <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>{contact.hours}</span>
              </li>
            </ul>
          </Reveal>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {navigation.footer.map((column, index) => (
              <Reveal key={column.title} delay={0.05 * index}>
                <h2 className="text-sm font-semibold text-ink">{column.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <AppLink
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-[0.9375rem] text-ink-muted transition-colors hover:text-ink"
                      >
                        <span className="bg-gradient-to-r from-accent to-accent bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                          {link.label}
                        </span>
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          {settings.social.length > 0 && (
            <ul className="flex items-center gap-2" aria-label="Social media">
              {settings.social.map((item) => (
                <li key={item.network}>
                  <AppLink
                    href={item.url}
                    aria-label={socialLabel(item.network)}
                    className="grid size-10 place-items-center rounded-full border border-line text-ink-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-on-accent"
                  >
                    <SocialIcon network={item.network} className="size-4" />
                  </AppLink>
                </li>
              ))}
            </ul>
          )}
          <ThemeSwitcher />
        </div>

        {(settings.acknowledgement || settings.identifiers.length > 0) && (
          <div className="mt-8 space-y-3 text-sm text-ink-subtle">
            {settings.acknowledgement && <p className="max-w-3xl">{settings.acknowledgement}</p>}
            {settings.identifiers.length > 0 && (
              <p className="flex flex-wrap gap-x-6 gap-y-1">
                {settings.identifiers.map((id) => (
                  <span key={id.label}>
                    {id.label}: <span className="text-ink-muted">{id.value}</span>
                  </span>
                ))}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 text-sm text-ink-subtle md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.legalName}
            {settings.tradingName ? ` trading as ${settings.tradingName}` : ''}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {navigation.legal.map((link) => (
              <li key={link.href}>
                <AppLink href={link.href} className="hover:text-ink">
                  {link.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p
        aria-hidden
        className="pointer-events-none select-none whitespace-nowrap px-4 pb-2 text-center font-display text-[clamp(3rem,12vw,11rem)] font-semibold leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.08)]"
      >
        {settings.shortName}
      </p>
    </footer>
  )
}

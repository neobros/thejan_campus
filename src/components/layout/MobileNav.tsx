import { ChevronDown, Mail, Menu, Phone, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Accordion, Dialog } from 'radix-ui'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useNavigationData, useSettings } from '@/api/queries'
import { cn } from '@/lib/cn'
import { isDialable, isEmail, telHref } from '@/lib/links'
import { useTheme } from '@/lib/theme'
import { AppLink } from '@/components/ui/AppLink'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Logo } from './Logo'
import { ThemeSwitcher } from './ThemeToggle'

export function MobileNav({ onDark }: { onDark?: boolean }) {
  const [open, setOpen] = useState(false)
  const { pathname, search } = useLocation()
  const navigation = useNavigationData()
  const settings = useSettings()
  const { theme } = useTheme()

  // Close after navigating.
  useEffect(() => setOpen(false), [pathname, search])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className={cn(
            'grid size-10 place-items-center rounded-full transition-colors xl:hidden',
            onDark ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-surface-muted',
          )}
        >
          <Menu aria-hidden className="size-5" />
        </button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[70] bg-[#070b18]/55 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col bg-canvas shadow-2xl outline-none sm:rounded-l-[2rem]"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              >
                <Dialog.Title className="sr-only">Site menu</Dialog.Title>
                <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
                  <Logo onDark={theme === 'dark'} />
                  <Dialog.Close className="grid size-10 place-items-center rounded-full text-ink hover:bg-surface-muted" aria-label="Close menu">
                    <X aria-hidden className="size-5" />
                  </Dialog.Close>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
                  <AppLink
                    href="/search"
                    className="mx-2 mb-4 flex h-12 items-center gap-3 rounded-2xl border border-line bg-surface px-4 text-ink-subtle transition-colors hover:border-primary/50"
                  >
                    <Search aria-hidden className="size-4" />
                    Search courses and pages
                  </AppLink>
                  <motion.nav
                    aria-label="Main"
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.12 } } }}
                  >
                    <Accordion.Root type="single" collapsible>
                      {navigation.main.map((item) => (
                        <motion.div
                          key={item.label}
                          variants={{ hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } } }}
                        >
                          {item.groups?.length ? (
                            <Accordion.Item value={item.label} className="group/m">
                              <Accordion.Header>
                                <Accordion.Trigger className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left font-display text-xl font-semibold text-ink hover:bg-surface-muted">
                                  {item.label}
                                  <ChevronDown aria-hidden className="size-5 text-ink-subtle transition-transform duration-300 group-data-[state=open]/m:rotate-180" />
                                </Accordion.Trigger>
                              </Accordion.Header>
                              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                <div className="space-y-4 px-2 pb-4 pt-1">
                                  {item.groups.map((group) => (
                                    <div key={group.title}>
                                      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">{group.title}</p>
                                      <ul>
                                        {group.items.map((leaf) => (
                                          <li key={leaf.href + leaf.label}>
                                            <AppLink href={leaf.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-ink-muted hover:bg-surface-muted hover:text-ink">
                                              {leaf.icon && <Icon name={leaf.icon} className="size-4 text-primary-ink" />}
                                              {leaf.label}
                                            </AppLink>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </Accordion.Content>
                            </Accordion.Item>
                          ) : (
                            <AppLink href={item.href} className="flex rounded-2xl px-4 py-3.5 font-display text-xl font-semibold text-ink hover:bg-surface-muted">
                              {item.label}
                            </AppLink>
                          )}
                        </motion.div>
                      ))}
                    </Accordion.Root>
                  </motion.nav>

                  <ul className="mt-4 flex flex-wrap gap-2 border-t border-line px-2 pt-5">
                    {navigation.utility.map((link) => (
                      <li key={link.href}>
                        <AppLink href={link.href} className="inline-flex rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-muted hover:border-primary/50 hover:text-ink">
                          {link.label}
                        </AppLink>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 border-t border-line bg-canvas-alt px-5 py-5">
                  <div className="grid grid-cols-2 gap-3">
                    <ButtonLink href="/enquire" variant="secondary" className="w-full">
                      Enquire
                    </ButtonLink>
                    <ButtonLink href="/apply" variant="accent" className="w-full">
                      Apply now
                    </ButtonLink>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <ThemeSwitcher />
                    <div className="flex items-center gap-1">
                      {isDialable(settings.contact.phone) && (
                        <a href={telHref(settings.contact.phone)} aria-label="Call us" className="grid size-9 place-items-center rounded-full text-ink-muted hover:bg-surface-muted">
                          <Phone aria-hidden className="size-4" />
                        </a>
                      )}
                      {isEmail(settings.contact.email) && (
                        <a href={`mailto:${settings.contact.email}`} aria-label="Email us" className="grid size-9 place-items-center rounded-full text-ink-muted hover:bg-surface-muted">
                          <Mail aria-hidden className="size-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

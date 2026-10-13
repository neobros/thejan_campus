import { GraduationCap, Mail, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Dialog } from 'radix-ui'
import type { StaffProfile } from '@/api/types'
import { Badge } from '@/components/ui/Badge'
import { isEmail } from '@/lib/links'
import { PersonAvatar } from './PersonAvatar'

const GROUP_LABELS: Record<StaffProfile['group'], string> = {
  leadership: 'Leadership',
  faculty: 'Faculty',
  professional: 'Professional staff',
}

/** Full staff profile: bio, confirmed qualifications, expertise and public contact (only if approved). */
export function ProfileDialog({ person, onOpenChange }: { person: StaffProfile | null; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog.Root open={Boolean(person)} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {person && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[80] bg-night/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className="fixed inset-x-3 bottom-3 top-auto z-[81] mx-auto flex max-h-[calc(100dvh-1.5rem)] max-w-2xl flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-float outline-none sm:inset-x-6 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              >
                <div className="relative border-b border-line bg-canvas-alt px-6 pb-6 pt-7 sm:px-8">
                  <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-50 mask-fade-radial" />
                  <Dialog.Close
                    aria-label="Close profile"
                    className="absolute right-3 top-3 grid size-10 place-items-center rounded-full text-ink-subtle transition-colors hover:bg-surface-muted hover:text-ink"
                  >
                    <X aria-hidden className="size-5" />
                  </Dialog.Close>
                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                    <PersonAvatar person={person} className="size-24" textClassName="text-3xl" />
                    <div className="min-w-0 pr-8">
                      <Badge tone="accent">{GROUP_LABELS[person.group]}</Badge>
                      <Dialog.Title className="mt-2 font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">{person.name}</Dialog.Title>
                      <Dialog.Description className="mt-1 text-ink-muted">
                        {person.role}
                        <span className="text-ink-subtle"> · {person.department}</span>
                      </Dialog.Description>
                    </div>
                  </div>
                </div>

                <div className="space-y-7 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8 sm:py-7">
                  {person.bio && <p className="text-[1.0625rem] leading-relaxed text-ink-muted">{person.bio}</p>}

                  {person.qualifications.length > 0 && (
                    <section>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">Qualifications</h3>
                      <ul className="mt-3 space-y-2">
                        {person.qualifications.map((q) => (
                          <li key={q} className="flex gap-3 text-ink-muted">
                            <GraduationCap aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-ink" />
                            {q}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {person.expertise.length > 0 && (
                    <section>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">Areas of expertise</h3>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {person.expertise.map((area) => (
                          <li key={area}>
                            <Badge tone="brand" size="md">
                              {area}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {isEmail(person.email) && (
                    <section className="rounded-2xl bg-surface-muted p-4">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">Contact</h3>
                      <a
                        href={`mailto:${person.email}`}
                        className="mt-2 inline-flex items-center gap-2 font-medium text-primary-ink underline-offset-4 [overflow-wrap:anywhere] hover:underline"
                      >
                        <Mail aria-hidden className="size-4" />
                        {person.email}
                      </a>
                    </section>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

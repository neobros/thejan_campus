import { Phone, Siren } from 'lucide-react'
import { useId } from 'react'
import { useSettings } from '@/api/queries'
import { cn } from '@/lib/cn'
import { isDialable, telHref } from '@/lib/links'

/**
 * Location-appropriate emergency guidance from shared settings (spec §5.18). Always states that
 * website forms are not an emergency channel, even when no emergency details are configured.
 */
export function EmergencyNotice({ className }: { className?: string }) {
  const { emergency } = useSettings()
  const titleId = useId()
  const mentionsForms = emergency ? /\bforms?\b/i.test(emergency.body) : false
  return (
    <aside
      aria-labelledby={titleId}
      className={cn(
        'relative overflow-hidden rounded-3xl border p-5 sm:p-7',
        emergency ? 'border-danger/30 bg-danger-soft' : 'border-warning/30 bg-warning-soft',
        className,
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span
          aria-hidden
          className={cn(
            'relative grid size-12 shrink-0 place-items-center rounded-2xl bg-surface shadow-card',
            emergency ? 'text-danger' : 'text-warning',
          )}
        >
          <Siren className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={titleId} className="font-display text-xl font-semibold text-ink">
            {emergency?.title ?? 'Forms are not an emergency channel'}
          </h3>
          <div className="mt-2 space-y-2 leading-relaxed text-ink-muted">
            {emergency ? (
              <>
                <p>{emergency.body}</p>
                {!mentionsForms && <p>Website forms, email and enquiry inboxes are not monitored for emergencies.</p>}
              </>
            ) : (
              <p>
                Website forms, email and enquiry inboxes are not monitored for emergencies. If you or someone else is in immediate danger,
                contact local emergency services first.
              </p>
            )}
          </div>
          {emergency?.phone && (
            <div className="mt-4">
              {isDialable(emergency.phone) ? (
                <a
                  href={telHref(emergency.phone)}
                  className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-danger/40 bg-surface px-5 py-2 font-semibold text-danger transition-colors hover:border-danger"
                >
                  <Phone aria-hidden className="size-4" />
                  <span>
                    {emergency.phoneLabel}: <span className="tabular-nums">{emergency.phone}</span>
                  </span>
                </a>
              ) : (
                <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-5 py-2 font-semibold text-ink">
                  <Phone aria-hidden className="size-4 text-danger" />
                  {emergency.phoneLabel}: {emergency.phone}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

import { CalendarClock, CalendarDays, Download, Info, Layers, MapPin, Receipt } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import type { Audience, Course } from '@/api/types'
import { AppLink } from '@/components/ui/AppLink'
import { ButtonLink } from '@/components/ui/Button'
import { Callout } from '@/components/ui/feedback'
import { AUDIENCE_LONG_LABELS, FEE_BASIS_LABELS, MODE_LABELS, NO_FEE_MESSAGE } from '@/components/shared/labels'
import { FeeAmount, IntakeStatusBadge } from '@/components/shared/status'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import { dateParts, formatDate, formatFileSize, formatMoney, relativeDays, timeZoneCity, timeZoneLabel } from '@/lib/format'
import { applyHref, enquireHref } from '@/lib/links'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { groupIntakesByOffering, groupOfferingsByFee, isIntakeOpen, nextOpenIntake, offeringsFor } from './course-detail'
import { AudienceSwitch } from './CourseHero'
import { CourseSection } from './CourseSections'
import { useStickyTop } from './hooks'

/** Cross-fade content when the audience changes. */
function AudienceFade({ audience, children }: { audience?: Audience; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={audience ?? 'all'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function NotOffered({ course, audience }: { course: Course; audience: Audience }) {
  return (
    <Callout title={`Not currently offered to ${AUDIENCE_LONG_LABELS[audience].toLowerCase()}`}>
      Ask our admissions team about study options that suit you.{' '}
      <AppLink href={enquireHref({ course: course.slug, audience })} className="font-semibold text-primary-ink underline-offset-4 hover:underline">
        Make an enquiry
      </AppLink>
    </Callout>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Fees
 * ---------------------------------------------------------------------------------------------- */

export function FeesSection({ course, audience, onAudienceChange }: { course: Course; audience?: Audience; onAudienceChange: (a: Audience) => void }) {
  const offerings = offeringsFor(course, audience)
  const groups = groupOfferingsByFee(offerings)
  const currencies = [...new Set(offerings.flatMap((o) => (o.fee ? [o.fee.tuition.currency] : [])))]

  return (
    <CourseSection
      id="fees"
      eyebrow="Costs"
      title={audience ? `Fees for ${AUDIENCE_LONG_LABELS[audience].toLowerCase()}` : 'Fees'}
      intro="Current approved fees by campus and delivery mode, with any additional costs."
      action={<AudienceSwitch course={course} audience={audience} onChange={onAudienceChange} size="sm" className="lg:hidden" />}
    >
      <AudienceFade audience={audience}>
        {offerings.length === 0 && audience ? (
          <NotOffered course={course} audience={audience} />
        ) : (
          <div className="space-y-5">
            {groups.map((group) => {
              const fee = group.fee
              return (
                <Reveal key={group.key} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
                  <div className="border-b border-line bg-surface-muted/60 px-6 py-4 sm:px-7">
                    <h3 className="sr-only">Fee for {group.offerings.map((o) => `${o.campus.name} ${MODE_LABELS[o.deliveryMode]}`).join(', ')}</h3>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">Applies to</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {group.offerings.map((o) => (
                        <li key={o.id} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink">
                          <MapPin aria-hidden className="size-3.5 text-ink-subtle" />
                          {o.campus.name}
                          <span aria-hidden className="text-ink-subtle">·</span>
                          {MODE_LABELS[o.deliveryMode]}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {fee ? (
                    <div className="grid gap-6 p-6 sm:p-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-10">
                      <div>
                        <p className="text-sm text-ink-subtle">Tuition</p>
                        <FeeAmount fee={fee.tuition} size="lg" className="mt-1" />
                        <p className="mt-3 text-sm text-ink-muted">
                          Valid {formatDate(fee.validFrom, 'medium')}
                          {fee.validTo ? ` – ${formatDate(fee.validTo, 'medium')}` : ' until further notice'}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                          <Receipt aria-hidden className="size-4 text-ink-subtle" />
                          Additional costs
                        </p>
                        {fee.additional.length ? (
                          <ul className="mt-3 divide-y divide-line rounded-2xl border border-line">
                            {fee.additional.map((item) => (
                              <li key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3">
                                <span className="text-[0.9375rem] text-ink">
                                  {item.label}
                                  {item.note && <span className="block text-sm text-ink-subtle">{item.note}</span>}
                                </span>
                                <span className="text-[0.9375rem] font-semibold tabular-nums text-ink">
                                  {formatMoney(item.amount, item.currency)}
                                  {item.basis && <span className="ml-1 text-sm font-normal text-ink-subtle">{FEE_BASIS_LABELS[item.basis]}</span>}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-sm text-ink-muted">No additional costs are listed for this fee.</p>
                        )}
                      </div>
                      {fee.paymentNotes && (
                        <p className="flex gap-2.5 border-t border-line pt-5 text-sm leading-relaxed text-ink-muted md:col-span-2">
                          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-ink" />
                          {fee.paymentNotes}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7">
                      <p className="font-medium text-ink">{NO_FEE_MESSAGE}</p>
                      <ButtonLink
                        href={enquireHref({ topic: 'fees', course: course.slug, campus: group.offerings[0].campus.slug, audience })}
                        variant="secondary"
                        size="sm"
                      >
                        Ask about fees
                      </ButtonLink>
                    </div>
                  )}
                </Reveal>
              )
            })}
          </div>
        )}
      </AudienceFade>
      <p className="mt-6 text-sm leading-relaxed text-ink-subtle">
        {currencies.length === 1 ? `Amounts are in ${currencies[0]}. ` : 'Amounts are shown in the currency listed with each fee. '}
        Your written offer confirms the fees that apply to you.{' '}
        <AppLink href="/admissions/fees" className="font-semibold text-primary-ink underline-offset-4 hover:underline">
          Fees and payment information
        </AppLink>
      </p>
    </CourseSection>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Intakes
 * ---------------------------------------------------------------------------------------------- */

export function IntakesSection({ course, audience, onAudienceChange }: { course: Course; audience?: Audience; onAudienceChange: (a: Audience) => void }) {
  const offerings = offeringsFor(course, audience)
  const groups = groupIntakesByOffering(offerings)
  return (
    <CourseSection
      id="intakes"
      eyebrow="Start dates"
      title="Intakes"
      intro="Dates are shown in each campus’s local time. Closed and full intakes stay listed so you can plan ahead or ask about alternatives."
      action={<AudienceSwitch course={course} audience={audience} onChange={onAudienceChange} size="sm" className="lg:hidden" />}
    >
      <AudienceFade audience={audience}>
        {offerings.length === 0 && audience ? (
          <NotOffered course={course} audience={audience} />
        ) : (
          <div className="space-y-8">
            {groups.map(({ offering, intakes }) => (
              <Reveal key={offering.id}>
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="flex items-center gap-2 font-semibold text-ink">
                    <MapPin aria-hidden className="size-4 text-primary-ink" />
                    {offering.campus.name}
                    <span aria-hidden className="text-ink-subtle">·</span>
                    <span className="font-medium text-ink-muted">{MODE_LABELS[offering.deliveryMode]}</span>
                  </h3>
                  <p className="text-xs text-ink-subtle">
                    {timeZoneCity(offering.campus.timezone)} time ({timeZoneLabel(offering.campus.timezone)})
                  </p>
                </div>
                {intakes.length === 0 ? (
                  <p className="rounded-3xl border border-dashed border-line-strong/50 px-5 py-6 text-[0.9375rem] text-ink-muted">
                    No upcoming dates are published for this campus and mode yet.{' '}
                    <AppLink href={enquireHref({ course: course.slug, campus: offering.campus.slug, audience })} className="font-semibold text-primary-ink underline-offset-4 hover:underline">
                      Ask about the next intake
                    </AppLink>
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {intakes.map((intake) => {
                      const parts = dateParts(intake.startDate)
                      const open = isIntakeOpen(intake)
                      return (
                        <li
                          key={intake.id}
                          className={cn(
                            'grid gap-4 rounded-3xl border border-line bg-surface p-4 transition-[border-color,box-shadow] duration-300 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:p-5',
                            open ? 'hover:border-primary/30 hover:shadow-card-hover' : 'bg-surface-muted/50',
                          )}
                        >
                          <div className={cn('grid size-16 place-items-center rounded-2xl text-center', open ? 'bg-primary-soft text-on-primary-soft' : 'bg-surface-muted text-ink-subtle')}>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">{parts.month}</span>
                            <span className="-mt-1 font-display text-2xl font-semibold leading-none">{parts.day}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <IntakeStatusBadge status={intake.status} />
                              {open && <span className="text-xs text-ink-subtle">Starts {relativeDays(intake.startDate)}</span>}
                            </div>
                            <p className="mt-1.5 font-semibold text-ink">Starts {formatDate(intake.startDate, 'weekday')}</p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-muted">
                              <CalendarClock aria-hidden className="size-3.5" />
                              Application deadline {formatDate(intake.applicationDeadline, 'medium')}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 sm:justify-end">
                            {open && (
                              <ButtonLink href={applyHref({ course: course.slug, campus: offering.campus.slug, audience: offering.audience, intake: intake.id })} size="sm" variant="primary">
                                Apply<span className="sr-only"> for the {formatDate(intake.startDate)} intake at {offering.campus.name}</span>
                              </ButtonLink>
                            )}
                            <ButtonLink href={enquireHref({ course: course.slug, campus: offering.campus.slug, audience: offering.audience })} size="sm" variant="secondary">
                              Enquire<span className="sr-only"> about the {formatDate(intake.startDate)} intake</span>
                            </ButtonLink>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </Reveal>
            ))}
          </div>
        )}
      </AudienceFade>
    </CourseSection>
  )
}

/* ------------------------------------------------------------------------------------------------
 * "Plan your study" sidebar card (desktop) and the floating action bar (mobile)
 * ---------------------------------------------------------------------------------------------- */

export function PlanStudyCard({ course, audience, onAudienceChange }: { course: Course; audience?: Audience; onAudienceChange: (a: Audience) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useStickyTop(ref)
  const offerings = offeringsFor(course, audience)
  const next = nextOpenIntake(offerings)
  const brochure = course.downloads.find((d) => d.type === 'brochure') ?? course.downloads[0]

  return (
    <div ref={ref} className="sticky top-[calc(var(--sticky-top,4.5rem)+5rem)] transition-[top]">
      <Reveal immediate y={20} delay={0.2} className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card">
        <div className="relative overflow-hidden border-b border-line bg-gradient-to-br from-primary-soft to-surface px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink">Plan your study</p>
          <p className="mt-1 font-display text-lg font-semibold leading-snug text-ink">{course.title}</p>
        </div>
        <div className="space-y-6 p-6">
          {course.audiences.length > 1 && audience && (
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">I am a…</p>
              <AudienceSwitch course={course} audience={audience} onChange={onAudienceChange} size="sm" className="flex w-full [&>button]:flex-1 [&>button]:justify-center" />
            </div>
          )}
          <AudienceFade audience={audience}>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-ink-subtle">Tuition from</p>
                {audience ? <FeeAmount fee={course.feeFrom[audience]} size="lg" className="mt-1" /> : <p className="mt-1 text-ink-muted">{NO_FEE_MESSAGE}</p>}
                <a href="#fees" className="mt-1 inline-block text-sm font-semibold text-primary-ink underline-offset-4 hover:underline">
                  See all fees and costs
                </a>
              </div>
              <div className="rounded-2xl bg-surface-muted p-4">
                <p className="text-sm text-ink-subtle">Next available intake</p>
                {next ? (
                  <>
                    <p className="mt-1 flex flex-wrap items-center gap-2 font-semibold text-ink">
                      <CalendarDays aria-hidden className="size-4 text-primary-ink" />
                      {formatDate(next.startDate)}
                      <IntakeStatusBadge status={next.status} />
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                      <Layers aria-hidden className="size-3.5" />
                      {next.campus.name} · {MODE_LABELS[next.deliveryMode]}
                    </p>
                    <p className="mt-0.5 text-sm text-ink-muted">Apply by {formatDate(next.applicationDeadline, 'medium')}</p>
                  </>
                ) : (
                  <p className="mt-1 text-[0.9375rem] text-ink-muted">No intakes are open for applications right now.</p>
                )}
              </div>
            </div>
          </AudienceFade>
          <div className="grid gap-2.5">
            {next && (
              <ButtonLink href={applyHref({ course: course.slug, audience })} variant="accent" arrow className="w-full">
                Apply now
              </ButtonLink>
            )}
            <ButtonLink href={enquireHref({ course: course.slug, audience })} variant={next ? 'secondary' : 'primary'} className="w-full">
              {next ? 'Enquire about this course' : 'Ask about the next intake'}
            </ButtonLink>
          </div>
          {brochure && (
            <a
              href={brochure.file.url}
              download
              className="flex items-center gap-3 rounded-2xl border border-line p-3 text-sm transition-colors hover:border-primary/40 hover:bg-surface-muted"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-on-primary-soft">
                <Download aria-hidden className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-ink">{brochure.title}</span>
                <span className="block text-xs text-ink-subtle">
                  {brochure.file.format} · {formatFileSize(brochure.file.sizeBytes)}
                </span>
              </span>
            </a>
          )}
        </div>
      </Reveal>
    </div>
  )
}

export function MobileActionBar({ course, audience, visible }: { course: Course; audience?: Audience; visible: boolean }) {
  const next = nextOpenIntake(offeringsFor(course, audience))
  const fee = audience ? course.feeFrom[audience] : undefined
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="course-action-bar"
          initial={{ y: '120%' }}
          animate={{ y: 0 }}
          exit={{ y: '120%' }}
          transition={{ type: 'spring', stiffness: 340, damping: 34 }}
          className="no-print fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
        >
          {/* Lift the shared back-to-top button above this bar while it is shown. */}
          <style>{`@media (width < 64rem) { button[aria-label='Back to top'] { translate: 0 -5.25rem; transition: translate 300ms ease; } }`}</style>
          <section aria-label="Apply or enquire" className="mx-auto max-w-xl rounded-[1.5rem] border border-line bg-surface/90 p-3 shadow-float backdrop-blur-xl">
            <p className="truncate px-1 pb-2 text-xs text-ink-subtle">
              {next ? `Next intake ${formatDate(next.startDate, 'medium')}` : 'No intakes open right now'}
              {' · '}
              {fee ? `Tuition from ${formatMoney(fee.amount, fee.currency)} ${FEE_BASIS_LABELS[fee.basis]}` : 'Contact admissions for current fees'}
            </p>
            <div className={cn('grid gap-2', next && 'grid-cols-2')}>
              <ButtonLink href={enquireHref({ course: course.slug, audience })} variant="secondary" size="md" className="w-full">
                Enquire
              </ButtonLink>
              {next && (
                <ButtonLink href={applyHref({ course: course.slug, audience })} variant="accent" size="md" arrow className="w-full">
                  Apply
                </ButtonLink>
              )}
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

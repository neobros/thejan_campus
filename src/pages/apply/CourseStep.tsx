import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarClock, Globe, House, Layers, MapPin } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useMemo, useState, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import type { ApplicationSelection, Audience, CourseOption } from '@/api/types'
import { AppLink } from '@/components/ui/AppLink'
import { Callout } from '@/components/ui/feedback'
import { Field, FieldError, Fieldset, RadioCard, Select } from '@/components/ui/form'
import { AUDIENCE_LONG_LABELS, FEE_BASIS_LABELS, MODE_LABELS } from '@/components/shared/labels'
import { FeeAmount, IntakeStatusBadge } from '@/components/shared/status'
import { ErrorSummary } from '@/features/enquiry/ErrorSummary'
import { fieldErrorItems } from '@/features/enquiry/formErrors'
import { formatDate, formatMoney, relativeDays } from '@/lib/format'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { resolveSelection, SELECTION_ORDER, selectionFromForm, selectionSchema, type SelectionValues } from './schema'
import { StepFooter, StepFrame, type StepNavProps } from './StepFrame'

const AUDIENCE_META: Record<Audience, { description: string; icon: ReactNode }> = {
  domestic: { description: 'Citizens and residents studying in their home country', icon: <House aria-hidden className="size-5" /> },
  international: { description: 'Coming from overseas to study with us', icon: <Globe aria-hidden className="size-5" /> },
}

function Reveal({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
          className="overflow-hidden"
        >
          <div className="pt-8">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function CourseStep({
  options,
  saved,
  prefill,
  remembered,
  conflict,
  onSave,
  ...nav
}: StepNavProps & {
  options: CourseOption[]
  saved?: ApplicationSelection
  prefill: { audience?: string | null; course?: string | null; campus?: string | null; intake?: string | null }
  remembered?: SelectionValues
  conflict?: string | null
  onSave: (selection: ApplicationSelection) => void
}) {
  const uid = useId()
  const [defaults] = useState<SelectionValues>(() => {
    if (remembered) return remembered
    if (saved) return resolveSelection(options, { audience: saved.audience, course: saved.courseSlug, offeringId: saved.offeringId, intake: saved.intakeId })
    return resolveSelection(options, prefill)
  })
  const savedIntakeUnavailable = Boolean(saved?.intakeId && defaults.intakeId !== saved.intakeId && !remembered)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setFocus,
    getValues,
    formState: { errors, submitCount },
  } = useForm<SelectionValues>({ resolver: zodResolver(selectionSchema), defaultValues: defaults })

  const [audience, courseSlug, offeringId, intakeId] = useWatch({ control, name: ['audience', 'courseSlug', 'offeringId', 'intakeId'] })

  const audiences = useMemo(
    () => (['domestic', 'international'] as Audience[]).filter((a) => options.some((c) => c.offerings.some((o) => o.audience === a))),
    [options],
  )
  const courses = options.filter((c) => c.offerings.some((o) => o.audience === audience))
  const course = courses.find((c) => c.slug === courseSlug)
  const offerings = course?.offerings.filter((o) => o.audience === audience) ?? []
  const offering = offerings.find((o) => o.id === offeringId)
  const intakes = offering?.intakes ?? []
  const intake = intakes.find((i) => i.id === intakeId)

  const resetFrom = (field: 'courseSlug' | 'offeringId' | 'intakeId') => {
    const order = ['courseSlug', 'offeringId', 'intakeId'] as const
    order.slice(order.indexOf(field)).forEach((name) => setValue(name, ''))
  }

  const audienceField = register('audience', {
    onChange: (event: { target: { value: string } }) => {
      const next = event.target.value
      const current = options.find((c) => c.slug === getValues('courseSlug'))
      if (!current?.offerings.some((o) => o.audience === next)) resetFrom('courseSlug')
      else {
        resetFrom('offeringId')
        const matching = current.offerings.filter((o) => o.audience === next)
        if (matching.length === 1) setValue('offeringId', matching[0].id)
      }
    },
  })
  const courseField = register('courseSlug', {
    onChange: (event: { target: { value: string } }) => {
      resetFrom('offeringId')
      const matching = options.find((c) => c.slug === event.target.value)?.offerings.filter((o) => o.audience === getValues('audience')) ?? []
      if (matching.length === 1) setValue('offeringId', matching[0].id)
    },
  })
  const offeringField = register('offeringId', { onChange: () => resetFrom('intakeId') })

  const errorItems = submitCount > 0 ? fieldErrorItems(errors, SELECTION_ORDER) : []
  const describe = (name: keyof SelectionValues) => (errors[name] ? `${uid}-${name}-error` : undefined)

  return (
    <StepFrame
      index={nav.index}
      focusHeading={nav.focusHeading}
      intro="Only courses, campuses and intakes that are currently accepting applications are shown. You can change your choice before you submit."
    >
      <form noValidate onSubmit={handleSubmit((values) => onSave(selectionFromForm(values)))}>
        {conflict && (
          <Callout tone="warning" role="alert" title="Please choose another intake" className="mb-8">
            {conflict} Your other answers and documents are still saved.
          </Callout>
        )}
        {savedIntakeUnavailable && !conflict && (
          <Callout tone="warning" title="Your earlier intake is no longer available" className="mb-8">
            The intake you chose before has closed or filled. Please choose another intake to continue.
          </Callout>
        )}
        <ErrorSummary items={errorItems} onSelect={(key) => setFocus(key as keyof SelectionValues)} className="mb-8" />

        <Fieldset legend="Which describes you?" description="Fees, entry requirements and available intakes can differ for domestic and international students.">
          <div className="grid gap-3 sm:grid-cols-2">
            {audiences.map((a) => (
              <RadioCard
                key={a}
                value={a}
                label={AUDIENCE_LONG_LABELS[a]}
                description={AUDIENCE_META[a].description}
                icon={AUDIENCE_META[a].icon}
                aria-invalid={errors.audience ? true : undefined}
                aria-describedby={describe('audience')}
                {...audienceField}
              />
            ))}
          </div>
          <FieldError id={describe('audience')} message={errors.audience?.message} />
        </Fieldset>

        <Reveal show={Boolean(audience)}>
          <Field
            label="Course"
            required
            hint={
              <>
                Not sure yet? <AppLink href="/courses" className="font-medium text-primary-ink underline underline-offset-4">Compare courses</AppLink> first.
              </>
            }
            error={errors.courseSlug?.message}
          >
            {(control) => (
              <Select {...control} {...courseField}>
                <option value="">Choose a course</option>
                {courses.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                    {c.code ? ` (${c.code})` : ''} — {c.level}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </Reveal>

        <Reveal show={Boolean(course)}>
          <Fieldset legend="Campus and study mode">
            <div className="grid gap-3 sm:grid-cols-2">
              {offerings.map((o) => (
                <RadioCard
                  key={o.id}
                  value={o.id}
                  label={o.campus.name}
                  description={MODE_LABELS[o.deliveryMode]}
                  icon={o.deliveryMode === 'on-campus' ? <MapPin aria-hidden className="size-5" /> : <Layers aria-hidden className="size-5" />}
                  aria-invalid={errors.offeringId ? true : undefined}
                  aria-describedby={describe('offeringId')}
                  {...offeringField}
                />
              ))}
            </div>
            <FieldError id={describe('offeringId')} message={errors.offeringId?.message} />
          </Fieldset>
        </Reveal>

        <Reveal show={Boolean(offering)}>
          <Fieldset legend="Intake" description="Dates are in the campus’s local time. Apply before the deadline shown.">
            <div className="grid gap-3 sm:grid-cols-2">
              {intakes.map((i) => (
                <RadioCard
                  key={i.id}
                  value={i.id}
                  icon={<CalendarClock aria-hidden className="size-5" />}
                  label={
                    <span className="flex flex-wrap items-center gap-2">
                      Starts {formatDate(i.startDate)}
                      <IntakeStatusBadge status={i.status} />
                    </span>
                  }
                  description={`Apply by ${formatDate(i.applicationDeadline, 'medium')} · deadline ${relativeDays(i.applicationDeadline)}`}
                  aria-invalid={errors.intakeId ? true : undefined}
                  aria-describedby={describe('intakeId')}
                  {...register('intakeId')}
                />
              ))}
            </div>
            <FieldError id={describe('intakeId')} message={errors.intakeId?.message} />
          </Fieldset>
        </Reveal>

        <Reveal show={Boolean(offering)}>
          {offering && (
            <section aria-labelledby={`${uid}-fee`} className="rounded-2xl border border-line bg-surface-muted/60 p-5 sm:p-6">
              <h3 id={`${uid}-fee`} className="text-sm font-semibold text-ink">
                Tuition for this option
              </h3>
              <div className="mt-2">
                <FeeAmount fee={offering.fee?.tuition ?? null} size="lg" />
              </div>
              {offering.fee && (
                <>
                  {offering.fee.additional.length > 0 && (
                    <ul className="mt-4 space-y-1 text-sm text-ink-muted">
                      {offering.fee.additional.map((item) => (
                        <li key={item.label}>
                          {item.label}: {formatMoney(item.amount, item.currency)}
                          {item.basis ? ` ${FEE_BASIS_LABELS[item.basis]}` : ''}
                          {item.note ? ` — ${item.note}` : ''}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-4 text-sm text-ink-subtle">
                    Current approved fee for {AUDIENCE_LONG_LABELS[offering.audience].toLowerCase()}, valid from {formatDate(offering.fee.validFrom, 'medium')}
                    {offering.fee.validTo ? ` to ${formatDate(offering.fee.validTo, 'medium')}` : ''}. The fee shown is recorded with your application.
                    {offering.fee.paymentNotes ? ` ${offering.fee.paymentNotes}` : ''}
                  </p>
                </>
              )}
              {intake && (
                <p className="mt-4 border-t border-line pt-4 text-sm text-ink-muted">
                  You are applying for <strong className="font-semibold text-ink">{course?.title}</strong> at {offering.campus.name} (
                  {MODE_LABELS[offering.deliveryMode].toLowerCase()}), starting {formatDate(intake.startDate)}.
                </p>
              )}
            </section>
          )}
        </Reveal>

        <StepFooter
          saving={nav.saving}
          note="Saving creates a secure draft. Applying is a request for admissions review — it is not an offer, enrolment or payment obligation."
        />
      </form>
    </StepFrame>
  )
}

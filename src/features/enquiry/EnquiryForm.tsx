import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { BookOpen, Globe, House, MessageSquarePlus, Send, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '@/api/client'
import { errorMessage, isApiError } from '@/api/errors'
import { queries } from '@/api/queries'
import type { Audience, EnquiryInput, EnquiryReceipt, EnquiryTopic } from '@/api/types'
import { AppLink } from '@/components/ui/AppLink'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Callout } from '@/components/ui/feedback'
import { Checkbox, Field, FieldError, Fieldset, Input, RadioCard, Select, Textarea } from '@/components/ui/form'
import { ENQUIRY_TOPIC_LABELS } from '@/components/shared/labels'
import { AnimatedCheck } from '@/components/motion/effects'
import { cn } from '@/lib/cn'
import { uuid } from '@/lib/ids'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { ErrorSummary } from './ErrorSummary'
import { fieldErrorItems } from './formErrors'

export type EnquiryVariant = 'general' | 'agent'

export interface EnquiryContext {
  topic?: string | null
  course?: string | null
  campus?: string | null
  audience?: string | null
}

const AUDIENCE_CHOICES = [
  { value: 'domestic', label: 'Domestic student', description: 'Studying in my home country', icon: House },
  { value: 'international', label: 'International student', description: 'Coming from overseas', icon: Globe },
  { value: 'unsure', label: 'Not sure yet', description: 'Help me work it out', icon: Sparkles },
] as const

const AUDIENCE_VALUES: string[] = AUDIENCE_CHOICES.map((a) => a.value)
const TOPICS = Object.keys(ENQUIRY_TOPIC_LABELS) as EnquiryTopic[]
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?[\d\s().-]{6,24}$/
const WEBSITE = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#]\S*)?$/i

function makeSchema(variant: EnquiryVariant) {
  const agent = variant === 'agent'
  return z.object({
    organisation: z
      .string()
      .trim()
      .max(160, 'Keep the organisation name under 160 characters.')
      .refine((v) => !agent || v.length > 0, 'Enter your organisation’s name.'),
    fullName: z
      .string()
      .trim()
      .min(1, agent ? 'Enter the name of the main contact person.' : 'Enter your full name.')
      .max(120, 'Keep the name under 120 characters.'),
    email: z
      .string()
      .trim()
      .min(1, 'Enter your email address.')
      .max(200, 'Keep the email address under 200 characters.')
      .refine((v) => EMAIL.test(v), 'Enter a valid email address, like name@example.com.'),
    phone: z
      .string()
      .trim()
      .max(40, 'Keep the phone number under 40 characters.')
      .refine((v) => !v || PHONE.test(v), 'Enter a valid phone number (digits, spaces and + only), or leave it blank.'),
    country: z
      .string()
      .trim()
      .max(80, 'Keep the country under 80 characters.')
      .refine((v) => !agent || v.length > 0, 'Enter the country your organisation is based in.'),
    organisationWebsite: z
      .string()
      .trim()
      .max(200, 'Keep the website address under 200 characters.')
      .refine((v) => !v || WEBSITE.test(v), 'Enter a valid website address, like example.com.'),
    audience: z.string().refine((v) => agent || AUDIENCE_VALUES.includes(v), 'Tell us which best describes you.'),
    topic: z.string().refine((v) => agent || TOPICS.includes(v as EnquiryTopic), 'Choose what your enquiry is about.'),
    courseSlug: z.string(),
    campusSlug: z.string(),
    message: z
      .string()
      .trim()
      .min(10, 'Tell us a little more (at least 10 characters).')
      .max(3000, 'Keep your message under 3,000 characters.'),
    privacyAccepted: z.boolean().refine((v) => v, 'Please confirm you have read the privacy notice.'),
    marketingOptIn: z.boolean(),
    /** Honeypot — hidden from people and assistive technology; bots tend to fill it in. */
    trap: z.string(),
  })
}

type Schema = ReturnType<typeof makeSchema>
type Values = z.input<Schema>
type Output = z.output<Schema>

const ORDER: Record<EnquiryVariant, (keyof Values)[]> = {
  general: ['fullName', 'email', 'phone', 'country', 'audience', 'topic', 'courseSlug', 'campusSlug', 'message', 'privacyAccepted'],
  agent: ['organisation', 'fullName', 'email', 'country', 'phone', 'organisationWebsite', 'message', 'privacyAccepted'],
}

/** Server field names (EnquiryInput) → form field names. */
const SERVER_FIELDS: Record<string, keyof Values> = {
  fullName: 'fullName',
  email: 'email',
  phone: 'phone',
  country: 'country',
  audience: 'audience',
  topic: 'topic',
  courseSlug: 'courseSlug',
  campusSlug: 'campusSlug',
  organisation: 'organisation',
  message: 'message',
  privacyAccepted: 'privacyAccepted',
}

function defaultsFor(variant: EnquiryVariant, context: EnquiryContext): Values {
  const topic = context.topic && TOPICS.includes(context.topic as EnquiryTopic) ? context.topic : context.course ? 'course' : ''
  return {
    organisation: '',
    fullName: '',
    email: '',
    phone: '',
    country: '',
    organisationWebsite: '',
    audience: context.audience && AUDIENCE_VALUES.includes(context.audience) ? context.audience : '',
    topic: variant === 'agent' ? 'agent' : topic,
    courseSlug: context.course ?? '',
    campusSlug: context.campus ?? '',
    message: '',
    privacyAccepted: false,
    marketingOptIn: false,
    trap: '',
  }
}

function toInput(variant: EnquiryVariant, v: Output): EnquiryInput {
  const agent = variant === 'agent'
  const message = agent && v.organisationWebsite ? `${v.message}\n\nOrganisation website: ${v.organisationWebsite}` : v.message
  return {
    fullName: v.fullName,
    email: v.email,
    phone: v.phone || undefined,
    country: v.country || undefined,
    audience: agent ? undefined : (v.audience as Audience | 'unsure'),
    topic: agent ? 'agent' : (v.topic as EnquiryTopic),
    courseSlug: agent ? undefined : v.courseSlug || undefined,
    campusSlug: agent ? undefined : v.campusSlug || undefined,
    organisation: agent ? v.organisation : undefined,
    message,
    privacyAccepted: v.privacyAccepted,
    marketingOptIn: v.marketingOptIn,
    website: v.trap || undefined,
  }
}

/**
 * Enquiry form shared by the enquiry page, the CMS enquiry module and the agent enquiry module
 * (spec §5.26, §7). Validates client-side, maps server field errors, submits once per idempotency
 * key and replaces itself with a confirmation showing the stored reference.
 */
export function EnquiryForm({
  variant = 'general',
  context = {},
  headingLevel = 'h2',
  className,
}: {
  variant?: EnquiryVariant
  /** Pre-selected topic/course/campus/audience (e.g. from the URL or a CMS module prop). */
  context?: EnquiryContext
  /** Heading level for the success panel. */
  headingLevel?: 'h2' | 'h3'
  className?: string
}) {
  const [receipt, setReceipt] = useState<EnquiryReceipt | null>(null)
  const [formKey, setFormKey] = useState(0)

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {receipt ? (
          <EnquirySuccess
            key="success"
            receipt={receipt}
            variant={variant}
            headingLevel={headingLevel}
            onReset={() => {
              setReceipt(null)
              setFormKey((k) => k + 1)
            }}
          />
        ) : (
          <motion.div
            key={`form-${formKey}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
          >
            <EnquiryFormFields variant={variant} context={context} onSuccess={setReceipt} focusOnMount={formKey > 0} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EnquiryFormFields({
  variant,
  context,
  onSuccess,
  focusOnMount,
}: {
  variant: EnquiryVariant
  context: EnquiryContext
  onSuccess: (receipt: EnquiryReceipt) => void
  focusOnMount: boolean
}) {
  const agent = variant === 'agent'
  const uid = useId()
  // One idempotency key per form session: retries of the same submission reuse it, so a
  // double-click or a network retry can never store the enquiry twice.
  const idempotencyKey = useRef(uuid())
  const summaryRef = useRef<HTMLDivElement>(null)
  const [schema] = useState(() => makeSchema(variant))
  const [defaults] = useState(() => defaultsFor(variant, context))

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    setValue,
    getValues,
    formState: { errors, submitCount },
  } = useForm<Values, unknown, Output>({ resolver: zodResolver(schema), defaultValues: defaults, mode: 'onTouched' })

  const { data: courses } = useQuery({ ...queries.courses({ pageSize: 48, sort: 'title' }), enabled: !agent })
  const { data: campuses } = useQuery({ ...queries.campuses(), enabled: !agent })

  // Pre-selected course/campus arrive before their <option>s exist; re-apply once options load
  // and drop values that do not match a published record.
  useEffect(() => {
    if (!courses) return
    const current = getValues('courseSlug')
    setValue('courseSlug', current && courses.items.some((c) => c.slug === current) ? current : '')
  }, [courses, getValues, setValue])
  useEffect(() => {
    if (!campuses) return
    const current = getValues('campusSlug')
    setValue('campusSlug', current && campuses.some((c) => c.slug === current) ? current : '')
  }, [campuses, getValues, setValue])

  useEffect(() => {
    if (focusOnMount) setFocus(agent ? 'organisation' : 'fullName')
  }, [focusOnMount, setFocus, agent])

  const mutation = useMutation({
    mutationFn: (input: EnquiryInput) => api.createEnquiry(input, { idempotencyKey: idempotencyKey.current }),
    onSuccess: (result) => {
      idempotencyKey.current = uuid()
      onSuccess(result)
    },
    onError: (error) => {
      if (!isApiError(error) || !error.fieldErrors) return
      const mapped = Object.entries(error.fieldErrors)
        .map(([key, message]) => [SERVER_FIELDS[key], message] as const)
        .filter((entry): entry is readonly [keyof Values, string] => Boolean(entry[0]))
      mapped.forEach(([name, message]) => setError(name, { type: 'server', message }))
      const first = ORDER[variant].find((name) => mapped.some(([key]) => key === name))
      if (first) setFocus(first)
    },
  })

  const onValid = (values: Output) => {
    if (mutation.isPending) return
    mutation.mutate(toInput(variant, values))
  }

  const errorItems = submitCount > 0 ? fieldErrorItems(errors, ORDER[variant]) : []
  const serverMessage = mutation.isError && !(isApiError(mutation.error) && mutation.error.fieldErrors) ? errorMessage(mutation.error) : null
  const privacyErrorId = `${uid}-privacy-error`
  const audienceErrorId = `${uid}-audience-error`
  const pending = mutation.isPending

  return (
    <form noValidate onSubmit={handleSubmit(onValid)} aria-busy={pending || undefined}>
      <p className="mb-6 text-sm text-ink-subtle">
        Fields marked <span className="text-danger">*</span> are required.
      </p>

      <ErrorSummary ref={summaryRef} items={errorItems} onSelect={(key) => setFocus(key as keyof Values)} className="mb-8" />

      {serverMessage && (
        <Callout tone="danger" role="alert" title="Your enquiry has not been sent yet" className="mb-8">
          {serverMessage} Your answers are still here — please try again.
        </Callout>
      )}

      <fieldset disabled={pending} className="min-w-0 space-y-6">
        <legend className="sr-only">{agent ? 'Agent enquiry details' : 'Enquiry details'}</legend>

        {agent && (
          <Field label="Organisation" required error={errors.organisation?.message}>
            {(control) => <Input {...control} {...register('organisation')} autoComplete="organization" />}
          </Field>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label={agent ? 'Contact name' : 'Full name'} required error={errors.fullName?.message}>
            {(control) => <Input {...control} {...register('fullName')} autoComplete="name" />}
          </Field>
          <Field label="Email" required error={errors.email?.message}>
            {(control) => <Input {...control} {...register('email')} type="email" inputMode="email" autoComplete="email" spellCheck={false} />}
          </Field>
          {agent ? (
            <>
              <Field label="Country" required hint="Where your organisation is based." error={errors.country?.message}>
                {(control) => <Input {...control} {...register('country')} autoComplete="country-name" />}
              </Field>
              <Field label="Phone" optional hint="Include the country code." error={errors.phone?.message}>
                {(control) => <Input {...control} {...register('phone')} type="tel" autoComplete="tel" />}
              </Field>
              <Field label="Website" optional className="sm:col-span-2" error={errors.organisationWebsite?.message}>
                {(control) => <Input {...control} {...register('organisationWebsite')} type="url" inputMode="url" autoComplete="url" placeholder="example.com" />}
              </Field>
            </>
          ) : (
            <>
              <Field label="Phone" optional hint="Include the country code if you are outside our country." error={errors.phone?.message}>
                {(control) => <Input {...control} {...register('phone')} type="tel" autoComplete="tel" />}
              </Field>
              <Field label="Country of residence" optional error={errors.country?.message}>
                {(control) => <Input {...control} {...register('country')} autoComplete="country-name" />}
              </Field>
            </>
          )}
        </div>

        {!agent && (
          <>
            <Fieldset legend={<>I am a… <span aria-hidden className="text-danger">*</span></>}>
              <div className="grid gap-3 sm:grid-cols-3">
                {AUDIENCE_CHOICES.map((choice) => (
                  <RadioCard
                    key={choice.value}
                    value={choice.value}
                    label={choice.label}
                    description={choice.description}
                    icon={<choice.icon aria-hidden className="size-5" />}
                    aria-invalid={errors.audience ? true : undefined}
                    aria-describedby={errors.audience ? audienceErrorId : undefined}
                    {...register('audience')}
                  />
                ))}
              </div>
              <FieldError id={audienceErrorId} message={errors.audience?.message} />
            </Fieldset>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="What is your enquiry about?" required className="sm:col-span-2" error={errors.topic?.message}>
                {(control) => (
                  <Select {...control} {...register('topic')}>
                    <option value="">Choose a topic</option>
                    {TOPICS.map((topic) => (
                      <option key={topic} value={topic}>
                        {ENQUIRY_TOPIC_LABELS[topic]}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label="Course" optional error={errors.courseSlug?.message}>
                {(control) => (
                  <Select {...control} {...register('courseSlug')}>
                    <option value="">{courses ? 'No specific course' : 'Loading courses…'}</option>
                    {courses?.items.map((course) => (
                      <option key={course.slug} value={course.slug}>
                        {course.title}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label="Campus" optional error={errors.campusSlug?.message}>
                {(control) => (
                  <Select {...control} {...register('campusSlug')}>
                    <option value="">{campuses ? 'No preference' : 'Loading campuses…'}</option>
                    {campuses?.map((campus) => (
                      <option key={campus.slug} value={campus.slug}>
                        {campus.name}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            </div>
          </>
        )}

        <Field
          label={agent ? 'About your organisation' : 'Your message'}
          required
          hint={
            agent
              ? 'Tell us the countries you recruit from, your experience and any current institutional partners.'
              : 'Please do not include sensitive information such as passport numbers, health details or payment card details.'
          }
          error={errors.message?.message}
        >
          {(control) => <Textarea {...control} {...register('message')} rows={6} />}
        </Field>

        {/* Honeypot: hidden from sighted users and assistive technology. */}
        <div aria-hidden className="absolute -left-[10000px] top-auto size-px overflow-hidden">
          <label htmlFor={`${uid}-trap`}>Leave this field empty</label>
          <input id={`${uid}-trap`} type="text" tabIndex={-1} autoComplete="off" {...register('trap')} />
        </div>

        <div className="space-y-4 rounded-2xl border border-line bg-surface-muted/60 p-5">
          <div>
            <Checkbox
              {...register('privacyAccepted')}
              aria-invalid={errors.privacyAccepted ? true : undefined}
              aria-describedby={errors.privacyAccepted ? privacyErrorId : undefined}
              aria-required
              label={
                <>
                  I have read the{' '}
                  <AppLink href="/privacy" className="relative z-10 font-semibold text-primary-ink underline underline-offset-4">
                    privacy notice
                  </AppLink>{' '}
                  and agree to my details being used to respond to this enquiry.{' '}
                  <span aria-hidden className="text-danger">
                    *
                  </span>
                </>
              }
            />
            <div className="pl-8">
              <FieldError id={privacyErrorId} message={errors.privacyAccepted?.message} />
            </div>
          </div>
          <Checkbox
            {...register('marketingOptIn')}
            label="Send me occasional news about courses, intakes and events."
            description="Optional. You can unsubscribe at any time — it does not affect how we handle your enquiry."
          />
        </div>

        {agent && (
          <p className="text-sm text-ink-muted">
            Sending this enquiry does not create an agent agreement or an approved listing. Our international office will review it and contact you
            about next steps.
          </p>
        )}

        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-subtle">This form is not monitored for emergencies.</p>
          <Button type="submit" size="lg" loading={pending} icon={pending ? undefined : <Send aria-hidden className="size-4" />}>
            {pending ? 'Sending…' : agent ? 'Send agent enquiry' : 'Send enquiry'}
          </Button>
        </div>
      </fieldset>
    </form>
  )
}

function EnquirySuccess({
  receipt,
  variant,
  headingLevel: Heading,
  onReset,
}: {
  receipt: EnquiryReceipt
  variant: EnquiryVariant
  headingLevel: 'h2' | 'h3'
  onReset: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    headingRef.current?.focus()
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      className="py-6 text-center sm:py-10"
    >
      <span className="mx-auto grid size-20 place-items-center rounded-full bg-success-soft text-success">
        <AnimatedCheck className="size-14" />
      </span>
      <Heading ref={headingRef} tabIndex={-1} className="mt-6 font-display text-2xl font-semibold text-ink focus:outline-none sm:text-3xl">
        Enquiry received
      </Heading>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">
        Thank you. Your enquiry <strong className="font-mono font-semibold tracking-wide text-ink">{receipt.reference}</strong> has been received. Our
        team will contact you using the details provided.
      </p>
      {variant === 'agent' && (
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-subtle">
          This enquiry is not an agent agreement and does not add you to our list of approved agents.
        </p>
      )}
      <div className={cn('mt-8 flex flex-wrap justify-center gap-3')}>
        <Button variant="secondary" onClick={onReset} icon={<MessageSquarePlus aria-hidden className="size-4" />}>
          Make another enquiry
        </Button>
        <ButtonLink href="/courses" icon={<BookOpen aria-hidden className="size-4" />}>
          Browse courses
        </ButtonLink>
      </div>
    </motion.div>
  )
}

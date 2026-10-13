import { zodResolver } from '@hookform/resolvers/zod'
import { Handshake, LifeBuoy, ShieldCheck, UserRound, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useState, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import type { ApplicationAgent, ApplicationBackground, ApplicationPersonal, ApplicationSupport } from '@/api/types'
import { AppLink } from '@/components/ui/AppLink'
import { Callout } from '@/components/ui/feedback'
import { Checkbox, Field, FieldError, Fieldset, Input, RadioCard, Textarea } from '@/components/ui/form'
import { ErrorSummary } from '@/features/enquiry/ErrorSummary'
import { fieldErrorItems } from '@/features/enquiry/formErrors'
import { EASE_OUT_EXPO } from '@/lib/motion'
import {
  AGENT_ORDER,
  agentFromForm,
  agentSchema,
  agentToForm,
  BACKGROUND_ORDER,
  backgroundFromForm,
  backgroundSchema,
  backgroundToForm,
  PERSONAL_ORDER,
  personalFromForm,
  personalSchema,
  personalToForm,
  SUPPORT_ORDER,
  supportFromForm,
  supportSchema,
  supportToForm,
  type AgentValues,
  type BackgroundValues,
  type PersonalValues,
  type SupportValues,
} from './schema'
import { StepFooter, StepFrame, type StepNavProps } from './StepFrame'

function Expand({ show, children }: { show: boolean; children: ReactNode }) {
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
          <div className="pt-6">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------------------------------------ */

export function DetailsStep({
  saved,
  remembered,
  onSave,
  ...nav
}: StepNavProps & { saved?: ApplicationPersonal; remembered?: PersonalValues; onSave: (personal: ApplicationPersonal) => void }) {
  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    formState: { errors, submitCount },
  } = useForm<PersonalValues>({ resolver: zodResolver(personalSchema), defaultValues: remembered ?? personalToForm(saved) })
  const [today] = useState(() => new Date().toISOString().slice(0, 10))
  const errorItems = submitCount > 0 ? fieldErrorItems(errors, PERSONAL_ORDER) : []

  return (
    <StepFrame index={nav.index} focusHeading={nav.focusHeading} intro="Use your legal name exactly as it appears on your passport or other identity document. We use these details to contact you about your application.">
      <form noValidate onSubmit={handleSubmit((values) => onSave(personalFromForm(values)))}>
        <ErrorSummary items={errorItems} onSelect={(key) => setFocus(key as keyof PersonalValues)} className="mb-8" />
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Given names" required error={errors.givenNames?.message}>
            {(c) => <Input {...c} {...register('givenNames')} autoComplete="given-name" />}
          </Field>
          <Field label="Family name" required error={errors.familyName?.message}>
            {(c) => <Input {...c} {...register('familyName')} autoComplete="family-name" />}
          </Field>
          <Field label="Preferred name" optional hint="What you would like us to call you." className="sm:col-span-2" error={errors.preferredName?.message}>
            {(c) => <Input {...c} {...register('preferredName')} autoComplete="nickname" />}
          </Field>
          <Field label="Email" required hint="We will send your acknowledgement and updates here." error={errors.email?.message}>
            {(c) => <Input {...c} {...register('email')} type="email" inputMode="email" autoComplete="email" spellCheck={false} />}
          </Field>
          <Field label="Phone" required hint="Include the country code, e.g. +44 20 7946 0000." error={errors.phone?.message}>
            {(c) => <Input {...c} {...register('phone')} type="tel" autoComplete="tel" placeholder="+" />}
          </Field>
          <Field
            label="Date of birth"
            optional
            hint="Only if requested by admissions for your course — otherwise leave blank."
            error={errors.dateOfBirth?.message}
          >
            {(c) => <Input {...c} {...register('dateOfBirth')} type="date" autoComplete="bday" max={today} />}
          </Field>
          <div className="hidden sm:block" aria-hidden />
          <Field label="Country of citizenship" required error={errors.citizenship?.message}>
            {(c) => <Input {...c} {...register('citizenship')} autoComplete="country-name" />}
          </Field>
          <Field label="Country where you live now" required error={errors.residency?.message}>
            {(c) => <Input {...c} {...register('residency')} autoComplete="country-name" />}
          </Field>
          <Field label="Postal address" optional hint="Only needed if admissions has asked for it." className="sm:col-span-2" error={errors.address?.message}>
            {(c) => <Textarea {...c} {...register('address')} rows={3} autoComplete="street-address" className="min-h-24" />}
          </Field>
        </div>
        <StepFooter saving={nav.saving} onBack={nav.onBack && (() => nav.onBack?.(getValues()))} />
      </form>
    </StepFrame>
  )
}

/* ------------------------------------------------------------------------------------------------ */

export function BackgroundStep({
  saved,
  remembered,
  onSave,
  ...nav
}: StepNavProps & { saved?: ApplicationBackground; remembered?: BackgroundValues; onSave: (background: ApplicationBackground) => void }) {
  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    formState: { errors, submitCount },
  } = useForm<BackgroundValues>({ resolver: zodResolver(backgroundSchema), defaultValues: remembered ?? backgroundToForm(saved) })
  const errorItems = submitCount > 0 ? fieldErrorItems(errors, BACKGROUND_ORDER) : []

  return (
    <StepFrame
      index={nav.index}
      focusHeading={nav.focusHeading}
      intro="Tell us about your highest completed qualification (or the one you are studying now). Admissions staff review every application individually."
    >
      <form noValidate onSubmit={handleSubmit((values) => onSave(backgroundFromForm(values)))}>
        <ErrorSummary items={errorItems} onSelect={(key) => setFocus(key as keyof BackgroundValues)} className="mb-8" />
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Highest qualification" required hint="For example: secondary school certificate, diploma or bachelor’s degree." className="sm:col-span-2" error={errors.highestQualification?.message}>
            {(c) => <Input {...c} {...register('highestQualification')} />}
          </Field>
          <Field label="School, college or university" required error={errors.institution?.message}>
            {(c) => <Input {...c} {...register('institution')} autoComplete="organization" />}
          </Field>
          <Field label="Year completed" required hint="Or the year you expect to finish." error={errors.completionYear?.message}>
            {(c) => <Input {...c} {...register('completionYear')} inputMode="numeric" maxLength={4} placeholder="YYYY" className="sm:max-w-40" />}
          </Field>
          <Field label="Relevant work or other experience" optional className="sm:col-span-2" error={errors.experience?.message}>
            {(c) => <Textarea {...c} {...register('experience')} rows={4} />}
          </Field>
          <Field
            label="English language evidence"
            optional
            hint="If your course requires it — for example a test name and result. Leave blank if you are not sure; admissions will advise you."
            className="sm:col-span-2"
            error={errors.languageEvidence?.message}
          >
            {(c) => <Input {...c} {...register('languageEvidence')} />}
          </Field>
        </div>
        <StepFooter saving={nav.saving} onBack={() => nav.onBack?.(getValues())} />
      </form>
    </StepFrame>
  )
}

/* ------------------------------------------------------------------------------------------------ */

export function AgentStep({
  saved,
  remembered,
  onSave,
  ...nav
}: StepNavProps & { saved?: ApplicationAgent; remembered?: AgentValues; onSave: (agent: ApplicationAgent) => void }) {
  const uid = useId()
  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    control,
    formState: { errors, submitCount },
  } = useForm<AgentValues>({ resolver: zodResolver(agentSchema), defaultValues: remembered ?? agentToForm(saved) })
  const viaAgent = useWatch({ control, name: 'viaAgent' })
  const errorItems = submitCount > 0 ? fieldErrorItems(errors, AGENT_ORDER) : []

  return (
    <StepFrame
      index={nav.index}
      focusHeading={nav.focusHeading}
      intro={
        <>
          You do not need an agent to apply. If an education agent is helping you, tell us so we can include them in updates. Check that they appear
          in our <AppLink href="/international/agents" className="font-medium text-primary-ink underline underline-offset-4">list of approved agents</AppLink>.
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit((values) => onSave(agentFromForm(values)))}>
        <ErrorSummary items={errorItems} onSelect={(key) => setFocus(key as keyof AgentValues)} className="mb-8" />
        <Fieldset legend="How are you applying?">
          <div className="grid gap-3 sm:grid-cols-2">
            <RadioCard
              value="direct"
              label="Directly"
              description="I am applying myself"
              icon={<UserRound aria-hidden className="size-5" />}
              aria-invalid={errors.viaAgent ? true : undefined}
              aria-describedby={errors.viaAgent ? `${uid}-via-error` : undefined}
              {...register('viaAgent')}
            />
            <RadioCard
              value="agent"
              label="Through an agent"
              description="An education agent is helping me"
              icon={<Handshake aria-hidden className="size-5" />}
              aria-invalid={errors.viaAgent ? true : undefined}
              aria-describedby={errors.viaAgent ? `${uid}-via-error` : undefined}
              {...register('viaAgent')}
            />
          </div>
          <FieldError id={`${uid}-via-error`} message={errors.viaAgent?.message} />
        </Fieldset>

        <Expand show={viaAgent === 'agent'}>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Agent or agency name" required error={errors.agentName?.message}>
              {(c) => <Input {...c} {...register('agentName')} autoComplete="off" />}
            </Field>
            <Field label="Agent reference" optional hint="If your agent gave you one." error={errors.agentReference?.message}>
              {(c) => <Input {...c} {...register('agentReference')} autoComplete="off" />}
            </Field>
          </div>
          <div className="mt-6 rounded-2xl border border-line bg-surface-muted/60 p-5">
            <Checkbox
              {...register('agentConsent')}
              aria-invalid={errors.agentConsent ? true : undefined}
              aria-describedby={errors.agentConsent ? `${uid}-consent-error` : undefined}
              label="I agree that admissions may discuss my application with this agent and send them updates about it."
              description="You can withdraw this consent at any time by contacting admissions."
            />
            <div className="pl-8">
              <FieldError id={`${uid}-consent-error`} message={errors.agentConsent?.message} />
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-subtle">Agents may charge their own fees, separate from ours. Only our admissions team can make admissions decisions.</p>
        </Expand>

        <StepFooter saving={nav.saving} onBack={() => nav.onBack?.(getValues())} />
      </form>
    </StepFrame>
  )
}

/* ------------------------------------------------------------------------------------------------ */

export function SupportStep({
  saved,
  remembered,
  onSave,
  ...nav
}: StepNavProps & { saved?: ApplicationSupport; remembered?: SupportValues; onSave: (support: ApplicationSupport) => void }) {
  const uid = useId()
  const [defaults] = useState(() => remembered ?? supportToForm(saved))
  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    control,
    formState: { errors, submitCount },
  } = useForm<SupportValues>({ resolver: zodResolver(supportSchema), defaultValues: defaults })
  const requested = useWatch({ control, name: 'requested' })
  const errorItems = submitCount > 0 ? fieldErrorItems(errors, SUPPORT_ORDER) : []

  return (
    <StepFrame
      index={nav.index}
      focusHeading={nav.focusHeading}
      intro="If you have a disability, health condition or other circumstance that may affect your study, you can ask us to contact you about support. This step is optional."
    >
      <form noValidate onSubmit={handleSubmit((values) => onSave(supportFromForm(values)))}>
        <ErrorSummary items={errorItems} onSelect={(key) => setFocus(key as keyof SupportValues)} className="mb-8" />
        <Fieldset legend="Would you like us to contact you about support?">
          <div className="grid gap-3 sm:grid-cols-2">
            <RadioCard
              value="no"
              label="No, not right now"
              description="You can ask for support at any time"
              icon={<X aria-hidden className="size-5" />}
              aria-invalid={errors.requested ? true : undefined}
              aria-describedby={errors.requested ? `${uid}-requested-error` : undefined}
              {...register('requested')}
            />
            <RadioCard
              value="yes"
              label="Yes, please contact me"
              description="Tell us briefly what would help"
              icon={<LifeBuoy aria-hidden className="size-5" />}
              aria-invalid={errors.requested ? true : undefined}
              aria-describedby={errors.requested ? `${uid}-requested-error` : undefined}
              {...register('requested')}
            />
          </div>
          <FieldError id={`${uid}-requested-error`} message={errors.requested?.message} />
        </Fieldset>

        <Expand show={requested === 'yes'}>
          <Field
            label="What support would help?"
            required
            hint="Keep it brief — for example “extra time in assessments” or “wheelchair access”. You do not need to share a diagnosis or medical records."
            error={errors.details?.message}
          >
            {(c) => <Textarea {...c} {...register('details')} rows={4} />}
          </Field>
        </Expand>

        <Callout tone="info" title="Who sees this" className="mt-8">
          Your request is shared only with the admissions staff handling your application and the student support team, so they can contact
          you about arrangements. It is kept private and is never published or shared with your agent.
        </Callout>
        <p className="mt-4 flex items-start gap-2 text-sm text-ink-subtle">
          <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
          Read more in our <AppLink href="/privacy" className="font-medium text-primary-ink underline underline-offset-4">privacy notice</AppLink>.
        </p>

        <StepFooter saving={nav.saving} onBack={() => nav.onBack?.(getValues())} />
      </form>
    </StepFrame>
  )
}

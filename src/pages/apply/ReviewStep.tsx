import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Send } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import type { ApplicationDeclarations, ApplicationDraft, CourseOption } from '@/api/types'
import { AppLink } from '@/components/ui/AppLink'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/feedback'
import { Checkbox, FieldError } from '@/components/ui/form'
import { AUDIENCE_LONG_LABELS, DOCUMENT_TYPE_LABELS, MODE_LABELS } from '@/components/shared/labels'
import { FeeAmount, IntakeStatusBadge } from '@/components/shared/status'
import { ErrorSummary } from '@/features/enquiry/ErrorSummary'
import { fieldErrorItems } from '@/features/enquiry/formErrors'
import { formatDate } from '@/lib/format'
import { DECLARATIONS_ORDER, declarationsSchema, DOCUMENTS_STEP, findSelection, STEPS, type DeclarationsValues } from './schema'
import { StepFooter, StepFrame, type StepNavProps } from './StepFrame'

function Summary({ step, onEdit, children }: { step: number; onEdit: (step: number) => void; children: ReactNode }) {
  const title = STEPS[step].title
  return (
    <section aria-labelledby={`review-${step}`} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 id={`review-${step}`} className="font-semibold text-ink">
          {title}
        </h3>
        <Button variant="ghost" size="sm" onClick={() => onEdit(step)} icon={<Pencil aria-hidden className="size-3.5" />}>
          Edit<span className="sr-only"> {title.toLowerCase()}</span>
        </Button>
      </div>
      <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">{children}</dl>
    </section>
  )
}

function Row({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <dt className="text-ink-subtle">{label}</dt>
      <dd className="mt-0.5 break-words font-medium text-ink">{children || <span className="font-normal text-ink-subtle">Not provided</span>}</dd>
    </div>
  )
}

export function ReviewStep({
  draft,
  options,
  submitting,
  submitError,
  onEdit,
  onSubmit,
  ...nav
}: StepNavProps & {
  draft: ApplicationDraft
  options: CourseOption[]
  submitting: boolean
  submitError: string | null
  onEdit: (step: number) => void
  onSubmit: (declarations: ApplicationDeclarations) => void
}) {
  const uid = useId()
  const { selection, personal, background, agent, support, declarations } = draft.data
  const { course, offering, intake } = findSelection(options, selection)
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, submitCount },
  } = useForm<DeclarationsValues>({
    resolver: zodResolver(declarationsSchema),
    defaultValues: { accuracy: declarations?.accuracy ?? false, privacy: declarations?.privacy ?? false, admissions: declarations?.admissions ?? false },
  })
  const errorItems = submitCount > 0 ? fieldErrorItems(errors, DECLARATIONS_ORDER) : []
  const errorId = (name: keyof DeclarationsValues) => (errors[name] ? `${uid}-${name}-error` : undefined)

  return (
    <StepFrame index={nav.index} focusHeading={nav.focusHeading} intro="Check your answers before you submit. Use “Edit” to change anything — your other answers stay saved.">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <ErrorSummary items={errorItems} onSelect={(key) => setFocus(key as keyof DeclarationsValues)} className="mb-8" />
        {submitError && (
          <Callout
            tone="danger"
            role="alert"
            title="Your application has not been submitted yet"
            className="mb-8"
            action={
              /upload/i.test(submitError) ? (
                <Button variant="link" onClick={() => onEdit(DOCUMENTS_STEP)}>
                  Go to documents
                </Button>
              ) : undefined
            }
          >
            {submitError} Your answers are saved — please try again.
          </Callout>
        )}

        <div className="space-y-4">
          <Summary step={0} onEdit={onEdit}>
            <Row label="Course" wide>
              {course ? `${course.title}${course.code ? ` (${course.code})` : ''} — ${course.level}` : null}
            </Row>
            <Row label="Student type">{selection ? AUDIENCE_LONG_LABELS[selection.audience] : null}</Row>
            <Row label="Campus and mode">{offering ? `${offering.campus.name} · ${MODE_LABELS[offering.deliveryMode]}` : null}</Row>
            <Row label="Intake">
              {intake ? (
                <span className="inline-flex flex-wrap items-center gap-2">
                  Starts {formatDate(intake.startDate)} <IntakeStatusBadge status={intake.status} />
                </span>
              ) : (
                <span className="text-danger">This intake is no longer available — please choose another.</span>
              )}
            </Row>
            <Row label="Application deadline">{intake ? formatDate(intake.applicationDeadline) : null}</Row>
            <Row label="Tuition shown to you" wide>
              {offering ? <FeeAmount fee={offering.fee?.tuition ?? null} size="sm" /> : null}
            </Row>
          </Summary>

          <Summary step={1} onEdit={onEdit}>
            <Row label="Legal name">{personal ? `${personal.givenNames} ${personal.familyName}` : null}</Row>
            <Row label="Preferred name">{personal?.preferredName}</Row>
            <Row label="Email">{personal?.email}</Row>
            <Row label="Phone">{personal?.phone}</Row>
            <Row label="Date of birth">{personal?.dateOfBirth ? formatDate(personal.dateOfBirth) : null}</Row>
            <Row label="Citizenship">{personal?.citizenship}</Row>
            <Row label="Country of residence">{personal?.residency}</Row>
            <Row label="Address">{personal?.address}</Row>
          </Summary>

          <Summary step={2} onEdit={onEdit}>
            <Row label="Highest qualification">{background?.highestQualification}</Row>
            <Row label="Institution">{background?.institution}</Row>
            <Row label="Year completed">{background?.completionYear}</Row>
            <Row label="English language evidence">{background?.languageEvidence}</Row>
            <Row label="Experience" wide>
              {background?.experience}
            </Row>
          </Summary>

          <Summary step={3} onEdit={onEdit}>
            <Row label="How you are applying">{agent ? (agent.viaAgent ? 'Through an agent' : 'Directly') : null}</Row>
            {agent?.viaAgent && (
              <>
                <Row label="Agent">{agent.agentName}</Row>
                <Row label="Agent reference">{agent.agentReference}</Row>
                <Row label="Consent to share updates">{agent.agentConsent ? 'Given' : 'Not given'}</Row>
              </>
            )}
          </Summary>

          <Summary step={4} onEdit={onEdit}>
            <Row label="Uploaded files" wide>
              {draft.documents.length ? (
                <ul className="space-y-1 font-normal">
                  {draft.documents.map((doc) => (
                    <li key={doc.id}>
                      <span className="font-medium">{DOCUMENT_TYPE_LABELS[doc.type]}:</span> {doc.fileName}
                      {doc.scanStatus === 'pending' && <span className="text-ink-subtle"> (security check in progress)</span>}
                      {doc.scanStatus === 'rejected' && <span className="text-danger"> (not accepted — please replace)</span>}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Row>
          </Summary>

          <Summary step={5} onEdit={onEdit}>
            <Row label="Support request" wide>
              {support ? (support.requested ? support.details : 'No support requested') : null}
            </Row>
          </Summary>
        </div>

        <fieldset className="mt-10 min-w-0 rounded-2xl border border-line bg-surface-muted/60 p-5 sm:p-6">
          <legend className="px-1 font-semibold text-ink">Declarations</legend>
          <div className="mt-2 space-y-5">
            <div>
              <Checkbox
                {...register('accuracy')}
                aria-invalid={errors.accuracy ? true : undefined}
                aria-describedby={errorId('accuracy')}
                label="The information I have given is true and complete to the best of my knowledge. I understand admissions may verify it and that false or missing information may affect my application."
              />
              <div className="pl-8">
                <FieldError id={errorId('accuracy')} message={errors.accuracy?.message} />
              </div>
            </div>
            <div>
              <Checkbox
                {...register('privacy')}
                aria-invalid={errors.privacy ? true : undefined}
                aria-describedby={errorId('privacy')}
                label={
                  <>
                    I have read the{' '}
                    <AppLink href="/privacy" className="font-semibold text-primary-ink underline underline-offset-4">
                      privacy notice
                    </AppLink>{' '}
                    and understand how my personal information and documents will be used to assess my application.
                  </>
                }
              />
              <div className="pl-8">
                <FieldError id={errorId('privacy')} message={errors.privacy?.message} />
              </div>
            </div>
            <div>
              <Checkbox
                {...register('admissions')}
                aria-invalid={errors.admissions ? true : undefined}
                aria-describedby={errorId('admissions')}
                label="I understand that submitting this application is a request for admissions review. It is not an offer, enrolment, visa document or payment obligation."
              />
              <div className="pl-8">
                <FieldError id={errorId('admissions')} message={errors.admissions?.message} />
              </div>
            </div>
          </div>
        </fieldset>

        <StepFooter
          saving={submitting}
          onBack={() => nav.onBack?.()}
          submitLabel="Submit application"
          savingLabel="Submitting…"
          submitIcon={<Send aria-hidden className="size-4" />}
          note="After you submit, admissions will review your application and contact you by email. You will see your reference straight away."
        />
      </form>
    </StepFrame>
  )
}

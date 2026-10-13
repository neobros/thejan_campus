import { useSuspenseQuery } from '@tanstack/react-query'
import { CalendarX, Lock, MessageSquare, RotateCcw, ShieldCheck } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { api } from '@/api/client'
import { errorMessage, isApiError } from '@/api/errors'
import { queries } from '@/api/queries'
import type { ApplicationData, ApplicationDeclarations, ApplicationReceipt, CourseOption } from '@/api/types'
import { prefetchOptionalPage, queryClient, useOptionalPage } from '@/app/routing'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { AppLink } from '@/components/ui/AppLink'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Callout, EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/motion/Reveal'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { Seo } from '@/lib/seo'
import { CourseStep } from './CourseStep'
import { DocumentsStep } from './DocumentsStep'
import { AgentStep, BackgroundStep, DetailsStep, SupportStep } from './FormSteps'
import { ReviewStep } from './ReviewStep'
import { LAST_STEP, STEPS, type AgentValues, type BackgroundValues, type PersonalValues, type SelectionValues, type SupportValues } from './schema'
import { Stepper } from './Stepper'
import { isDraftGone, useApplicationDraft } from './useApplicationDraft'

export async function loader() {
  await Promise.all([prefetchOptionalPage('apply'), queryClient.ensureQueryData(queries.courseOptions())])
  return null
}

const stepVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -48 }),
}

function goToConfirmation(navigate: ReturnType<typeof useNavigate>, receipt: ApplicationReceipt) {
  toast.dismiss('draft-saved')
  navigate('/apply/confirmation', { replace: true, state: { receipt }, viewTransition: true })
}

function Wizard({ options }: { options: CourseOption[] }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const reduceMotion = useReducedMotion()
  const draftApi = useApplicationDraft()
  const { status, draft, notice, recovered } = draftApi.state

  const [step, setStep] = useState(0)
  const [furthestLocal, setFurthestLocal] = useState(0)
  const [direction, setDirection] = useState(1)
  const [navigated, setNavigated] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [conflict, setConflict] = useState<string | null>(null)
  const [confirmStartOver, setConfirmStartOver] = useState(false)
  const [liveMessage, setLiveMessage] = useState('')
  const [restoredFor, setRestoredFor] = useState<string | null>(null)
  const [memory, setMemory] = useState<Record<number, unknown>>({})
  const busy = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Restore the furthest step of a resumed draft once (render-time state adjustment).
  if (status === 'ready' && draft && restoredFor !== draft.id) {
    setRestoredFor(draft.id)
    const resumeAt = Math.min(draft.step, LAST_STEP)
    if (resumeAt > step) {
      setStep(resumeAt)
      setFurthestLocal(resumeAt)
    }
  }

  useEffect(() => {
    if (recovered) goToConfirmation(navigate, recovered)
  }, [recovered, navigate])

  const furthest = Math.max(furthestLocal, draft ? Math.min(draft.step, LAST_STEP) : 0)

  const goTo = useCallback(
    (next: number) => {
      if (next === step) return
      setDirection(next > step ? 1 : -1)
      setStep(next)
      setNavigated(true)
      const top = cardRef.current?.getBoundingClientRect().top ?? 0
      if (top < 0) cardRef.current?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' })
    },
    [reduceMotion, step],
  )

  const resetWizard = useCallback(() => {
    setMemory({})
    setStep(0)
    setFurthestLocal(0)
    setDirection(-1)
    setConflict(null)
    setSubmitError(null)
    setConfirmStartOver(false)
  }, [])

  const handleGone = useCallback(() => {
    draftApi.startOver('expired')
    resetWizard()
    toast.error('Your draft has expired', { description: 'For your security, drafts expire after a while. Please start again.' })
  }, [draftApi, resetWizard])

  const saveStep = async (index: number, data: ApplicationData) => {
    if (busy.current) return
    busy.current = true
    setSaving(true)
    try {
      const next = Math.min(index + 1, LAST_STEP)
      await draftApi.save(next, data)
      setMemory(({ [index]: _saved, ...rest }) => rest)
      if (index === 0) setConflict(null)
      setFurthestLocal((f) => Math.max(f, next))
      // One toast id so quick successive saves replace the notice instead of stacking.
      toast.success('Progress saved', { id: 'draft-saved', description: 'Your secure draft has been updated.', duration: 2500 })
      setLiveMessage(`${STEPS[index].title} saved. Now on step ${next + 1} of ${STEPS.length}: ${STEPS[next].title}.`)
      goTo(next)
    } catch (error) {
      if (isDraftGone(error)) handleGone()
      else {
        toast.error('We could not save this step', { description: `${errorMessage(error)} Your answers are still here.` })
        setLiveMessage('Saving failed. Your answers are still here — please try again.')
      }
    } finally {
      busy.current = false
      setSaving(false)
    }
  }

  const submit = async (declarations: ApplicationDeclarations) => {
    if (busy.current) return
    const handle = draftApi.handle()
    if (!handle) return handleGone()
    busy.current = true
    setSubmitting(true)
    setSubmitError(null)
    try {
      // A previous attempt may already have been stored (e.g. the response was lost). In that
      // case the draft is gone, and replaying the same key returns the original receipt.
      const retrying = draftApi.hasSubmitKey()
      try {
        await draftApi.save(LAST_STEP, { declarations })
      } catch (error) {
        if (!(retrying && isDraftGone(error))) throw error
      }
      const receipt = await api.submitApplication(handle, { idempotencyKey: draftApi.submitKey() })
      draftApi.clear()
      goToConfirmation(navigate, receipt)
    } catch (error) {
      if (isApiError(error) && error.status === 409) {
        draftApi.rotateSubmitKey()
        setConflict(error.message)
        goTo(0)
      } else if (isDraftGone(error)) {
        handleGone()
      } else {
        if (isApiError(error) && error.status < 500) draftApi.rotateSubmitKey()
        setSubmitError(errorMessage(error))
      }
    } finally {
      busy.current = false
      setSubmitting(false)
    }
  }

  const back = (index: number) => (values?: unknown) => {
    if (values !== undefined) setMemory((m) => ({ ...m, [index]: values }))
    goTo(index - 1)
  }

  if (status === 'loading') {
    return (
      <LoadingRegion label="Loading your application" className="space-y-6 p-6 sm:p-10">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </LoadingRegion>
    )
  }
  if (status === 'error') {
    return (
      <div className="p-6 sm:p-10">
        <ErrorPanel title="Your saved application could not be loaded" onRetry={draftApi.retry} />
      </div>
    )
  }

  const handle = draftApi.handle()
  const data = draft?.data ?? {}
  const nav = { index: step, focusHeading: navigated, saving, onBack: step > 0 ? back(step) : undefined }

  let content
  switch (step) {
    case 0:
      content = (
        <CourseStep
          {...nav}
          options={options}
          saved={data.selection}
          prefill={{ audience: params.get('audience'), course: params.get('course'), campus: params.get('campus'), intake: params.get('intake') }}
          remembered={memory[0] as SelectionValues | undefined}
          conflict={conflict}
          onSave={(selection) => void saveStep(0, { selection })}
        />
      )
      break
    case 1:
      content = (
        <DetailsStep {...nav} saved={data.personal} remembered={memory[1] as PersonalValues | undefined} onSave={(personal) => void saveStep(1, { personal })} />
      )
      break
    case 2:
      content = (
        <BackgroundStep
          {...nav}
          saved={data.background}
          remembered={memory[2] as BackgroundValues | undefined}
          onSave={(background) => void saveStep(2, { background })}
        />
      )
      break
    case 3:
      content = <AgentStep {...nav} saved={data.agent} remembered={memory[3] as AgentValues | undefined} onSave={(agent) => void saveStep(3, { agent })} />
      break
    case 4:
      content =
        handle && draft ? (
          <DocumentsStep {...nav} handle={handle} draft={draft} onRefresh={draftApi.refresh} onContinue={() => void saveStep(4, {})} />
        ) : null
      break
    case 5:
      content = (
        <SupportStep {...nav} saved={data.support} remembered={memory[5] as SupportValues | undefined} onSave={(support) => void saveStep(5, { support })} />
      )
      break
    default:
      content = draft ? (
        <ReviewStep
          {...nav}
          saving={submitting}
          draft={draft}
          options={options}
          submitting={submitting}
          submitError={submitError}
          onEdit={goTo}
          onSubmit={(declarations) => void submit(declarations)}
        />
      ) : null
  }

  return (
    <div ref={cardRef} className="scroll-mt-28">
      <div className="border-b border-line bg-surface-muted/50 px-5 py-5 sm:px-10 sm:py-7">
        <Stepper steps={STEPS} current={step} furthest={furthest} onSelect={goTo} />
      </div>

      <div className="px-5 py-8 sm:px-10 sm:py-10">
        <AnimatePresence initial={false}>
          {notice === 'resumed' && (
            <motion.div key="resumed" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <Callout
                tone="success"
                title="Welcome back"
                className="mb-8"
                action={
                  confirmStartOver ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-ink">Discard this draft and start again?</span>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          draftApi.startOver()
                          resetWizard()
                          setLiveMessage('Started a new application.')
                        }}
                      >
                        Yes, start over
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setConfirmStartOver(false)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" variant="secondary" onClick={draftApi.dismissNotice}>
                        Continue my application
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setConfirmStartOver(true)} icon={<RotateCcw aria-hidden className="size-4" />}>
                        Start over
                      </Button>
                    </div>
                  )
                }
              >
                We restored your saved draft, including any documents you uploaded. You can carry on where you left off.
              </Callout>
            </motion.div>
          )}
          {notice === 'expired' && (
            <motion.div key="expired" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <Callout
                tone="warning"
                title="We started a fresh application"
                className="mb-8"
                action={
                  <Button size="sm" variant="ghost" onClick={draftApi.dismissNotice}>
                    Dismiss
                  </Button>
                }
              >
                Your earlier draft has expired or could not be found, so nothing from it was submitted. Please enter your details again.
              </Callout>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_OUT_EXPO }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>

        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {liveMessage}
        </p>
      </div>
    </div>
  )
}

export default function ApplyPage() {
  const cms = useOptionalPage('apply')
  const { data: options } = useSuspenseQuery(queries.courseOptions())
  const blocks = cms?.blocks ?? []

  return (
    <>
      <Seo
        title={cms?.seo?.title ?? 'Apply online'}
        description={cms?.seo?.description ?? cms?.summary ?? 'Apply online: choose your course, campus and intake, upload your documents securely and submit for admissions review.'}
      />
      <PageHero
        title={cms?.title ?? 'Apply *online*'}
        eyebrow={cms?.eyebrow ?? 'Admissions'}
        summary={
          cms?.summary ??
          'Choose your course, campus and intake, then complete each step at your own pace. Your progress is saved as a secure draft.'
        }
        breadcrumbs={[{ label: 'Admissions', href: '/admissions' }, { label: 'Apply online' }]}
        className="pb-10 sm:pb-12"
      />

      {blocks.length > 0 && <BlockRenderer blocks={blocks} />}

      <Section spacing="sm" className={blocks.length ? 'pt-0 sm:pt-0' : 'pt-10 sm:pt-14'}>
        <div className="mx-auto max-w-5xl">
          {options.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="No intakes are open for applications right now"
              description="New intakes are published regularly. Ask our admissions team about upcoming start dates and we will let you know when applications open."
              actions={
                <>
                  <ButtonLink href="/enquire?topic=admissions">Ask about intakes</ButtonLink>
                  <ButtonLink href="/courses" variant="secondary">
                    Browse courses
                  </ButtonLink>
                </>
              }
            />
          ) : (
            <Reveal immediate y={24} delay={0.25}>
              <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card">
                <Wizard options={options} />
              </div>
              <div className="mt-6 grid gap-4 text-sm text-ink-muted sm:grid-cols-3">
                <p className="flex items-start gap-2">
                  <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-ink" />
                  Submitting is a request for admissions review — not an offer, enrolment, visa document or payment obligation.
                </p>
                <p className="flex items-start gap-2">
                  <Lock aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-ink" />
                  Your draft is saved securely when you continue. You can resume it in this browser tab; the link is never put in the address bar.
                </p>
                <p className="flex items-start gap-2">
                  <MessageSquare aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-ink" />
                  <span>
                    Questions?{' '}
                    <AppLink href="/enquire?topic=admissions" className="font-medium text-primary-ink underline underline-offset-4">
                      Ask our admissions team
                    </AppLink>
                    .
                  </span>
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </Section>
    </>
  )
}

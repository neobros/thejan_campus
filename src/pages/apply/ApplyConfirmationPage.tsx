import { BookOpen, Check, Copy, House, Mail, Phone, Printer, ShieldCheck } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useLocation } from 'react-router'
import { toast } from 'sonner'
import { useSettings } from '@/api/queries'
import type { ApplicationReceipt } from '@/api/types'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Callout } from '@/components/ui/feedback'
import { Section } from '@/components/ui/Section'
import { AnimatedCheck, Aurora, GridBackdrop } from '@/components/motion/effects'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { formatDate, formatDateTime, timeZoneLabel } from '@/lib/format'
import { isDialable, isEmail, telHref } from '@/lib/links'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { Seo } from '@/lib/seo'

const NEXT_STEPS = [
  { title: 'Admissions review', text: 'Our admissions team reviews your application, documents and eligibility for the course and intake you chose.' },
  { title: 'We may ask for more information', text: 'If anything is missing or unclear, we will email you. Reply using the reference above so we can match it quickly.' },
  { title: 'Outcome by email', text: 'You will receive the outcome of your application in writing at the email address you gave us.' },
  {
    title: 'Follow the instructions you receive',
    text: 'If your application is successful, the outcome will explain any acceptance, enrolment and payment steps. Nothing is required from you until then.',
  },
]

function isReceipt(value: unknown): value is ApplicationReceipt {
  const r = value as Partial<ApplicationReceipt> | null
  return Boolean(r && typeof r.reference === 'string' && typeof r.receivedAt === 'string' && typeof r.courseTitle === 'string')
}

function CopyReference({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reference)
      setCopied(true)
      toast.success('Reference copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed — please select the reference and copy it manually.')
    }
  }
  return (
    <Button variant="secondary" size="sm" onClick={() => void copy()} className="no-print" icon={copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}>
      {copied ? 'Copied' : 'Copy'}
      <span className="sr-only"> application reference</span>
    </Button>
  )
}

function AdmissionsContact() {
  const { contact } = useSettings()
  const phone = isDialable(contact.phone) ? contact.phone : null
  const email = isEmail(contact.email) ? contact.email : null
  return (
    <div className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-card sm:p-7">
      <h2 className="font-display text-xl font-semibold text-ink">Questions about your application?</h2>
      <p className="mt-2 text-[0.9375rem] text-ink-muted">Contact admissions and quote your reference. {contact.hours}.</p>
      <ul className="mt-4 space-y-2 text-[0.9375rem]">
        {email && (
          <li className="flex items-center gap-2">
            <Mail aria-hidden className="size-4 text-primary-ink" />
            <a href={`mailto:${email}`} className="font-semibold text-primary-ink underline-offset-4 hover:underline">
              {email}
            </a>
          </li>
        )}
        {phone && (
          <li className="flex items-center gap-2">
            <Phone aria-hidden className="size-4 text-primary-ink" />
            <a href={telHref(phone)} className="font-semibold text-primary-ink underline-offset-4 hover:underline">
              {phone}
            </a>
          </li>
        )}
      </ul>
      <ButtonLink href="/enquire?topic=admissions" variant="secondary" size="sm" className="no-print mt-5">
        Send an enquiry
      </ButtonLink>
    </div>
  )
}

function Receipt({ receipt }: { receipt: ApplicationReceipt }) {
  const settings = useSettings()
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line bg-canvas-alt pb-14 pt-[calc(var(--header-h)+3rem)] sm:pb-20">
        <Aurora intensity="soft" className="-z-10" />
        <GridBackdrop className="-z-10 opacity-70" />
        <div className="container-page max-w-3xl text-center">
          <motion.span
            className="mx-auto grid size-24 place-items-center rounded-full bg-success-soft text-success ring-8 ring-success-soft/50"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            <AnimatedCheck className="size-16" />
          </motion.span>
          <Reveal immediate y={16} delay={0.3}>
            <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Application received</h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">
              Thank you. We have received your application for admissions review. We will contact you at{' '}
              <strong className="font-semibold text-ink">{receipt.email}</strong>.
            </p>
          </Reveal>
          <Reveal immediate y={16} delay={0.45}>
            <div className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4 shadow-card">
              <span className="text-sm text-ink-subtle">Your reference</span>
              <span className="font-mono text-xl font-semibold tracking-wider text-ink">{receipt.reference}</span>
              <CopyReference reference={receipt.reference} />
            </div>
          </Reveal>
        </div>
      </section>

      <Section>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <Reveal className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-card sm:p-8">
              <h2 className="font-display text-xl font-semibold text-ink">Application summary</h2>
              <dl className="mt-5 grid gap-4 text-[0.9375rem] sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-sm text-ink-subtle">Course</dt>
                  <dd className="font-semibold text-ink">{receipt.courseTitle}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-subtle">Campus</dt>
                  <dd className="font-medium text-ink">{receipt.campusName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-subtle">Intake starts</dt>
                  <dd className="font-medium text-ink">{formatDate(receipt.intakeStartDate)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm text-ink-subtle">Received</dt>
                  <dd className="font-medium text-ink">
                    {formatDateTime(receipt.receivedAt, settings.timezone)}{' '}
                    <span className="font-normal text-ink-subtle">({timeZoneLabel(settings.timezone, new Date(receipt.receivedAt))})</span>
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal>
              <Callout tone="info" title="This is not an offer">
                Your application is a request for admissions review. It is not an offer, enrolment, visa document or payment obligation. Please do
                not make travel or payment arrangements until you receive your outcome in writing.
              </Callout>
            </Reveal>

            <section aria-labelledby="next-steps">
              <h2 id="next-steps" className="font-display text-2xl font-semibold text-ink">
                What happens next
              </h2>
              <Stagger as="ol" className="mt-6 space-y-4">
                {NEXT_STEPS.map((item, index) => (
                  <StaggerItem as="li" key={item.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                    <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft font-semibold text-on-primary-soft">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink">{item.title}</h3>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-muted">{item.text}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <Reveal>
              <AdmissionsContact />
            </Reveal>
            <Reveal delay={0.1} className="no-print rounded-[1.75rem] border border-line bg-surface-muted/60 p-6 sm:p-7">
              <p className="flex items-start gap-2 text-sm text-ink-muted">
                <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-ink" />
                Keep a copy of your reference. For your privacy these details are shown only once and are not included in any link.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" onClick={() => window.print()} icon={<Printer aria-hidden className="size-4" />}>
                  Print this page
                </Button>
                <ButtonLink href="/" variant="ghost" size="sm" icon={<House aria-hidden className="size-4" />}>
                  Home
                </ButtonLink>
                <ButtonLink href="/courses" variant="ghost" size="sm" icon={<BookOpen aria-hidden className="size-4" />}>
                  Courses
                </ButtonLink>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>
    </>
  )
}

function NoReceipt() {
  return (
    <section className="relative isolate overflow-hidden bg-canvas-alt pb-24 pt-[calc(var(--header-h)+4rem)]">
      <Aurora intensity="soft" className="-z-10" />
      <GridBackdrop className="-z-10" />
      <div className="container-page max-w-2xl text-center">
        <Reveal immediate>
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary-soft text-on-primary-soft">
            <ShieldCheck aria-hidden className="size-7" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold text-ink sm:text-5xl">Application confirmation</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            For your privacy, confirmation details are shown only once, straight after you submit an application, and are never stored in a link.
            If you have submitted an application, your reference is in the acknowledgement email we sent you.
          </p>
        </Reveal>
        <Reveal immediate delay={0.15}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/enquire?topic=admissions">Contact admissions</ButtonLink>
            <ButtonLink href="/apply" variant="secondary">
              Start or resume an application
            </ButtonLink>
            <ButtonLink href="/" variant="ghost" icon={<House aria-hidden className="size-4" />}>
              Home
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function ApplyConfirmationPage() {
  const location = useLocation()
  const receipt = (location.state as { receipt?: unknown } | null)?.receipt
  return (
    <>
      <Seo title={isReceipt(receipt) ? 'Application received' : 'Application confirmation'} noindex />
      {isReceipt(receipt) ? <Receipt receipt={receipt} /> : <NoReceipt />}
    </>
  )
}

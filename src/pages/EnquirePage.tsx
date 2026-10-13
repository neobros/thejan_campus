import { ArrowRight, BookOpen, CircleQuestionMark, Clock, ClipboardList, Mail, MapPin, Phone, Siren } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { useSettings } from '@/api/queries'
import { prefetchOptionalPage, useOptionalPage } from '@/app/routing'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { AppLink } from '@/components/ui/AppLink'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/motion/Reveal'
import { EnquiryForm } from '@/features/enquiry/EnquiryForm'
import { isDialable, isEmail, telHref } from '@/lib/links'
import { Seo } from '@/lib/seo'

export async function loader() {
  await prefetchOptionalPage('enquire')
  return null
}

const QUICK_LINKS = [
  { href: '/faq', label: 'Frequently asked questions', icon: CircleQuestionMark },
  { href: '/courses', label: 'Browse courses', icon: BookOpen },
  { href: '/admissions', label: 'How admissions works', icon: ClipboardList },
]

function ContactPanel() {
  const settings = useSettings()
  const { phone, email, address, hours } = settings.contact
  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-card sm:p-7">
        <h2 className="font-display text-xl font-semibold text-ink">Other ways to reach us</h2>
        <dl className="mt-5 space-y-4 text-[0.9375rem]">
          <div className="flex gap-3">
            <dt>
              <Phone aria-hidden className="mt-0.5 size-5 text-primary-ink" />
              <span className="sr-only">Phone</span>
            </dt>
            <dd className="text-ink">
              {isDialable(phone) ? (
                <a href={telHref(phone)} className="font-semibold text-primary-ink underline-offset-4 hover:underline">
                  {phone}
                </a>
              ) : (
                phone
              )}
            </dd>
          </div>
          <div className="flex gap-3">
            <dt>
              <Mail aria-hidden className="mt-0.5 size-5 text-primary-ink" />
              <span className="sr-only">Email</span>
            </dt>
            <dd className="min-w-0 break-words text-ink">
              {isEmail(email) ? (
                <a href={`mailto:${email}`} className="font-semibold text-primary-ink underline-offset-4 hover:underline">
                  {email}
                </a>
              ) : (
                email
              )}
            </dd>
          </div>
          <div className="flex gap-3">
            <dt>
              <Clock aria-hidden className="mt-0.5 size-5 text-primary-ink" />
              <span className="sr-only">Opening hours</span>
            </dt>
            <dd className="text-ink-muted">{hours}</dd>
          </div>
          <div className="flex gap-3">
            <dt>
              <MapPin aria-hidden className="mt-0.5 size-5 text-primary-ink" />
              <span className="sr-only">Address</span>
            </dt>
            <dd className="text-ink-muted">{address}</dd>
          </div>
        </dl>
      </div>

      <nav aria-labelledby="enquire-quick-links" className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-card sm:p-7">
        <h2 id="enquire-quick-links" className="font-display text-xl font-semibold text-ink">
          You might find your answer here
        </h2>
        <ul className="mt-4 divide-y divide-line">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <AppLink
                href={link.href}
                className="group flex min-h-11 items-center gap-3 py-3 text-[0.9375rem] font-medium text-ink transition-colors hover:text-primary-ink"
              >
                <link.icon aria-hidden className="size-5 shrink-0 text-ink-subtle group-hover:text-primary-ink" />
                <span className="flex-1">{link.label}</span>
                <ArrowRight aria-hidden className="size-4 text-ink-subtle transition-transform group-hover:translate-x-1" />
              </AppLink>
            </li>
          ))}
        </ul>
      </nav>

      {settings.emergency && (
        <aside aria-labelledby="enquire-emergency" className="rounded-[1.75rem] border border-danger/30 bg-danger-soft p-6 sm:p-7">
          <h2 id="enquire-emergency" className="flex items-center gap-2 font-semibold text-ink">
            <Siren aria-hidden className="size-5 text-danger" />
            {settings.emergency.title}
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
            This enquiry form is not an emergency channel. {settings.emergency.body}
          </p>
          <p className="mt-3 text-[0.9375rem] text-ink">
            {settings.emergency.phoneLabel}:{' '}
            {isDialable(settings.emergency.phone) ? (
              <a href={telHref(settings.emergency.phone)} className="font-semibold text-danger underline underline-offset-4">
                {settings.emergency.phone}
              </a>
            ) : (
              <strong className="font-semibold">{settings.emergency.phone}</strong>
            )}
          </p>
        </aside>
      )}
    </div>
  )
}

export default function EnquirePage() {
  const cms = useOptionalPage('enquire')
  const [params] = useSearchParams()
  const context = {
    topic: params.get('topic'),
    course: params.get('course'),
    campus: params.get('campus'),
    audience: params.get('audience'),
  }

  return (
    <>
      <Seo
        title={cms?.seo?.title ?? cms?.title ?? 'Make an enquiry'}
        description={cms?.seo?.description ?? cms?.summary ?? 'Send us an enquiry about courses, admissions, fees, international study, campuses or support.'}
      />
      <PageHero
        title={cms?.title ?? 'Make an *enquiry*'}
        eyebrow={cms?.eyebrow ?? 'Contact'}
        summary={cms?.summary ?? 'Ask us about courses, admissions, fees, international study, campuses or support. We will reply using the contact details you provide.'}
        breadcrumbs={[{ label: 'Contact', href: '/contact' }, { label: 'Make an enquiry' }]}
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal immediate y={20} delay={0.2} className="lg:col-span-8">
            <div className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-card sm:p-10">
              <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Send us an enquiry</h2>
              <p className="mt-2 text-ink-muted">Tell us a little about your question and the right team will get back to you.</p>
              <EnquiryForm context={context} headingLevel="h2" className="mt-8" />
            </div>
          </Reveal>
          <Reveal immediate y={20} delay={0.3} className="lg:col-span-4">
            <ContactPanel />
          </Reveal>
        </div>
      </Section>
      {cms && cms.blocks.length > 0 && <BlockRenderer blocks={cms.blocks} />}
    </>
  )
}

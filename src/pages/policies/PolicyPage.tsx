import { useSuspenseQuery } from '@tanstack/react-query'
import { ArrowLeft, CalendarCheck, Download, FileText, Layers, MessageSquare, Printer, UserRound } from 'lucide-react'
import { useMemo } from 'react'
import { useParams, type LoaderFunctionArgs } from 'react-router'
import { queries } from '@/api/queries'
import type { FileInfo, Policy } from '@/api/types'
import { orNotFound, queryClient } from '@/app/routing'
import { AppLink } from '@/components/ui/AppLink'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Callout } from '@/components/ui/feedback'
import { Markdown, markdownHeadings } from '@/components/ui/Markdown'
import { Section, SectionHeader } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { formatDate, formatFileSize } from '@/lib/format'
import { enquireHref } from '@/lib/links'
import { plainText, Seo } from '@/lib/seo'
import { ContactText } from './ContactText'
import { OnThisPage, OnThisPageDisclosure } from './OnThisPage'

export async function loader({ params }: LoaderFunctionArgs) {
  await orNotFound(queryClient.ensureQueryData(queries.policy(params.slug!)))
  return null
}

const fileLabel = (file: FileInfo) => `${file.format} · ${formatFileSize(file.sizeBytes)}`

function PolicyMetaCard({ policy }: { policy: Policy }) {
  const rows = [
    { icon: Layers, label: 'Version', value: policy.version },
    { icon: CalendarCheck, label: 'Effective date', value: formatDate(policy.effectiveDate) },
    { icon: UserRound, label: 'Policy owner', value: policy.owner },
    { icon: FileText, label: 'Category', value: policy.category },
  ]
  return (
    <div className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-card sm:p-7">
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">Policy details</h2>
      <dl className="mt-5 divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-3 py-3 first:pt-0">
            <row.icon aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
            <dt className="w-32 shrink-0 text-sm text-ink-subtle">{row.label}</dt>
            <dd className="min-w-0 text-sm font-medium text-ink">{row.value}</dd>
          </div>
        ))}
        <div className="flex items-start gap-3 py-3 last:pb-0">
          <MessageSquare aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
          <dt className="w-32 shrink-0 text-sm text-ink-subtle">Contact</dt>
          <dd className="min-w-0 text-sm text-ink">
            <ContactText text={policy.contact} />
          </dd>
        </div>
      </dl>
      {policy.file && (
        <div className="no-print mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <ButtonLink href={policy.file.url} variant="primary" icon={<Download aria-hidden className="size-4" />} aria-label={`Download ${policy.title} (${fileLabel(policy.file)})`}>
            Download
          </ButtonLink>
          <span className="text-sm text-ink-subtle">
            {fileLabel(policy.file)} · {policy.file.language}
          </span>
        </div>
      )}
    </div>
  )
}

function RelatedForms({ policy }: { policy: Policy }) {
  if (!policy.relatedForms.length) return null
  return (
    <Section background="alt" spacing="md">
      <SectionHeader eyebrow="Forms and documents" heading="Related forms" intro="Documents referred to in this policy. Each opens as a file you can save or print." />
      <Stagger as="ul" className="grid gap-4 md:grid-cols-2">
        {policy.relatedForms.map((form) => (
          <StaggerItem as="li" key={form.id} className="flex gap-4 rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-on-primary-soft">
              <FileText aria-hidden className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-ink">{form.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{form.purpose}</p>
              <p className="mt-2 text-xs text-ink-subtle">
                {fileLabel(form.file)} · Version {form.version} · Effective {formatDate(form.effectiveDate, 'medium')}
              </p>
              <AppLink
                href={form.file.url}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink underline-offset-4 hover:underline"
              >
                <Download aria-hidden className="size-4" />
                Download<span className="sr-only"> {form.title}</span> ({fileLabel(form.file)})
              </AppLink>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}

export default function PolicyPage() {
  const { slug } = useParams()
  const { data: policy } = useSuspenseQuery(queries.policy(slug!))
  const headings = useMemo(() => markdownHeadings(policy.body), [policy.body])
  const hasToc = headings.length > 1

  return (
    <>
      <Seo title={policy.seo?.title ?? policy.title} description={policy.seo?.description ?? policy.summary} image={policy.seo?.image} noindex={policy.seo?.noindex} />
      <PageHero
        title={policy.title}
        eyebrow={policy.category}
        summary={policy.summary}
        breadcrumbs={[{ label: 'Policies', href: '/policies' }, { label: plainText(policy.title) }]}
        aside={<PolicyMetaCard policy={policy} />}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 print:block">
          {hasToc && (
            <aside className="no-print hidden lg:col-span-3 lg:block">
              <div className="sticky top-28">
                <OnThisPage headings={headings} />
                <Button variant="ghost" size="sm" className="mt-6 -ml-3" icon={<Printer aria-hidden className="size-4" />} onClick={() => window.print()}>
                  Print this policy
                </Button>
              </div>
            </aside>
          )}
          <div className={hasToc ? 'min-w-0 lg:col-span-9' : 'min-w-0 lg:col-span-12'}>
            {hasToc && <OnThisPageDisclosure headings={headings} className="mb-8 lg:hidden" />}
            <Reveal>
              <Markdown>{policy.body}</Markdown>
            </Reveal>
            <Reveal className="mt-12 max-w-[72ch]">
              <Callout
                tone="info"
                title="Questions about this policy?"
                action={
                  <ButtonLink href={enquireHref({ topic: 'other' })} variant="link" arrow className="no-print">
                    Send us an enquiry
                  </ButtonLink>
                }
              >
                <ContactText text={policy.contact} />
              </Callout>
            </Reveal>
            <p className="mt-8 max-w-[72ch] border-t border-line pt-6 text-sm text-ink-subtle">
              Version {policy.version}, effective {formatDate(policy.effectiveDate)}. Owner: {policy.owner}. The current approved version is always published on this page.
            </p>
            <div className="no-print mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/policies" variant="secondary" icon={<ArrowLeft aria-hidden className="size-4" />}>
                All policies
              </ButtonLink>
              {!hasToc && (
                <Button variant="ghost" icon={<Printer aria-hidden className="size-4" />} onClick={() => window.print()}>
                  Print
                </Button>
              )}
            </div>
          </div>
        </div>
      </Section>

      <RelatedForms policy={policy} />
    </>
  )
}

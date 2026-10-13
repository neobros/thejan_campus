import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Building, Clock, Mail, MapPin, Phone, Send, Users } from 'lucide-react'
import { queries } from '@/api/queries'
import type { Department } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import type { ModuleComponentProps } from '@/components/blocks/types'
import { AppLink } from '@/components/ui/AppLink'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { CardGridSkeleton, EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { ENQUIRY_TOPIC_LABELS } from '@/components/shared/labels'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { enquireHref, isDialable, isEmail, telHref } from '@/lib/links'

function DepartmentCard({ department }: { department: Department }) {
  return (
    <article className="flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-6 shadow-card transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-card-hover sm:p-7">
      <h3 className="font-display text-xl font-semibold text-ink">{department.name}</h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{department.description}</p>
      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex items-start gap-2.5">
          <dt>
            <Mail aria-hidden className="mt-0.5 size-4 text-ink-subtle" />
            <span className="sr-only">Email</span>
          </dt>
          <dd className="min-w-0 break-words">
            {isEmail(department.email) ? (
              <a href={`mailto:${department.email}`} className="font-medium text-primary-ink underline-offset-4 hover:underline">
                {department.email}
              </a>
            ) : (
              <span className="text-ink-muted">{department.email}</span>
            )}
          </dd>
        </div>
        {department.phone && (
          <div className="flex items-start gap-2.5">
            <dt>
              <Phone aria-hidden className="mt-0.5 size-4 text-ink-subtle" />
              <span className="sr-only">Phone</span>
            </dt>
            <dd>
              {isDialable(department.phone) ? (
                <a href={telHref(department.phone)} className="font-medium text-primary-ink underline-offset-4 hover:underline">
                  {department.phone}
                </a>
              ) : (
                <span className="text-ink-muted">{department.phone}</span>
              )}
            </dd>
          </div>
        )}
        {department.hours && (
          <div className="flex items-start gap-2.5">
            <dt>
              <Clock aria-hidden className="mt-0.5 size-4 text-ink-subtle" />
              <span className="sr-only">Hours</span>
            </dt>
            <dd className="text-ink-muted">{department.hours}</dd>
          </div>
        )}
        <div className="flex items-start gap-2.5">
          <dt>
            <MapPin aria-hidden className="mt-0.5 size-4 text-ink-subtle" />
            <span className="sr-only">Location</span>
          </dt>
          <dd className="text-ink-muted">
            {department.campus ? (
              <AppLink href={`/campuses/${department.campus.slug}`} className="underline-offset-4 hover:text-primary-ink hover:underline">
                {department.campus.name}
              </AppLink>
            ) : (
              'All campuses'
            )}
          </dd>
        </div>
      </dl>
      {department.topics.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Can help with">
          {department.topics.map((topic) => (
            <li key={topic}>
              <Badge tone="brand">{ENQUIRY_TOPIC_LABELS[topic]}</Badge>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-6">
        <ButtonLink
          href={enquireHref({ topic: department.topics[0] })}
          variant="secondary"
          size="sm"
          icon={<Send aria-hidden className="size-3.5" />}
          aria-label={`Send an enquiry to ${department.name}`}
        >
          Send an enquiry
        </ButtonLink>
      </div>
    </article>
  )
}

function CampusList() {
  const { data, isPending, isError, refetch } = useQuery(queries.campuses())
  if (isPending) {
    return (
      <LoadingRegion label="Loading campuses" className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </LoadingRegion>
    )
  }
  if (isError) return <ErrorPanel title="Campus details could not be loaded" onRetry={() => refetch()} />
  if (data.length === 0) return null
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((campus) => (
        <li key={campus.slug}>
          <AppLink
            href={`/campuses/${campus.slug}`}
            className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-surface p-5 transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-card-hover"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-on-primary-soft">
              <Building aria-hidden className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink group-hover:text-primary-ink">{campus.name}</span>
              <span className="mt-0.5 block text-sm text-ink-muted">{campus.address}</span>
            </span>
            <ArrowRight aria-hidden className="mt-1 size-4 shrink-0 text-ink-subtle transition-transform group-hover:translate-x-1" />
          </AppLink>
        </li>
      ))}
    </ul>
  )
}

/** Department and campus directory for the contact page (spec §5.26). */
export function ContactDirectoryModule({ block, className }: ModuleComponentProps) {
  const { data, isPending, isError, refetch } = useQuery(queries.departments())
  return (
    <ModuleSection block={block} className={className}>
      {isPending ? (
        <CardGridSkeleton count={3} />
      ) : isError ? (
        <ErrorPanel title="The contact directory could not be loaded" onRetry={() => refetch()} />
      ) : data.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Department contacts are being updated"
          description="Send us an enquiry and we will pass it to the right team."
          actions={
            <ButtonLink href="/enquire" variant="primary">
              Make an enquiry
            </ButtonLink>
          }
        />
      ) : (
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((department) => (
            <StaggerItem key={department.id}>
              <DepartmentCard department={department} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
      <Reveal className="mt-14">
        <h3 className="mb-5 font-display text-2xl font-semibold text-ink">Campuses</h3>
        <CampusList />
      </Reveal>
    </ModuleSection>
  )
}

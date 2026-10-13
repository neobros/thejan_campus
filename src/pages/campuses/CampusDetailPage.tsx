import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { Accessibility, BookOpen, CalendarClock, Car, Check, Clock, Globe, Mail, MapPin, Phone, UserRound } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { useParams, type LoaderFunctionArgs } from 'react-router'
import { queries } from '@/api/queries'
import type { Campus } from '@/api/types'
import { orNotFound, queryClient } from '@/app/routing'
import { AppLink } from '@/components/ui/AppLink'
import { ButtonLink } from '@/components/ui/Button'
import { CardGridSkeleton, EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Icon } from '@/components/ui/Icon'
import { Markdown } from '@/components/ui/Markdown'
import { Eyebrow, Section, SectionHeader } from '@/components/ui/Section'
import { SmartImage } from '@/components/ui/SmartImage'
import { CourseCard } from '@/components/shared/cards'
import { CtaBanner } from '@/components/shared/CtaBanner'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { IntakeRow } from '@/features/courses/IntakeExplorerModule'
import { cn } from '@/lib/cn'
import { timeZoneCity, timeZoneLabel } from '@/lib/format'
import { applyHref, coursesHref, enquireHref, isDialable, isEmail, telHref } from '@/lib/links'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { Seo } from '@/lib/seo'
import { CampusMap } from './CampusMap'
import { transportIcon } from './maps'

export async function loader({ params }: LoaderFunctionArgs) {
  await orNotFound(queryClient.ensureQueryData(queries.campus(params.slug!)))
  return null
}

const COURSE_PREVIEW = 6
const INTAKE_PREVIEW = 5

function zoneText(timeZone: string) {
  const city = timeZoneCity(timeZone)
  const label = timeZoneLabel(timeZone)
  return city === label ? label : `${city} (${label})`
}

/** Phone/email rendered as a link only for real values — placeholders stay plain text. */
function PhoneValue({ phone }: { phone: string }) {
  return isDialable(phone) ? (
    <a href={telHref(phone)} className="font-medium text-primary-ink underline-offset-4 hover:underline">
      {phone}
    </a>
  ) : (
    <span>{phone}</span>
  )
}

function EmailValue({ email }: { email: string }) {
  return isEmail(email) ? (
    <a href={`mailto:${email}`} className="break-all font-medium text-primary-ink underline-offset-4 hover:underline">
      {email}
    </a>
  ) : (
    <span className="break-all">{email}</span>
  )
}

function GlanceRow({ icon: IconComponent, label, children }: { icon: typeof MapPin; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3.5 py-4 first:pt-0">
      <IconComponent aria-hidden className="mt-0.5 size-[1.125rem] shrink-0 text-accent-ink" />
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">{label}</dt>
        <dd className="mt-1 text-[0.9375rem] leading-relaxed text-ink">{children}</dd>
      </div>
    </div>
  )
}

function AtAGlance({ campus }: { campus: Campus }) {
  return (
    <div className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-card sm:p-7">
      <h2 className="font-display text-2xl font-semibold text-ink">At a glance</h2>
      <dl className="mt-6 divide-y divide-line">
        <GlanceRow icon={MapPin} label="Address">
          {campus.address}
        </GlanceRow>
        {campus.contact.phone && (
          <GlanceRow icon={Phone} label="Phone">
            <PhoneValue phone={campus.contact.phone} />
          </GlanceRow>
        )}
        {campus.contact.email && (
          <GlanceRow icon={Mail} label="Email">
            <EmailValue email={campus.contact.email} />
          </GlanceRow>
        )}
        {campus.hours.length > 0 && (
          <GlanceRow icon={Clock} label="Opening hours">
            <table className="mt-1 w-full text-sm">
              <caption className="sr-only">Opening hours at {campus.name}</caption>
              <tbody>
                {campus.hours.map((row) => (
                  <tr key={row.label} className="align-top">
                    <th scope="row" className="py-1 pr-4 text-left font-normal text-ink-muted">
                      {row.label}
                    </th>
                    <td className="py-1 text-right font-medium text-ink">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlanceRow>
        )}
        <GlanceRow icon={Globe} label="Local time zone">
          {zoneText(campus.timezone)}
          <span className="block text-sm text-ink-subtle">Intake and event times are shown in this time zone.</span>
        </GlanceRow>
      </dl>
    </div>
  )
}

function Facilities({ campus }: { campus: Campus }) {
  if (!campus.facilities.length) return null
  return (
    <Section background="alt">
      <SectionHeader eyebrow="Facilities" heading="What you’ll find on campus" />
      <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {campus.facilities.map((facility) => (
          <StaggerItem
            as="li"
            key={facility.name}
            className="group rounded-3xl border border-line bg-surface p-6 shadow-card transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-on-primary-soft transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
              <Icon name={facility.icon ?? 'building'} className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-ink">{facility.name}</h3>
            {facility.description && <p className="mt-1.5 leading-relaxed text-ink-muted">{facility.description}</p>}
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}

function CampusCourses({ campus }: { campus: Campus }) {
  const [expanded, setExpanded] = useState(false)
  const { data, isPending, isError, refetch } = useQuery(queries.courses({ campus: campus.slug, pageSize: 48 }))
  const courses = data?.items ?? []
  const visible = expanded ? courses : courses.slice(0, COURSE_PREVIEW)
  return (
    <Section>
      <SectionHeader
        eyebrow="Study here"
        heading={`Courses at ${campus.name}`}
        intro={data ? `${data.total} ${data.total === 1 ? 'course is' : 'courses are'} delivered at or administered by this campus.` : undefined}
        action={
          <ButtonLink href={coursesHref({ campus: campus.slug })} variant="secondary" arrow>
            Filter all courses
          </ButtonLink>
        }
      />
      {isPending ? (
        <CardGridSkeleton count={3} />
      ) : isError ? (
        <ErrorPanel title="Courses could not be loaded" onRetry={() => refetch()} />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses are listed at this campus yet"
          description="Our admissions team can tell you what is planned for this campus and where similar courses are offered."
          actions={
            <ButtonLink href={enquireHref({ topic: 'course', campus: campus.slug })} variant="primary">
              Ask admissions
            </ButtonLink>
          }
        />
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((course, index) => (
                <motion.li
                  key={course.slug}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.06, ease: EASE_OUT_EXPO }}
                >
                  <CourseCard course={course} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {courses.length > COURSE_PREVIEW && (
            <div className="mt-10 text-center">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex h-11 items-center rounded-full border border-line-strong/80 bg-surface px-5 text-[0.9375rem] font-semibold text-ink transition-colors hover:bg-surface-muted"
              >
                {expanded ? 'Show fewer courses' : `Show all ${courses.length} courses`}
              </button>
            </div>
          )}
        </>
      )}
    </Section>
  )
}

function CampusIntakes({ campus }: { campus: Campus }) {
  const { data, isPending, isError, refetch } = useQuery(queries.intakes({ campus: campus.slug }))
  const intakes = data ?? []
  return (
    <Section background="alt">
      <SectionHeader
        eyebrow="Intakes"
        heading={`Upcoming intakes at ${campus.name}`}
        action={
          <ButtonLink href="/admissions/intakes" variant="secondary" arrow>
            All intakes
          </ButtonLink>
        }
      />
      {isPending ? (
        <LoadingRegion label="Loading intakes" className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-24 rounded-3xl" />
          ))}
        </LoadingRegion>
      ) : isError ? (
        <ErrorPanel title="Intakes could not be loaded" onRetry={() => refetch()} />
      ) : intakes.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No upcoming intakes are published for this campus"
          description="New dates are published regularly. Ask admissions about the next available start date."
          actions={
            <ButtonLink href={enquireHref({ topic: 'admissions', campus: campus.slug })} variant="primary">
              Ask about intakes
            </ButtonLink>
          }
        />
      ) : (
        <Reveal>
          <p className="mb-4 text-sm text-ink-subtle">
            {intakes.length > INTAKE_PREVIEW ? `Showing the next ${INTAKE_PREVIEW} of ${intakes.length} intakes` : `${intakes.length} upcoming ${intakes.length === 1 ? 'intake' : 'intakes'}`} · Dates in
            campus local time ({timeZoneLabel(campus.timezone)})
          </p>
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {intakes.slice(0, INTAKE_PREVIEW).map((intake, index) => (
                <IntakeRow key={intake.id} intake={intake} index={index} />
              ))}
            </AnimatePresence>
          </ul>
          {intakes.length > INTAKE_PREVIEW && (
            <p className="mt-6 text-center">
              <AppLink href="/admissions/intakes" className="text-sm font-semibold text-primary-ink underline-offset-4 hover:underline">
                See all {intakes.length} intakes for this campus and others
              </AppLink>
            </p>
          )}
        </Reveal>
      )}
    </Section>
  )
}

function GettingHere({ campus }: { campus: Campus }) {
  return (
    <Section>
      <SectionHeader eyebrow="Visiting" heading="Getting here" intro="Plan your trip to campus, including transport, parking and access." />
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <CampusMap campus={campus} />
        </Reveal>
        <div className="space-y-6 lg:col-span-5">
          {(campus.transport.length > 0 || campus.parking) && (
            <Reveal delay={0.05} className="rounded-3xl border border-line bg-surface p-6 shadow-card">
              <h3 className="text-lg font-semibold text-ink">Transport and parking</h3>
              <ul className="mt-4 space-y-3">
                {campus.transport.map((line) => {
                  const TransportIcon = transportIcon(line)
                  return (
                    <li key={line} className="flex items-start gap-3 text-[0.9375rem] text-ink-muted">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-muted text-ink">
                        <TransportIcon aria-hidden className="size-4" />
                      </span>
                      <span className="pt-1">{line}</span>
                    </li>
                  )
                })}
                {campus.parking && (
                  <li className="flex items-start gap-3 text-[0.9375rem] text-ink-muted">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-muted text-ink">
                      <Car aria-hidden className="size-4" />
                    </span>
                    <span className="pt-1">
                      <span className="font-medium text-ink">Parking: </span>
                      {campus.parking}
                    </span>
                  </li>
                )}
              </ul>
            </Reveal>
          )}
          {campus.accessibility.length > 0 && (
            <Reveal delay={0.1} className="rounded-3xl border border-line bg-surface p-6 shadow-card">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
                <Accessibility aria-hidden className="size-5 text-accent-ink" />
                Accessibility
              </h3>
              <ul className="mt-4 space-y-2.5">
                {campus.accessibility.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-ink-muted">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-ink-subtle">
                Need support on arrival?{' '}
                <AppLink href={enquireHref({ topic: 'campus', campus: campus.slug })} className="font-semibold text-primary-ink underline-offset-4 hover:underline">
                  Let us know before your visit
                </AppLink>{' '}
                or read our <AppLink href="/accessibility" className="font-semibold text-primary-ink underline-offset-4 hover:underline">accessibility statement</AppLink>.
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  )
}

function Gallery({ campus }: { campus: Campus }) {
  if (!campus.gallery.length) return null
  return (
    <Section background="alt">
      <SectionHeader
        eyebrow="Gallery"
        heading={`Inside ${campus.name}`}
        action={
          <ButtonLink href="/gallery" variant="secondary" arrow>
            Full gallery
          </ButtonLink>
        }
      />
      <Stagger as="ul" className="grid auto-rows-[14rem] gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[15rem]">
        {campus.gallery.map((image, index) => (
          <StaggerItem
            as="li"
            key={`${image.slot ?? image.alt}-${index}`}
            className={cn(index === 0 && campus.gallery.length > 2 && 'sm:col-span-2 lg:row-span-2')}
          >
            <figure className="group relative size-full overflow-hidden rounded-3xl ring-1 ring-line">
              <SmartImage image={image} hoverZoom sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="size-full" />
              {image.alt && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 pb-4 pt-12 text-sm font-medium text-white">
                  {image.alt}
                </figcaption>
              )}
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}

function AdmissionsContactCard({ campus }: { campus: Campus }) {
  const contact = campus.admissionsContact
  return (
    <Reveal className="flex h-full flex-col rounded-[2.25rem] border border-line bg-surface p-7 shadow-card sm:p-9">
      <Eyebrow>Admissions contact</Eyebrow>
      <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink">Talk to {contact?.name ? `our ${contact.name.toLowerCase()}` : 'admissions'}</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">Questions about courses, entry requirements or intakes at {campus.name}? We’re here to help.</p>
      <dl className="mt-6 space-y-4">
        {contact?.name && (
          <div className="flex items-start gap-3">
            <dt className="sr-only">Team</dt>
            <UserRound aria-hidden className="mt-0.5 size-[1.125rem] shrink-0 text-accent-ink" />
            <dd className="text-ink">{contact.name}</dd>
          </div>
        )}
        {contact?.email && (
          <div className="flex items-start gap-3">
            <dt className="sr-only">Email</dt>
            <Mail aria-hidden className="mt-0.5 size-[1.125rem] shrink-0 text-accent-ink" />
            <dd className="min-w-0 text-ink">
              <EmailValue email={contact.email} />
            </dd>
          </div>
        )}
        {contact?.phone && (
          <div className="flex items-start gap-3">
            <dt className="sr-only">Phone</dt>
            <Phone aria-hidden className="mt-0.5 size-[1.125rem] shrink-0 text-accent-ink" />
            <dd className="text-ink">
              <PhoneValue phone={contact.phone} />
            </dd>
          </div>
        )}
      </dl>
      <div className="mt-auto pt-8">
        <ButtonLink href={enquireHref({ topic: 'campus', campus: campus.slug })} variant="primary" arrow>
          Make an enquiry
        </ButtonLink>
      </div>
    </Reveal>
  )
}

export default function CampusDetailPage() {
  const { slug } = useParams()
  const { data: campus } = useSuspenseQuery(queries.campus(slug!))

  return (
    <>
      <Seo title={campus.seo?.title ?? campus.name} description={campus.seo?.description ?? campus.summary} image={campus.seo?.image ?? campus.image.src} noindex={campus.seo?.noindex} />
      <PageHero
        title={campus.name}
        eyebrow={campus.city}
        summary={campus.summary}
        image={campus.image}
        breadcrumbs={[{ label: 'Campuses', href: '/campuses' }, { label: campus.name }]}
        actions={[
          { label: 'Enquire about this campus', href: enquireHref({ topic: 'campus', campus: campus.slug }), variant: 'primary' },
          { label: 'View courses', href: coursesHref({ campus: campus.slug }), variant: 'secondary' },
        ]}
      >
        {campus.studyAreas.length > 0 && (
          <ul aria-label="Study areas at this campus" className="flex flex-wrap gap-2">
            {campus.studyAreas.map((area) => (
              <li key={area.slug}>
                <AppLink
                  href={`/courses/category/${area.slug}`}
                  className="inline-flex h-9 items-center rounded-full border border-line bg-surface px-3.5 text-sm font-medium text-ink-muted transition-colors hover:border-primary/40 hover:text-primary-ink"
                >
                  {area.name}
                </AppLink>
              </li>
            ))}
          </ul>
        )}
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal y={12}>
              <Eyebrow className="mb-4">Overview</Eyebrow>
            </Reveal>
            <Reveal y={20} delay={0.05}>
              <h2 className="font-display text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl">Welcome to {campus.name}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Markdown size="lg" className="mt-6">
                {campus.overview}
              </Markdown>
            </Reveal>
          </div>
          <aside className="lg:col-span-5">
            <Reveal delay={0.1} className="lg:sticky lg:top-28">
              <AtAGlance campus={campus} />
            </Reveal>
          </aside>
        </div>
      </Section>

      <Facilities campus={campus} />
      <CampusCourses campus={campus} />
      <CampusIntakes campus={campus} />
      <GettingHere campus={campus} />
      <Gallery campus={campus} />

      <Section>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <AdmissionsContactCard campus={campus} />
          </div>
          <CtaBanner
            className="lg:col-span-7"
            eyebrow="See it for yourself"
            heading={`Visit ${campus.name}`}
            body="Join an open day, book a tour or start your application for a course at this campus."
            actions={[
              { label: 'Upcoming events', href: '/events', variant: 'accent' },
              { label: 'Apply now', href: applyHref({ campus: campus.slug }), variant: 'secondary' },
            ]}
          />
        </div>
      </Section>
    </>
  )
}

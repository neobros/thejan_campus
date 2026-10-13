import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Users } from 'lucide-react'
import { useState } from 'react'
import { queries } from '@/api/queries'
import type { StaffProfile } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import { moduleProp, type ModuleComponentProps } from '@/components/blocks/types'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { Tabs, TabsContent, TabsList } from '@/components/ui/Tabs'
import { Spotlight } from '@/components/motion/effects'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'
import { enquireHref } from '@/lib/links'
import { PersonAvatar } from './components/PersonAvatar'
import { ProfileDialog } from './components/ProfileDialog'

type Group = StaffProfile['group']
const GROUPS: Group[] = ['leadership', 'faculty', 'professional']
const GROUP_LABELS: Record<Group, string> = { leadership: 'Leadership', faculty: 'Faculty', professional: 'Professional staff' }

function PersonCard({ person, onOpen }: { person: StaffProfile; onOpen: () => void }) {
  return (
    <Spotlight className="h-full rounded-[1.75rem]">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface p-6 shadow-card transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-canvas hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover sm:p-7">
        <div className="flex items-center gap-4">
          <PersonAvatar person={person} className="size-16 transition-transform duration-500 group-hover:scale-105" textClassName="text-xl" />
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold leading-snug text-ink">{person.name}</h3>
            <p className="mt-0.5 text-sm text-ink-subtle">{person.department}</p>
          </div>
        </div>
        <p className="mt-5 font-medium leading-snug text-ink-muted">{person.role}</p>
        {person.expertise.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${person.name}’s areas of expertise`}>
            {person.expertise.map((area) => (
              <li key={area}>
                <Badge tone="neutral">{area}</Badge>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink after:absolute after:inset-0 after:z-10 after:rounded-[inherit] focus-visible:outline-none"
          >
            View profile<span className="sr-only">: {person.name}</span>
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </article>
    </Spotlight>
  )
}

function PeopleGrid({ people, onOpen }: { people: StaffProfile[]; onOpen: (person: StaffProfile) => void }) {
  return (
    <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => (
        <StaggerItem key={person.id} className="h-full">
          <PersonCard person={person} onOpen={() => onOpen(person)} />
        </StaggerItem>
      ))}
    </Stagger>
  )
}

/** Approved staff profiles by leadership / faculty / professional staff (spec §5.3). */
export function TeamDirectoryModule({ block, className }: ModuleComponentProps) {
  const requested = moduleProp<Group[] | null>(block, 'groups', null)
  const { data, isPending, isError, refetch } = useQuery(queries.staff())
  const [selected, setSelected] = useState<StaffProfile | null>(null)
  const [tab, setTab] = useState<Group | null>(null)

  const scope = GROUPS.filter((g) => !requested?.length || requested.includes(g))
  const people = (data ?? []).filter((p) => scope.includes(p.group))
  const present = scope.filter((g) => people.some((p) => p.group === g))
  const activeTab = tab && present.includes(tab) ? tab : present[0]

  return (
    <ModuleSection block={block} className={className}>
      {isPending ? (
        <LoadingRegion className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="rounded-[1.75rem] border border-line bg-surface p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="size-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3.5 w-1/2" />
                </div>
              </div>
              <Skeleton className="mt-6 h-4 w-4/5" />
              <Skeleton className="mt-4 h-6 w-full" />
            </div>
          ))}
        </LoadingRegion>
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : people.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Profiles will be published soon"
          description="Staff profiles appear here once they have been approved. For course or application questions, our admissions team can help."
          actions={
            <ButtonLink href={enquireHref({ topic: 'course' })} variant="primary">
              Contact admissions
            </ButtonLink>
          }
        />
      ) : present.length > 1 && activeTab ? (
        <Tabs value={activeTab} onValueChange={(value) => setTab(value as Group)}>
          <TabsList
            label="Staff group"
            value={activeTab}
            className="mb-8"
            options={present.map((g) => ({ value: g, label: GROUP_LABELS[g], count: people.filter((p) => p.group === g).length }))}
          />
          {present.map((group) => (
            <TabsContent key={group} value={group}>
              <PeopleGrid people={people.filter((p) => p.group === group)} onOpen={setSelected} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <PeopleGrid people={people} onOpen={setSelected} />
      )}
      <ProfileDialog person={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </ModuleSection>
  )
}

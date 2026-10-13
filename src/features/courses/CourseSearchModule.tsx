import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { queries } from '@/api/queries'
import type { ModuleComponentProps } from '@/components/blocks/types'
import { AppLink } from '@/components/ui/AppLink'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import { coursesHref } from '@/lib/links'

function SearchField({ label, htmlFor, children, className }: { label: string; htmlFor: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('group/field relative rounded-2xl px-4 py-2.5 transition-colors focus-within:bg-surface-muted hover:bg-surface-muted', className)}>
      <label htmlFor={htmlFor} className="block text-xs font-semibold text-ink-subtle">
        {label}
      </label>
      {children}
    </div>
  )
}

/** Floating course finder that overlaps the home hero (spec §5.1 section 2). */
export function CourseSearchModule({ block }: ModuleComponentProps) {
  const navigate = useNavigate()
  const { data: options } = useQuery(queries.courseFilters())
  const [values, setValues] = useState({ q: '', category: '', level: '', campus: '', audience: '' })
  const set = (key: keyof typeof values) => (next: string) => setValues((v) => ({ ...v, [key]: next }))

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    navigate(coursesHref({ ...values, q: values.q.trim() || undefined }), { viewTransition: true })
  }

  return (
    <section id={block.id} className="relative z-20 -mt-9 pb-4 sm:-mt-11">
      <div className="container-page">
        <Reveal immediate y={40} delay={0.95} duration={1}>
          <form
            role="search"
            aria-label="Find a course"
            onSubmit={onSubmit}
            className="rounded-[2rem] border border-line bg-surface p-2.5 shadow-float"
          >
            <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr_1fr_auto] lg:items-center lg:divide-x lg:divide-line">
              <SearchField label="What do you want to study?" htmlFor="cs-q" className="md:col-span-2 lg:col-span-1">
                <div className="mt-0.5 flex items-center gap-2">
                  <Search aria-hidden className="size-4 shrink-0 text-ink-subtle" />
                  <input
                    id="cs-q"
                    value={values.q}
                    onChange={(event) => set('q')(event.target.value)}
                    placeholder="e.g. business, cookery, IT"
                    className="w-full bg-transparent text-[0.9375rem] font-medium text-ink placeholder:font-normal placeholder:text-ink-subtle focus:outline-none"
                  />
                </div>
              </SearchField>
              <SearchField label="Study area" htmlFor="cs-category">
                <Dropdown id="cs-category" variant="bare" value={values.category} onChange={set('category')} anyLabel="Any area" options={options?.categories ?? []} />
              </SearchField>
              <SearchField label="Qualification" htmlFor="cs-level">
                <Dropdown id="cs-level" variant="bare" value={values.level} onChange={set('level')} anyLabel="Any level" options={options?.levels ?? []} />
              </SearchField>
              <SearchField label="Campus" htmlFor="cs-campus">
                <Dropdown id="cs-campus" variant="bare" value={values.campus} onChange={set('campus')} anyLabel="Any campus" options={options?.campuses ?? []} />
              </SearchField>
              <SearchField label="I am a…" htmlFor="cs-audience">
                <Dropdown
                  id="cs-audience"
                  variant="bare"
                  value={values.audience}
                  onChange={set('audience')}
                  anyLabel="Any student"
                  options={(options?.audiences ?? []).map((o) => ({ value: o.value, label: o.label.replace(' students', ' student') }))}
                />
              </SearchField>
              <div className="p-1.5 md:col-span-2 lg:col-span-1 lg:border-l-0 lg:pl-2">
                <Button type="submit" size="lg" className="w-full" icon={<Search aria-hidden className="size-4" />}>
                  Search
                </Button>
              </div>
            </div>
          </form>
        </Reveal>
        {options && (
          <Reveal immediate y={12} delay={1.15}>
            <p className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-ink-subtle">
              <span>Popular areas:</span>
              {options.categories.slice(0, 4).map((c) => (
                <AppLink
                  key={c.value}
                  href={`/courses/category/${c.value}`}
                  className="rounded-full border border-line bg-surface px-3 py-1 text-ink-muted transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-ink"
                >
                  {c.label}
                </AppLink>
              ))}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}

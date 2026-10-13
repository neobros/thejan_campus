import { ArrowLeft, BookOpen, Compass, MessageSquare, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { AppLink } from '@/components/ui/AppLink'
import { Button } from '@/components/ui/Button'
import { Aurora, GridBackdrop } from '@/components/motion/effects'
import { Reveal } from '@/components/motion/Reveal'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { Seo } from '@/lib/seo'

const SUGGESTIONS = [
  { href: '/courses', label: 'Browse courses', text: 'Search and filter every course we offer', icon: BookOpen },
  { href: '/admissions', label: 'How to apply', text: 'Entry requirements, fees and intakes', icon: Compass },
  { href: '/contact', label: 'Contact us', text: 'Our team will point you in the right direction', icon: MessageSquare },
]

/**
 * Shown for unknown paths and missing records. In this single-page app the HTTP status comes from
 * the server/CDN config (see README → Deployment); the page is marked noindex either way.
 */
export function NotFoundContent() {
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (term.trim()) navigate(`/search?q=${encodeURIComponent(term.trim())}`, { viewTransition: true })
  }
  return (
    <section className="relative isolate overflow-hidden bg-canvas-alt pb-24 pt-[calc(var(--header-h)+4rem)]">
      <Seo title="Page not found" noindex />
      <Aurora intensity="soft" className="-z-10" />
      <GridBackdrop className="-z-10" />
      <div className="container-page text-center">
        <motion.p
          aria-hidden
          className="font-display text-[clamp(7rem,22vw,16rem)] font-semibold leading-none tracking-tighter text-transparent [-webkit-text-stroke:2px_var(--line-strong)]"
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
        >
          4
          <motion.span
            className="inline-block text-gradient-gold [-webkit-text-stroke:0]"
            animate={{ rotate: [0, -8, 8, 0], y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            0
          </motion.span>
          4
        </motion.p>
        <Reveal immediate delay={0.2}>
          <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">We couldn’t find that page</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-muted">
            The page may have moved, or the link might be out of date. Try searching, or use one of the links below.
          </p>
        </Reveal>
        <Reveal immediate delay={0.3}>
          <form onSubmit={onSubmit} role="search" className="mx-auto mt-9 flex max-w-lg items-center gap-2 rounded-full border border-line bg-surface p-1.5 shadow-card">
            <Search aria-hidden className="ml-3 size-5 shrink-0 text-ink-subtle" />
            <label htmlFor="nf-search" className="sr-only">
              Search the website
            </label>
            <input
              id="nf-search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search courses, pages, policies…"
              className="h-11 min-w-0 flex-1 bg-transparent text-ink placeholder:text-ink-subtle focus:outline-none"
            />
            <Button type="submit" size="md">
              Search
            </Button>
          </form>
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 text-left sm:grid-cols-3">
          {SUGGESTIONS.map((item, index) => (
            <Reveal key={item.href} immediate delay={0.4 + index * 0.08}>
              <AppLink href={item.href} className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <item.icon aria-hidden className="size-6 text-primary-ink" />
                <span className="mt-4 font-semibold text-ink">{item.label}</span>
                <span className="mt-1 text-sm text-ink-muted">{item.text}</span>
              </AppLink>
            </Reveal>
          ))}
        </div>
        <Reveal immediate delay={0.7}>
          <AppLink href="/" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary-ink hover:underline">
            <ArrowLeft aria-hidden className="size-4" /> Back to the home page
          </AppLink>
        </Reveal>
      </div>
    </section>
  )
}

export default function NotFoundPage() {
  return <NotFoundContent />
}

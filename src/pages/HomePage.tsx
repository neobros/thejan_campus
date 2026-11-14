import { useSuspenseQuery } from '@tanstack/react-query'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { useLoaderData } from 'react-router'
import { queries } from '@/api/queries'
import type { HeroSlide, Page } from '@/api/types'
import { contentPageLoader } from '@/app/routing'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { ActionButtons } from '@/components/ui/Button'
import { SmartImage } from '@/components/ui/SmartImage'
import { cn } from '@/lib/cn'
import { Seo } from '@/lib/seo'

export const loader = contentPageLoader

/* ------------------------------------------------------------------------------------------------
 * Split hero (left copy on a navy/blue panel, right rotating image) — matches the AIT mockup.
 * ---------------------------------------------------------------------------------------------- */

function useSlideshow(count: number, interval: number) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [playing] = useState(() => !reduced && count > 1)
  const [hovered, setHovered] = useState(false)
  const [hidden, setHidden] = useState(() => typeof document !== 'undefined' && document.hidden)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const active = playing && !hovered && !hidden && count > 1
  useEffect(() => {
    if (!active) return
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), interval)
    return () => clearTimeout(timer)
  }, [active, index, cycle, count, interval])

  const go = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count)
      setCycle((c) => c + 1)
    },
    [count],
  )

  return { index, go, active, setHovered }
}

/** Renders the hero headline: each sentence on its own line, with the *emphasised* phrase in a red box. */
function HeroTitle({ title }: { title: string }) {
  return (
    <>
      {title.split('*').map((segment, i) => {
        if (i % 2 === 1) {
          return (
            <span key={i} className="mt-3 inline-block rounded-xl bg-accent px-4 py-1.5 text-on-accent shadow-lg shadow-accent/30">
              {segment.trim()}
            </span>
          )
        }
        return segment
          .split(/(?<=\.)\s+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .map((sentence, j) => (
            <span key={`${i}-${j}`} className="block">
              {sentence}
            </span>
          ))
      })}
    </>
  )
}

function HomeHero({ page }: { page: Page }) {
  const slides: HeroSlide[] = page.hero?.slides?.length
    ? page.hero.slides
    : [{ image: page.hero?.image ?? { alt: '' }, eyebrow: page.eyebrow, title: page.title, summary: page.summary, actions: page.hero?.actions }]
  const interval = page.hero?.interval ?? 7000
  const reduced = useReducedMotion()
  const show = useSlideshow(slides.length, interval)
  const slide = slides[show.index]
  const multiple = slides.length > 1

  return (
    <section
      aria-roledescription={multiple ? 'carousel' : undefined}
      aria-label={multiple ? 'Highlights' : undefined}
      onMouseEnter={() => show.setHovered(true)}
      onMouseLeave={() => show.setHovered(false)}
      className="theme-night relative isolate flex min-h-[92svh] items-center overflow-hidden bg-[var(--night)] pt-[var(--header-h)]"
    >
      {/* Full-bleed rotating banner: each image crossfades with a slow zoom (Ken Burns). */}
      <AnimatePresence initial={false}>
        <motion.div
          key={show.index}
          aria-hidden
          className="absolute inset-0 -z-30"
          initial={{ opacity: 0, scale: reduced ? 1 : 1.06 }}
          animate={{ opacity: 1, scale: reduced ? 1 : 1.14 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.1, ease: 'easeInOut' }, scale: { duration: (interval + 2000) / 1000, ease: 'linear' } }}
        >
          <SmartImage image={slide.image} priority={show.index === 0} iconless sizes="100vw" className="size-full" imgClassName="object-[72%_center] lg:object-center" />
        </motion.div>
      </AnimatePresence>

      {/* Legibility overlays — darken the left where the copy sits. */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-r from-[var(--night)]/92 via-[var(--night)]/55 to-[var(--night)]/10" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-t from-[var(--night)]/70 via-transparent to-transparent" />
      {/* Soft bottom edge into the page. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-[var(--page-bg)]" />

      <div className="container-page relative z-10 py-20 sm:py-24">
        <div className="max-w-2xl text-white">
          <div aria-live={show.active ? 'off' : 'polite'} aria-atomic="true">
            <AnimatePresence mode="wait">
              <motion.div
                key={show.index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                {slide.eyebrow && (
                  <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">
                    {slide.eyebrow}
                  </p>
                )}
                <h1 className="font-display text-[2.6rem] font-semibold leading-[1.06] tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
                  <HeroTitle title={slide.title} />
                </h1>
                {slide.summary && <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">{slide.summary}</p>}
                <ActionButtons actions={slide.actions} onDark className="mt-9" />
              </motion.div>
            </AnimatePresence>
          </div>

          {multiple && (
            <div className="mt-12 flex items-center gap-2.5" role="tablist" aria-label="Choose banner">
              {slides.map((s, i) => {
                const current = i === show.index
                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={current}
                    aria-label={`Banner ${i + 1}: ${s.title.replace(/\*/g, '')}`}
                    onClick={() => show.go(i)}
                    className={cn('h-2.5 rounded-full transition-all duration-500', current ? 'w-9 bg-accent' : 'w-2.5 bg-white/35 hover:bg-white/60')}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { path } = useLoaderData() as { path: string }
  const { data: page } = useSuspenseQuery(queries.page(path))
  return (
    <>
      <Seo description={page.seo?.description ?? page.summary} />
      <HomeHero page={page} />
      <BlockRenderer blocks={page.blocks} />
    </>
  )
}

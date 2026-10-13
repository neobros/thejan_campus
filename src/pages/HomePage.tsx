import { useSuspenseQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLoaderData } from 'react-router'
import { queries } from '@/api/queries'
import type { HeroSlide, Page } from '@/api/types'
import { contentPageLoader } from '@/app/routing'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { ActionButtons } from '@/components/ui/Button'
import { SmartImage } from '@/components/ui/SmartImage'
import { Aurora } from '@/components/motion/effects'
import { Reveal } from '@/components/motion/Reveal'
import { TextReveal } from '@/components/motion/TextReveal'
import { cn } from '@/lib/cn'
import { Seo } from '@/lib/seo'

export const loader = contentPageLoader

/* ------------------------------------------------------------------------------------------------
 * Rotating hero
 * ---------------------------------------------------------------------------------------------- */

function useSlideshow(count: number, interval: number) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  // Auto-advance is off for visitors who prefer reduced motion; they can still use the controls.
  const [playing, setPlaying] = useState(() => !reduced && count > 1)
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
      setCycle((c) => c + 1) // restarts the progress bar
    },
    [count],
  )

  return { index, go, playing, setPlaying, active, setHovered, cycle }
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

  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      aria-roledescription={multiple ? 'carousel' : undefined}
      aria-label={multiple ? 'Highlights' : undefined}
      onMouseEnter={() => show.setHovered(true)}
      onMouseLeave={() => show.setHovered(false)}
      onFocusCapture={() => show.setHovered(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) show.setHovered(false)
      }}
      className="theme-night relative isolate flex min-h-[92svh] items-end overflow-hidden pb-28 pt-[calc(var(--header-h)+4rem)] sm:pb-36 lg:min-h-[54rem]"
    >
      {/* Banner images: crossfade with a slow zoom; the subject sits centre-right, so keep that in view on phones. */}
      <motion.div aria-hidden style={{ y: imageY }} className="absolute inset-0 -z-30">
        <AnimatePresence initial={false}>
          <motion.div
            key={show.index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
            animate={{ opacity: 1, scale: reduced ? 1 : 1.14 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.1, ease: 'easeInOut' },
              scale: { duration: (interval + 1500) / 1000, ease: 'linear' },
            }}
          >
            <SmartImage image={slide.image} priority={show.index === 0} iconless sizes="100vw" className="size-full" imgClassName="object-[65%_center] lg:object-center" />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-t from-[var(--night)] via-[var(--night)]/60 to-[var(--night)]/15" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-r from-[var(--night)]/85 via-[var(--night)]/35 to-transparent" />
      <Aurora className="-z-10 opacity-60 mix-blend-screen" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-50 mask-fade-radial [--grid-color:rgb(255_255_255/0.05)] [--grid-size:72px]" />
      {/* Soft bottom edge: the banner dissolves into the page instead of ending on a hard line. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-b from-transparent to-[var(--page-bg)] sm:h-36" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-page grid items-end gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {/* Announce slide changes only when the visitor is driving them; silent while auto-rotating. */}
          <div aria-live={show.active ? 'off' : 'polite'} aria-atomic="true">
            <AnimatePresence mode="wait" initial={true}>
              <motion.div
                key={show.index}
                role={multiple ? 'group' : undefined}
                aria-roledescription={multiple ? 'slide' : undefined}
                aria-label={multiple ? `${show.index + 1} of ${slides.length}` : undefined}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.22, ease: 'easeIn' } }}
              >
                {slide.eyebrow && (
                  <Reveal immediate y={12} delay={0.1}>
                    <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-sm font-medium text-white/85 backdrop-blur-md">
                      <Sparkles aria-hidden className="size-4 text-gold-300" />
                      {slide.eyebrow}
                    </p>
                  </Reveal>
                )}
                <TextReveal
                  text={slide.title}
                  delay={0.2}
                  stagger={0.07}
                  className={cn(
                    'mt-7 font-display font-semibold leading-[1] tracking-tight text-white',
                    // Long headlines step down one size so every slide fits in the same hero height.
                    slide.title.replace(/\*/g, '').length > 36
                      ? 'text-[2.5rem] sm:text-5xl lg:text-6xl xl:text-7xl'
                      : 'text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.25rem]',
                  )}
                />
                {slide.summary && (
                  <Reveal immediate y={20} delay={0.65}>
                    <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">{slide.summary}</p>
                  </Reveal>
                )}
                <Reveal immediate y={20} delay={0.8}>
                  <ActionButtons actions={slide.actions} onDark className="mt-10" />
                </Reveal>
              </motion.div>
            </AnimatePresence>
          </div>

          {multiple && (
            <Reveal immediate y={12} delay={1.1} className="mt-10 flex flex-wrap items-center gap-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => show.go(show.index - 1)}
                  aria-label="Previous banner"
                  className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/[0.06] text-white backdrop-blur-md transition-colors hover:bg-white/15"
                >
                  <ChevronLeft aria-hidden className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => show.go(show.index + 1)}
                  aria-label="Next banner"
                  className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/[0.06] text-white backdrop-blur-md transition-colors hover:bg-white/15"
                >
                  <ChevronRight aria-hidden className="size-5" />
                </button>
              </div>
              <div className="flex items-center gap-2" role="tablist" aria-label="Choose banner">
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
                      className={cn(
                        'relative h-2 overflow-hidden rounded-full bg-white/25 transition-[width,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/45',
                        current ? 'w-12' : 'w-2',
                      )}
                    >
                      {current && (
                        <span
                          key={`${show.index}-${show.cycle}`}
                          aria-hidden
                          style={{ '--hero-interval': `${interval}ms` } as CSSProperties}
                          className={cn('absolute inset-0 origin-left rounded-full bg-gold-300 animate-hero-progress', !show.active && '[animation-play-state:paused]')}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
              <button
                type="button"
                onClick={() => show.setPlaying((p) => !p)}
                aria-pressed={show.playing}
                aria-label={show.playing ? 'Pause banner rotation' : 'Play banner rotation'}
                className="grid size-10 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {show.playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
              </button>
            </Reveal>
          )}
        </div>
      </motion.div>
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

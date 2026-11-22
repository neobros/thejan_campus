import { motion, useReducedMotion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Aurora } from '@/components/motion/effects'
import { Seo } from '@/lib/seo'

const EASE = [0.16, 1, 0.3, 1] as const

/** Branded "Coming Soon" screen for pages that are not live yet. */
export default function ComingSoonPage() {
  const reduced = useReducedMotion()
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  })

  return (
    <section className="relative isolate flex min-h-[90svh] items-center justify-center overflow-hidden bg-canvas px-6 pb-16 pt-[calc(var(--header-h)+2rem)] text-center">
      <Seo title="Coming Soon" description="This page is on its way — explore AIT’s story and vision in the meantime." noindex />
      {/* Ambient brand glow + grid. */}
      <Aurora intensity="soft" className="-z-10 opacity-70" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background:radial-gradient(45%_45%_at_18%_22%,rgb(37_99_235/0.10),transparent_60%),radial-gradient(42%_46%_at_86%_20%,rgb(229_0_34/0.08),transparent_62%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-60 mask-fade-radial [--grid-color:rgb(6_20_82/0.045)] [--grid-size:64px]" />

      {/* Floating decorative orbs. */}
      {!reduced && (
        <>
          <motion.span
            aria-hidden
            className="absolute left-[12%] top-[26%] -z-10 size-24 rounded-full bg-brand-500/15 blur-2xl"
            animate={{ y: [0, -18, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            aria-hidden
            className="absolute bottom-[22%] right-[14%] -z-10 size-28 rounded-full bg-accent/10 blur-2xl"
            animate={{ y: [0, 16, 0], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </>
      )}

      <div className="relative flex max-w-xl flex-col items-center gap-7">
        {/* Logo badge. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="animate-float"
        >
          <div className="grid place-items-center rounded-[1.75rem] border border-line bg-white px-8 py-6 shadow-card ring-1 ring-black/5">
            <img src="/brand/crest-800.png" srcSet="/brand/crest-800.png 800w, /brand/crest-1536.png 1536w" width={800} height={486} alt="AIT" className="h-20 w-auto sm:h-24" />
          </div>
        </motion.div>

        <motion.p {...rise(0.25)} className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          <Sparkles aria-hidden className="size-3.5 animate-pulse" />
          Australian Institute of Technology
        </motion.p>

        <motion.h1 {...rise(0.35)} className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
          Coming <span className="animate-gradient text-gradient-brand">Soon</span>
        </motion.h1>

        <motion.p {...rise(0.5)} className="max-w-md text-lg leading-relaxed text-ink-muted">
          We’re putting the finishing touches on this page. In the meantime, discover the story and vision behind AIT.
        </motion.p>

        {/* Animated progress shimmer. */}
        <motion.div {...rise(0.6)} className="relative h-1.5 w-56 overflow-hidden rounded-full bg-surface-muted">
          <span className="animate-loader absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-accent to-brand-500" />
        </motion.div>

        <motion.div {...rise(0.7)} className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <ButtonLink href="/about" variant="accent" size="lg" arrow>
            Discover AIT
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" size="lg">
            Back to Home
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  )
}

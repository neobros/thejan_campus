import { RefreshCw, TriangleAlert } from 'lucide-react'
import { isRouteErrorResponse, useRevalidator, useRouteError } from 'react-router'
import { isNotFound } from '@/api/errors'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Aurora, GridBackdrop } from '@/components/motion/effects'
import { Seo } from '@/lib/seo'
import { NotFoundContent } from './NotFoundPage'

function is404(error: unknown) {
  return isNotFound(error) || (isRouteErrorResponse(error) && error.status === 404)
}

/** Errors inside the site layout: 404s show the not-found page; anything else offers a retry. */
export function RouteErrorBoundary() {
  const error = useRouteError()
  const revalidator = useRevalidator()
  if (is404(error)) return <NotFoundContent />
  if (import.meta.env.DEV) console.error(error)
  return (
    <section className="relative isolate overflow-hidden bg-canvas-alt pb-24 pt-[calc(var(--header-h)+5rem)]">
      <Seo title="Something went wrong" noindex />
      <Aurora intensity="soft" className="-z-10" />
      <GridBackdrop className="-z-10" />
      <div className="container-page max-w-2xl text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-warning-soft text-warning">
          <TriangleAlert aria-hidden className="size-7" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-semibold text-ink">This page didn’t load properly</h1>
        <p className="mt-4 text-lg text-ink-muted">
          It may be a temporary problem with our service or your connection. Anything you typed into a form on another page is unaffected.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => revalidator.revalidate()} loading={revalidator.state === 'loading'} icon={<RefreshCw aria-hidden className="size-4" />}>
            Try again
          </Button>
          <ButtonLink href="/contact" variant="secondary">
            Contact us
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

/**
 * Last-resort screen when the site shell itself cannot load (e.g. the settings API is down).
 * It cannot rely on CMS settings, so it is fully self-contained.
 */
export function RootErrorBoundary() {
  const error = useRouteError()
  if (import.meta.env.DEV) console.error(error)
  return (
    <main className="theme-night relative isolate grid min-h-svh place-items-center overflow-hidden px-6 text-center">
      <title>Service temporarily unavailable</title>
      <meta name="robots" content="noindex" />
      <Aurora />
      <div className="max-w-lg">
        <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">We’ll be right back</h1>
        <p className="mt-4 text-lg text-white/70">
          The website couldn’t load just now. Please check your connection and try again in a moment.
        </p>
        <Button className="mt-8" variant="accent" size="lg" onClick={() => window.location.reload()} icon={<RefreshCw aria-hidden className="size-4" />}>
          Reload the page
        </Button>
      </div>
    </main>
  )
}

/** Branded splash shown while the site loads on first visit. */
export function BootScreen() {
  return (
    <div className="grid min-h-svh place-items-center bg-canvas" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="flex flex-col items-center gap-7 px-6 text-center">
        <div className="animate-float">
          <img src="/brand/logo-400.png" alt="" width={800} height={213} className="h-11 w-auto dark:hidden" />
          <img src="/brand/logo-white-400.png" alt="" width={800} height={213} className="hidden h-11 w-auto dark:block" />
        </div>
        <p className="animate-gradient text-shimmer-ink text-[0.72rem] font-semibold uppercase tracking-[0.3em] dark:text-shimmer-white">
          Australian Institute of Technology
        </p>
        <div className="relative h-1 w-44 overflow-hidden rounded-full bg-line">
          <span className="animate-loader absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-gold-500 to-brand-500" />
        </div>
      </div>
    </div>
  )
}

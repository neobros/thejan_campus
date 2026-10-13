import type { ReactNode } from 'react'
import type { Action } from '@/api/types'
import { cn } from '@/lib/cn'
import { ActionButtons } from '@/components/ui/Button'
import { Aurora } from '@/components/motion/effects'
import { Reveal } from '@/components/motion/Reveal'

/** Dark, glowing call-to-action panel used to close pages. */
export function CtaBanner({
  eyebrow,
  heading,
  body,
  actions,
  className,
  children,
}: {
  eyebrow?: string
  heading: string
  body?: ReactNode
  actions?: Action[]
  className?: string
  children?: ReactNode
}) {
  return (
    <Reveal y={32} scale={0.98} className={cn('theme-night relative isolate overflow-hidden rounded-[2.25rem] px-6 py-14 sm:px-12 sm:py-20', className)}>
      <Aurora />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-40 mask-fade-radial [--grid-color:rgb(255_255_255/0.06)]" />
      <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full border border-white/10" />
      <div aria-hidden className="absolute -right-10 -top-10 size-52 rounded-full border border-white/10" />
      <div className="relative mx-auto max-w-3xl text-center">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">{eyebrow}</p>}
        <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">{heading}</h2>
        {body && <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{body}</p>}
        {children}
        <ActionButtons actions={actions} onDark className="mt-9 justify-center" />
      </div>
    </Reveal>
  )
}

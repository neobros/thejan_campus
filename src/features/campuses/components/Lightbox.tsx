import { Captions, ChevronLeft, ChevronRight, ExternalLink, FileText, Play, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Dialog } from 'radix-ui'
import { useState, type KeyboardEvent } from 'react'
import type { GalleryItem } from '@/api/types'
import { AppLink } from '@/components/ui/AppLink'
import { Badge } from '@/components/ui/Badge'
import { SmartImage } from '@/components/ui/SmartImage'
import { cn } from '@/lib/cn'
import { EASE_OUT_EXPO } from '@/lib/motion'

export interface LightboxEntry {
  item: GalleryItem
  album: string
}

const navButton =
  'grid size-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-night disabled:pointer-events-none disabled:opacity-40'

function Media({ item }: { item: GalleryItem }) {
  const width = item.image.width ?? 4
  const height = item.image.height ?? 3
  const ratio = width / height
  return (
    <div className="relative mx-auto overflow-hidden rounded-2xl" style={{ aspectRatio: `${width} / ${height}`, width: `min(100%, calc(62dvh * ${ratio}))` }}>
      <SmartImage image={item.image} className="size-full bg-transparent" imgClassName="object-contain" sizes="(min-width: 1024px) 64rem, 100vw" />
      {item.kind === 'video' && (
        <div aria-hidden className="absolute inset-0 grid place-items-center bg-night/30">
          <span className="grid size-20 place-items-center rounded-full bg-white/90 text-night shadow-float ring-8 ring-white/15">
            <Play className="ml-1 size-8 fill-current" />
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Accessible gallery lightbox: focus is trapped and returned, ←/→ (and swipe) move between items,
 * a live region announces the new caption. Videos never autoplay — captions/transcripts are linked.
 */
export function Lightbox({
  entries,
  index,
  onIndexChange,
  onClose,
  onCloseAutoFocus,
}: {
  entries: LightboxEntry[]
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  onCloseAutoFocus?: (event: Event) => void
}) {
  const [direction, setDirection] = useState(1)
  const open = index !== null && entries.length > 0
  const current = open ? entries[Math.min(index, entries.length - 1)] : null
  const total = entries.length
  const position = (index ?? 0) + 1

  const go = (delta: number) => {
    if (index === null || total < 2) return
    setDirection(delta)
    onIndexChange((index + delta + total) % total)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(-1)
    }
  }

  const credit = current ? (current.item.credit ?? current.item.image.credit) : undefined
  const kindLabel = current?.item.kind === 'video' ? 'Video' : 'Photo'

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence>
        {open && current && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div className="fixed inset-0 z-[90] bg-night/85 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount onKeyDown={onKeyDown} onCloseAutoFocus={onCloseAutoFocus}>
              <motion.div
                className="theme-night fixed inset-x-2 top-1/2 z-[91] mx-auto flex max-h-[calc(100dvh-1rem)] max-w-6xl -translate-y-1/2 flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-night shadow-float outline-none sm:inset-x-6"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <div className="flex items-center justify-between gap-4 px-4 pb-2 pt-4 sm:px-6">
                  <div className="min-w-0">
                    <Dialog.Title className="truncate font-display text-lg font-semibold text-ink">{current.album}</Dialog.Title>
                    <p className="text-sm tabular-nums text-ink-subtle">
                      {kindLabel} {position} of {total}
                    </p>
                  </div>
                  <Dialog.Close aria-label="Close gallery" className={navButton}>
                    <X aria-hidden className="size-5" />
                  </Dialog.Close>
                </div>

                <div className="relative flex min-h-0 flex-1 items-center gap-3 overflow-hidden px-3 py-2 sm:px-6">
                  {total > 1 && (
                    <button type="button" onClick={() => go(-1)} aria-label="Previous item" className={cn(navButton, 'hidden sm:grid')}>
                      <ChevronLeft aria-hidden className="size-5" />
                    </button>
                  )}
                  <div className="relative min-w-0 flex-1">
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                      <motion.div
                        key={current.item.id}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 48 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -48 }}
                        transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                        drag={total > 1 ? 'x' : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.25}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -60) go(1)
                          else if (info.offset.x > 60) go(-1)
                        }}
                        className="touch-pan-y"
                      >
                        <Media item={current.item} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  {total > 1 && (
                    <button type="button" onClick={() => go(1)} aria-label="Next item" className={cn(navButton, 'hidden sm:grid')}>
                      <ChevronRight aria-hidden className="size-5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-5 pt-3 sm:flex-row sm:items-start sm:justify-between sm:px-6">
                  <div className="min-w-0 max-w-3xl">
                    <Dialog.Description className="leading-relaxed text-ink">{current.item.caption}</Dialog.Description>
                    {credit && <p className="mt-1 text-sm text-ink-subtle">Credit: {credit}</p>}
                    {current.item.kind === 'video' && (
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <Badge tone="glass">
                          <Captions aria-hidden className="size-3.5" />
                          Captions and transcript provided
                        </Badge>
                        {current.item.videoUrl && (
                          <AppLink href={current.item.videoUrl} className="inline-flex items-center gap-1.5 font-semibold text-primary-ink underline-offset-4 hover:underline">
                            Watch the video <ExternalLink aria-hidden className="size-3.5" />
                          </AppLink>
                        )}
                        {current.item.transcriptUrl && (
                          <AppLink href={current.item.transcriptUrl} className="inline-flex items-center gap-1.5 font-semibold text-primary-ink underline-offset-4 hover:underline">
                            <FileText aria-hidden className="size-3.5" /> Read the transcript
                          </AppLink>
                        )}
                        {!current.item.videoUrl && <span className="text-ink-subtle">The video will be published here soon. It never plays automatically.</span>}
                      </div>
                    )}
                  </div>
                  {total > 1 && (
                    <div className="flex shrink-0 items-center gap-2 sm:hidden">
                      <button type="button" onClick={() => go(-1)} aria-label="Previous item" className={navButton}>
                        <ChevronLeft aria-hidden className="size-5" />
                      </button>
                      <button type="button" onClick={() => go(1)} aria-label="Next item" className={navButton}>
                        <ChevronRight aria-hidden className="size-5" />
                      </button>
                    </div>
                  )}
                </div>
                <p aria-live="polite" aria-atomic="true" className="sr-only">
                  {`${kindLabel} ${position} of ${total}: ${current.item.caption}`}
                </p>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, Captions, Expand, Images, Play } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { queries } from '@/api/queries'
import type { GalleryAlbum, GalleryItem } from '@/api/types'
import { ModuleSection } from '@/components/blocks/ModuleSection'
import { moduleProp, type ModuleComponentProps } from '@/components/blocks/types'
import { AppLink } from '@/components/ui/AppLink'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { CardGridSkeleton, EmptyState, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { SmartImage } from '@/components/ui/SmartImage'
import { SegmentedControl } from '@/components/ui/Tabs'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import { pluralize } from '@/lib/format'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { Lightbox, type LightboxEntry } from './components/Lightbox'

/** Rhythm of thumbnail shapes for the masonry columns (the lightbox always shows the full image). */
const SHAPES = ['aspect-[4/5]', 'aspect-[4/3]', 'aspect-square', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-[16/11]']

function itemCount(items: GalleryItem[]) {
  const videos = items.filter((i) => i.kind === 'video').length
  const photos = items.length - videos
  return [photos ? pluralize(photos, 'photo') : null, videos ? pluralize(videos, 'video') : null].filter(Boolean).join(' · ')
}

function AlbumCover({ album }: { album: GalleryAlbum }) {
  return (
    <article className="theme-night group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[1.75rem] p-6 shadow-card focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-canvas sm:aspect-[4/4.4]">
      <SmartImage image={album.cover} hoverZoom className="absolute inset-0 -z-20" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/55 to-transparent" />
      <Badge tone="glass" className="mb-auto self-start">
        <Images aria-hidden className="size-3" />
        {itemCount(album.items)}
      </Badge>
      <h3 className="mt-10 font-display text-2xl font-semibold leading-tight text-white">
        <AppLink href={`/gallery?album=${encodeURIComponent(album.slug)}`} className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
          {album.title}
        </AppLink>
      </h3>
      <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-white/75">{album.description}</p>
      <span aria-hidden className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
        Open album
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </article>
  )
}

function Tile({ item, index, onOpen }: { item: GalleryItem; index: number; onOpen: () => void }) {
  const video = item.kind === 'video'
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: Math.min(index, 10) * 0.05, ease: EASE_OUT_EXPO }}
      className="mb-5 break-inside-avoid"
    >
      <figure>
        <button
          type="button"
          data-gallery-index={index}
          onClick={onOpen}
          aria-haspopup="dialog"
          aria-label={`${video ? 'Open video details' : 'View larger'}: ${item.image.alt || item.caption}`}
          className={cn(
            'group relative block w-full overflow-hidden rounded-3xl border border-line bg-surface-muted shadow-card transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-card-hover',
            video ? 'aspect-video' : SHAPES[index % SHAPES.length],
          )}
        >
          <SmartImage image={item.image} hoverZoom className="absolute inset-0" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {video ? (
            <>
              <span aria-hidden className="absolute inset-0 grid place-items-center">
                <span className="grid size-16 place-items-center rounded-full bg-white/90 text-night shadow-float ring-8 ring-white/20 transition-transform duration-500 group-hover:scale-110">
                  <Play className="ml-1 size-6 fill-current" />
                </span>
              </span>
              <span aria-hidden className="absolute left-3 top-3 flex gap-1.5">
                <Badge tone="glass">Video</Badge>
                <Badge tone="glass">
                  <Captions className="size-3" />
                  CC
                </Badge>
              </span>
            </>
          ) : (
            <span
              aria-hidden
              className="absolute bottom-3 right-3 grid size-10 translate-y-2 place-items-center rounded-full bg-white/90 text-night opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
            >
              <Expand className="size-4" />
            </span>
          )}
        </button>
        <figcaption className="mt-2.5 px-1 text-sm leading-relaxed text-ink-muted">{item.caption}</figcaption>
      </figure>
    </motion.li>
  )
}

/**
 * Gallery albums (spec §5.25). Full mode: album filter (`?album=` in the URL), masonry grid and an
 * accessible lightbox. With `limit` (preview mode) it shows album covers linking to the gallery.
 */
export function GalleryAlbumsModule({ block, className }: ModuleComponentProps) {
  const limit = moduleProp<number | null>(block, 'limit', null)
  const { data, isPending, isError, refetch } = useQuery(queries.gallery())
  const albums = (data ?? []).filter((a) => a.items.length > 0)
  const [params, setParams] = useSearchParams()
  const [lightbox, setLightbox] = useState<number | null>(null)
  const grid = useRef<HTMLUListElement>(null)
  const lastIndex = useRef(0)
  const show = (index: number) => {
    lastIndex.current = index
    setLightbox(index)
  }

  if (limit) {
    if (!isPending && !isError && albums.length === 0) return null
    return (
      <ModuleSection
        block={block}
        className={className}
        action={
          <ButtonLink href="/gallery" variant="secondary" arrow>
            View gallery
          </ButtonLink>
        }
      >
        {isPending ? (
          <CardGridSkeleton count={Math.min(limit, 3)} />
        ) : isError ? (
          <ErrorPanel onRetry={() => refetch()} />
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {albums.slice(0, limit).map((album) => (
              <StaggerItem key={album.id}>
                <AlbumCover album={album} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </ModuleSection>
    )
  }

  const requested = params.get('album')
  const active = albums.find((a) => a.slug === requested) ?? null
  const shown = active ? [active] : albums
  const entries: LightboxEntry[] = shown.flatMap((album) => album.items.map((item) => ({ item, album: album.title })))

  const setAlbum = (slug: string) => {
    setLightbox(null)
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (slug === 'all') next.delete('album')
        else next.set('album', slug)
        return next
      },
      { replace: true, preventScrollReset: true },
    )
  }

  return (
    <ModuleSection block={block} className={className}>
      {isPending ? (
        <LoadingRegion className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {['h-80', 'h-56', 'h-64', 'h-72', 'h-60', 'h-80'].map((h, i) => (
            <Skeleton key={i} className={cn('mb-5 break-inside-avoid rounded-3xl', h)} />
          ))}
        </LoadingRegion>
      ) : isError ? (
        <ErrorPanel onRetry={() => refetch()} />
      ) : albums.length === 0 ? (
        <EmptyState icon={Images} title="Our gallery is coming soon" description="Photos and videos of our campuses, facilities and activities will be published here." />
      ) : (
        <>
          <Reveal className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            {albums.length > 1 && (
              <div className="min-w-0">
                <p className="mb-2 text-sm font-semibold text-ink">Album</p>
                <SegmentedControl
                  label="Album"
                  value={active?.slug ?? 'all'}
                  onChange={setAlbum}
                  options={[{ value: 'all', label: 'All' }, ...albums.map((a) => ({ value: a.slug, label: a.title }))]}
                />
              </div>
            )}
            <p aria-live="polite" className="max-w-xl text-ink-muted lg:text-right">
              {active ? (
                <>
                  <span className="font-semibold text-ink">{itemCount(active.items)}</span> — {active.description}
                </>
              ) : (
                <>
                  <span className="font-semibold text-ink">{itemCount(entries.map((e) => e.item))}</span> across {pluralize(albums.length, 'album')}
                </>
              )}
            </p>
          </Reveal>
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={active?.slug ?? 'all'}
              ref={grid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="columns-1 gap-5 min-[480px]:columns-2 lg:columns-3"
            >
              {entries.map((entry, index) => (
                <Tile key={entry.item.id} item={entry.item} index={index} onOpen={() => show(index)} />
              ))}
            </motion.ul>
          </AnimatePresence>
          <Lightbox
            entries={entries}
            index={lightbox}
            onIndexChange={show}
            onClose={() => setLightbox(null)}
            onCloseAutoFocus={(event) => {
              // Return focus to the thumbnail of the item last viewed, not the one first opened.
              const target = grid.current?.querySelector<HTMLButtonElement>(`[data-gallery-index="${lastIndex.current}"]`)
              if (target) {
                event.preventDefault()
                target.focus()
              }
            }}
          />
        </>
      )}
    </ModuleSection>
  )
}

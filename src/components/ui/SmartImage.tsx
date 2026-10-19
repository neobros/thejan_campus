import { useState } from 'react'
import type { ImageAsset } from '@/api/types'
import { cn } from '@/lib/cn'
import { hashString, meshStyle, PALETTES } from '@/lib/palette'
import { Icon } from './Icon'

type Pattern = 'rings' | 'stripes' | 'dots' | 'waves'
const PATTERNS: Pattern[] = ['rings', 'stripes', 'dots', 'waves']

function PatternSvg({ pattern, seed }: { pattern: Pattern; seed: number }) {
  const ox = 300 + (seed % 60)
  const oy = 40 + ((seed >> 4) % 60)
  return (
    <svg aria-hidden viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
      {pattern === 'rings' && (
        <g fill="none" stroke="white" strokeOpacity="0.13" strokeWidth="1.5">
          {[50, 95, 140, 185, 230].map((r) => (
            <circle key={r} cx={ox} cy={oy} r={r} />
          ))}
        </g>
      )}
      {pattern === 'stripes' && (
        <g stroke="white" strokeOpacity="0.1" strokeWidth="16" strokeLinecap="round">
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i} x1={-60 + i * 76} y1="330" x2={150 + i * 76} y2="-30" />
          ))}
        </g>
      )}
      {pattern === 'dots' && (
        <g fill="white" fillOpacity="0.16">
          {Array.from({ length: 48 }, (_, i) => (
            <circle key={i} cx={210 + (i % 8) * 26} cy={40 + Math.floor(i / 8) * 26} r={1.6 + (i % 3) * 0.6} />
          ))}
        </g>
      )}
      {pattern === 'waves' && (
        <g fill="none" stroke="white" strokeOpacity="0.14" strokeWidth="2">
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M-20 ${190 + i * 26} C 80 ${160 + i * 26}, 160 ${220 + i * 26}, 260 ${190 + i * 26} S 420 ${180 + i * 26}, 440 ${200 + i * 26}`} />
          ))}
        </g>
      )}
    </svg>
  )
}

/** Designed stand-in for an image slot that has not been supplied yet. */
export function ImagePlaceholder({
  image,
  className,
  showLabel = import.meta.env.DEV,
  iconless,
}: {
  image: ImageAsset
  className?: string
  showLabel?: boolean
  /** Hide the icon badge (e.g. behind hero text). */
  iconless?: boolean
}) {
  const palette = PALETTES[image.tone ?? 'brand']
  const seed = hashString(image.slot ?? image.alt)
  const pattern = PATTERNS[seed % PATTERNS.length]
  return (
    <div
      role={image.alt ? 'img' : undefined}
      aria-label={image.alt || undefined}
      aria-hidden={image.alt ? undefined : true}
      className={cn('relative isolate size-full overflow-hidden', className)}
      style={meshStyle(palette)}
    >
      <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.2] mix-blend-overlay" />
      <PatternSvg pattern={pattern} seed={seed} />
      <div
        aria-hidden
        className="absolute -right-12 -top-12 size-44 rounded-full opacity-50 blur-3xl animate-float-slow"
        style={{ background: palette.light }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      {!iconless && (
        <div aria-hidden className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-xl bg-white/14 ring-1 ring-white/25 backdrop-blur-md">
          <Icon name={image.icon ?? 'image'} className="size-[1.15rem] text-white" />
        </div>
      )}
      {showLabel && image.slot && (
        <span className="absolute left-2 top-2 max-w-[60%] truncate rounded-md bg-black/45 px-2 py-0.5 font-mono text-[10px] text-white/85 backdrop-blur-sm">
          {image.slot}
          {image.width && image.height ? ` · ${image.width}×${image.height}` : ''}
        </span>
      )}
    </div>
  )
}

export interface SmartImageProps {
  image: ImageAsset
  className?: string
  imgClassName?: string
  /** Above-the-fold images: load eagerly with high priority. */
  priority?: boolean
  sizes?: string
  /** Gentle zoom when an ancestor with `group` is hovered. */
  hoverZoom?: boolean
  /** Placeholder without the icon badge (for images behind text). */
  iconless?: boolean
}

/**
 * Renders a CMS image with a smooth fade/blur-in, or the designed placeholder while the approved
 * file is missing (or fails to load). The wrapper fills its parent — size it with aspect-* classes.
 */
export function SmartImage({ image, className, imgClassName, priority, sizes = '100vw', hoverZoom, iconless }: SmartImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const zoom = hoverZoom && 'transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]'

  if (!image.src || failed) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        <div className={cn('size-full', zoom)}>
          <ImagePlaceholder image={image} iconless={iconless} />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden bg-surface-muted @container', className)}>
      {/* Animated loading shimmer until the lazy image has decoded (avoids a flat colour block on scroll). */}
      {!loaded && <div aria-hidden className="skeleton absolute inset-0" />}
      <img
        src={image.src}
        srcSet={image.srcSet}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        style={image.focus ? { objectPosition: image.focus } : undefined}
        className={cn(
          'size-full object-cover transition-[opacity,filter,scale] duration-700 ease-out',
          loaded ? 'scale-100 opacity-100 blur-0' : 'scale-[1.03] opacity-0 blur-md',
          zoom,
          imgClassName,
        )}
      />
      {image.credit && (
        <span className="absolute bottom-2 right-2 rounded bg-black/45 px-1.5 py-0.5 text-[10px] text-white/80">{image.credit}</span>
      )}
      {image.concept && (
        // Required by the image pack's terms: concept renders of real places stay labelled until a photo replaces them.
        <span
          title="AI concept image — to be replaced with an approved photograph"
          className="absolute left-2 top-2 inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm @max-[14rem]:px-1.5 @max-[14rem]:text-[9px]"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-gold-300" />
          <span className="@max-[14rem]:hidden">Concept image</span>
          <span className="hidden @max-[14rem]:inline">Concept</span>
        </span>
      )}
    </div>
  )
}

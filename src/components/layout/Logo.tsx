import { useSettings } from '@/api/queries'
import { cn } from '@/lib/cn'
import { AppLink } from '@/components/ui/AppLink'

/**
 * AIT logo (book + figure + wordmark), supplied by the client as a transparent PNG.
 * `onDark` swaps to the white wordmark version for the hero header, footer and dark theme.
 * Files: public/brand/logo*.png (colour and white, 800px + 400px). The 800 × 213 image is 3.76:1 —
 * the mark and wordmark are composed from the clean mark + "AIT" with deliberate breathing room.
 */
export function LogoImage({ onDark, className }: { onDark?: boolean; className?: string }) {
  const base = onDark ? '/brand/logo-white' : '/brand/logo'
  return (
    <img
      src={`${base}-400.png`}
      srcSet={`${base}-400.png 400w, ${base}.png 800w`}
      sizes="(min-width: 640px) 176px, 150px"
      width={800}
      height={213}
      alt=""
      decoding="async"
      className={cn('h-9 w-auto select-none sm:h-[2.9rem]', className)}
      draggable={false}
    />
  )
}

export function Logo({ onDark, className }: { onDark?: boolean; className?: string }) {
  const settings = useSettings()
  return (
    <AppLink
      href="/"
      className={cn('group flex min-w-0 items-center rounded-xl', className)}
      aria-label={`${settings.name} — home`}
    >
      <LogoImage
        onDark={onDark}
        className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
      />
    </AppLink>
  )
}

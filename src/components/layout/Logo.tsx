import { useSettings } from '@/api/queries'
import { cn } from '@/lib/cn'
import { AppLink } from '@/components/ui/AppLink'

/**
 * The full AIT crest (emblem + "Australian Institute of Technology" + tagline), supplied by the client.
 * It sits on a white badge so the red/navy artwork and navy lettering keep full contrast in both the
 * light and dark themes. Files: public/brand/crest-800.png (+ 1536 for retina).
 */
export function LogoImage({ className }: { className?: string }) {
  return (
    <img
      src="/brand/crest-800.png"
      srcSet="/brand/crest-800.png 800w, /brand/crest-1536.png 1536w"
      sizes="(min-width: 640px) 142px, 112px"
      width={800}
      height={515}
      alt=""
      decoding="async"
      className={cn('h-14 w-auto select-none sm:h-[4.5rem]', className)}
      draggable={false}
    />
  )
}

export function Logo({ className }: { className?: string }) {
  const settings = useSettings()
  return (
    <AppLink
      href="/"
      className={cn('group flex min-w-0 items-center rounded-xl', className)}
      aria-label={`${settings.name} — home`}
    >
      <span className="inline-flex items-center rounded-xl bg-white px-2 py-1 shadow-sm ring-1 ring-black/5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
        <LogoImage />
      </span>
    </AppLink>
  )
}

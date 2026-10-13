import type { StaffProfile } from '@/api/types'
import { SmartImage } from '@/components/ui/SmartImage'
import { cn } from '@/lib/cn'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/** Approved photograph when supplied, otherwise an elegant monogram (portraits are never generated). */
export function PersonAvatar({ person, className, textClassName }: { person: Pick<StaffProfile, 'name' | 'photo'>; className?: string; textClassName?: string }) {
  if (person.photo?.src) {
    return <SmartImage image={person.photo} className={cn('shrink-0 rounded-full ring-4 ring-surface', className)} sizes="160px" />
  }
  return (
    <span
      aria-hidden
      className={cn(
        'relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-primary-soft via-surface to-accent-soft text-on-primary-soft ring-1 ring-line',
        className,
      )}
    >
      <span className="absolute inset-[3px] rounded-full ring-1 ring-primary/15" />
      <span className={cn('font-display font-semibold tracking-tight', textClassName)}>{initials(person.name)}</span>
    </span>
  )
}

import { Sparkles, type LucideProps } from 'lucide-react'
import { iconRegistry, type IconName } from './icon-names'

/** Renders an icon referenced by name in CMS data. Unknown names fall back gracefully. */
export function Icon({ name, ...props }: LucideProps & { name?: IconName | string | null }) {
  const Component = (name && iconRegistry[name as IconName]) || Sparkles
  return <Component aria-hidden strokeWidth={1.75} {...props} />
}

export type { IconName }

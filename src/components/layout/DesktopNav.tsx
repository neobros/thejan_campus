import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react'
import { LayoutGroup, motion } from 'motion/react'
import { NavigationMenu } from 'radix-ui'
import { useState } from 'react'
import { useLocation } from 'react-router'
import { queries } from '@/api/queries'
import type { NavGroup, NavItem, NavLeaf } from '@/api/types'
import { cn } from '@/lib/cn'
import { pluralize } from '@/lib/format'
import { EASE_OUT_EXPO, springSnappy } from '@/lib/motion'
import { PALETTES } from '@/lib/palette'
import { AppLink } from '@/components/ui/AppLink'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { SmartImage } from '@/components/ui/SmartImage'
import { Aurora } from '@/components/motion/effects'

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function itemActive(pathname: string, item: NavItem) {
  return isActive(pathname, item.href) || Boolean(item.groups?.some((g) => g.items.some((leaf) => isActive(pathname, leaf.href))))
}

type HoverState = { hover: string | null; setHover: (key: string | null) => void }

const enter = (index: number, group: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: EASE_OUT_EXPO, delay: 0.05 + group * 0.06 + index * 0.035 },
})

/** Coloured tile entry (study areas). */
function TileLeaf({ leaf, count, state, index, group }: { leaf: NavLeaf; count?: number; state: HoverState; index: number; group: number }) {
  const key = leaf.href
  const palette = PALETTES[leaf.tone ?? 'brand']
  return (
    <motion.li {...enter(index, group)}>
      <NavigationMenu.Link asChild>
        <AppLink
          href={leaf.href}
          onMouseEnter={() => state.setHover(key)}
          onFocus={() => state.setHover(key)}
          className="group/leaf relative flex items-center gap-3 rounded-2xl p-2.5 pr-3 outline-none"
        >
          {state.hover === key && (
            <motion.span layoutId="nav-hover" transition={springSnappy} className="absolute inset-0 -z-10 rounded-2xl bg-surface-muted ring-1 ring-line" />
          )}
          <span
            className="grid size-11 shrink-0 place-items-center rounded-xl text-white shadow-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/leaf:-rotate-6 group-hover/leaf:scale-110"
            style={{ background: `linear-gradient(135deg, ${palette.mid}, ${palette.deep})`, boxShadow: `0 8px 20px -10px ${palette.mid}` }}
          >
            <Icon name={leaf.icon ?? 'book-open'} className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.9375rem] font-semibold leading-snug text-ink">{leaf.label}</span>
            <span className="block text-xs text-ink-subtle">{count !== undefined ? pluralize(count, 'course') : 'View courses'}</span>
          </span>
          <ArrowRight aria-hidden className="size-4 -translate-x-1 text-ink-subtle opacity-0 transition-all duration-300 group-hover/leaf:translate-x-0 group-hover/leaf:opacity-100" />
        </AppLink>
      </NavigationMenu.Link>
    </motion.li>
  )
}

/** Standard entry with icon chip and description. */
function ListLeaf({ leaf, state, index, group }: { leaf: NavLeaf; state: HoverState; index: number; group: number }) {
  const key = leaf.href
  return (
    <motion.li {...enter(index, group)}>
      <NavigationMenu.Link asChild>
        <AppLink
          href={leaf.href}
          onMouseEnter={() => state.setHover(key)}
          onFocus={() => state.setHover(key)}
          className="group/leaf relative flex items-start gap-3 rounded-2xl p-3 outline-none"
        >
          {state.hover === key && (
            <motion.span layoutId="nav-hover" transition={springSnappy} className="absolute inset-0 -z-10 rounded-2xl bg-surface-muted ring-1 ring-line" />
          )}
          {leaf.icon && (
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-on-primary-soft transition-all duration-300 group-hover/leaf:bg-primary group-hover/leaf:text-on-primary">
              <Icon name={leaf.icon} className="size-[1.1rem]" />
            </span>
          )}
          <span className="min-w-0">
            <span className="flex items-center gap-1 text-[0.9375rem] font-semibold text-ink">
              {leaf.label}
              <ArrowRight aria-hidden className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover/leaf:translate-x-0 group-hover/leaf:opacity-100" />
            </span>
            {leaf.description && <span className="mt-0.5 block text-sm leading-snug text-ink-subtle">{leaf.description}</span>}
          </span>
        </AppLink>
      </NavigationMenu.Link>
    </motion.li>
  )
}

function PanelGroup({ group, index, state, counts }: { group: NavGroup; index: number; state: HoverState; counts: Map<string, number> }) {
  const tiles = group.items.some((leaf) => leaf.tone)
  return (
    <div className="p-2">
      <motion.p {...enter(0, index)} className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
        {group.title}
      </motion.p>
      <ul className={cn(tiles ? 'grid grid-cols-2 gap-1 gap-x-2' : 'space-y-0.5')}>
        {group.items.map((leaf, i) =>
          tiles ? (
            <TileLeaf key={leaf.href} leaf={leaf} count={counts.get(leaf.href)} state={state} index={i} group={index} />
          ) : (
            <ListLeaf key={leaf.href} leaf={leaf} state={state} index={i} group={index} />
          ),
        )}
      </ul>
    </div>
  )
}

function Promo({ promo, index }: { promo: NonNullable<NavItem['promo']>; index: number }) {
  return (
    <motion.div {...enter(0, index)} className="p-2">
      <NavigationMenu.Link asChild>
        <AppLink
          href={promo.href}
          className="theme-night group/promo relative isolate flex h-full min-h-[17rem] flex-col justify-end overflow-hidden rounded-[1.4rem] p-5 text-white outline-none ring-1 ring-white/10 focus-visible:ring-2 focus-visible:ring-accent"
        >
          {promo.image?.src ? (
            <SmartImage image={promo.image} className="absolute inset-0 -z-20" hoverZoom sizes="320px" />
          ) : (
            <>
              <Aurora className="-z-20" />
              <div aria-hidden className="absolute inset-0 -z-20 bg-grid opacity-40 mask-fade-radial [--grid-color:rgb(255_255_255/0.07)] [--grid-size:28px]" />
              <div aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full border border-white/10 transition-transform duration-700 group-hover/promo:scale-125" />
              <div aria-hidden className="absolute -right-2 -top-2 size-24 rounded-full border border-white/10 transition-transform duration-700 group-hover/promo:scale-110" />
            </>
          )}
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#070b18] via-[#070b18]/60 to-transparent" />
          {promo.eyebrow && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300">
              <Sparkles aria-hidden className="size-3.5" />
              {promo.eyebrow}
            </span>
          )}
          <span className="mt-2 font-display text-xl font-semibold leading-snug">{promo.title}</span>
          <span className="mt-1.5 text-sm leading-snug text-white/75">{promo.text}</span>
          <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0b1324] transition-transform duration-300 group-hover/promo:translate-x-1">
            {promo.label}
            <ArrowRight aria-hidden className="size-4" />
          </span>
        </AppLink>
      </NavigationMenu.Link>
    </motion.div>
  )
}

function MegaPanel({ item, counts }: { item: NavItem; counts: Map<string, number> }) {
  const [hover, setHover] = useState<string | null>(null)
  const groups = item.groups ?? []
  const columns = groups.map((g) => (g.items.some((leaf) => leaf.tone) ? 'minmax(0, 1.9fr)' : 'minmax(0, 1fr)')).join(' ') + (item.promo ? ' 17rem' : '')
  return (
    <LayoutGroup id={`nav-${item.label}`}>
      <div className="w-[min(72rem,calc(100vw-3rem))] p-2" onMouseLeave={() => setHover(null)}>
        <div className="grid gap-1" style={{ gridTemplateColumns: columns }}>
          {groups.map((group, i) => (
            <PanelGroup key={group.title} group={group} index={i} state={{ hover, setHover }} counts={counts} />
          ))}
          {item.promo && <Promo promo={item.promo} index={groups.length} />}
        </div>
        <motion.div
          {...enter(1, groups.length)}
          className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-canvas-alt px-4 py-3"
        >
          <p className="text-sm text-ink-muted">
            Not sure where to start? <span className="font-medium text-ink">Our advisers can help you compare courses.</span>
          </p>
          <div className="flex gap-2">
            <NavigationMenu.Link asChild>
              <ButtonLink href="/enquire" size="sm" variant="secondary">
                Enquire
              </ButtonLink>
            </NavigationMenu.Link>
            <NavigationMenu.Link asChild>
              <ButtonLink href="/apply" size="sm" variant="accent" arrow>
                Apply now
              </ButtonLink>
            </NavigationMenu.Link>
          </div>
        </motion.div>
      </div>
    </LayoutGroup>
  )
}

export function DesktopNav({
  items,
  onDark,
  value,
  onValueChange,
}: {
  items: NavItem[]
  onDark?: boolean
  value: string
  onValueChange: (value: string) => void
}) {
  const { pathname } = useLocation()
  const { data: categories } = useQuery(queries.categories())
  const counts = new Map((categories ?? []).map((c) => [`/courses/category/${c.slug}`, c.courseCount]))

  const itemClass = (active: boolean) =>
    cn(
      'group relative inline-flex h-10 items-center gap-0.5 whitespace-nowrap rounded-full px-2.5 text-[0.875rem] font-medium transition-colors',
      onDark
        ? 'text-white/85 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white'
        : 'text-ink-muted hover:bg-surface-muted hover:text-ink data-[state=open]:bg-surface-muted data-[state=open]:text-ink',
      active && (onDark ? 'text-white' : 'text-ink'),
    )

  return (
    <NavigationMenu.Root value={value} onValueChange={onValueChange} delayDuration={60} className="relative hidden xl:flex" aria-label="Main">
      <NavigationMenu.List className="flex items-center gap-0.5">
        {items.map((item) => {
          const active = itemActive(pathname, item)
          const indicator = active && (
            <span
              aria-hidden
              className={cn(
                'absolute -bottom-0.5 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full',
                onDark ? 'bg-gold-300' : 'bg-accent',
              )}
            />
          )
          return item.groups?.length ? (
            <NavigationMenu.Item key={item.label} value={item.label}>
              <NavigationMenu.Trigger className={itemClass(active)}>
                {item.label}
                <ChevronDown aria-hidden className="size-3.5 opacity-70 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                {indicator}
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="nm-content absolute left-0 top-0">
                <MegaPanel item={item} counts={counts} />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item key={item.label}>
              <NavigationMenu.Link asChild active={active}>
                <AppLink href={item.href} className={itemClass(active)} aria-current={active ? 'page' : undefined}>
                  {item.label}
                  {indicator}
                </AppLink>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          )
        })}
        {/* Caret that slides under the open trigger */}
        <NavigationMenu.Indicator className="top-full z-[1] flex h-3 items-end justify-center overflow-hidden transition-[width,transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100">
          <span className="relative top-[55%] size-3 rotate-45 rounded-tl-[3px] border-l border-t border-line bg-surface" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>
      <div className="absolute left-1/2 top-full flex -translate-x-1/2 justify-center pt-3">
        <NavigationMenu.Viewport className="nm-viewport relative w-[var(--radix-navigation-menu-viewport-width)] overflow-hidden rounded-[1.75rem] border border-line bg-surface/95 shadow-float backdrop-blur-xl before:absolute before:inset-x-10 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/60 before:to-transparent" />
      </div>
    </NavigationMenu.Root>
  )
}

import type { ReactElement } from 'react'
import type { IconName, Tone } from '@/api/types'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { categoryTone, meshStyle, PALETTES, type Palette } from '@/lib/palette'

/**
 * Bespoke, animated artwork for each study area — used wherever a study-area or course image has
 * not been supplied yet, so the catalogue looks designed rather than empty. Place inside a `group`
 * element: the motifs respond to hover, and `--px`/`--py` (−1..1, set by <Tilt>) add parallax.
 */

const svgBase = 'absolute inset-0 size-full overflow-visible'
const parallax = '[translate:calc(var(--px,0)*10px)_calc(var(--py,0)*10px)] transition-[translate] duration-300 ease-out'
const draw = 'transition-[stroke-dashoffset] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] [stroke-dasharray:1] [stroke-dashoffset:1] group-hover:[stroke-dashoffset:0]'

/*
 * All motifs live inside the "safe area" x 80–320, y 30–190 of the 400×300 canvas: with
 * `slice` scaling that region stays visible on tall tiles, wide cards and square thumbnails,
 * and sits above the text gradient on study-area tiles.
 */

function Business({ p }: { p: Palette }) {
  const bars = [
    { x: 176, h: 46 },
    { x: 204, h: 74 },
    { x: 232, h: 60 },
    { x: 260, h: 104 },
    { x: 288, h: 132 },
  ]
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden className={cn(svgBase, parallax)}>
      <g stroke="white" strokeOpacity="0.14" strokeWidth="1">
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="60" x2="340" y1={64 + i * 42} y2={64 + i * 42} strokeDasharray="2 6" />
        ))}
      </g>
      <g>
        {bars.map((bar, i) => (
          <rect
            key={bar.x}
            x={bar.x}
            y={194 - bar.h}
            width="18"
            height={bar.h}
            rx="5"
            fill="white"
            fillOpacity={0.14 + i * 0.05}
            className="origin-bottom [transform-box:fill-box] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-110"
            style={{ transitionDelay: `${i * 60}ms` }}
          />
        ))}
      </g>
      <path d="M168 150 L206 126 L238 138 L274 92 L306 60" fill="none" stroke={p.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className={draw} />
      <circle cx="306" cy="60" r="6" fill={p.accent} className="animate-pulse-ring origin-center [transform-box:fill-box]" />
      <circle cx="306" cy="60" r="4" fill={p.accent} />
      <circle cx="96" cy="236" r="46" fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="14" strokeDasharray="200 100" className="animate-spin-slow origin-center [transform-box:fill-box]" />
    </svg>
  )
}

function InformationTechnology({ p }: { p: Palette }) {
  const nodes = [
    [100, 70],
    [170, 46],
    [236, 104],
    [310, 66],
    [130, 160],
    [246, 196],
    [316, 172],
    [104, 244],
  ] as const
  const links = [
    [0, 1],
    [1, 2],
    [2, 3],
    [1, 4],
    [4, 5],
    [2, 5],
    [5, 6],
    [3, 6],
    [4, 7],
  ] as const
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden className={cn(svgBase, parallax)}>
      <g stroke="white" strokeOpacity="0.22" strokeWidth="1.5">
        {links.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
      </g>
      <path d="M100 70 L170 46 L236 104 L310 66" fill="none" stroke={p.light} strokeWidth="2.5" strokeLinecap="round" pathLength={1} className={draw} />
      {nodes.map(([x, y], i) => (
        <g key={i}>
          {i % 3 === 0 && <circle cx={x} cy={y} r="7" fill={p.light} className="animate-pulse-ring origin-center [transform-box:fill-box]" style={{ animationDelay: `${i * 0.4}s` }} />}
          <circle cx={x} cy={y} r="5" fill="white" fillOpacity={0.85} className="transition-transform duration-500 group-hover:scale-125 origin-center [transform-box:fill-box]" style={{ transitionDelay: `${i * 40}ms` }} />
        </g>
      ))}
      <text x="236" y="262" fontFamily="ui-monospace, monospace" fontSize="44" fontWeight="600" fill="white" fillOpacity="0.12" className="transition-opacity duration-500 group-hover:fill-opacity-25">
        {'</>'}
      </text>
    </svg>
  )
}

function Hospitality({ p }: { p: Palette }) {
  const steam = (d: string, delay: number) => (
    <path
      d={d}
      fill="none"
      stroke="white"
      strokeOpacity="0.55"
      strokeWidth="3"
      strokeLinecap="round"
      className="animate-steam"
      style={{ animationDelay: `${delay}s` }}
    />
  )
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden className={cn(svgBase, parallax)}>
      <ellipse cx="236" cy="180" rx="92" ry="17" fill="white" fillOpacity="0.14" />
      <ellipse cx="236" cy="174" rx="70" ry="11" fill="white" fillOpacity="0.2" />
      <path d="M166 170 A70 70 0 0 1 306 170" fill={p.light} fillOpacity="0.35" stroke="white" strokeOpacity="0.5" strokeWidth="2" className="origin-bottom [transform-box:fill-box] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-5 group-hover:rotate-[-8deg]" />
      <circle cx="236" cy="96" r="6" fill="white" fillOpacity="0.7" className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-5" />
      {steam('M208 84 c-10 -14 10 -22 0 -36 c-8 -12 6 -18 2 -30', 0)}
      {steam('M236 76 c-10 -14 10 -22 0 -36 c-8 -12 6 -18 2 -30', 0.6)}
      {steam('M264 84 c-10 -14 10 -22 0 -36 c-8 -12 6 -18 2 -30', 1.2)}
      <circle cx="96" cy="236" r="54" fill="none" stroke={p.accent} strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 10" className="animate-spin-slow origin-center [transform-box:fill-box]" />
      <circle cx="96" cy="236" r="30" fill="white" fillOpacity="0.08" />
    </svg>
  )
}

function Health({ p }: { p: Palette }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden className={cn(svgBase, parallax)}>
      <path d="M-20 130 H110 l16 -34 l22 80 l24 -118 l22 98 l16 -26 H420" fill="none" stroke="white" strokeOpacity="0.18" strokeWidth="2.5" strokeLinejoin="round" />
      <path
        d="M-20 130 H110 l16 -34 l22 80 l24 -118 l22 98 l16 -26 H420"
        fill="none"
        stroke={p.light}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        pathLength={1}
        className="animate-ecg"
      />
      <g className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 origin-center [transform-box:fill-box]">
        <circle cx="296" cy="176" r="38" fill="white" fillOpacity="0.1" />
        <rect x="284" y="154" width="24" height="44" rx="6" fill="white" fillOpacity="0.75" />
        <rect x="274" y="164" width="44" height="24" rx="6" fill="white" fillOpacity="0.75" />
      </g>
      <circle cx="90" cy="236" r="60" fill={p.accent} fillOpacity="0.1" className="animate-float-slow" />
    </svg>
  )
}

function English({ p }: { p: Palette }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden className={cn(svgBase, parallax)}>
      <text x="36" y="214" fontFamily="'Fraunces Variable', Georgia, serif" fontSize="150" fontWeight="600" fill="white" fillOpacity="0.14" className="transition-opacity duration-500 group-hover:fill-opacity-22">
        Aa
      </text>
      <g className="animate-float">
        <path d="M196 50 h110 a16 16 0 0 1 16 16 v52 a16 16 0 0 1 -16 16 h-70 l-28 24 v-24 h-12 a16 16 0 0 1 -16 -16 v-52 a16 16 0 0 1 16 -16z" fill="white" fillOpacity="0.9" />
        <g stroke={p.mid} strokeWidth="5" strokeLinecap="round">
          <line x1="212" y1="78" x2="286" y2="78" />
          <line x1="212" y1="102" x2="264" y2="102" />
        </g>
      </g>
      <g className="animate-float-slow">
        <path d="M150 150 h86 a12 12 0 0 1 12 12 v34 a12 12 0 0 1 -12 12 h-10 v20 l-24 -20 h-52 a12 12 0 0 1 -12 -12 v-34 a12 12 0 0 1 12 -12z" fill={p.accent} fillOpacity="0.85" />
        <g stroke={p.deep} strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round">
          <line x1="164" y1="172" x2="224" y2="172" />
          <line x1="164" y1="190" x2="202" y2="190" />
        </g>
      </g>
    </svg>
  )
}

function ShortCourses({ p }: { p: Palette }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden className={cn(svgBase, parallax)}>
      <circle cx="240" cy="124" r="84" fill="none" stroke="white" strokeOpacity="0.16" strokeWidth="10" />
      <circle cx="240" cy="124" r="84" fill="none" stroke={p.accent} strokeWidth="10" strokeLinecap="round" pathLength={1} strokeDasharray="0.62 1" className="-rotate-90 origin-center [transform-box:fill-box] transition-[stroke-dasharray] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[stroke-dasharray:0.9_1]" />
      <path d="M252 68 L216 136 h30 l-18 50 l52 -76 h-30 l16 -42z" fill="white" fillOpacity="0.92" className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-rotate-6 origin-center [transform-box:fill-box]" />
      <g fill={p.accent}>
        <circle cx="70" cy="80" r="5" className="animate-float" />
        <circle cx="120" cy="210" r="4" className="animate-float-slow" />
        <circle cx="180" cy="60" r="3" className="animate-float" style={{ animationDelay: '-3s' }} />
      </g>
      <g stroke="white" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="3 8">
        <line x1="20" y1="260" x2="220" y2="260" />
        <line x1="20" y1="240" x2="160" y2="240" />
      </g>
    </svg>
  )
}

function Generic({ p, icon }: { p: Palette; icon?: IconName }) {
  return (
    <>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden className={cn(svgBase, parallax)}>
        <circle cx="250" cy="110" r="90" fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="24" />
        <circle cx="250" cy="110" r="90" fill="none" stroke={p.accent} strokeWidth="6" strokeLinecap="round" pathLength={1} className={draw} />
        <circle cx="90" cy="230" r="70" fill={p.light} fillOpacity="0.12" className="animate-float-slow" />
      </svg>
      {icon && (
        <div aria-hidden className="absolute left-1/2 top-[36%] grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl bg-white/12 ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
          <Icon name={icon} className="size-9 text-white" />
        </div>
      )}
    </>
  )
}

const ART: Record<string, (props: { p: Palette; icon?: IconName }) => ReactElement> = {
  business: Business,
  'information-technology': InformationTechnology,
  hospitality: Hospitality,
  health: Health,
  english: English,
  'short-courses': ShortCourses,
}

export function CategoryArtwork({
  slug,
  tone,
  icon,
  className,
}: {
  slug: string
  /** Overrides the palette (otherwise derived from the slug). */
  tone?: Tone
  icon?: IconName
  className?: string
}) {
  const palette = PALETTES[tone ?? categoryTone(slug)]
  const Art = ART[slug] ?? Generic
  return (
    <div aria-hidden className={cn('absolute inset-0 overflow-hidden', className)} style={meshStyle(palette)}>
      <div className="absolute inset-0 bg-noise opacity-[0.22] mix-blend-overlay" />
      <Art p={palette} icon={icon} />
      {/* Light sweep on hover */}
      <div className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-[300%]" />
    </div>
  )
}

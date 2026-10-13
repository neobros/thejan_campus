import { ExternalLink, MapPin, MapPinned, Navigation } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { Campus } from '@/api/types'
import { ButtonLink, Button } from '@/components/ui/Button'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { directionsHref, osmEmbedUrl, osmViewUrl } from './maps'

/** Decorative stand-in map drawn with theme tokens. */
function MapArt() {
  return (
    <svg aria-hidden viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
      <path d="M-20 300 C 120 260, 200 340, 330 290 S 520 220, 640 260" className="fill-none stroke-primary/15" strokeWidth="38" strokeLinecap="round" />
      <ellipse cx="110" cy="90" rx="90" ry="55" className="fill-success/10" />
      <ellipse cx="500" cy="110" rx="70" ry="45" className="fill-success/10" />
      <g className="fill-none stroke-line-strong/30" strokeLinecap="round">
        <path d="M0 160 H600" strokeWidth="10" />
        <path d="M250 0 V400" strokeWidth="10" />
        <path d="M0 60 L600 230" strokeWidth="5" />
        <path d="M420 0 L360 400" strokeWidth="5" />
        <path d="M0 380 L240 0" strokeWidth="3" />
        <path d="M120 0 V400 M0 240 H600 M520 0 V400" strokeWidth="2" />
      </g>
    </svg>
  )
}

export function CampusMap({ campus }: { campus: Campus }) {
  const [loaded, setLoaded] = useState(false)
  const coords = campus.coordinates
  const directions = directionsHref(campus)

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card">
      <div className="relative aspect-[4/3] sm:aspect-[16/10]">
        <AnimatePresence mode="wait" initial={false}>
          {loaded && coords ? (
            <motion.iframe
              key="map"
              title={`Map showing the location of ${campus.name}`}
              src={osmEmbedUrl(coords)}
              loading="lazy"
              className="absolute inset-0 size-full border-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            />
          ) : (
            <motion.div key="placeholder" exit={{ opacity: 0 }} className="absolute inset-0 overflow-hidden bg-surface-muted">
              <MapArt />
              <div aria-hidden className="absolute inset-0 bg-grid opacity-40 mask-fade-radial" />
              <div className="absolute inset-0 grid place-items-center p-6 text-center">
                <div className="max-w-sm">
                  <span className="relative mx-auto grid size-14 place-items-center rounded-full bg-primary text-on-primary shadow-float">
                    <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/40" />
                    <MapPin aria-hidden className="relative size-6" />
                  </span>
                  <p className="mt-4 font-semibold text-ink">{campus.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">{campus.address}</p>
                  {coords ? (
                    <>
                      <Button size="sm" className="mt-5" onClick={() => setLoaded(true)} icon={<MapPinned aria-hidden className="size-4" />}>
                        Load interactive map
                      </Button>
                      <p className="mt-3 text-xs text-ink-subtle">Loads a map from OpenStreetMap, a third-party service.</p>
                    </>
                  ) : (
                    <p className="mt-4 text-xs text-ink-subtle">An interactive map will be added once the campus location is confirmed.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {(directions || coords) && (
        <div className="flex flex-wrap items-center gap-3 border-t border-line p-4 sm:p-5">
          {directions && (
            <ButtonLink href={directions} variant="primary" size="sm" icon={<Navigation aria-hidden className="size-4" />}>
              Get directions
            </ButtonLink>
          )}
          {coords && (
            <ButtonLink href={osmViewUrl(coords)} variant="ghost" size="sm" icon={<ExternalLink aria-hidden className="size-4" />}>
              View larger map
            </ButtonLink>
          )}
        </div>
      )}
    </div>
  )
}

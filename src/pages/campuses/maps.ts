import { Bike, Bus, Car, Footprints, Route, TrainFront, type LucideIcon } from 'lucide-react'
import type { Campus } from '@/api/types'

type Coordinates = NonNullable<Campus['coordinates']>

/** OpenStreetMap embed (loaded only after the visitor asks for it). */
export function osmEmbedUrl({ lat, lng }: Coordinates) {
  const dLng = 0.008
  const dLat = 0.005
  const bbox = [lng - dLng, lat - dLat, lng + dLng, lat + dLat].map((n) => n.toFixed(6)).join(',')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(6)},${lng.toFixed(6)}`
}

export function osmViewUrl({ lat, lng }: Coordinates) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`
}

/** Approved directions link, else a maps search for a real (non-placeholder) address. */
export function directionsHref(campus: Pick<Campus, 'directionsUrl' | 'address'>) {
  if (campus.directionsUrl) return campus.directionsUrl
  if (campus.address && !campus.address.includes('[')) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campus.address)}`
  }
  return null
}

/** Pick a suitable icon for a free-text transport line. */
export function transportIcon(text: string): LucideIcon {
  if (/train|metro|rail|tram|station/i.test(text)) return TrainFront
  if (/bus|coach/i.test(text)) return Bus
  if (/bicycle|cycl|bike/i.test(text)) return Bike
  if (/walk/i.test(text)) return Footprints
  if (/car|parking|drive/i.test(text)) return Car
  return Route
}

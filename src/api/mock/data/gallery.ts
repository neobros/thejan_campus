import type { GalleryAlbum, GalleryItem, ImageAsset } from '@/api/types'
import { media } from './media'

/**
 * DEMO DATA — gallery albums built from image slots (specification §5.25). Every published asset
 * needs a caption, alt text, credit/rights information and a recorded publication consent.
 * Videos must have captions and a transcript and never autoplay with sound.
 */
const CREDIT = '[Credit and usage rights — to be confirmed]'

function photo(id: string, image: ImageAsset, caption: string): GalleryItem {
  return { id, kind: 'image', image, caption, credit: CREDIT }
}

export const galleryAlbums: GalleryAlbum[] = [
  {
    id: 'album-campus',
    slug: 'campus',
    title: 'Our campuses',
    description: 'Entrances, buildings and outdoor spaces across City, Riverside and Parkview campuses.',
    cover: media.campus.city,
    items: [
      photo('gallery-campus-city', media.campus.city, 'City Campus, a short walk from public transport, cafés and city services.'),
      photo('gallery-campus-riverside', media.campus.riverside, 'Riverside Campus, home to our training kitchens, beside the riverside walking path.'),
      photo('gallery-campus-parkview', media.campus.parkview, 'The entrance to Parkview Campus, set beside landscaped gardens and parkland.'),
      photo('gallery-campus-entrance', media.page.about, 'The main entrance at City Campus in the morning light.'),
      photo('gallery-campus-courtyard', media.gallery.courtyard, 'A shaded courtyard where students meet between classes.'),
      {
        id: 'gallery-campus-welcome-video',
        kind: 'video',
        image: media.gallery.welcomeVideo,
        caption:
          'Campus welcome video (placeholder). The video will be published with closed captions and a text transcript, and will not play automatically.',
        credit: CREDIT,
        videoUrl: null,
        transcriptUrl: null,
      },
    ],
  },
  {
    id: 'album-facilities',
    slug: 'facilities',
    title: 'Facilities',
    description: 'The labs, kitchens, classrooms and study spaces where students learn and practise.',
    cover: media.facility.library,
    items: [
      photo('gallery-facility-library', media.facility.library, 'A quiet study area in the City Campus library.'),
      photo('gallery-facility-computer-lab', media.facility.computerLab, 'The City Campus computer lab, used for information technology classes.'),
      photo('gallery-facility-kitchen', media.facility.kitchen, 'A commercial training kitchen at Riverside Campus.'),
      photo('gallery-facility-care-lab', media.facility.careLab, 'A simulated care room at Parkview Campus, used for practical training before placement.'),
      photo('gallery-facility-classroom', media.facility.classroom, 'A flexible classroom with movable desks and a presentation screen.'),
      photo('gallery-facility-lounge', media.facility.lounge, 'A student lounge with seating and a kitchenette.'),
    ],
  },
  {
    id: 'album-student-activities',
    slug: 'student-activities',
    title: 'Student activities',
    description: 'Orientation, celebrations, volunteering and everyday moments shared with the consent of those pictured.',
    cover: media.life.events,
    items: [
      photo('gallery-life-orientation', media.gallery.orientation, 'New students getting to know each other during orientation.'),
      photo('gallery-life-culture', media.life.events, 'Students sharing food and music at a cultural celebration.'),
      photo('gallery-life-clubs', media.life.clubs, 'A student club meeting in the common room.'),
      photo('gallery-life-showcase', media.gallery.showcase, 'Cookery students presenting dishes at a community showcase lunch.'),
      photo('gallery-life-community', media.life.community, 'Student volunteers planting the community garden at Parkview Campus.'),
      photo('gallery-life-sport', media.life.sport, 'A friendly game of basketball after classes.'),
    ],
  },
]

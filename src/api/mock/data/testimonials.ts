import type { Testimonial } from '@/api/types'

/**
 * DEMO DATA — clearly labelled sample testimonials for layout only. Never publish these as real
 * student voices: replace them with approved quotes that have a recorded consent (specification §12).
 */
export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-business',
    quote:
      'The trainers explained each topic clearly and were happy to go over it again when I needed. Presenting our group projects in class helped me feel much more confident sharing my ideas.',
    name: 'Sample student',
    context: 'Diploma of Business student (sample testimonial)',
    photo: null,
  },
  {
    id: 'testimonial-cookery',
    quote:
      'Practising in the training kitchen every week made a real difference. I learned how to stay organised and calm when service gets busy.',
    name: 'Sample student',
    context: 'Certificate in Professional Cookery student (sample testimonial)',
    photo: null,
  },
  {
    id: 'testimonial-english',
    quote:
      'When I first arrived I was not sure where to start. The support team helped me understand my timetable and showed me where to get help with my writing.',
    name: 'Sample student',
    context: 'English for Academic Purposes student (sample testimonial)',
    photo: null,
  },
]

/**
 * Education partners shown in the "Our Partners" sections (home page + Partners page).
 * Each links out to the partner's own website. Logos live in public/brand/.
 */
export interface EducationPartner {
  name: string
  logo: string
  width: number
  height: number
  /** Partner's own website; omitted when no public URL is on record (the logo then shows without a link). */
  href?: string
}

export const educationPartners: EducationPartner[] = [
  {
    name: 'The Centre of Excellence',
    logo: '/brand/partner-coe.png',
    width: 648,
    height: 240,
    href: 'https://www.thecentreofexcellence.com.au/international/',
  },
  {
    name: 'IHM Australia — powered by Arizona State University',
    logo: '/brand/partner-ihm.png',
    width: 522,
    height: 240,
    href: 'https://ihm.edu.au/',
  },
]

/** VC Consultancy and the network of Australian education providers available through it. */
export const vcConsultancyLead: EducationPartner = {
  name: 'VC Consultancy',
  logo: '/brand/partners/partner-vconsultancy.png',
  width: 1551,
  height: 200,
}

export const vcConsultancyProviders: EducationPartner[] = [
  { name: 'AIBT — Australian Institute of Business and Technology', logo: '/brand/partners/partner-aibt.png', width: 928, height: 200 },
  { name: 'AIBT-i', logo: '/brand/partners/partner-aibt-i.png', width: 843, height: 200 },
  { name: 'Australian Vocational Training Academy (AVTA)', logo: '/brand/partners/partner-avta.png', width: 207, height: 200 },
  { name: 'Education Access Australia', logo: '/brand/partners/partner-eaa.png', width: 477, height: 200 },
  { name: 'HJ Australian Institute', logo: '/brand/partners/partner-hj.png', width: 918, height: 200 },
  { name: 'National Polytechnic of Australia', logo: '/brand/partners/partner-npa.png', width: 207, height: 200 },
  { name: 'Pivot Education', logo: '/brand/partners/partner-pivot.png', width: 317, height: 200 },
  { name: 'Profound Learn', logo: '/brand/partners/partner-profound.png', width: 1001, height: 200 },
  { name: 'Reach Community College', logo: '/brand/partners/partner-reach.png', width: 195, height: 200 },
]

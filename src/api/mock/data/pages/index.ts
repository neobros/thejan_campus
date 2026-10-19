import type { Page } from '@/api/types'
import { aboutPages } from './about'
import { admissionsPages } from './admissions'
import { bespokePages } from './bespoke'
import { homePage } from './home'
import { howItWorksPage } from './how-it-works'
import { internationalPages } from './international'
import { legalPages } from './legal'
import { placePages } from './places'
import { studentPages } from './students'

/** DEMO DATA — CMS pages keyed by path (no leading slash). The home page stays first. */
export const pages: Page[] = [
  homePage,
  howItWorksPage,
  ...bespokePages,
  ...aboutPages,
  ...admissionsPages,
  ...internationalPages,
  ...studentPages,
  ...placePages,
  ...legalPages,
]

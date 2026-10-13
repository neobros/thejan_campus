import type { FeatureFlags } from '@/api/types'
import { settings } from './data/settings'

/** Pages that only exist when the related service is offered (specification §4 "Conditional"). */
export const PAGE_FEATURES: Record<string, keyof FeatureFlags> = {
  'admissions/scholarships': 'scholarships',
  'admissions/credit-transfer': 'creditTransfer',
  international: 'international',
  'international/pre-arrival': 'international',
  'international/living-and-studying': 'international',
  'international/agents': 'agents',
  domestic: 'domestic',
}

export function featureEnabled(feature?: keyof FeatureFlags) {
  return !feature || settings.features[feature]
}

export function pagePublished(path: string) {
  return featureEnabled(PAGE_FEATURES[path])
}

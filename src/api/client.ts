import { env } from '@/config/env'
import type { CampusApi } from './contract'

let instance: Promise<CampusApi> | null = null

/**
 * The implementation is loaded on first use. In an http build the demo dataset is never
 * requested (and is eliminated from the bundle because VITE_API_MODE is replaced at build time).
 */
function load(): Promise<CampusApi> {
  instance ??=
    import.meta.env.VITE_API_MODE === 'http'
      ? import('./http').then((m) => m.createHttpApi(env.apiBaseUrl))
      : import('./mock').then((m) => m.createMockApi({ latency: env.mockLatency }))
  return instance
}

type AnyMethod = (...args: unknown[]) => Promise<unknown>

export const api = new Proxy({} as CampusApi, {
  get(_target, method: string) {
    return (...args: unknown[]) => load().then((impl) => (impl[method as keyof CampusApi] as AnyMethod)(...args))
  },
})

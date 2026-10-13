const mode = import.meta.env.VITE_API_MODE === 'http' ? 'http' : 'mock'

export const env = {
  /** "mock" serves the labelled demo dataset; "http" calls the backend API. */
  apiMode: mode as 'mock' | 'http',
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, ''),
  siteUrl: (import.meta.env.VITE_SITE_URL ?? '').replace(/\/+$/, ''),
  mockLatency: Number(import.meta.env.VITE_MOCK_LATENCY ?? 250) || 0,
  isDev: import.meta.env.DEV,
  /** The demo dataset is in use (the `build` script refuses to ship it; see vite.config.ts). */
  isDemo: mode === 'mock',
} as const

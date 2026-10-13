import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Guard against publishing the labelled demo dataset as real content (spec §12).
  // `npm run build` (mode "production") must talk to the real backend; `npm run build:demo`
  // produces a clearly labelled preview build for staging and client review.
  if (command === 'build' && mode === 'production') {
    if (env.VITE_API_MODE !== 'http' || !env.VITE_API_BASE_URL) {
      throw new Error(
        '\n[campus] Production builds need VITE_API_MODE=http and VITE_API_BASE_URL set (see .env.example).\n' +
          '[campus] To build the labelled demo for staging/client review, run: npm run build:demo\n',
      )
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: 'es2022',
      sourcemap: mode !== 'production',
    },
  }
})

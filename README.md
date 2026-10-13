# Campus website

Public website for `AIT`: course catalogue, admissions information, enquiries and online application intake. Built from [`docs/specification.md`](docs/specification.md).

React 19 · Vite 8 · TypeScript 6 · Tailwind CSS 4 · React Router 8 · TanStack Query 5 · Motion · Radix UI

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173 — uses the labelled demo dataset
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build:demo` | Production-optimised **preview** build using demo data. For staging / client review. |
| `npm run build` | Real production build. Requires `VITE_API_MODE=http` and `VITE_API_BASE_URL` — it refuses to build with demo content. |
| `npm run preview` | Serve the last build locally |
| `npm run typecheck` / `npm run lint` / `npm test` | Quality checks |

Copy `.env.example` to `.env` (development) or `.env.production` (live build) and fill in the values.

## What's included

- **Light / dark / system themes** — header toggle with a circular reveal animation; preference remembered; no flash on load.
- **Motion** — page transitions (View Transitions API), word-by-word headline reveals, scroll reveals, parallax hero, animated mega menu, scroll-linked admissions timeline, layout animations on filters. All animation respects the visitor's "reduce motion" setting.
- **All P1 pages from the spec** (§4), CMS-driven where possible: 27 content pages render from structured blocks, plus bespoke templates for courses, campuses, news, events, policies, search, enquiry and the multi-step application.
- **Conditional pages** (international, domestic, scholarships, credit transfer, agents) switch off via feature flags in settings — routes then 404 and menu links disappear.
- **Accessibility** — WCAG 2.2 AA target: skip link, landmarks, keyboard-operable menus/dialogs, labelled form fields with announced errors, focus management on navigation, contrast-checked tokens in both themes.

## Architecture in one minute

- `src/api/contract.ts` defines everything the site needs from a backend. `src/api/http.ts` implements it against the REST endpoints in spec §10; `src/api/mock/` implements it over the demo dataset. `VITE_API_MODE` picks one. **To connect the real backend (e.g. Laravel), implement those endpoints — no UI changes needed.**
- Images live in CMS data. Missing images render designed placeholders — see [`docs/IMAGE_PROMPTS.md`](docs/IMAGE_PROMPTS.md) for every slot, size and prompt.
- Conventions, design tokens and motion rules: [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

## Before launch (spec §12, §14)

- Replace every `[PLACEHOLDER]` (institution name, contacts, addresses, legal name, entry requirements, policies) with client-approved content in the CMS.
- Supply the logo, brand colours and approved images.
- Backend: enquiries, application drafts, private document storage with virus scanning, staff CMS/admissions review, email queue — the admin CMS is backend scope.

## Deployment notes

This is a single-page app. The host must:

1. **Serve `index.html` for unknown paths** (SPA fallback) — Netlify `_redirects`: `/* /index.html 200`; Vercel rewrites; Apache `FallbackResource /index.html`; nginx `try_files $uri /index.html;`.
2. **Return HTTP 404 for unknown URLs** if required by SEO policy (spec §5.27) — needs server-side route awareness or prerendering; the 404 page is already marked `noindex`.
3. Send security headers (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`). The small inline theme script in `index.html` needs a CSP hash.
4. **Social previews / SEO**: crawlers that don't run JavaScript only see the defaults in `index.html`. For per-page previews, add prerendering or SSR (React Router framework mode) — recommended before launch.
5. Serve `sitemap.xml` from the backend (it knows the published content); update `public/robots.txt` with the real domain.

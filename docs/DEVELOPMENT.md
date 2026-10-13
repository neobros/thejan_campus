# Development guide

How the campus website is put together and the conventions every change should follow. The product brief is [`specification.md`](./specification.md); image briefs are in [`IMAGE_PROMPTS.md`](./IMAGE_PROMPTS.md).

## Stack

| Concern | Choice |
| --- | --- |
| Build | Vite 8, TypeScript 6 (strict) |
| UI | React 19, Tailwind CSS 4 (+ typography plugin) |
| Routing | React Router 8 (data router, lazy routes, loaders) |
| Data | TanStack Query 5 over a typed `CampusApi` contract |
| Motion | Motion 14 (`motion/react`) + CSS keyframes + View Transitions |
| Primitives | Radix UI (dialog, accordion, tabs, navigation menu) |
| Forms | react-hook-form + zod |
| Icons | lucide-react 1.x (note: v1 renamed `Home`→`House`, `Loader2`→`LoaderCircle`, `CheckCircle2`→`CircleCheck`, `AlertTriangle`→`TriangleAlert`; brand icons were removed — use `SocialIcon`) |

## Folder map

```
src/
  api/            contract.ts (CampusApi), types.ts (data model), http.ts (REST adapter),
                  mock/ (demo implementation + data/), queries.ts (React Query factories + hooks)
  app/            App providers, router.tsx, routing.ts (loader helpers), queryClient.ts
  components/
    ui/           primitives: AppLink, Button/ButtonLink/ActionButtons, Badge, Section/SectionHeader/Eyebrow,
                  Breadcrumbs, Accordion, Tabs/TabsList/SegmentedControl, Pagination, form (Field, Input,
                  Textarea, Select, Checkbox, RadioCard, Fieldset), feedback (Skeleton, LoadingRegion,
                  CardGridSkeleton, EmptyState, Callout, ErrorPanel), Markdown, SmartImage, Icon, SocialIcon
    motion/       Reveal, Stagger/StaggerItem, TextReveal, effects (Parallax, CountUp, Marquee, Spotlight,
                  Aurora, ScrollProgress, AnimatedCheck, GridBackdrop)
    layout/       Header, DesktopNav (mega menu), MobileNav, SearchDialog, Footer, ThemeToggle, chrome
    blocks/       CMS block renderer, block components, module registry, ModuleSection
    shared/       PageHero, CtaBanner, cards (Course/Category/Campus/Article/Event), status, labels
  features/       CMS "module" components grouped by area (one file per module + modules.ts barrel)
  pages/          route components (default export + optional `loader`)
  lib/            cn, format (money/dates/timezones), links (apply/enquire hrefs), seo, theme, motion,
                  files (upload checks), storage, ids
  styles/index.css  design tokens, utilities, keyframes, view transitions
```

## Data layer

- **Never call `fetch` from components.** Use `queries.*` with `useQuery`/`useSuspenseQuery`. The `api` object (src/api/client.ts) picks `http` or `mock` from `VITE_API_MODE`.
- **Route loaders** prefetch the page's primary record so the page renders complete (no skeleton flash during the view transition) and so missing records become a 404:
  ```ts
  export async function loader({ params }: LoaderFunctionArgs) {
    await orNotFound(queryClient.ensureQueryData(queries.course(params.slug!)))
    return null
  }
  export default function CoursePage() {
    const { slug } = useParams()
    const { data: course } = useSuspenseQuery(queries.course(slug!))
  }
  ```
  `orNotFound`/`queryClient` come from `@/app/routing`. Secondary data uses `useQuery` with skeletons.
- **Bespoke pages with CMS hero copy** (courses, news, events, enquire, apply, search): call `await prefetchOptionalPage('courses')` in the loader, then `const cms = useOptionalPage('courses')` and fall back to built-in copy when it is `undefined`. Render `cms.blocks` with `<BlockRenderer>` after the page's own content.
- **Filters live in the URL** (`useSearchParams`) so they combine, survive back/forward and can be shared. Update with `setSearchParams(next, { replace: true, preventScrollReset: true })`. Lists use `placeholderData: keepPreviousData` (already set in the factories) so results animate rather than flash.
- **Fees:** when no approved fee exists show `NO_FEE_MESSAGE` ("Contact admissions for current fees.") — never `0`. Use `FeeAmount`.
- **Dates:** calendar dates (`YYYY-MM-DD`) → `formatDate`; instants → `formatDateTime`/`formatDateTimeRange` with the campus `timezone`, and show `timeZoneLabel(tz)`.
- **Context links:** build apply/enquire links with `applyHref({ course, campus, audience, intake })` and `enquireHref({ topic, course, campus, audience })` so forms are pre-filled.
- **Placeholders:** never render `tel:`/`mailto:` for placeholder values — guard with `isDialable()` / `isEmail()`.

## CMS pages, blocks and modules

Most pages are CMS records (`Page` with `blocks`) rendered by `pages/ContentPage.tsx`. Block types are defined in `api/types.ts` and rendered by `components/blocks/*`. A `module` block embeds live data; the registry is `components/blocks/modules.ts`.

To build a module: implement the named export in `src/features/<area>/<Name>.tsx` with signature `({ block, className }: ModuleComponentProps)`, wrap output in `<ModuleSection block={block} className={className} action={…}>` (it renders background, spacing and the CMS heading), read options with `moduleProp(block, 'key', fallback)`, and handle loading (skeleton), error (`ErrorPanel` with retry) and empty (`EmptyState`) states. Return `null` when the brief says to omit an empty section.

## Design system

**Colour tokens** (switch automatically between light and dark — never hard-code hex colours in components):
`bg-canvas`, `bg-canvas-alt`, `bg-surface`, `bg-surface-muted`, `text-ink`, `text-ink-muted`, `text-ink-subtle`, `border-line`, `border-line-strong`, `bg-primary`/`text-on-primary`, `text-primary-ink` (links on surfaces), `bg-primary-soft`/`text-on-primary-soft`, `bg-accent`/`text-on-accent` (gold CTA), `text-accent-ink`, `bg-accent-soft`/`text-on-accent-soft`, and `success|warning|danger|info` + `-soft`. Brand scales `brand-50…950` and `gold-50…900` exist for decoration. Wrap a region in `theme-night` to render it dark in both themes (hero, CTA banners, footer).

Avoid `dark:` variants for colours — tokens already adapt, and `dark:` does not apply inside `theme-night` sections in light mode.

`--page-bg` is the real page background in both themes and, unlike `--canvas`, is **not** overridden inside `theme-night`. Use it (e.g. `to-[var(--page-bg)]`) when a dark section needs to fade its edge into the page behind it — the home hero's soft bottom edge does this.

**Type:** headings use `font-display` (Fraunces, optical sizing) with `font-semibold`; body is Inter. Page H1 is rendered by `PageHero` — exactly one `h1` per page. Section headings via `SectionHeader` (`h2`).

**Shape & depth:** cards `rounded-[1.75rem]`/`rounded-3xl` + `border border-line bg-surface shadow-card`, hover `hover:-translate-y-1 hover:shadow-card-hover`. Pills/buttons are `rounded-full`. Layout width: `container-page`. Section rhythm comes from `<Section>`.

**Images:** delivered files live in `public/images/` as responsive WebP, produced by `npm run images -- <folder>` (`scripts/optimise-images.mjs`, uses sharp). The script regenerates `src/api/mock/data/images.generated.ts` (slot id → `src`/`srcSet`), which `media.ts` reads; never edit that file by hand. `SmartImage` passes `srcSet` through, so always give it a realistic `sizes`. Every course shows a photo: a dedicated `course-<slug>` image when supplied, otherwise its study-area photo with a per-course `focus` crop (`ImageAsset.focus` → `object-position`) so sibling cards don't look identical. The animated `CategoryArtwork` is now only the fallback when no photo exists at all.

**Logo:** the client's PNG lives in `public/brand/` — `logo.png`/`logo-400.png` (navy wordmark, light surfaces) and `logo-white*.png` (white wordmark, dark surfaces), plus `mark-512.png`, favicon tiles and `apple-touch-icon.png`. The client master merges the book mark and the "AIT" letters with no gap, so the horizontal logo is **composed** (sharp): the clean `mark-512` mark + the "AIT" wordmark cropped from the master (connected-component filtered to drop the book remnant), laid out with deliberate breathing room — 800 × 213, ~3.76:1. `layout/Logo.tsx` picks the variant from `onDark`; callers pass `onDark` when the surface is dark **or the theme is dark** (header: `onDark || theme === 'dark'`). Re-run that compose step (not a plain resize) if the client supplies a new master or an SVG, keeping the gap.

**Home hero slideshow:** `pages/HomePage.tsx` rotates `page.hero.slides` (crossfade + slow zoom, text re-animates per slide, dots with a progress bar, prev/next, pause). It pauses on hover/focus and when the tab is hidden, never auto-plays for reduced-motion visitors, and only announces slide changes (`aria-live`) when the visitor drives them. Without `slides` it falls back to the single `hero.image`.

**Header search:** `layout/SearchDialog.tsx` exports `SearchProvider` (owns the dialog + Ctrl/⌘K shortcut, wraps the header once) and `SearchTrigger` (`variant="bar"` is the full search field in the top utility strip on desktop; `variant="icon"` is the compact button for mobile/tablet and for desktop once the strip scrolls away — the main bar hides it at `xl` until `scrolled`). Multiple triggers open one dialog, so the shortcut lives only in the provider.

**Card carousels:** "Courses to explore" and "Plan your start date" share `components/shared/CardCarousel` (`useCardCarousel` + `CarouselControls` in the section header + `CarouselTrack` around the cards). Any new horizontally-scrolling card row should use it rather than a bespoke track.

**Artwork & placeholders:** missing images never render as flat gradients. `SmartImage` falls back to `ImagePlaceholder` (mesh gradient from `lib/palette.ts` + seeded pattern); study areas and courses use `shared/CategoryArtwork` — bespoke animated SVG per area slug, keyed by `categoryTone()`. Keep new motifs inside the canvas safe area (x 80–320, y 30–190 of 400×300) so they survive cropping on tall tiles and sit above text gradients. Wrap tiles in `<Tilt>` (motion/effects) for pointer-follow 3D and `--px/--py` parallax.

**Dropdowns:** filters and finders use `ui/Dropdown` (Radix Select: animated, typeahead, `anyLabel` for the "no filter" option, `variant="bare"` inside the hero finder). Forms driven by react-hook-form `register()` keep the native `Select` from `ui/form`.

## Motion

- Above the fold: `Reveal immediate`, `TextReveal` for the H1 (wrap words in `*asterisks*` for the gold italic accent).
- Below the fold: `Reveal` / `Stagger` + `StaggerItem` (they trigger once when scrolled into view).
- Use the shared easing `EASE_OUT_EXPO` and springs from `lib/motion.ts`. Keep UI feedback under ~300 ms; entrances 0.6–0.9 s.
- Lists that filter: `AnimatePresence mode="popLayout"` + `motion.li layout`.
- **Theme safety:** never animate colours through Motion inline styles (they keep the old theme's value after a theme switch). Toggle classes and use CSS `transition-colors`.
- Reduced motion is respected globally (`MotionConfig reducedMotion="user"` + CSS). Do not add autoplaying carousels or video with sound.
- Internal links use `AppLink` (adds the page view-transition). Programmatic navigation: `navigate(to, { viewTransition: true })`.

## Accessibility (WCAG 2.2 AA target)

- Use semantic landmarks/headings; one `h1`; logical heading order.
- Every control has a visible label (`Field`); errors are text, linked with `aria-describedby`, and summarised at the top of multi-step forms; move focus to the first error on submit.
- Icon-only buttons need `aria-label`; decorative icons `aria-hidden`.
- Interactive cards use the stretched-link pattern (one real link; no nested interactive elements inside the clickable area other than with `relative z-20`).
- Announce async results with `aria-live="polite"` (counts, saved states).
- Colour is never the only signal (status badges include text).
- Touch targets ≥ 40px; visible focus (`:focus-visible` outline is global).

## Content rules (from the specification)

- Demo data is labelled and only served in mock mode. Never ship guessed entry scores, ages, fees, accreditation, rankings, employment or visa claims.
- A submitted application is a request for review — never imply it is an offer or enrolment.
- Enquiry/contact forms are not emergency channels — keep the emergency notice where support is discussed.
- Search and listings show published content only; never index applicant data or private uploads.

## Conventions

- Imports via `@/…`. Components are named exports; route modules `export default` the page and may `export const loader` / `export async function loader`.
- Links: `AppLink` / `ButtonLink` only (handles internal, external, files, tel/mailto).
- Class names: `cn()`; tokens over arbitrary values.
- Each page renders `<Seo title description noindex? />` and a `PageHero` (or its own hero that pads with `pt-[calc(var(--header-h)+…)]`, because the header is fixed and transparent at the top).
- Run `npm run typecheck`, `npm run lint` and `npm test` before committing.

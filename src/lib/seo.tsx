import { useLocation } from 'react-router'
import { useSettings } from '@/api/queries'
import { env } from '@/config/env'

interface SeoProps {
  /** Page title without the site suffix. Omit on the home page. */
  title?: string
  description?: string
  image?: string | null
  /** Exclude from search engines (confirmation pages, search results, 404s). */
  noindex?: boolean
  type?: 'website' | 'article'
}

/** Strip the `*emphasis*` markers used for animated headings. */
export function plainText(text: string) {
  return text.replace(/\*/g, '')
}

/**
 * Per-page metadata. React 19 hoists these tags into <head>. The static fallbacks from
 * index.html are removed on boot (main.tsx) so they do not shadow these values.
 */
export function Seo({ title, description, image, noindex, type = 'website' }: SeoProps) {
  const settings = useSettings()
  const { pathname } = useLocation()
  const fullTitle = title ? settings.seo.titleTemplate.replace('%s', plainText(title)) : settings.seo.defaultTitle
  const desc = description || settings.seo.description
  const canonical = env.siteUrl ? `${env.siteUrl}${pathname === '/' ? '' : pathname}` : undefined
  const ogImage = image || settings.seo.image
  const absoluteImage = ogImage && env.siteUrl && ogImage.startsWith('/') ? `${env.siteUrl}${ogImage}` : ogImage

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {canonical && !noindex && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:site_name" content={settings.name} />
      {canonical && <meta property="og:url" content={canonical} />}
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}
      <meta name="twitter:card" content="summary_large_image" />
    </>
  )
}

/** Structured data for actual published content only (spec §11). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here once "<" is escaped to avoid closing the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

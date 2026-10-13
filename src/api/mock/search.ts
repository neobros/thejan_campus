import type { Block, SearchResult, SearchResultType } from '@/api/types'
import { campuses, courses } from './catalogue'
import { articles } from './data/articles'
import { events } from './data/events'
import { faqs } from './data/faqs'
import { pages } from './data/pages'
import { pagePublished } from './features'
import { policies, resources } from './data/resources'

interface Doc {
  type: SearchResultType
  title: string
  body: string
  excerpt: string
  href: string
  meta?: string
}

function blockText(block: Block): string {
  const parts: string[] = []
  const add = (...values: (string | undefined)[]) => parts.push(...values.filter((v): v is string => Boolean(v)))
  if ('heading' in block) add(block.heading)
  if ('intro' in block) add(block.intro)
  switch (block.type) {
    case 'richText':
      add(block.body)
      break
    case 'intro':
      add(block.lead, block.body)
      break
    case 'featureGrid':
    case 'linkCards':
    case 'steps':
    case 'timeline':
      block.items.forEach((i) => add(i.title, i.text))
      break
    case 'checklist':
      block.groups.forEach((g) => add(g.title, ...g.items))
      break
    case 'split':
    case 'callout':
      add(block.body)
      break
    case 'faqs':
      block.items.forEach((i) => add(i.question, i.answer))
      break
    default:
      break
  }
  return parts.join(' ')
}

const stripMarkdown = (text: string) =>
  text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

let index: Doc[] | null = null

function buildIndex(): Doc[] {
  const now = new Date().toISOString()
  return [
    ...courses.map<Doc>((c) => ({
      type: 'course',
      title: c.title,
      body: `${c.code ?? ''} ${c.level} ${c.category.name} ${c.summary} ${c.modules.map((m) => m.title).join(' ')} ${c.outcomes.join(' ')}`,
      excerpt: c.summary,
      href: `/courses/${c.slug}`,
      meta: `${c.level} · ${c.category.name}`,
    })),
    ...pages
      .filter((p) => p.slug !== 'home' && p.slug !== 'search' && !p.seo?.noindex && pagePublished(p.slug))
      .map<Doc>((p) => ({
        type: 'page',
        title: p.title.replace(/\*/g, ''),
        body: stripMarkdown(`${p.summary ?? ''} ${p.blocks.map(blockText).join(' ')}`),
        excerpt: p.summary ?? '',
        href: `/${p.slug}`,
        meta: p.eyebrow,
      })),
    ...campuses.map<Doc>((c) => ({
      type: 'campus',
      title: c.name,
      body: `${c.city} ${c.summary} ${c.facilities.map((f) => f.name).join(' ')}`,
      excerpt: c.summary,
      href: `/campuses/${c.slug}`,
      meta: c.city,
    })),
    ...articles.map<Doc>((a) => ({
      type: 'article',
      title: a.title,
      body: stripMarkdown(`${a.summary} ${a.body}`),
      excerpt: a.summary,
      href: `/news/${a.slug}`,
      meta: a.category,
    })),
    ...events.map<Doc>((e) => ({
      type: 'event',
      title: e.title,
      body: stripMarkdown(`${e.type} ${e.summary} ${e.description}`),
      excerpt: e.summary,
      href: `/events/${e.slug}`,
      meta: e.end < now ? `${e.type} · Past event` : e.type,
    })),
    ...resources.map<Doc>((r) => ({
      type: 'resource',
      title: r.title,
      body: `${r.type} ${r.purpose}`,
      excerpt: r.purpose,
      href: `/downloads?q=${encodeURIComponent(r.title)}`,
      meta: `${r.file.format} · ${r.type}`,
    })),
    ...policies.map<Doc>((p) => ({
      type: 'policy',
      title: p.title,
      body: stripMarkdown(`${p.summary} ${p.body}`),
      excerpt: p.summary,
      href: `/policies/${p.slug}`,
      meta: `Version ${p.version}`,
    })),
    ...faqs.map<Doc>((f) => ({
      type: 'faq',
      title: f.question,
      body: stripMarkdown(f.answer),
      excerpt: stripMarkdown(f.answer).slice(0, 180),
      href: `/faq#${f.id}`,
      meta: 'FAQ',
    })),
  ]
}

const TYPE_BOOST: Record<SearchResultType, number> = {
  course: 3,
  page: 2,
  campus: 2,
  policy: 1.5,
  faq: 1.5,
  article: 1,
  event: 1,
  resource: 1,
}

/** Published content only — applications, drafts and uploads are never indexed (spec §5.27). */
export function searchAll(query: string): SearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1)
  if (!terms.length) return []
  index ??= buildIndex()
  return index
    .map((doc) => {
      const title = doc.title.toLowerCase()
      const body = doc.body.toLowerCase()
      let score = 0
      for (const term of terms) {
        if (title.includes(term)) score += 6
        else if (body.includes(term)) score += 1
        else return { doc, score: 0 }
      }
      if (title.startsWith(terms[0])) score += 3
      return { doc, score: score * TYPE_BOOST[doc.type] }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 40)
    .map(({ doc }) => ({ type: doc.type, title: doc.title, excerpt: doc.excerpt, href: doc.href, meta: doc.meta }))
}

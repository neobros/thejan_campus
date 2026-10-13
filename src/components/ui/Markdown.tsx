import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { slugify } from '@/lib/ids'
import { cn } from '@/lib/cn'
import { AppLink } from './AppLink'

function textOf(children: unknown): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(textOf).join('')
  if (children && typeof children === 'object' && 'props' in children) {
    return textOf((children as { props: { children?: unknown } }).props.children)
  }
  return ''
}

const components: Components = {
  a: ({ href = '', children }) => <AppLink href={href}>{children}</AppLink>,
  h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  h3: ({ children }) => <h3 id={slugify(textOf(children))}>{children}</h3>,
  table: ({ children }) => (
    <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm [&_td]:border-t [&_td]:border-line [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_td]:text-ink-muted [&_th]:bg-surface-muted [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_th]:text-ink">
        {children}
      </table>
    </div>
  ),
}

/**
 * CMS rich text. Raw HTML is never rendered (react-markdown escapes it), so content cannot inject
 * scripts; links route through AppLink.
 */
export function Markdown({ children, className, size = 'base' }: { children: string; className?: string; size?: 'sm' | 'base' | 'lg' }) {
  return (
    <div className={cn('prose prose-campus', size === 'sm' && 'prose-sm', size === 'lg' && 'prose-lg', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

/** Extract h2 headings from markdown for an "On this page" list. */
export function markdownHeadings(markdown: string) {
  return [...markdown.matchAll(/^##\s+(.+)$/gm)].map((match) => ({ id: slugify(match[1]), title: match[1].trim() }))
}

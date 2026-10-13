import { Fragment } from 'react'
import { isEmail } from '@/lib/links'

const EMAIL = /([^\s@[\]()<>,;:]+@[^\s@[\]()<>,;:]+\.[a-z]{2,})/gi

/** Plain CMS text with real email addresses turned into mailto links (placeholders stay text). */
export function ContactText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(EMAIL)
  return (
    <span className={className}>
      {parts.map((part, index) =>
        index % 2 === 1 && isEmail(part) ? (
          <a key={index} href={`mailto:${part}`} className="font-medium text-primary-ink underline underline-offset-4 hover:decoration-2">
            {part}
          </a>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </span>
  )
}

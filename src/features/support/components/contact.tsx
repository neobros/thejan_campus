import { Fragment } from 'react'
import { AppLink } from '@/components/ui/AppLink'
import { cn } from '@/lib/cn'
import { isDialable, isEmail, isExternalUrl, telHref } from '@/lib/links'
import { hostname } from './search'

const linkClass = 'font-medium text-primary-ink underline-offset-4 [overflow-wrap:anywhere] hover:underline'
const EMAIL_IN_TEXT = /([^\s@<>()[\]{},;:"']+@[^\s@<>()[\]{},;:"']+\.[A-Za-z]{2,})/g

/** Free text where real email addresses become mailto links (placeholders stay plain text). */
export function ContactText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(EMAIL_IN_TEXT)
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 && isEmail(part) ? (
          <a key={i} href={`mailto:${part}`} className={linkClass}>
            {part}
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </span>
  )
}

/** A contact value that may be an email, phone, URL or plain instructions. */
export function ContactValue({ value, className }: { value: string; className?: string }) {
  const v = value.trim()
  if (isEmail(v))
    return (
      <a href={`mailto:${v}`} className={cn(linkClass, className)}>
        {v}
      </a>
    )
  if (isDialable(v))
    return (
      <a href={telHref(v)} className={cn(linkClass, 'whitespace-nowrap', className)}>
        {v}
      </a>
    )
  if (isExternalUrl(v))
    return (
      <AppLink href={v} className={cn(linkClass, className)}>
        {hostname(v)}
      </AppLink>
    )
  return <ContactText text={v} className={className} />
}

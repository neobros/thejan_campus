import type { AnchorHTMLAttributes, Ref } from 'react'
import { Link } from 'react-router'
import { isExternalUrl, isFileUrl } from '@/lib/links'

export interface AppLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  ref?: Ref<HTMLAnchorElement>
  /** Keep scroll position (e.g. filter links). */
  preventScrollReset?: boolean
  replace?: boolean
  state?: unknown
}

/**
 * One link component for the whole site:
 * - internal routes use the client router with a view transition,
 * - external URLs open in a new tab with a screen-reader hint,
 * - mailto/tel/hash and static files use a plain anchor.
 */
export function AppLink({ href, children, preventScrollReset, replace, state, ...rest }: AppLinkProps) {
  if (isExternalUrl(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  if (/^(mailto:|tel:|#)/i.test(href) || isFileUrl(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} viewTransition preventScrollReset={preventScrollReset} replace={replace} state={state} {...rest}>
      {children}
    </Link>
  )
}

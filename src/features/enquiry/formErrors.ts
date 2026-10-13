import type { FieldErrors, FieldValues } from 'react-hook-form'

export interface ErrorItem {
  key: string
  message: string
}

/** Flatten react-hook-form errors into an ordered list for an error summary. */
export function fieldErrorItems<T extends FieldValues>(errors: FieldErrors<T>, order: readonly string[]): ErrorItem[] {
  const record = errors as Record<string, { message?: unknown } | undefined>
  return order.flatMap((key) => {
    const message = record[key]?.message
    return typeof message === 'string' && message ? [{ key, message }] : []
  })
}

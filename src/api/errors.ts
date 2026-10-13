export class ApiError extends Error {
  readonly status: number
  /** Field-level validation messages keyed by field path (e.g. "email", "personal.phone"). */
  readonly fieldErrors?: Record<string, string>

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function isNotFound(error: unknown) {
  return isApiError(error) && error.status === 404
}

/** Friendly message for unexpected failures — never exposes server internals. */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (isApiError(error) && error.status < 500 && error.message) return error.message
  if (error instanceof TypeError) return 'We could not reach the server. Check your connection and try again.'
  return fallback
}

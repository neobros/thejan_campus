import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '@/api/client'
import { isApiError } from '@/api/errors'
import type { ApplicationData, ApplicationDraft, ApplicationReceipt, DraftHandle } from '@/api/types'
import { uuid } from '@/lib/ids'
import { readJson, removeKey, writeJson } from '@/lib/storage'

/**
 * The secret draft handle (and the submission idempotency key) live in sessionStorage only —
 * never in the URL, localStorage or analytics (spec §6.1, §10).
 */
const STORAGE_KEY = 'campus-application'

interface Session {
  handle: DraftHandle
  /** Created just before the first submission attempt and reused for every retry. */
  submitKey?: string
}

export type DraftNotice = 'resumed' | 'expired' | null

interface DraftState {
  status: 'loading' | 'ready' | 'error'
  draft: ApplicationDraft | null
  notice: DraftNotice
  /** Receipt recovered after a refresh during submission (same idempotency key → same reference). */
  recovered: ApplicationReceipt | null
}

export function isDraftGone(error: unknown) {
  return isApiError(error) && (error.status === 404 || error.status === 410)
}

function readSession(): Session | null {
  const session = readJson<Session>(STORAGE_KEY, 'session')
  return session?.handle?.id && session.handle.token ? session : null
}

function storeSession(ref: { current: Session | null }, session: Session | null) {
  ref.current = session
  if (session) writeJson(STORAGE_KEY, session, 'session')
  else removeKey(STORAGE_KEY, 'session')
}

export function useApplicationDraft() {
  const [state, setState] = useState<DraftState>(() => ({ status: readSession() ? 'loading' : 'ready', draft: null, notice: null, recovered: null }))
  const sessionRef = useRef<Session | null>(null)

  /** Load the stored draft for a session (the server enforces expiry). */
  const restore = useCallback(async (session: Session, isCancelled: () => boolean = () => false) => {
    sessionRef.current = session
    try {
      const draft = await api.getApplicationDraft(session.handle)
      if (isCancelled()) return
      const started = draft.step > 0 || Object.keys(draft.data).length > 0
      setState({ status: 'ready', draft, notice: started ? 'resumed' : null, recovered: null })
    } catch (error) {
      if (isCancelled()) return
      if (!isDraftGone(error)) {
        setState({ status: 'error', draft: null, notice: null, recovered: null })
        return
      }
      // The draft may be gone because it was submitted just before a refresh: replaying the same
      // idempotency key returns the original receipt instead of losing it.
      if (session.submitKey) {
        try {
          const receipt = await api.submitApplication(session.handle, { idempotencyKey: session.submitKey })
          if (isCancelled()) return
          storeSession(sessionRef, null)
          setState({ status: 'ready', draft: null, notice: null, recovered: receipt })
          return
        } catch {
          /* not submitted — fall through to a fresh start */
        }
      }
      storeSession(sessionRef, null)
      setState({ status: 'ready', draft: null, notice: 'expired', recovered: null })
    }
  }, [])

  useEffect(() => {
    const session = readSession()
    if (!session) return
    let cancelled = false
    void restore(session, () => cancelled)
    return () => {
      cancelled = true
    }
  }, [restore])

  /** Save a step. The server-side draft is created on the first save. */
  const save = useCallback(async (step: number, data: ApplicationData) => {
    let session = sessionRef.current
    if (!session) {
      const handle = await api.createApplicationDraft()
      session = { handle }
      storeSession(sessionRef, session)
    }
    const draft = await api.saveApplicationDraft(session.handle, { step, data })
    setState((s) => ({ ...s, status: 'ready', draft }))
    return draft
  }, [])

  const refresh = useCallback(async () => {
    const session = sessionRef.current
    if (!session) return null
    const draft = await api.getApplicationDraft(session.handle)
    setState((s) => ({ ...s, draft }))
    return draft
  }, [])

  const startOver = useCallback((notice: DraftNotice = null) => {
    storeSession(sessionRef, null)
    setState({ status: 'ready', draft: null, notice, recovered: null })
  }, [])

  const dismissNotice = useCallback(() => setState((s) => ({ ...s, notice: null })), [])

  const handle = useCallback(() => sessionRef.current?.handle ?? null, [])

  const hasSubmitKey = useCallback(() => Boolean(sessionRef.current?.submitKey), [])

  /** Idempotency key for the final submission — persisted before the request is sent. */
  const submitKey = useCallback(() => {
    const session = sessionRef.current
    if (!session) throw new Error('No application draft')
    if (!session.submitKey) storeSession(sessionRef, { ...session, submitKey: uuid() })
    return sessionRef.current!.submitKey!
  }, [])

  /** After a definitive rejection (e.g. 409/422) the next attempt is a different request. */
  const rotateSubmitKey = useCallback(() => {
    const session = sessionRef.current
    if (session?.submitKey) storeSession(sessionRef, { handle: session.handle })
  }, [])

  const retry = useCallback(() => {
    const session = readSession()
    if (!session) {
      setState({ status: 'ready', draft: null, notice: null, recovered: null })
      return
    }
    setState((s) => ({ ...s, status: 'loading' }))
    void restore(session)
  }, [restore])

  const clear = useCallback(() => storeSession(sessionRef, null), [])

  return { state, save, refresh, startOver, dismissNotice, handle, hasSubmitKey, submitKey, rotateSubmitKey, clear, retry }
}

import type { CampusApi } from './contract'
import { ApiError } from './errors'
import type { DraftHandle, UploadedDocument } from './types'

type Query = Record<string, string | number | boolean | undefined | null>

interface RequestOptions extends Omit<RequestInit, 'body'> {
  query?: Query
  json?: unknown
}

/**
 * REST adapter for the backend (specification §10). Endpoint paths are proposals — adjust them
 * here if the chosen backend differs; the rest of the site only depends on the CampusApi contract.
 */
export function createHttpApi(baseUrl: string): CampusApi {
  if (!baseUrl) throw new Error('VITE_API_BASE_URL is required when VITE_API_MODE=http')

  async function request<T>(path: string, { query, json, headers, ...init }: RequestOptions = {}): Promise<T> {
    const url = new URL(`${baseUrl}${path}`)
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
    }
    const response = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : undefined,
    })
    if (!response.ok) throw await toApiError(response)
    if (response.status === 204) return undefined as T
    return (await response.json()) as T
  }

  const auth = (handle: DraftHandle) => ({ Authorization: `Bearer ${handle.token}` })
  const draftPath = (handle: DraftHandle) => `/api/application-drafts/${encodeURIComponent(handle.id)}`
  const seg = encodeURIComponent

  return {
    getSettings: () => request('/api/settings'),
    getNavigation: () => request('/api/navigation'),
    getPage: (path) => request('/api/pages', { query: { path } }),

    listCategories: () => request('/api/course-categories'),
    getCategory: (slug) => request(`/api/course-categories/${seg(slug)}`),
    listCourses: (query) => request('/api/courses', { query: { ...query } }),
    getCourseFilterOptions: () => request('/api/courses/filters'),
    getCourse: (slug) => request(`/api/courses/${seg(slug)}`),
    listCourseOptions: () => request('/api/course-options'),
    listIntakes: (query) => request('/api/intakes', { query: { ...query } }),
    listFees: (query) => request('/api/fees', { query: { ...query } }),

    listCampuses: () => request('/api/campuses'),
    getCampus: (slug) => request(`/api/campuses/${seg(slug)}`),

    listArticles: (query) => request('/api/articles', { query: { ...query } }),
    getArticle: (slug) => request(`/api/articles/${seg(slug)}`),
    listEvents: (query) => request('/api/events', { query: { ...query } }),
    getEvent: (slug) => request(`/api/events/${seg(slug)}`),
    listGalleryAlbums: () => request('/api/gallery'),
    listTestimonials: () => request('/api/testimonials'),

    listStaff: () => request('/api/staff'),
    listAccreditations: () => request('/api/accreditations'),
    listAgents: () => request('/api/agents'),
    listScholarships: () => request('/api/scholarships'),

    listSupportServices: () => request('/api/support-services'),
    listOrientationSessions: () => request('/api/orientation-sessions'),
    listResources: (query) => request('/api/resources', { query: { ...query } }),
    listPolicies: () => request('/api/policies'),
    getPolicy: (slug) => request(`/api/policies/${seg(slug)}`),
    listFaqs: () => request('/api/faqs'),
    listDepartments: () => request('/api/departments'),

    search: (q) => request('/api/search', { query: { q } }),

    createEnquiry: (input, { idempotencyKey }) =>
      request('/api/enquiries', { method: 'POST', json: input, headers: { 'Idempotency-Key': idempotencyKey } }),

    createApplicationDraft: () => request('/api/application-drafts', { method: 'POST', json: {} }),
    getApplicationDraft: (handle) => request(draftPath(handle), { headers: auth(handle) }),
    saveApplicationDraft: (handle, patch) =>
      request(draftPath(handle), { method: 'PATCH', json: patch, headers: auth(handle) }),
    getDocumentRequirements: (handle) => request(`${draftPath(handle)}/document-requirements`, { headers: auth(handle) }),
    uploadApplicationDocument: (handle, type, file, onProgress) =>
      uploadWithProgress(`${baseUrl}${draftPath(handle)}/documents`, handle.token, type, file, onProgress),
    removeApplicationDocument: (handle, documentId) =>
      request(`${draftPath(handle)}/documents/${seg(documentId)}`, { method: 'DELETE', headers: auth(handle) }),
    submitApplication: (handle, { idempotencyKey }) =>
      request('/api/applications', {
        method: 'POST',
        json: { draftId: handle.id },
        headers: { ...auth(handle), 'Idempotency-Key': idempotencyKey },
      }),
  }
}

async function toApiError(response: Response) {
  let message = response.status === 404 ? 'Not found' : 'The request could not be completed.'
  let fieldErrors: Record<string, string> | undefined
  try {
    const body = (await response.json()) as { message?: string; errors?: Record<string, string | string[]> }
    if (body.message) message = body.message
    if (body.errors) {
      fieldErrors = Object.fromEntries(
        Object.entries(body.errors).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
      )
    }
  } catch {
    /* non-JSON error body */
  }
  return new ApiError(message, response.status, fieldErrors)
}

/** fetch() cannot report upload progress, so document uploads use XMLHttpRequest. */
function uploadWithProgress(
  url: string,
  token: string,
  type: string,
  file: File,
  onProgress?: (fraction: number) => void,
): Promise<UploadedDocument> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total)
    }
    xhr.onload = () => {
      let body: unknown = null
      try {
        body = JSON.parse(xhr.responseText)
      } catch {
        /* ignore */
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(body as UploadedDocument)
      else {
        const message = (body as { message?: string } | null)?.message ?? 'The file could not be uploaded.'
        reject(new ApiError(message, xhr.status))
      }
    }
    xhr.onerror = () => reject(new TypeError('Network error'))
    const form = new FormData()
    form.append('type', type)
    form.append('file', file)
    xhr.send(form)
  })
}

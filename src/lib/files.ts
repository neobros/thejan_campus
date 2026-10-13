import { formatFileSize } from './format'

/**
 * Upload rules from the specification (§7). They are proposals pending client confirmation and
 * are a usability pre-check only — the server must repeat type/size checks, scan and quarantine.
 */
export const UPLOAD_RULES = {
  maxFileBytes: 10 * 1024 * 1024,
  maxTotalBytes: 50 * 1024 * 1024,
  accept: '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png',
  label: 'PDF, JPG or PNG',
} as const

export type AllowedKind = 'pdf' | 'jpeg' | 'png'

const SIGNATURES: { kind: AllowedKind; bytes: number[] }[] = [
  { kind: 'pdf', bytes: [0x25, 0x50, 0x44, 0x46, 0x2d] }, // %PDF-
  { kind: 'png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { kind: 'jpeg', bytes: [0xff, 0xd8, 0xff] },
]

const EXTENSIONS: Record<AllowedKind, string[]> = {
  pdf: ['pdf'],
  png: ['png'],
  jpeg: ['jpg', 'jpeg'],
}

/** Identify a file by its leading bytes rather than trusting the name or browser-reported type. */
export async function sniffKind(file: File): Promise<AllowedKind | null> {
  const head = new Uint8Array(await file.slice(0, 8).arrayBuffer())
  const match = SIGNATURES.find((sig) => sig.bytes.every((byte, i) => head[i] === byte))
  return match?.kind ?? null
}

export type UploadCheck = { ok: true; kind: AllowedKind } | { ok: false; reason: string }

export async function checkUpload(file: File, alreadyUploadedBytes: number): Promise<UploadCheck> {
  if (file.size === 0) return { ok: false, reason: `“${file.name}” is empty.` }
  if (file.size > UPLOAD_RULES.maxFileBytes) {
    return {
      ok: false,
      reason: `“${file.name}” is ${formatFileSize(file.size)}. Each file must be ${formatFileSize(UPLOAD_RULES.maxFileBytes)} or smaller.`,
    }
  }
  if (alreadyUploadedBytes + file.size > UPLOAD_RULES.maxTotalBytes) {
    return {
      ok: false,
      reason: `Adding “${file.name}” would exceed the ${formatFileSize(UPLOAD_RULES.maxTotalBytes)} limit for one application.`,
    }
  }
  const kind = await sniffKind(file)
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!kind || !EXTENSIONS[kind].includes(ext)) {
    return { ok: false, reason: `“${file.name}” is not a valid ${UPLOAD_RULES.label} file.` }
  }
  return { ok: true, kind }
}

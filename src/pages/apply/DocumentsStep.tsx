import { useQuery } from '@tanstack/react-query'
import { CircleCheck, CircleX, FileText, LoaderCircle, Lock, Trash2, Upload } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { api } from '@/api/client'
import { errorMessage } from '@/api/errors'
import type { ApplicationDraft, DocumentRequirement, DraftHandle, UploadedDocument } from '@/api/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Callout, ErrorPanel, LoadingRegion, Skeleton } from '@/components/ui/feedback'
import { FieldError } from '@/components/ui/form'
import { ErrorSummary } from '@/features/enquiry/ErrorSummary'
import { cn } from '@/lib/cn'
import { checkUpload, UPLOAD_RULES } from '@/lib/files'
import { formatFileSize } from '@/lib/format'
import { StepFooter, StepFrame, type StepNavProps } from './StepFrame'

const POLL_MS = 2500

function ScanChip({ status }: { status: UploadedDocument['scanStatus'] }) {
  if (status === 'clean')
    return (
      <Badge tone="success">
        <CircleCheck aria-hidden className="size-3.5" />
        Checked
      </Badge>
    )
  if (status === 'rejected')
    return (
      <Badge tone="danger">
        <CircleX aria-hidden className="size-3.5" />
        Not accepted
      </Badge>
    )
  return (
    <Badge tone="warning">
      <LoaderCircle aria-hidden className="size-3.5 animate-spin" />
      Security check…
    </Badge>
  )
}

function DocumentSlot({
  requirement,
  documents,
  handle,
  usedBytes,
  missing,
  onChanged,
  announce,
  buttonRef,
}: {
  requirement: DocumentRequirement
  documents: UploadedDocument[]
  handle: DraftHandle
  usedBytes: number
  missing: boolean
  onChanged: () => Promise<unknown>
  announce: (message: string) => void
  buttonRef: (node: HTMLButtonElement | null) => void
}) {
  const uid = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<{ name: string; progress: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const busy = Boolean(uploading)

  const uploadFiles = async (files: File[]) => {
    if (!files.length || busy) return
    setError(null)
    let added = 0
    for (const file of files) {
      const check = await checkUpload(file, usedBytes + added)
      if (!check.ok) {
        setError(check.reason)
        announce(check.reason)
        continue
      }
      setUploading({ name: file.name, progress: 0 })
      announce(`Uploading ${file.name}.`)
      try {
        await api.uploadApplicationDocument(handle, requirement.type, file, (fraction) =>
          setUploading((current) => (current ? { ...current, progress: fraction } : current)),
        )
        added += file.size
        announce(`${file.name} uploaded. A security check is in progress.`)
        await onChanged().catch(() => undefined)
      } catch (e) {
        const message = errorMessage(e, `“${file.name}” could not be uploaded. Please try again.`)
        setError(message)
        announce(message)
      } finally {
        setUploading(null)
      }
    }
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    void uploadFiles(Array.from(event.dataTransfer.files))
  }

  const onInput = (event: FormEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ''
    void uploadFiles(files)
  }

  const remove = async (doc: UploadedDocument) => {
    setRemoving(doc.id)
    try {
      await api.removeApplicationDocument(handle, doc.id)
      await onChanged().catch(() => undefined)
      announce(`${doc.fileName} removed.`)
    } catch (e) {
      setError(errorMessage(e, 'The file could not be removed. Please try again.'))
    } finally {
      setRemoving(null)
    }
  }

  const descriptionId = `${uid}-description`
  const errorId = error || missing ? `${uid}-error` : undefined

  return (
    <li className={cn('rounded-2xl border bg-surface p-5 transition-colors sm:p-6', missing ? 'border-danger/50' : 'border-line')}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0 flex-1">
          <h3 id={`${uid}-label`} className="font-semibold text-ink">
            {requirement.label}
          </h3>
          <p id={descriptionId} className="mt-1 text-sm text-ink-muted">
            {requirement.description}
          </p>
        </div>
        {requirement.required ? <Badge tone="brand">Required</Badge> : <Badge tone="outline">Optional</Badge>}
      </div>

      {documents.length > 0 && (
        <ul className="mt-4 space-y-2" aria-label={`Uploaded ${requirement.label.toLowerCase()} files`}>
          <AnimatePresence initial={false}>
            {documents.map((doc) => (
              <motion.li
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap items-center gap-3 rounded-xl bg-surface-muted px-4 py-3"
              >
                <FileText aria-hidden className="size-5 shrink-0 text-primary-ink" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">{doc.fileName}</span>
                  <span className="block text-xs text-ink-subtle">{formatFileSize(doc.sizeBytes)}</span>
                </span>
                <ScanChip status={doc.scanStatus} />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => void remove(doc)}
                  loading={removing === doc.id}
                  aria-label={`Remove ${doc.fileName}`}
                  icon={removing === doc.id ? undefined : <Trash2 aria-hidden className="size-4" />}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <div
        onDragOver={(event) => {
          event.preventDefault()
          if (!busy) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'mt-4 rounded-2xl border-2 border-dashed px-4 py-5 text-center transition-colors',
          dragging ? 'border-primary bg-primary-soft/60' : 'border-line-strong/40 bg-surface-muted/40',
        )}
      >
        {uploading ? (
          <div>
            <p className="truncate text-sm font-medium text-ink">Uploading {uploading.name}</p>
            <div
              role="progressbar"
              aria-label={`Uploading ${uploading.name}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(uploading.progress * 100)}
              className="mx-auto mt-3 h-2 max-w-sm overflow-hidden rounded-full bg-surface"
            >
              <motion.div
                className="h-full origin-left rounded-full bg-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: uploading.progress }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p className="mt-2 text-xs tabular-nums text-ink-subtle">{Math.round(uploading.progress * 100)}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Upload aria-hidden className="size-5 text-ink-subtle" />
            <p className="hidden text-sm text-ink-muted sm:block">Drag and drop here, or</p>
            <Button
              ref={buttonRef}
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ')}
            >
              {documents.length ? 'Add another file' : 'Choose file'}
              <span className="sr-only"> for {requirement.label}</span>
            </Button>
          </div>
        )}
        <input ref={inputRef} type="file" accept={UPLOAD_RULES.accept} multiple className="sr-only" tabIndex={-1} aria-hidden onInput={onInput} />
      </div>
      <FieldError id={errorId} message={error ?? (missing ? `Upload your ${requirement.label.toLowerCase()} to continue.` : undefined)} />
    </li>
  )
}

export function DocumentsStep({
  handle,
  draft,
  onRefresh,
  onContinue,
  ...nav
}: StepNavProps & {
  handle: DraftHandle
  draft: ApplicationDraft
  onRefresh: () => Promise<unknown>
  onContinue: () => void
}) {
  const selectionKey = draft.data.selection ? `${draft.data.selection.offeringId}` : 'none'
  const requirements = useQuery({
    queryKey: ['application-document-requirements', handle.id, selectionKey],
    queryFn: () => api.getDocumentRequirements(handle),
    staleTime: 0,
    gcTime: 0,
  })
  const documents = draft.documents
  const usedBytes = documents.reduce((sum, d) => sum + d.sizeBytes, 0)
  const pending = documents.some((d) => d.scanStatus === 'pending')
  const [missing, setMissing] = useState<string[]>([])
  const [announcement, setAnnouncement] = useState('')
  const slotButtons = useRef(new Map<string, HTMLButtonElement>())

  // Refresh the draft while any file is waiting for its security scan.
  useEffect(() => {
    if (!pending) return
    const timer = setInterval(() => void onRefresh().catch(() => undefined), POLL_MS)
    return () => clearInterval(timer)
  }, [pending, onRefresh])

  // Announce files that finished their scan.
  const previous = useRef(new Map<string, UploadedDocument['scanStatus']>())
  useEffect(() => {
    const done = documents.filter((d) => previous.current.get(d.id) === 'pending' && d.scanStatus !== 'pending')
    if (done.length) {
      setAnnouncement(done.map((d) => (d.scanStatus === 'clean' ? `${d.fileName} passed the security check.` : `${d.fileName} was not accepted.`)).join(' '))
    }
    previous.current = new Map(documents.map((d) => [d.id, d.scanStatus]))
  }, [documents])

  const list = requirements.data ?? []
  const outstanding = (reqs: DocumentRequirement[]) =>
    reqs.filter((r) => r.required && !documents.some((d) => d.type === r.type && d.scanStatus !== 'rejected')).map((r) => r.type as string)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!requirements.data) return
    const stillMissing = outstanding(requirements.data)
    setMissing(stillMissing)
    if (stillMissing.length) {
      slotButtons.current.get(stillMissing[0])?.focus()
      return
    }
    onContinue()
  }

  const visibleMissing = missing.filter((type) => outstanding(list).includes(type))

  return (
    <StepFrame
      index={nav.index}
      focusHeading={nav.focusHeading}
      intro="The checklist below is based on your course and student type. Upload clear copies — admissions may ask for certified copies or originals later."
    >
      <form noValidate onSubmit={onSubmit}>
        <div className="mb-6 grid gap-3 rounded-2xl border border-line bg-surface-muted/60 p-5 text-sm sm:grid-cols-2">
          <p className="flex items-start gap-2 text-ink-muted">
            <Upload aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-ink" />
            <span>
              {UPLOAD_RULES.label} · up to {formatFileSize(UPLOAD_RULES.maxFileBytes)} per file · {formatFileSize(UPLOAD_RULES.maxTotalBytes)} in total.{' '}
              <span className="tabular-nums text-ink">{formatFileSize(usedBytes)} used.</span>
            </span>
          </p>
          <p className="flex items-start gap-2 text-ink-muted">
            <Lock aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-ink" />
            Files are stored privately, checked for malware before admissions staff can open them, and never published.
          </p>
        </div>

        <ErrorSummary
          title="Some required documents are missing"
          items={visibleMissing.map((type) => ({ key: type, message: `Upload your ${list.find((r) => r.type === type)?.label.toLowerCase() ?? 'document'}.` }))}
          onSelect={(key) => slotButtons.current.get(key)?.focus()}
          className="mb-6"
        />

        {requirements.isPending ? (
          <LoadingRegion label="Loading your document checklist" className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </LoadingRegion>
        ) : requirements.isError ? (
          <ErrorPanel title="Your document checklist could not be loaded" onRetry={() => void requirements.refetch()} />
        ) : (
          <ul className="space-y-4">
            {list.map((requirement) => (
              <DocumentSlot
                key={requirement.type}
                requirement={requirement}
                documents={documents.filter((d) => d.type === requirement.type)}
                handle={handle}
                usedBytes={usedBytes}
                missing={visibleMissing.includes(requirement.type)}
                onChanged={onRefresh}
                announce={setAnnouncement}
                buttonRef={(node) => {
                  if (node) slotButtons.current.set(requirement.type, node)
                  else slotButtons.current.delete(requirement.type)
                }}
              />
            ))}
          </ul>
        )}

        {pending && (
          <Callout tone="info" className="mt-6">
            Security checks usually take a few seconds. You can continue while they finish.
          </Callout>
        )}

        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {announcement}
        </p>

        <StepFooter saving={nav.saving} onBack={() => nav.onBack?.()} />
      </form>
    </StepFrame>
  )
}

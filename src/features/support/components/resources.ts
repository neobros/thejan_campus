import { BookOpen, BookText, CalendarDays, ClipboardList, Compass, FileSpreadsheet, FileText, Presentation, ScrollText, type LucideIcon } from 'lucide-react'
import type { FileInfo, ResourceType } from '@/api/types'
import { formatFileSize } from '@/lib/format'

export const FORMAT_STYLE: Record<FileInfo['format'], { icon: LucideIcon; tile: string; mime: string }> = {
  PDF: { icon: FileText, tile: 'bg-danger-soft text-danger', mime: 'application/pdf' },
  DOCX: { icon: FileText, tile: 'bg-primary-soft text-on-primary-soft', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  XLSX: { icon: FileSpreadsheet, tile: 'bg-success-soft text-success', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  PPTX: { icon: Presentation, tile: 'bg-accent-soft text-on-accent-soft', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
}

export const RESOURCE_TYPE_ICONS: Record<ResourceType, LucideIcon> = {
  handbook: BookOpen,
  form: ClipboardList,
  policy: ScrollText,
  brochure: BookText,
  calendar: CalendarDays,
  guide: Compass,
}

export function fileLabel(file: FileInfo) {
  return `${file.format} · ${formatFileSize(file.sizeBytes)}`
}


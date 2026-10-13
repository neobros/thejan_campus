import { Download, FileText } from 'lucide-react'
import { motion } from 'motion/react'
import type { FileInfo, Resource } from '@/api/types'
import { Badge } from '@/components/ui/Badge'
import { buttonClasses } from '@/components/ui/Button'
import { AUDIENCE_LABELS, RESOURCE_TYPE_LABELS } from '@/components/shared/labels'
import { cn } from '@/lib/cn'
import { formatDate, formatFileSize } from '@/lib/format'
import { Highlight } from './filters'
import { listItemMotion } from './motion'
import { fileLabel, FORMAT_STYLE, RESOURCE_TYPE_ICONS } from './resources'

/** File-type tile: icon plus the format name, so colour is never the only signal. */
export function FileTypeTile({ format, className }: { format: FileInfo['format']; className?: string }) {
  const style = FORMAT_STYLE[format] ?? FORMAT_STYLE.PDF
  const IconComponent = style.icon
  return (
    <span aria-hidden className={cn('relative grid size-14 shrink-0 place-items-center rounded-2xl', style.tile, className)}>
      <span className="flex flex-col items-center gap-0.5">
        <IconComponent strokeWidth={1.75} className="size-5" />
        <span className="text-[10px] font-bold tracking-[0.08em]">{format}</span>
      </span>
    </span>
  )
}

/** One downloadable document with purpose, version, effective date, language, owner and file details (spec §5.20). */
export function ResourceRow({ resource, query = '', index = 0, headingLevel: Heading = 'h3' }: { resource: Resource; query?: string; index?: number; headingLevel?: 'h3' | 'h4' }) {
  const TypeIcon = RESOURCE_TYPE_ICONS[resource.type] ?? FileText
  const { file } = resource
  const fileName = `${resource.slug}.${file.format.toLowerCase()}`
  return (
    <motion.li
      {...listItemMotion(index)}
      className="group grid gap-4 rounded-3xl border border-line bg-surface p-5 shadow-card transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-card-hover sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:p-6"
    >
      <FileTypeTile format={file.format} className="transition-transform duration-500 group-hover:-rotate-3" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="brand">
            <TypeIcon aria-hidden className="size-3" />
            {RESOURCE_TYPE_LABELS[resource.type]}
          </Badge>
          {resource.audiences.map((audience) => (
            <Badge key={audience} tone="outline">
              {audience === 'all' ? 'All students' : AUDIENCE_LABELS[audience]}
            </Badge>
          ))}
        </div>
        <Heading className="mt-2 text-lg font-semibold leading-snug text-ink">
          <Highlight text={resource.title} query={query} />
        </Heading>
        <p className="mt-1 leading-relaxed text-ink-muted">{resource.purpose}</p>
        <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-subtle">
          <div className="flex gap-1">
            <dt>Version</dt>
            <dd className="font-medium text-ink-muted">{resource.version}</dd>
          </div>
          <div className="flex gap-1">
            <dt>Effective</dt>
            <dd className="font-medium text-ink-muted">
              <time dateTime={resource.effectiveDate}>{formatDate(resource.effectiveDate, 'medium')}</time>
            </dd>
          </div>
          <div className="flex gap-1">
            <dt>Language</dt>
            <dd className="font-medium text-ink-muted">{file.language}</dd>
          </div>
          <div className="flex gap-1">
            <dt>Owner</dt>
            <dd className="font-medium text-ink-muted">{resource.owner}</dd>
          </div>
        </dl>
      </div>
      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
        <span className="text-sm font-medium tabular-nums text-ink-subtle sm:order-2">{fileLabel(file)}</span>
        <a href={file.url} download={fileName} type={FORMAT_STYLE[file.format]?.mime} className={buttonClasses({ variant: 'primary', size: 'sm' })}>
          <Download aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
          Download
          <span className="sr-only">
            {' '}
            {resource.title} ({file.format}, {formatFileSize(file.sizeBytes)})
          </span>
        </a>
      </div>
    </motion.li>
  )
}

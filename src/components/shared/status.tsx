import type { Audience, FeeBasis, IntakeStatus, Money } from '@/api/types'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import { formatMoney } from '@/lib/format'
import { FEE_BASIS_LABELS, INTAKE_STATUS, NO_FEE_MESSAGE } from './labels'

export function IntakeStatusBadge({ status, className }: { status: IntakeStatus; className?: string }) {
  const meta = INTAKE_STATUS[status]
  return (
    <Badge tone={meta.tone} dot className={className}>
      {meta.label}
    </Badge>
  )
}

/** A tuition amount with its basis, or the "contact admissions" message when no approved fee exists. */
export function FeeAmount({
  fee,
  className,
  size = 'md',
}: {
  fee?: (Money & { basis: FeeBasis }) | null
  audience?: Audience
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  if (!fee) return <span className={cn('text-ink-muted', size === 'sm' ? 'text-sm' : 'text-[0.9375rem]', className)}>{NO_FEE_MESSAGE}</span>
  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-x-1.5', className)}>
      <span
        className={cn(
          'font-semibold tabular-nums text-ink',
          size === 'lg' ? 'font-display text-3xl' : size === 'md' ? 'text-lg' : 'text-[0.9375rem]',
        )}
      >
        {formatMoney(fee.amount, fee.currency)}
      </span>
      <span className="text-sm text-ink-subtle">{FEE_BASIS_LABELS[fee.basis]}</span>
    </span>
  )
}

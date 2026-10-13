import { Plus } from 'lucide-react'
import { Accordion as Primitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Accordion({ className, ...props }: ComponentProps<typeof Primitive.Root>) {
  return <Primitive.Root className={cn('divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface', className)} {...props} />
}

export function AccordionItem({
  value,
  title,
  meta,
  children,
  className,
  id,
}: {
  value: string
  title: ReactNode
  meta?: ReactNode
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <Primitive.Item value={value} id={id} className={cn('group/acc scroll-mt-32', className)}>
      <Primitive.Header asChild>
        <h3>
          <Primitive.Trigger className="flex w-full items-start gap-4 px-5 py-5 text-left transition-colors hover:bg-surface-muted/60 sm:px-7 sm:py-6">
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold text-ink sm:text-[1.0625rem]">{title}</span>
              {meta && <span className="mt-1 block text-sm text-ink-subtle">{meta}</span>}
            </span>
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-canvas text-ink-muted transition-all duration-300 group-data-[state=open]/acc:rotate-45 group-data-[state=open]/acc:border-primary group-data-[state=open]/acc:bg-primary group-data-[state=open]/acc:text-on-primary"
            >
              <Plus className="size-4" />
            </span>
          </Primitive.Trigger>
        </h3>
      </Primitive.Header>
      <Primitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="px-5 pb-6 text-ink-muted sm:px-7">{children}</div>
      </Primitive.Content>
    </Primitive.Item>
  )
}

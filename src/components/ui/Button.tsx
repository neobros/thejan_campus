import { ArrowRight, LoaderCircle } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import type { Action } from '@/api/types'
import { cn } from '@/lib/cn'
import { AppLink, type AppLinkProps } from './AppLink'
import { Icon } from './Icon'

export type ButtonVariant =
  | 'primary'
  | 'accent'
  | 'secondary'
  | 'ghost'
  | 'inverse'
  | 'inverse-outline'
  | 'inverse-ghost'
  | 'link'
  | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm'

const base =
  'group/btn relative isolate inline-flex select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-full font-semibold tracking-[-0.005em] transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'

const shine =
  'before:absolute before:inset-0 before:-z-10 before:-translate-x-[120%] before:skew-x-[-20deg] before:bg-gradient-to-r before:from-transparent before:via-white/45 before:to-transparent before:transition-transform before:duration-700 before:ease-out hover:before:translate-x-[120%]'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary shadow-[0_8px_24px_-12px] shadow-primary/60 hover:bg-primary-hover',
  accent: cn('bg-accent text-on-accent shadow-[0_10px_28px_-12px] shadow-accent/70 hover:bg-accent-hover', shine),
  secondary: 'border border-line-strong/80 bg-surface text-ink hover:border-ink/50 hover:bg-surface-muted',
  ghost: 'text-ink hover:bg-surface-muted',
  inverse: cn('bg-white text-[#0b1324] hover:bg-white/90', shine),
  'inverse-outline': 'border border-white/35 bg-white/5 text-white backdrop-blur-sm hover:border-white/70 hover:bg-white/12',
  'inverse-ghost': 'text-white hover:bg-white/10',
  link: 'h-auto rounded-md px-0 text-primary-ink underline-offset-4 hover:underline',
  danger: 'bg-danger text-white hover:opacity-90',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 gap-1.5 px-4 text-sm',
  md: 'h-11 gap-2 px-5 text-[0.9375rem]',
  lg: 'h-13 gap-2.5 px-7 text-base',
  icon: 'size-11',
  'icon-sm': 'size-9',
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], variant !== 'link' && sizes[size], className)
}

function Content({ children, arrow, loading, icon }: { children: ReactNode; arrow?: boolean; loading?: boolean; icon?: ReactNode }) {
  return (
    <>
      {loading ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : icon}
      {children}
      {arrow && (
        <ArrowRight aria-hidden className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover/btn:translate-x-1" />
      )}
    </>
  )
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Trailing arrow that nudges on hover. */
  arrow?: boolean
  loading?: boolean
  icon?: ReactNode
  ref?: Ref<HTMLButtonElement>
}

export function Button({ variant, size, arrow, loading, icon, className, children, disabled, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <Content arrow={arrow} loading={loading} icon={icon}>
        {children}
      </Content>
    </button>
  )
}

export interface ButtonLinkProps extends AppLinkProps {
  variant?: ButtonVariant
  size?: ButtonSize
  arrow?: boolean
  icon?: ReactNode
}

export function ButtonLink({ variant, size, arrow, icon, className, children, ...rest }: ButtonLinkProps) {
  return (
    <AppLink className={buttonClasses({ variant, size, className })} {...rest}>
      <Content arrow={arrow} icon={icon}>
        {children}
      </Content>
    </AppLink>
  )
}

const onDarkVariant: Partial<Record<ButtonVariant, ButtonVariant>> = {
  secondary: 'inverse-outline',
  ghost: 'inverse-ghost',
}

/** Renders CMS `Action`s as buttons. Pass `onDark` when placed on a dark/night surface. */
export function ActionButtons({
  actions,
  onDark,
  size = 'lg',
  className,
}: {
  actions?: Action[]
  onDark?: boolean
  size?: ButtonSize
  className?: string
}) {
  if (!actions?.length) return null
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {actions.map((action, index) => {
        const variant = action.variant ?? (index === 0 ? 'primary' : 'secondary')
        return (
          <ButtonLink
            key={`${action.href}-${action.label}`}
            href={action.href}
            size={size}
            variant={(onDark && onDarkVariant[variant]) || variant}
            arrow={index === 0}
            icon={action.icon ? <Icon name={action.icon} className="size-4" /> : undefined}
          >
            {action.label}
          </ButtonLink>
        )
      })}
    </div>
  )
}

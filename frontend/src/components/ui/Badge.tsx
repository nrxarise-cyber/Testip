import { clsx } from 'clsx'

type BadgeVariant = 'success' | 'danger' | 'info' | 'warning' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantMap: Record<BadgeVariant, string> = {
  success: 'badge-live',
  danger: 'badge-dead',
  info: 'badge-info',
  warning: 'badge-warning',
  neutral: 'bg-tg-surface text-tg-muted border border-tg-border/40 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
}

/**
 * Status badge component used for live/dead, VPN, TOR indicators, etc.
 */
export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span className={clsx(variantMap[variant], className)}>
      {children}
    </span>
  )
}

import { type ReactNode } from 'react'

interface PremiumBadgeProps {
  children: ReactNode
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'primary'
  icon?: ReactNode
  className?: string
}

const variantClasses = {
  success: 'badge-success',
  danger: 'badge-danger',
  warning: 'badge-warning',
  info: 'badge-info',
  primary: 'badge-primary',
}

export function PremiumBadge({
  children,
  variant = 'primary',
  icon,
  className = '',
}: PremiumBadgeProps) {
  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </div>
  )
}

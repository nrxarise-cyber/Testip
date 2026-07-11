import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

const variantStyles = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'text-text-muted hover:text-text-primary transition-colors py-2 px-3 rounded-lg hover:bg-aerox-surface/50',
}

const sizeStyles = {
  sm: 'btn-primary-sm',
  md: '',
  lg: 'px-8 py-4 text-lg',
}

export function PremiumButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  className,
  disabled,
  ...rest
}: PremiumButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      className={`
        ${variantStyles[variant]} ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        flex items-center justify-center gap-2
        ${className || ''}
      `}
      disabled={disabled || loading}
      {...(rest as object)}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
    </motion.button>
  )
}

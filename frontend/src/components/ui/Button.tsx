import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

const variantClasses = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'text-tg-muted hover:text-tg-text transition-colors py-2 px-3 rounded-lg hover:bg-tg-surface/50',
}

/**
 * Animated button with loading state, icon support, and multiple variants.
 */
export function Button({
  variant = 'primary',
  loading = false,
  icon,
  fullWidth = false,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={clsx(
        variantClasses[variant],
        fullWidth && 'w-full',
        'flex items-center justify-center gap-2',
        className
      )}
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

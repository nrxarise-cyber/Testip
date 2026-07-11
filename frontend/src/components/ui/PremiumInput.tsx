import { type InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface PremiumInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  error?: string
  helperText?: string
}

export function PremiumInput({
  icon,
  error,
  helperText,
  className = '',
  ...rest
}: PremiumInputProps) {
  return (
    <div className="w-full space-y-1.5">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {icon}
          </div>
        )}
        <motion.input
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`glass-input ${icon ? 'pl-10' : ''} ${error ? 'border-danger/50' : ''} ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-danger font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-text-muted">{helperText}</p>}
    </div>
  )
}

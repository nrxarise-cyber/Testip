import { type TextareaHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface PremiumTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onDrag'> {
  error?: string
  helperText?: string
  charLimit?: number
}

export function PremiumTextarea({
  error,
  helperText,
  charLimit,
  value,
  className = '',
  ...rest
}: PremiumTextareaProps) {
  const charCount = typeof value === 'string' ? value.length : 0

  return (
    <div className="w-full space-y-1.5">
      <motion.textarea
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-textarea ${error ? 'border-danger/50' : ''} ${className}`}
        value={value}
        {...rest}
      />
      <div className="flex items-center justify-between">
        <div>
          {error && <p className="text-xs text-danger font-medium">{error}</p>}
          {helperText && !error && <p className="text-xs text-text-muted">{helperText}</p>}
        </div>
        {charLimit && <p className="text-xs text-text-muted">{charCount}/{charLimit}</p>}
      </div>
    </div>
  )
}

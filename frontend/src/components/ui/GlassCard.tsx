import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  glow?: boolean
  variant?: 'default' | 'lg' | 'input'
}

export function GlassCard({
  children,
  className = '',
  hoverable = false,
  glow = false,
  variant = 'default',
}: GlassCardProps) {
  const baseClass = variant === 'lg' ? 'glass-card-lg' : variant === 'input' ? 'glass-input' : 'glass-card'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverable ? { y: -2 } : undefined}
      className={`
        ${baseClass}
        ${hoverable ? 'cursor-pointer' : ''}
        ${glow ? 'shadow-glow-primary' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

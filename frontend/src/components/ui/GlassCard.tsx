import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  glow?: boolean
  variant?: 'default' | 'lg' | 'input'
  onClick?: () => void
  animate?: boolean
}

export function GlassCard({
  children,
  className = '',
  hoverable = false,
  glow = false,
  variant = 'default',
  onClick,
  animate = true,
}: GlassCardProps) {
  const baseClass = variant === 'lg' ? 'glass-card-lg' : variant === 'input' ? 'glass-input' : 'glass-card'

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 10 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.3 }}
      whileHover={hoverable ? { y: -2 } : undefined}
      onClick={onClick}
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

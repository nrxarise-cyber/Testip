import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  animate?: boolean
  delay?: number
}

/**
 * Glassmorphism card — the primary surface component used throughout AEROX.
 */
export function GlassCard({
  children,
  className,
  onClick,
  animate = true,
  delay = 0,
}: GlassCardProps) {
  const Component = animate ? motion.div : 'div'
  const animProps = animate
    ? {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, delay, ease: 'easeOut' },
      }
    : {}

  return (
    <Component
      className={clsx('glass p-4', onClick && 'cursor-pointer', className)}
      onClick={onClick}
      {...animProps}
    >
      {children}
    </Component>
  )
}

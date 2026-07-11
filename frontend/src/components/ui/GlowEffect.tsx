import { motion } from 'framer-motion'

interface GlowEffectProps {
  className?: string
  color?: 'primary' | 'cyan' | 'success' | 'danger'
  intensity?: 'low' | 'medium' | 'high'
}

const colorConfig = {
  primary: 'from-purple-primary to-purple-secondary',
  cyan: 'from-cyan to-cyan-light',
  success: 'from-success to-success-dark',
  danger: 'from-danger to-danger-dark',
}

const intensityConfig = {
  low: 'opacity-30',
  medium: 'opacity-50',
  high: 'opacity-70',
}

export function GlowEffect({ className = '', color = 'primary', intensity = 'medium' }: GlowEffectProps) {
  return (
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
      className={`
        absolute inset-0 bg-gradient-to-r ${colorConfig[color]} 
        rounded-full blur-3xl ${intensityConfig[intensity]} pointer-events-none
        ${className}
      `}
    />
  )
}

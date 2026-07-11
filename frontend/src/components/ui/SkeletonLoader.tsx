import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'input' | 'circle'
  count?: number
  className?: string
}

export function SkeletonLoader({ variant = 'card', count = 1, className = '' }: SkeletonLoaderProps) {
  const baseClass = 'skeleton'

  const variants = {
    card: `${baseClass} h-32 rounded-xl`,
    text: `${baseClass} h-4 rounded-md`,
    input: `${baseClass} h-10 rounded-lg`,
    circle: `${baseClass} w-10 h-10 rounded-full`,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${variants[variant]} ${className}`} />
      ))}
    </motion.div>
  )
}

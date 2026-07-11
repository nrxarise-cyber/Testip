import { motion } from 'framer-motion'

interface PremiumSectionProps {
  title?: string
  children: React.ReactNode
  className?: string
  delay?: number
}

export function PremiumSection({ title, children, className = '', delay = 0 }: PremiumSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`space-y-3 ${className}`}
    >
      {title && <h2 className="text-lg font-semibold text-text-primary px-4">{title}</h2>}
      <div className="px-4">{children}</div>
    </motion.section>
  )
}

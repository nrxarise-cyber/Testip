import { motion } from 'framer-motion'

interface RiskScoreProps {
  score: number
  max?: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function RiskScore({ score, max = 100, label, size = 'md' }: RiskScoreProps) {
  const percentage = (score / max) * 100
  const getRiskColor = (pct: number) => {
    if (pct < 30) return '#22C55E' // Green
    if (pct < 60) return '#F59E0B' // Amber
    return '#EF4444' // Red
  }

  const sizeConfig = {
    sm: { container: 'w-12 h-12', text: 'text-xs' },
    md: { container: 'w-16 h-16', text: 'text-sm' },
    lg: { container: 'w-20 h-20', text: 'text-base' },
  }

  const config = sizeConfig[size]
  const color = getRiskColor(percentage)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-2"
    >
      <div className={`${config.container} relative`}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(124, 58, 237, 0.1)" strokeWidth="8" />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={283 * (1 - percentage / 100)}
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 * (1 - percentage / 100) }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${config.text} font-bold text-text-primary`}>{Math.round(percentage)}%</span>
        </div>
      </div>
      {label && <p className="text-xs text-text-muted text-center">{label}</p>}
    </motion.div>
  )
}

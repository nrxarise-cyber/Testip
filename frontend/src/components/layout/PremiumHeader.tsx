import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  action?: React.ReactNode
}

export function PremiumHeader({ title, subtitle, showBack = false, action }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 pt-6 pb-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {showBack && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-aerox-surface transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </motion.button>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
            {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'

interface StatusIndicatorProps {
  status: 'live' | 'dead' | 'checking'
  label?: string
}

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const statusConfig = {
    live: {
      class: 'status-live',
      color: 'bg-success',
      label: 'Live',
    },
    dead: {
      class: 'status-dead',
      color: 'bg-danger',
      label: 'Dead',
    },
    checking: {
      class: 'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-cyan/20 text-cyan border border-cyan/40',
      color: 'bg-cyan',
      label: 'Checking...',
    },
  }

  const config = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={config.class}
    >
      <motion.div
        animate={{ scale: status === 'checking' ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.6, repeat: status === 'checking' ? Infinity : 0 }}
        className={`w-2 h-2 rounded-full ${config.color}`}
      />
      <span>{label || config.label}</span>
    </motion.div>
  )
}

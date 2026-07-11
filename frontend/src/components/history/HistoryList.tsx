import { motion } from 'framer-motion'
import { Trash2, Copy, Clock, Search } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusIndicator } from '@/components/ui/StatusIndicator'
import { PremiumButton } from '@/components/ui/PremiumButton'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import type { HistoryItem } from '@/types'

interface HistoryListProps {
  items: HistoryItem[]
  loading: boolean
  onDelete: (id: string) => void
  onCopy: (text: string) => void
}

export function HistoryList({ items, loading, onDelete, onCopy }: HistoryListProps) {
  if (loading) {
    return (
      <div className="px-4 py-8">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center text-text-muted"
        >
          Loading history...
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-12"
      >
        <GlassCard>
          <div className="p-8 text-center space-y-3">
            <Search className="w-12 h-12 text-text-muted/30 mx-auto" />
            <h3 className="text-lg font-semibold text-text-primary">No history yet</h3>
            <p className="text-sm text-text-muted">Your checks will appear here</p>
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-2 px-4 pb-8"
    >
      {items.map((item, index) => (
        <HistoryItemCard
          key={item.id}
          item={item}
          index={index}
          onDelete={onDelete}
          onCopy={onCopy}
        />
      ))}
    </motion.div>
  )
}

interface HistoryItemCardProps {
  item: HistoryItem
  index: number
  onDelete: (id: string) => void
  onCopy: (text: string) => void
}

function HistoryItemCard({ item, index, onDelete, onCopy }: HistoryItemCardProps) {
  const isLive = item.result?.is_alive || item.result?.is_alive === undefined

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <GlassCard className="p-4" hoverable>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Status indicator */}
              <div className="flex-shrink-0">
                {item.result && 'is_alive' in item.result ? (
                  <StatusIndicator status={item.result.is_alive ? 'live' : 'dead'} />
                ) : (
                  <StatusIndicator status="checking" />
                )}
              </div>

              {/* Address and type */}
              <div className="min-w-0 flex-1">
                <code className="text-sm font-mono font-semibold text-text-primary block truncate">
                  {item.query}
                </code>
                <p className="text-xs text-text-muted capitalize mt-1">{item.type} • {formatTime(item.timestamp)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onCopy(item.query)}
                className="p-2 rounded-lg hover:bg-aerox-surface transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-text-muted hover:text-text-primary" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(item.id)}
                className="p-2 rounded-lg hover:bg-danger/10 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-danger" />
              </motion.button>
            </div>
          </div>

          {/* Result details if available */}
          {item.result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-3 border-t border-aerox-border/30 grid grid-cols-2 gap-2 text-xs"
            >
              {item.result.ping_ms !== undefined && (
                <div>
                  <p className="text-text-muted mb-0.5">Latency</p>
                  <p className="font-semibold text-cyan">
                    <AnimatedCounter value={item.result.ping_ms} suffix="ms" decimals={0} />
                  </p>
                </div>
              )}
              {item.result.country && (
                <div>
                  <p className="text-text-muted mb-0.5">Location</p>
                  <p className="font-semibold text-text-primary">{item.result.country}</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}

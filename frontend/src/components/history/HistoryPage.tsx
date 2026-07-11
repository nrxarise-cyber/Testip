import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { PremiumHeader } from '@/components/layout/PremiumHeader'
import { PremiumSection } from '@/components/layout/PremiumSection'
import { HistoryList } from '@/components/history/HistoryList'
import type { HistoryEntry } from '@/types'

interface HistoryPageProps {
  items: HistoryEntry[]
  loading: boolean
  onDelete: (id: number) => void
  onClearAll: () => void
  onCopy: (text: string) => void
}

export function HistoryPage({ items, loading, onDelete, onClearAll, onCopy }: HistoryPageProps) {
  const stats = {
    total: items.length,
    live: items.filter((i) => i.result && 'is_alive' in i.result && i.result.is_alive).length,
    dead: items.filter((i) => i.result && 'is_alive' in i.result && !i.result.is_alive).length,
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <PremiumHeader
        title="History"
        subtitle="Review all your previous checks"
        action={
          items.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClearAll}
              className="p-2 rounded-lg hover:bg-danger/10 transition-colors"
              title="Clear all history"
            >
              <Trash2 className="w-5 h-5 text-danger" />
            </motion.button>
          )
        }
      />

      {/* Stats */}
      {items.length > 0 && (
        <PremiumSection className="px-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-2 px-4"
          >
            <StatCard label="Total" value={stats.total} color="cyan" />
            <StatCard label="Live" value={stats.live} color="success" />
            <StatCard label="Dead" value={stats.dead} color="danger" />
          </motion.div>
        </PremiumSection>
      )}

      {/* History List */}
      <PremiumSection className="px-0">
        <HistoryList items={items} loading={loading} onDelete={onDelete} onCopy={onCopy} />
      </PremiumSection>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
  color: 'cyan' | 'success' | 'danger'
}

const colorConfig = {
  cyan: { bg: 'bg-cyan/20', text: 'text-cyan', border: 'border-cyan/30' },
  success: { bg: 'bg-success/20', text: 'text-success', border: 'border-success/30' },
  danger: { bg: 'bg-danger/20', text: 'text-danger', border: 'border-danger/30' },
}

function StatCard({ label, value, color }: StatCardProps) {
  const config = colorConfig[color]

  return (
    <GlassCard>
      <div className={`p-3 text-center space-y-1 ${config.bg} border ${config.border} rounded-lg`}>
        <p className="text-xs text-text-muted">{label}</p>
        <p className={`text-2xl font-bold ${config.text}`}>{value}</p>
      </div>
    </GlassCard>
  )
}

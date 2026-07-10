import { motion } from 'framer-motion'
import { Globe, Plug, LayoutGrid, Clock, ChevronRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import type { HistoryEntry, CheckType, IPCheckResult, ProxyCheckResult, BulkCheckResult } from '@/types'

interface HistoryItemProps {
  entry: HistoryEntry
  index: number
  onClick: (entry: HistoryEntry) => void
}

const typeConfig: Record<CheckType, { icon: React.ElementType; label: string; color: string }> = {
  ip: { icon: Globe, label: 'IP Check', color: 'text-tg-blue-light' },
  proxy: { icon: Plug, label: 'Proxy Check', color: 'text-success' },
  bulk: { icon: LayoutGrid, label: 'Bulk Check', color: 'text-warning' },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getResultSummary(entry: HistoryEntry): string {
  const result = entry.result as Record<string, unknown>
  if (entry.check_type === 'ip') {
    const ipResult = entry.result as IPCheckResult
    return `${ipResult.country ?? ''} · ${ipResult.isp ?? 'Unknown ISP'}`
  }
  if (entry.check_type === 'proxy') {
    const proxyResult = entry.result as ProxyCheckResult
    const alive = proxyResult.is_alive ? 'Live' : 'Dead'
    return `${alive} · ${proxyResult.country ?? 'Unknown'}`
  }
  if (entry.check_type === 'bulk') {
    const bulkResult = entry.result as BulkCheckResult
    return `${bulkResult.live ?? 0} live / ${bulkResult.dead ?? 0} dead`
  }
  return ''
}

/**
 * Single history entry row with animated entrance.
 */
export function HistoryItem({ entry, index, onClick }: HistoryItemProps) {
  const config = typeConfig[entry.check_type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
    >
      <GlassCard
        className="p-3.5 cursor-pointer hover:border-tg-blue/30 transition-colors"
        onClick={() => onClick(entry)}
        animate={false}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-tg-surface flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Badge variant="info" className="text-[9px]">{config.label}</Badge>
            </div>
            <p className="font-mono text-xs text-tg-text truncate">{entry.input_data.split('\n')[0]}</p>
            <p className="text-[10px] text-tg-muted mt-0.5">{getResultSummary(entry)}</p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div className="flex items-center gap-1 text-tg-muted">
              <Clock className="w-2.5 h-2.5" />
              <span className="text-[9px]">{formatDate(entry.created_at)}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-tg-muted" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

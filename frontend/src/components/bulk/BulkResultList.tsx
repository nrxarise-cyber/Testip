import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { CopyButton } from '@/components/ui/CopyButton'
import type { BulkCheckResult, ProxyCheckResult } from '@/types'

interface BulkResultListProps {
  result: BulkCheckResult
}

function BulkProxyRow({ item, index }: { item: ProxyCheckResult; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className="glass-sm p-3 flex items-center gap-3"
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
        item.is_alive ? 'bg-success pulse-green' : 'bg-danger'
      }`} />
      <div className="flex-1 min-w-0">
        <p className="font-mono text-xs text-tg-text truncate">{item.proxy}</p>
        {item.is_alive && item.country && (
          <p className="text-[10px] text-tg-muted mt-0.5">{item.country} · {item.isp ?? 'Unknown ISP'}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {item.is_alive && item.ping_ms != null && (
          <span className="text-[10px] font-mono text-tg-muted">{item.ping_ms}ms</span>
        )}
        {item.is_alive && item.proxy_score != null && (
          <span className={`text-[10px] font-bold ${
            item.proxy_score > 60 ? 'text-danger' : item.proxy_score > 30 ? 'text-warning' : 'text-success'
          }`}>
            {item.proxy_score}
          </span>
        )}
        <Badge variant={item.is_alive ? 'success' : 'danger'}>
          {item.is_alive ? '✅' : '❌'}
        </Badge>
      </div>
    </motion.div>
  )
}

/**
 * Bulk check results list with summary stats and per-proxy rows.
 */
export function BulkResultList({ result }: BulkResultListProps) {
  const copyText = result.results.map((r) =>
    `${r.proxy} | ${r.is_alive ? 'LIVE' : 'DEAD'} | ${r.ping_ms != null ? r.ping_ms + 'ms' : 'N/A'} | ${r.country ?? 'Unknown'} | Score: ${r.proxy_score ?? 'N/A'}`
  ).join('\n')

  const livePercent = result.total > 0 ? Math.round((result.live / result.total) * 100) : 0

  return (
    <div className="space-y-3">
      {/* Summary card */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-tg-text">Results Summary</h3>
          <CopyButton text={copyText} variant="icon" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="glass-sm p-2.5 text-center rounded-xl">
            <p className="text-[10px] text-tg-muted">Total</p>
            <p className="text-xl font-bold text-tg-text">{result.total}</p>
          </div>
          <div className="glass-sm p-2.5 text-center rounded-xl">
            <p className="text-[10px] text-tg-muted">Live</p>
            <p className="text-xl font-bold text-success">{result.live}</p>
          </div>
          <div className="glass-sm p-2.5 text-center rounded-xl">
            <p className="text-[10px] text-tg-muted">Dead</p>
            <p className="text-xl font-bold text-danger">{result.dead}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="relative h-1.5 bg-tg-border/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${livePercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-success to-tg-blue-light rounded-full"
          />
        </div>
        <p className="text-[10px] text-tg-muted text-right mt-1">{livePercent}% live</p>
      </GlassCard>

      {/* Individual rows */}
      <div className="space-y-2">
        {result.results.map((item, i) => (
          <BulkProxyRow key={item.proxy + i} item={item} index={i} />
        ))}
      </div>

      {/* Copy all */}
      <CopyButton text={copyText} label="Copy All Results" className="w-full justify-center" />
    </div>
  )
}

import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, AlertCircle } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusIndicator } from '@/components/ui/StatusIndicator'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { PremiumBadge } from '@/components/ui/PremiumBadge'
import type { BulkCheckResult, ProxyCheckResult } from '@/types'

interface BulkResultListProps {
  result: BulkCheckResult
}

export function BulkResultList({ result }: BulkResultListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  }

  const successRate = ((result.live / result.total) * 100).toFixed(1)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4 px-4 pb-4"
    >
      {/* Summary Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-3 gap-2"
      >
        {/* Total */}
        <GlassCard>
          <div className="p-4 space-y-2 text-center">
            <div className="w-8 h-8 rounded-lg bg-cyan/20 flex items-center justify-center mx-auto">
              <AlertCircle className="w-4 h-4 text-cyan" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Total</p>
              <p className="text-lg font-bold text-text-primary">
                <AnimatedCounter value={result.total} />
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Live */}
        <GlassCard>
          <div className="p-4 space-y-2 text-center">
            <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Live</p>
              <p className="text-lg font-bold text-success">
                <AnimatedCounter value={result.live} />
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Dead */}
        <GlassCard>
          <div className="p-4 space-y-2 text-center">
            <div className="w-8 h-8 rounded-lg bg-danger/20 flex items-center justify-center mx-auto">
              <XCircle className="w-4 h-4 text-danger" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Dead</p>
              <p className="text-lg font-bold text-danger">
                <AnimatedCounter value={result.dead} />
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Success Rate */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan" />
                <span className="text-sm font-semibold text-text-primary">Success Rate</span>
              </div>
              <span className="text-lg font-bold text-cyan">{successRate}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-aerox-surface overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${successRate}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-success to-success-dark"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Results List */}
      <motion.div variants={itemVariants}>
        <div className="space-y-2">
          {result.results.map((proxy, index) => (
            <ProxyResultItem key={`${proxy.proxy}-${index}`} proxy={proxy} index={index} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

interface ProxyResultItemProps {
  proxy: ProxyCheckResult
  index: number
}

function ProxyResultItem({ proxy, index }: ProxyResultItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard className={`p-4 ${proxy.is_alive ? 'border-success/30' : 'border-danger/30'}`}>
        <div className="space-y-3">
          {/* Proxy address and status */}
          <div className="flex items-center justify-between">
            <code className="text-sm font-mono font-semibold text-text-primary">{proxy.proxy}</code>
            <StatusIndicator status={proxy.is_alive ? 'live' : 'dead'} />
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {proxy.ping_ms !== undefined && (
              <div>
                <p className="text-text-muted mb-1">Latency</p>
                <p className="font-semibold text-text-primary">
                  <AnimatedCounter value={proxy.ping_ms} suffix="ms" decimals={0} />
                </p>
              </div>
            )}
            {proxy.country && (
              <div>
                <p className="text-text-muted mb-1">Location</p>
                <p className="font-semibold text-text-primary">{proxy.country}</p>
              </div>
            )}
          </div>

          {/* Badges */}
          {(proxy.anonymous_level || proxy.supports_http || proxy.supports_https) && (
            <div className="flex flex-wrap gap-1">
              {proxy.anonymous_level && (
                <PremiumBadge variant="primary">{proxy.anonymous_level}</PremiumBadge>
              )}
              {proxy.supports_https && (
                <PremiumBadge variant="success">HTTPS</PremiumBadge>
              )}
              {proxy.supports_socks5 && (
                <PremiumBadge variant="info">SOCKS5</PremiumBadge>
              )}
            </div>
          )}

          {/* Error message */}
          {proxy.error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-2 p-2 rounded-md bg-danger/10 border border-danger/20"
            >
              <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-xs text-danger">{proxy.error}</p>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { AlertTriangle, Zap, Globe, Gauge, Shield, Lock } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { PremiumBadge } from '@/components/ui/PremiumBadge'
import { StatusIndicator } from '@/components/ui/StatusIndicator'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import type { ProxyCheckResult } from '@/types'

interface ProxyResultCardProps {
  result: ProxyCheckResult
}

export function ProxyResultCard({ result }: ProxyResultCardProps) {
  if (result.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pb-4"
      >
        <GlassCard>
          <div className="p-6 text-center space-y-3">
            <AlertTriangle className="w-12 h-12 text-danger mx-auto" />
            <h3 className="text-lg font-semibold text-danger">Error</h3>
            <p className="text-sm text-text-muted">{result.error}</p>
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4 px-4 pb-4"
    >
      {/* Main Status Card */}
      <motion.div variants={itemVariants}>
        <GlassCard variant="lg">
          <div className="p-6 space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted mb-2">Status</p>
                <StatusIndicator status={result.is_alive ? 'live' : 'dead'} />
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl font-bold text-gradient"
              >
                {result.is_alive ? '✓' : '✗'}
              </motion.div>
            </div>

            {/* Proxy Info */}
            <div className="space-y-2">
              <p className="text-sm text-text-muted">Proxy</p>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-aerox-surface/50 border border-aerox-border">
                <Zap className="w-5 h-5 text-cyan" />
                <code className="text-sm font-mono font-semibold text-text-primary">{result.proxy}</code>
              </div>
            </div>

            {/* Performance Metrics */}
            {result.ping_ms !== undefined && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-aerox-surface/50 border border-aerox-border space-y-1">
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <Gauge className="w-3 h-3" /> Latency
                  </p>
                  <p className="text-lg font-bold text-cyan">
                    <AnimatedCounter value={result.ping_ms} suffix="ms" decimals={0} />
                  </p>
                </div>
                {result.response_time_ms !== undefined && (
                  <div className="p-3 rounded-lg bg-aerox-surface/50 border border-aerox-border space-y-1">
                    <p className="text-xs text-text-muted">Response</p>
                    <p className="text-lg font-bold text-cyan">
                      <AnimatedCounter value={result.response_time_ms} suffix="ms" decimals={0} />
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Details Card */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="p-6 space-y-3">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan" /> Details
            </h3>
            <div className="space-y-2 divide-y divide-aerox-border/30">
              {result.country && (
                <DetailRow label="Country" value={result.country} />
              )}
              {result.anonymous_level && (
                <DetailRow label="Anonymity">
                  <PremiumBadge variant="primary">{result.anonymous_level}</PremiumBadge>
                </DetailRow>
              )}
              {result.isp && <DetailRow label="ISP" value={result.isp} />}
              {result.asn && <DetailRow label="ASN" value={result.asn} />}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Protocol Support */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="p-6 space-y-3">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan" /> Protocol Support
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.supports_http && (
                <PremiumBadge variant="success">HTTP</PremiumBadge>
              )}
              {result.supports_https && (
                <PremiumBadge variant="success">HTTPS</PremiumBadge>
              )}
              {result.supports_socks4 && (
                <PremiumBadge variant="info">SOCKS4</PremiumBadge>
              )}
              {result.supports_socks5 && (
                <PremiumBadge variant="info">SOCKS5</PremiumBadge>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Network Type */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="p-6 space-y-3">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan" /> Network Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.is_vpn && <PremiumBadge variant="warning">VPN</PremiumBadge>}
              {result.is_tor && <PremiumBadge variant="danger">TOR</PremiumBadge>}
              {result.is_datacenter && <PremiumBadge variant="info">Data Center</PremiumBadge>}
              {result.is_residential && <PremiumBadge variant="success">Residential</PremiumBadge>}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

interface DetailRowProps {
  label: string
  value?: string
  children?: React.ReactNode
}

function DetailRow({ label, value, children }: DetailRowProps) {
  return (
    <div className="py-3 flex items-center justify-between">
      <span className="text-sm text-text-muted">{label}</span>
      {children || <span className="text-sm font-semibold text-text-primary">{value}</span>}
    </div>
  )
}

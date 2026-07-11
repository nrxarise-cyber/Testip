import { motion } from 'framer-motion'
import { MapPin, Building2, Zap, AlertTriangle, Globe, Database } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { PremiumBadge } from '@/components/ui/PremiumBadge'
import { RiskScore } from '@/components/ui/RiskScore'
import type { IPCheckResult } from '@/types'

interface IPResultCardProps {
  result: IPCheckResult
}

export function IPResultCard({ result }: IPResultCardProps) {
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
      {/* Main Result Card */}
      <motion.div variants={itemVariants}>
        <GlassCard variant="lg">
          <div className="p-6 space-y-4">
            {/* IP Address */}
            <div className="space-y-2">
              <p className="text-sm text-text-muted">IP Address</p>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-aerox-surface/50 border border-aerox-border">
                <Globe className="w-5 h-5 text-cyan" />
                <code className="text-base font-mono font-semibold text-text-primary">{result.ip}</code>
              </div>
            </div>

            {/* Location & ISP */}
            <div className="grid grid-cols-2 gap-3">
              {result.country && (
                <div className="p-3 rounded-lg bg-aerox-surface/50 border border-aerox-border space-y-1">
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </p>
                  <p className="text-sm font-semibold text-text-primary">{result.country}</p>
                  {result.city && <p className="text-xs text-text-muted">{result.city}</p>}
                </div>
              )}
              {result.isp && (
                <div className="p-3 rounded-lg bg-aerox-surface/50 border border-aerox-border space-y-1">
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> ISP
                  </p>
                  <p className="text-sm font-semibold text-text-primary truncate">{result.isp}</p>
                </div>
              )}
            </div>

            {/* Risk Score */}
            {result.risk_score !== undefined && (
              <div className="flex items-center justify-center p-4 rounded-lg bg-aerox-surface/50 border border-aerox-border">
                <RiskScore score={result.risk_score} label="Risk Score" size="md" />
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Details Grid */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="p-6 space-y-3">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan" /> Details
            </h3>
            <div className="space-y-2 divide-y divide-aerox-border/30">
              {result.asn && (
                <DetailRow label="ASN" value={result.asn}>
                  <PremiumBadge variant="info">{result.asn}</PremiumBadge>
                </DetailRow>
              )}
              {result.organization && (
                <DetailRow label="Organization" value={result.organization} />
              )}
              {result.timezone && <DetailRow label="Timezone" value={result.timezone} />}
              {result.hostname && <DetailRow label="Hostname" value={result.hostname} />}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Status Indicators */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="p-6 space-y-3">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan" /> Network Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.is_vpn && <PremiumBadge variant="warning">VPN</PremiumBadge>}
              {result.is_proxy && <PremiumBadge variant="warning">Proxy</PremiumBadge>}
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
  value: string
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

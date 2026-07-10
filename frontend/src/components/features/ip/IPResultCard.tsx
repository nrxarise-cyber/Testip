import { Shield, MapPin, Server, AlertTriangle, Wifi } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { CopyButton } from '@/components/ui/CopyButton'
import type { IPCheckResult } from '@/types'

interface IPResultCardProps {
  result: IPCheckResult
}

interface RowProps {
  label: string
  value?: string | number | boolean | null
  valueClass?: string
}

function Row({ label, value, valueClass }: RowProps) {
  if (value === null || value === undefined) return null
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)
  return (
    <div className="result-row">
      <span className="result-label">{label}</span>
      <span className={`result-value ${valueClass ?? ''}`}>{displayValue}</span>
    </div>
  )
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-3 pb-1 mt-2 border-t border-tg-border/20">
      <Icon className="w-3.5 h-3.5 text-tg-blue-light" />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-tg-muted">{title}</span>
    </div>
  )
}

/**
 * Comprehensive IP result card displaying all intelligence data.
 */
export function IPResultCard({ result }: IPResultCardProps) {
  if (result.error) {
    return (
      <GlassCard className="border-danger/30">
        <div className="flex items-center gap-2 text-danger">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{result.error}</p>
        </div>
      </GlassCard>
    )
  }

  const copyText = JSON.stringify(result, null, 2)

  const riskLevel = (score?: number) => {
    if (score === undefined || score === null) return null
    if (score >= 75) return 'danger'
    if (score >= 40) return 'warning'
    return 'success'
  }

  return (
    <GlassCard className="overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{result.country_flag ?? '🌐'}</span>
            <div>
              <p className="font-mono text-tg-text font-semibold text-sm">{result.ip}</p>
              <p className="text-xs text-tg-muted">{result.country ?? 'Unknown location'}</p>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap mt-2">
            {result.is_vpn && <Badge variant="warning">🔒 VPN</Badge>}
            {result.is_proxy && <Badge variant="warning">🔀 Proxy</Badge>}
            {result.is_tor && <Badge variant="danger">🧅 TOR</Badge>}
            {result.is_datacenter && <Badge variant="info">🏢 Datacenter</Badge>}
            {result.is_residential && <Badge variant="success">🏠 Residential</Badge>}
          </div>
        </div>
        <CopyButton text={copyText} variant="icon" />
      </div>

      {/* Geo section */}
      <SectionHeader icon={MapPin} title="Location" />
      <Row label="City" value={result.city} />
      <Row label="Region" value={result.region} />
      <Row label="Country" value={result.country} />
      <Row label="Timezone" value={result.timezone} />
      <Row label="Latitude" value={result.latitude?.toFixed(4)} />
      <Row label="Longitude" value={result.longitude?.toFixed(4)} />

      {/* Network section */}
      <SectionHeader icon={Server} title="Network" />
      <Row label="ISP" value={result.isp} />
      <Row label="ASN" value={result.asn} />
      <Row label="Organization" value={result.organization} />
      <Row label="Hostname" value={result.hostname} />

      {/* Security section */}
      <SectionHeader icon={Shield} title="Security" />
      <Row label="VPN" value={result.is_vpn} valueClass={result.is_vpn ? 'text-warning' : 'text-success'} />
      <Row label="Proxy" value={result.is_proxy} valueClass={result.is_proxy ? 'text-warning' : 'text-success'} />
      <Row label="TOR" value={result.is_tor} valueClass={result.is_tor ? 'text-danger' : 'text-success'} />

      {/* Risk section */}
      <SectionHeader icon={Wifi} title="Risk Scores" />
      {result.risk_score !== undefined && result.risk_score !== null && (
        <div className="result-row">
          <span className="result-label">Risk Score</span>
          <Badge variant={riskLevel(result.risk_score) ?? 'neutral'}>
            {result.risk_score}/100
          </Badge>
        </div>
      )}
      {result.fraud_score !== undefined && result.fraud_score !== null && (
        <div className="result-row">
          <span className="result-label">Fraud Score</span>
          <Badge variant={riskLevel(result.fraud_score) ?? 'neutral'}>
            {result.fraud_score}/100
          </Badge>
        </div>
      )}
      {result.abuse_score !== undefined && result.abuse_score !== null && (
        <div className="result-row">
          <span className="result-label">Abuse Score</span>
          <Badge variant={riskLevel(result.abuse_score) ?? 'neutral'}>
            {result.abuse_score}/100
          </Badge>
        </div>
      )}

      {/* Blacklist */}
      {result.blacklist_status && result.blacklist_status.length > 0 && (
        <>
          <SectionHeader icon={AlertTriangle} title="Blacklist" />
          {result.blacklist_status.map((entry) => (
            <div key={entry.source} className="result-row">
              <span className="result-label">{entry.source}</span>
              <Badge variant={entry.listed ? 'danger' : 'success'}>
                {entry.listed ? '⛔ Listed' : '✅ Clean'}
              </Badge>
            </div>
          ))}
        </>
      )}

      {/* Full copy button */}
      <div className="mt-4 pt-3 border-t border-tg-border/20">
        <CopyButton text={copyText} label="Copy Full Result" className="w-full justify-center" />
      </div>
    </GlassCard>
  )
}

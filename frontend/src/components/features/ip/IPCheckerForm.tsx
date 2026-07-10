import { useState } from 'react'
import { Search, Globe } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'

interface IPCheckerFormProps {
  onSubmit: (ip: string) => void
  loading: boolean
}

/**
 * IP Checker input form with validation and animated submit button.
 */
export function IPCheckerForm({ onSubmit, loading }: IPCheckerFormProps) {
  const [ip, setIp] = useState('')
  const [error, setError] = useState('')

  const validate = (value: string): boolean => {
    const trimmed = value.trim()
    if (!trimmed) {
      setError('Please enter an IP address')
      return false
    }
    // Basic IPv4/IPv6 pattern check
    const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6 = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/
    if (!ipv4.test(trimmed) && !ipv6.test(trimmed)) {
      setError('Enter a valid IPv4 or IPv6 address')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate(ip)) {
      onSubmit(ip.trim())
    }
  }

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-tg-blue/20 flex items-center justify-center">
          <Globe className="w-5 h-5 text-tg-blue-light" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-tg-text">IP Checker</h2>
          <p className="text-xs text-tg-muted">Enter an IPv4 or IPv6 address</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            id="ip-input"
            type="text"
            className="input-field font-mono"
            placeholder="e.g. 8.8.8.8 or 2001:db8::1"
            value={ip}
            onChange={(e) => {
              setIp(e.target.value)
              if (error) setError('')
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            disabled={loading}
          />
          {error && (
            <p className="text-danger text-xs mt-1.5 flex items-center gap-1">
              <span>⚠</span> {error}
            </p>
          )}
        </div>
        <Button
          type="submit"
          loading={loading}
          fullWidth
          icon={<Search className="w-4 h-4" />}
        >
          {loading ? 'Checking…' : 'Check IP'}
        </Button>
      </form>
    </GlassCard>
  )
}

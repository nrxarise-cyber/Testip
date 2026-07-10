import { useState } from 'react'
import { LayoutGrid, Search } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'

interface BulkCheckerFormProps {
  onSubmit: (proxies: string[]) => void
  loading: boolean
  maxProxies?: number
}

/**
 * Bulk checker form — paste multiple proxies (one per line, max 10).
 */
export function BulkCheckerForm({
  onSubmit,
  loading,
  maxProxies = 10,
}: BulkCheckerFormProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const parseProxies = (raw: string): string[] =>
    raw
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const proxies = parseProxies(text)
    if (proxies.length === 0) {
      setError('Paste at least one proxy')
      return
    }
    if (proxies.length > maxProxies) {
      setError(`Maximum ${maxProxies} proxies allowed`)
      return
    }
    setError('')
    onSubmit(proxies)
  }

  const proxyCount = parseProxies(text).length

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-tg-blue/20 flex items-center justify-center">
          <LayoutGrid className="w-5 h-5 text-tg-blue-light" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-tg-text">Bulk Checker</h2>
          <p className="text-xs text-tg-muted">Check up to {maxProxies} proxies in parallel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <textarea
            id="bulk-input"
            className="input-field font-mono resize-none h-44"
            placeholder={`192.168.1.1:8080\nuser:pass@10.0.0.1:3128\n10.0.0.2:1080:user:pass`}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if (error) setError('')
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            disabled={loading}
          />
          <div className="flex justify-between items-center mt-1.5">
            {error ? (
              <p className="text-danger text-xs">⚠ {error}</p>
            ) : (
              <p className="text-tg-muted text-xs">One proxy per line</p>
            )}
            <p className={`text-xs font-mono ${proxyCount > maxProxies ? 'text-danger' : 'text-tg-muted'}`}>
              {proxyCount}/{maxProxies}
            </p>
          </div>
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
          icon={<Search className="w-4 h-4" />}
          disabled={proxyCount === 0 || proxyCount > maxProxies}
        >
          {loading ? `Checking ${proxyCount} proxies…` : `Check ${proxyCount > 0 ? proxyCount : ''} Proxies`}
        </Button>
      </form>
    </GlassCard>
  )
}

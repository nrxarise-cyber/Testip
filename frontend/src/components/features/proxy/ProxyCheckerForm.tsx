import { useState } from 'react'
import { Plug, Search } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'

interface ProxyCheckerFormProps {
  onSubmit: (proxy: string) => void
  loading: boolean
}

const EXAMPLE_FORMATS = [
  '192.168.1.1:8080',
  'user:pass@192.168.1.1:8080',
  '192.168.1.1:8080:user:pass',
]

/**
 * Proxy checker form supporting all three proxy string formats.
 */
export function ProxyCheckerForm({ onSubmit, loading }: ProxyCheckerFormProps) {
  const [proxy, setProxy] = useState('')
  const [error, setError] = useState('')

  const validate = (value: string): boolean => {
    const trimmed = value.trim()
    if (!trimmed) {
      setError('Please enter a proxy')
      return false
    }
    // At minimum, must contain a colon
    if (!trimmed.includes(':')) {
      setError('Invalid proxy format. Expected IP:PORT, USER:PASS@IP:PORT, or IP:PORT:USER:PASS')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate(proxy)) {
      onSubmit(proxy.trim())
    }
  }

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-tg-blue/20 flex items-center justify-center">
          <Plug className="w-5 h-5 text-tg-blue-light" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-tg-text">Proxy Checker</h2>
          <p className="text-xs text-tg-muted">Check live / dead status and analytics</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <textarea
            id="proxy-input"
            className="input-field font-mono resize-none h-20"
            placeholder={EXAMPLE_FORMATS[0]}
            value={proxy}
            onChange={(e) => {
              setProxy(e.target.value)
              if (error) setError('')
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            disabled={loading}
          />
          {error && (
            <p className="text-danger text-xs mt-1.5">⚠ {error}</p>
          )}
        </div>

        {/* Format hints */}
        <div className="space-y-1">
          <p className="text-[10px] text-tg-muted font-medium">Supported formats:</p>
          {EXAMPLE_FORMATS.map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setProxy(fmt)}
              className="block text-[10px] font-mono text-tg-blue-light/70 hover:text-tg-blue-light transition-colors"
            >
              {fmt}
            </button>
          ))}
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
          icon={<Search className="w-4 h-4" />}
        >
          {loading ? 'Checking…' : 'Check Proxy'}
        </Button>
      </form>
    </GlassCard>
  )
}

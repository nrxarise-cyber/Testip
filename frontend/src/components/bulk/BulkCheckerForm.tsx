import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Loader2, X } from 'lucide-react'
import { PremiumTextarea } from '@/components/ui/PremiumTextarea'
import { PremiumButton } from '@/components/ui/PremiumButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlowEffect } from '@/components/ui/GlowEffect'

interface BulkCheckerFormProps {
  onSubmit: (proxies: string[]) => void
  loading: boolean
}

const MAX_PROXIES = 10

export function BulkCheckerForm({ onSubmit, loading }: BulkCheckerFormProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const validateProxy = (proxy: string) => {
    const trimmed = proxy.trim()
    if (!trimmed) return false
    const proxyRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}$/
    return proxyRegex.test(trimmed)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const proxies = input
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    if (proxies.length === 0) {
      setError('Please enter at least one proxy')
      return
    }

    if (proxies.length > MAX_PROXIES) {
      setError(`Maximum ${MAX_PROXIES} proxies allowed`)
      return
    }

    const invalidProxies = proxies.filter((p) => !validateProxy(p))
    if (invalidProxies.length > 0) {
      setError(`Invalid format: ${invalidProxies[0]}. Use: IP:PORT`)
      return
    }

    setError('')
    onSubmit(proxies)
  }

  const handleClear = () => {
    setInput('')
    setError('')
  }

  const proxyCount = input
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-4 pt-6 pb-4"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <GlowEffect color="success" intensity="low" className="w-80 h-80 -top-40 -right-20" />
      </div>

      <GlassCard variant="lg" className="relative z-10">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-text-primary">Bulk Checker</h2>
            <p className="text-xs text-text-muted">Check up to {MAX_PROXIES} proxies simultaneously</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Textarea */}
            <PremiumTextarea
              placeholder={`Enter proxies (one per line)\nExample:\n192.168.1.1:8080\n10.0.0.1:3128`}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                if (error) setError('')
              }}
              error={error}
              charLimit={MAX_PROXIES * 25}
              className="min-h-32"
            />

            {/* Counter and Actions */}
            <div className="flex items-center justify-between pt-2">
              <motion.div
                animate={proxyCount > 0 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-success/20 to-success-dark/10 flex items-center justify-center border border-success/30">
                  <span className="text-xs font-bold text-success">{proxyCount}</span>
                </div>
                <span className="text-xs text-text-muted">
                  {proxyCount}/{MAX_PROXIES}
                </span>
              </motion.div>

              {input && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-lg hover:bg-aerox-surface transition-colors"
                  title="Clear input"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </motion.button>
              )}
            </div>

            {/* Submit button */}
            <PremiumButton
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading || proxyCount === 0}
              icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            >
              {loading ? `Checking ${proxyCount} Proxies...` : `Check ${proxyCount} Proxy${proxyCount !== 1 ? 'ies' : ''}`}
            </PremiumButton>
          </form>
        </div>
      </GlassCard>
    </motion.div>
  )
}

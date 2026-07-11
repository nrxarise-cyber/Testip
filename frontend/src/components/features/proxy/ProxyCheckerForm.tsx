import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2 } from 'lucide-react'
import { PremiumInput } from '@/components/ui/PremiumInput'
import { PremiumButton } from '@/components/ui/PremiumButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlowEffect } from '@/components/ui/GlowEffect'

interface ProxyCheckerFormProps {
  onSubmit: (proxy: string) => void
  loading: boolean
}

export function ProxyCheckerForm({ onSubmit, loading }: ProxyCheckerFormProps) {
  const [proxy, setProxy] = useState('')
  const [error, setError] = useState('')

  const validateProxy = (value: string) => {
    const proxyRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}$/
    return proxyRegex.test(value) || value === ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!proxy.trim()) {
      setError('Please enter a proxy')
      return
    }
    if (!validateProxy(proxy)) {
      setError('Invalid proxy format. Use: 0.0.0.0:0000')
      return
    }
    setError('')
    onSubmit(proxy)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-4 pt-6 pb-4"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <GlowEffect color="cyan" intensity="low" className="w-80 h-80 -top-40 -right-20" />
      </div>

      <GlassCard variant="lg" className="relative z-10">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-text-primary">Check Proxy</h2>
            <p className="text-xs text-text-muted">Test proxy status and retrieve detailed analytics</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <PremiumInput
              type="text"
              placeholder="e.g., 192.168.1.1:8080"
              value={proxy}
              onChange={(e) => {
                setProxy(e.target.value)
                if (error) setError('')
              }}
              error={error}
              icon={<Search className="w-4 h-4" />}
              helperText="Format: IP:PORT"
            />

            {/* Submit button */}
            <PremiumButton
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading || !proxy.trim()}
              icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            >
              {loading ? 'Testing Proxy...' : 'Test Proxy'}
            </PremiumButton>
          </form>
        </div>
      </GlassCard>
    </motion.div>
  )
}

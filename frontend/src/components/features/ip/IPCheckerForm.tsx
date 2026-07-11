import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2 } from 'lucide-react'
import { PremiumInput } from '@/components/ui/PremiumInput'
import { PremiumButton } from '@/components/ui/PremiumButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlowEffect } from '@/components/ui/GlowEffect'

interface IPCheckerFormProps {
  onSubmit: (ip: string) => void
  loading: boolean
}

export function IPCheckerForm({ onSubmit, loading }: IPCheckerFormProps) {
  const [ip, setIp] = useState('')
  const [error, setError] = useState('')

  const validateIP = (value: string) => {
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
    return ipRegex.test(value) || value === ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ip.trim()) {
      setError('Please enter an IP address')
      return
    }
    if (!validateIP(ip)) {
      setError('Invalid IP address format')
      return
    }
    setError('')
    onSubmit(ip)
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
        <GlowEffect color="primary" intensity="low" className="w-80 h-80 -top-40 -right-20" />
      </div>

      <GlassCard variant="lg" className="relative z-10">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-text-primary">Check IP Address</h2>
            <p className="text-xs text-text-muted">Enter any IP to get detailed network information</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <PremiumInput
              type="text"
              placeholder="e.g., 8.8.8.8"
              value={ip}
              onChange={(e) => {
                setIp(e.target.value)
                if (error) setError('')
              }}
              error={error}
              icon={<Search className="w-4 h-4" />}
            />

            {/* Submit button */}
            <PremiumButton
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading || !ip.trim()}
              icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            >
              {loading ? 'Checking IP...' : 'Check IP'}
            </PremiumButton>
          </form>
        </div>
      </GlassCard>
    </motion.div>
  )
}

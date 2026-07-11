'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ProxyCheckerForm } from '@/components/features/proxy/ProxyCheckerForm'
import { ProxyResultCard } from '@/components/features/proxy/ProxyResultCard'
import { PageLayout } from '@/components/layout/PageLayout'
import { GlowEffect } from '@/components/ui/GlowEffect'
import type { ProxyCheckResult } from '@/types'

export default function ProxyCheckerPage() {
  const [result, setResult] = useState<ProxyCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckProxy = async (proxy: string) => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/proxy-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proxy }),
      })

      if (!response.ok) {
        throw new Error('Failed to check proxy')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setResult({
        proxy,
        error: err instanceof Error ? err.message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Proxy Checker" subtitle="Test proxy status and retrieve analytics">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <GlowEffect color="cyan" intensity="low" className="w-96 h-96 -top-48 -left-48" />
        <GlowEffect color="primary" intensity="low" className="w-96 h-96 -bottom-48 -right-48" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-6">
        <ProxyCheckerForm onSubmit={handleCheckProxy} loading={loading} />
        {result && <ProxyResultCard result={result} />}
      </div>
    </PageLayout>
  )
}

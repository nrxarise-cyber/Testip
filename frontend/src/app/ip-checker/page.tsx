'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { IPCheckerForm } from '@/components/features/ip/IPCheckerForm'
import { IPResultCard } from '@/components/features/ip/IPResultCard'
import { PageLayout } from '@/components/layout/PageLayout'
import { GlowEffect } from '@/components/ui/GlowEffect'
import type { IPCheckResult } from '@/types'

export default function IPCheckerPage() {
  const [result, setResult] = useState<IPCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckIP = async (ip: string) => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/ip-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip }),
      })

      if (!response.ok) {
        throw new Error('Failed to check IP')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setResult({
        ip,
        error: err instanceof Error ? err.message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="IP Checker" subtitle="Check any IP address for detailed information">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <GlowEffect color="primary" intensity="low" className="w-96 h-96 -top-48 -left-48" />
        <GlowEffect color="cyan" intensity="low" className="w-96 h-96 -bottom-48 -right-48" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-6">
        <IPCheckerForm onSubmit={handleCheckIP} loading={loading} />
        {result && <IPResultCard result={result} />}
      </div>
    </PageLayout>
  )
}

'use client'

import { useState } from 'react'
import { BulkCheckerForm } from '@/components/bulk/BulkCheckerForm'
import { BulkResultList } from '@/components/bulk/BulkResultList'
import { PageLayout } from '@/components/layout/PageLayout'
import { GlowEffect } from '@/components/ui/GlowEffect'
import type { BulkCheckResult } from '@/types'

export default function BulkCheckerPage() {
  const [result, setResult] = useState<BulkCheckResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleBulkCheck = async (proxies: string[]) => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/bulk-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proxies }),
      })

      if (!response.ok) {
        throw new Error('Failed to perform bulk check')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setResult({
        total: proxies.length,
        live: 0,
        dead: proxies.length,
        results: proxies.map(proxy => ({
          proxy,
          is_alive: false,
          error: err instanceof Error ? err.message : 'An error occurred',
        })),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Bulk Checker" subtitle="Check up to 10 proxies simultaneously">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <GlowEffect color="success" intensity="low" className="w-96 h-96 -top-48 -left-48" />
        <GlowEffect color="cyan" intensity="low" className="w-96 h-96 -bottom-48 -right-48" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-6">
        <BulkCheckerForm onSubmit={handleBulkCheck} loading={loading} />
        {result && <BulkResultList result={result} />}
      </div>
    </PageLayout>
  )
}

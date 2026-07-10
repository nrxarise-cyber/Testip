import { useState } from 'react'
import { IPCheckerForm } from '@/components/features/ip/IPCheckerForm'
import { IPResultCard } from '@/components/features/ip/IPResultCard'
import { ResultSkeleton } from '@/components/ui/Skeleton'
import { checkIP } from '@/services/api'
import type { IPCheckResult } from '@/types'

/**
 * IP Checker page — form, skeleton loader, and result card.
 */
export function IPCheckerPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<IPCheckResult | null>(null)

  const handleSubmit = async (ip: string) => {
    setLoading(true)
    setResult(null)
    try {
      const data = await checkIP(ip)
      setResult(data)
    } catch (err) {
      setResult({
        ip,
        error: err instanceof Error ? err.message : 'Failed to check IP',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 pt-6 space-y-4">
      <IPCheckerForm onSubmit={handleSubmit} loading={loading} />
      {loading && <ResultSkeleton />}
      {result && !loading && <IPResultCard result={result} />}
    </div>
  )
}

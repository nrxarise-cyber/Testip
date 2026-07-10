import { useState } from 'react'
import { BulkCheckerForm } from '@/components/features/bulk/BulkCheckerForm'
import { BulkResultList } from '@/components/features/bulk/BulkResultList'
import { ResultSkeleton } from '@/components/ui/Skeleton'
import { checkBulk } from '@/services/api'
import type { BulkCheckResult } from '@/types'

/**
 * Bulk Checker page — orchestrates bulk checker form, loading state, and result list.
 */
export function BulkCheckerPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BulkCheckResult | null>(null)

  const handleSubmit = async (proxies: string[]) => {
    setLoading(true)
    setResult(null)
    try {
      const data = await checkBulk(proxies)
      setResult(data)
    } catch (err) {
      setResult({
        total: proxies.length,
        live: 0,
        dead: proxies.length,
        results: proxies.map((p) => ({
          proxy: p,
          is_alive: false,
          error: err instanceof Error ? err.message : 'Failed to check proxy bulk',
        })),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 pt-6 space-y-4">
      <BulkCheckerForm onSubmit={handleSubmit} loading={loading} />
      {loading && <ResultSkeleton />}
      {result && !loading && <BulkResultList result={result} />}
    </div>
  )
}

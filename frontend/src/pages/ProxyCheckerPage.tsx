import { useState } from 'react'
import { ProxyCheckerForm } from '@/components/features/proxy/ProxyCheckerForm'
import { ProxyResultCard } from '@/components/features/proxy/ProxyResultCard'
import { ResultSkeleton } from '@/components/ui/Skeleton'
import { checkProxy } from '@/services/api'
import type { ProxyCheckResult } from '@/types'

/**
 * Proxy Checker page — form, skeleton loader, and result card.
 */
export function ProxyCheckerPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ProxyCheckResult | null>(null)

  const handleSubmit = async (proxy: string) => {
    setLoading(true)
    setResult(null)
    try {
      const data = await checkProxy(proxy)
      setResult(data)
    } catch (err) {
      setResult({
        proxy,
        is_alive: false,
        error: err instanceof Error ? err.message : 'Failed to check proxy',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 pt-6 space-y-4">
      <ProxyCheckerForm onSubmit={handleSubmit} loading={loading} />
      {loading && <ResultSkeleton />}
      {result && !loading && <ProxyResultCard result={result} />}
    </div>
  )
}

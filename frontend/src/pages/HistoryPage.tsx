import { useEffect, useState, useCallback } from 'react'
import { HistoryItem as HistoryItemComponent } from '@/components/features/history/HistoryItem'
import { IPResultCard } from '@/components/features/ip/IPResultCard'
import { ProxyResultCard } from '@/components/features/proxy/ProxyResultCard'
import { BulkResultList } from '@/components/features/bulk/BulkResultList'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { getHistory, clearHistory } from '@/services/api'
import type { HistoryEntry, IPCheckResult, ProxyCheckResult, BulkCheckResult } from '@/types'
import { ScrollText, Trash2, ArrowLeft, RefreshCw } from 'lucide-react'

export function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null)
  const [clearing, setClearing] = useState(false)

  const fetchHistory = useCallback(async (pageNum: number) => {
    setLoading(true)
    try {
      const data = await getHistory(pageNum, 20)
      setEntries(data.items)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory(page)
  }, [page, fetchHistory])

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all history?')) return
    setClearing(true)
    try {
      await clearHistory()
      setEntries([])
      setTotal(0)
      setSelectedEntry(null)
    } catch (err) {
      console.error(err)
    } finally {
      setClearing(false)
    }
  }

  const renderDetail = () => {
    if (!selectedEntry) return null

    return (
      <div className="space-y-4">
        <Button
          variant="secondary"
          onClick={() => setSelectedEntry(null)}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="mb-2"
        >
          Back to list
        </Button>
        <div className="text-xs text-tg-muted mb-2">
          Checked on {new Date(selectedEntry.created_at).toLocaleString()}
        </div>
        {selectedEntry.check_type === 'ip' && (
          <IPResultCard result={selectedEntry.result as IPCheckResult} />
        )}
        {selectedEntry.check_type === 'proxy' && (
          <ProxyResultCard result={selectedEntry.result as ProxyCheckResult} />
        )}
        {selectedEntry.check_type === 'bulk' && (
          <BulkResultList result={selectedEntry.result as BulkCheckResult} />
        )}
      </div>
    )
  }

  if (selectedEntry) {
    return <div className="px-4 pt-6 pb-20">{renderDetail()}</div>
  }

  return (
    <div className="px-4 pt-6 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tg-blue/20 flex items-center justify-center">
            <ScrollText className="w-5 h-5 text-tg-blue-light" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-tg-text">Check History</h2>
            <p className="text-xs text-tg-muted">Review previous checks</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => fetchHistory(page)}
            disabled={loading}
            className="p-2 py-2 px-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          {entries.length > 0 && (
            <Button
              variant="danger"
              onClick={handleClearHistory}
              disabled={clearing}
              icon={<Trash2 className="w-4 h-4" />}
              className="py-2.5 px-3.5"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <GlassCard key={idx} className="p-4" animate={false}>
              <div className="flex justify-between items-center gap-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="w-1/4 h-3.5" />
                  <Skeleton className="w-1/2 h-3.5" />
                </div>
                <Skeleton className="w-12 h-6" />
              </div>
            </GlassCard>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <GlassCard className="text-center p-8">
          <p className="text-sm text-tg-muted">No history found.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <HistoryItemComponent
              key={entry.id}
              entry={entry}
              index={index}
              onClick={setSelectedEntry}
            />
          ))}

          {/* Simple Pagination */}
          {total > 20 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-xs text-tg-muted">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              <Button
                variant="secondary"
                disabled={page * 20 >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

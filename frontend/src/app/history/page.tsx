'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HistoryPage } from '@/components/history/HistoryPage'
import { PageLayout } from '@/components/layout/PageLayout'
import { GlowEffect } from '@/components/ui/GlowEffect'
import type { HistoryItem } from '@/types'

export default function HistoryPageComponent() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/history')
      if (!response.ok) throw new Error('Failed to load history')
      const data = await response.json()
      setItems(data)
    } catch (err) {
      console.error('Failed to load history:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/history/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setItems(items.filter((item) => item.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete history item:', err)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Clear all history? This cannot be undone.')) return
    try {
      const response = await fetch('/api/history', { method: 'DELETE' })
      if (response.ok) {
        setItems([])
      }
    } catch (err) {
      console.error('Failed to clear history:', err)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <PageLayout title="History" subtitle="Review all your previous checks">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <GlowEffect color="primary" intensity="low" className="w-96 h-96 -top-48 -left-48" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <HistoryPage
          items={items}
          loading={loading}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
          onCopy={handleCopy}
        />
      </div>
    </PageLayout>
  )
}

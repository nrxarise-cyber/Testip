import { useState, useCallback, useRef } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

/**
 * Toast notification queue manager.
 * Returns a showToast function and the current toast list.
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3500) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      const toast: Toast = { id, message, type }
      setToasts((prev) => [...prev.slice(-3), toast]) // max 4 at once
      const timer = setTimeout(() => dismissToast(id), duration)
      timers.current.set(id, timer)
      return id
    },
    [dismissToast]
  )

  return { toasts, showToast, dismissToast }
}

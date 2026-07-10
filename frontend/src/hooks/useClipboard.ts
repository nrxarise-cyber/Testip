import { useCallback } from 'react'

/**
 * Copy text to clipboard with fallback for older browsers.
 * Returns a copyToClipboard function that resolves to true on success.
 */
export function useClipboard() {
  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch {
        // fall through to execCommand
      }
    }
    // Fallback for non-HTTPS / older browsers
    try {
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      return true
    } catch {
      return false
    }
  }, [])

  return { copyToClipboard }
}

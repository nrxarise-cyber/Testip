import { useEffect, useRef } from 'react'

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    onClick: (cb: () => void) => void
    offClick: (cb: () => void) => void
  }
  BackButton: {
    isVisible: boolean
    show: () => void
    hide: () => void
    onClick: (cb: () => void) => void
    offClick: (cb: () => void) => void
  }
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
  }
  colorScheme: 'light' | 'dark'
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
  }
  hapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  version: string
  platform: string
  isExpanded: boolean
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

/**
 * Hook that provides access to the Telegram WebApp SDK.
 * Gracefully degrades when not running inside Telegram.
 */
export function useTelegram() {
  const tg = useRef<TelegramWebApp | null>(
    typeof window !== 'undefined' ? window.Telegram?.WebApp ?? null : null
  )

  useEffect(() => {
    if (tg.current) {
      tg.current.ready()
      tg.current.expand()
    }
  }, [])

  const hapticImpact = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    tg.current?.hapticFeedback?.impactOccurred(style)
  }

  const hapticNotification = (type: 'success' | 'error' | 'warning') => {
    tg.current?.hapticFeedback?.notificationOccurred(type)
  }

  const user = tg.current?.initDataUnsafe?.user

  return {
    tg: tg.current,
    user,
    isInsideTelegram: !!tg.current,
    hapticImpact,
    hapticNotification,
  }
}

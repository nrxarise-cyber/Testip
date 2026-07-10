import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { clsx } from 'clsx'
import { useClipboard } from '@/hooks/useClipboard'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
  variant?: 'icon' | 'button'
}

/**
 * One-click copy button with a ✓ confirmation animation.
 */
export function CopyButton({
  text,
  label = 'Copy',
  className,
  variant = 'button',
}: CopyButtonProps) {
  const { copyToClipboard } = useClipboard()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleCopy}
        className={clsx(
          'p-1.5 rounded-lg transition-all duration-200',
          copied
            ? 'text-success bg-success/10'
            : 'text-tg-muted hover:text-tg-text hover:bg-tg-surface/60',
          className
        )}
        title={copied ? 'Copied!' : 'Copy to clipboard'}
        aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    )
  }

  return (
    <button
      onClick={handleCopy}
      className={clsx(
        'btn-secondary flex items-center gap-2 text-sm py-2 px-4',
        copied && 'border-success/40 text-success',
        className
      )}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  )
}

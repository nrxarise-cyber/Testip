import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
  lines?: number
  height?: string
}

/**
 * Skeleton shimmer loader for content placeholders.
 */
export function Skeleton({ className, height = 'h-4' }: SkeletonProps) {
  return <div className={clsx('skeleton', height, className)} />
}

/**
 * Pre-built skeleton layout for IP/Proxy result cards.
 */
export function ResultSkeleton() {
  return (
    <div className="glass p-4 space-y-3 animate-fade-in">
      <Skeleton height="h-6" className="w-1/3" />
      <div className="space-y-2.5 mt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex justify-between gap-4">
            <Skeleton height="h-3.5" className="w-24" />
            <Skeleton height="h-3.5" className="w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Dashboard card skeleton.
 */
export function CardSkeleton() {
  return (
    <div className="glass p-5 space-y-3">
      <Skeleton height="h-12" className="w-12 rounded-xl" />
      <Skeleton height="h-5" className="w-24" />
      <Skeleton height="h-3.5" className="w-32" />
    </div>
  )
}

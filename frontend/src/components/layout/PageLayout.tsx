import { type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'

interface PageLayoutProps {
  children: ReactNode
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

/**
 * Root layout wrapper providing animated page transitions and bottom nav.
 */
export function PageLayout({ children }: PageLayoutProps) {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-dvh bg-tg-bg">
      {/* Decorative gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-tg-blue/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-tg-blue-dark/6 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-72 h-72 bg-tg-blue/5 rounded-full blur-3xl" />
      </div>

      {/* Page content with route-keyed animation */}
      <main className="flex-1 relative z-10 pb-24 overflow-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  )
}

import { type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { PremiumBottomNav } from './PremiumBottomNav'

interface PageLayoutProps {
  children: ReactNode
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export function PageLayout({ children }: PageLayoutProps) {
  const location = useLocation()

  return (
    <div className="relative flex flex-col min-h-dvh bg-aerox-bg overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Blob 1 */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-primary/8 rounded-full blur-3xl"
        />
        {/* Blob 2 */}
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 -left-32 w-72 h-72 bg-cyan/6 rounded-full blur-3xl"
        />
        {/* Blob 3 */}
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-32 right-1/4 w-80 h-80 bg-purple-secondary/5 rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <main className="flex-1 relative z-10 pb-28 overflow-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <PremiumBottomNav />
    </div>
  )
}

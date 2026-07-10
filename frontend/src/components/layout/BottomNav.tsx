import { useNavigate, useLocation } from 'react-router-dom'
import { Globe, Plug, LayoutGrid, ScrollText } from 'lucide-react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutGrid },
  { path: '/ip', label: 'IP Check', icon: Globe },
  { path: '/proxy', label: 'Proxy', icon: Plug },
  { path: '/history', label: 'History', icon: ScrollText },
] as const

/**
 * Fixed bottom navigation bar with active state highlight and haptic feedback.
 */
export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="glass-sm mx-2 mb-2 px-2 py-1 rounded-2xl border-tg-border/50">
        <div className="flex items-center justify-around">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={clsx('nav-item relative', isActive && 'active')}
                aria-label={`Navigate to ${label}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-tg-blue/10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon
                  className={clsx(
                    'w-5 h-5 relative z-10 transition-all duration-200',
                    isActive ? 'text-tg-blue-light' : 'text-tg-muted'
                  )}
                />
                <span
                  className={clsx(
                    'text-[10px] font-medium relative z-10 transition-all duration-200',
                    isActive ? 'text-tg-blue-light' : 'text-tg-muted'
                  )}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

import { useNavigate, useLocation } from 'react-router-dom'
import { Globe, Plug, LayoutGrid, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutGrid },
  { path: '/ip', label: 'IP', icon: Globe },
  { path: '/proxy', label: 'Proxy', icon: Plug },
  { path: '/history', label: 'History', icon: Clock },
] as const

export function PremiumBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      {/* Gradient line at top */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-primary/40 to-transparent" />

      {/* Navigation bar */}
      <div className="glass-base mx-3 mb-3 px-2 py-2 rounded-2xl flex items-center justify-around">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path

          return (
            <motion.button
              key={path}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(path)}
              className="nav-item relative"
              aria-label={`Navigate to ${label}`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 bg-gradient-to-r from-purple-primary/20 to-cyan/10 rounded-lg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <motion.div
                className="relative z-10 flex flex-col items-center gap-1"
                animate={isActive ? { y: -2 } : { y: 0 }}
              >
                <Icon
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? 'text-cyan shadow-glow-cyan' : 'text-text-muted'
                  }`}
                />
                <span
                  className={`text-[10px] font-semibold transition-all duration-300 ${
                    isActive ? 'text-cyan' : 'text-text-muted'
                  }`}
                >
                  {label}
                </span>
              </motion.div>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}

import { useNavigate } from 'react-router-dom'
import { Globe, Plug, LayoutGrid, ScrollText, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTelegram } from '@/hooks/useTelegram'

interface FeatureCard {
  id: string
  icon: React.ElementType
  emoji: string
  title: string
  description: string
  path: string
  gradient: string
  delay: number
}

const features: FeatureCard[] = [
  {
    id: 'ip-checker',
    icon: Globe,
    emoji: '🌐',
    title: 'IP Checker',
    description: 'Full intelligence: geo, ISP, ASN, VPN, TOR, risk scores',
    path: '/ip',
    gradient: 'from-tg-blue/20 to-tg-blue-dark/10',
    delay: 0.1,
  },
  {
    id: 'proxy-checker',
    icon: Plug,
    emoji: '🔌',
    title: 'Proxy Checker',
    description: 'Live/dead, ping, anonymity level, protocol support',
    path: '/proxy',
    gradient: 'from-success/15 to-success/5',
    delay: 0.15,
  },
  {
    id: 'bulk-checker',
    icon: LayoutGrid,
    emoji: '📋',
    title: 'Bulk Checker',
    description: 'Check up to 10 proxies in parallel with one click',
    path: '/bulk',
    gradient: 'from-warning/15 to-warning/5',
    delay: 0.2,
  },
  {
    id: 'history',
    icon: ScrollText,
    emoji: '📜',
    title: 'History',
    description: 'Browse all previous checks, newest first',
    path: '/history',
    gradient: 'from-tg-blue-light/10 to-tg-blue/5',
    delay: 0.25,
  },
]

/**
 * Dashboard page — entry point showing all four feature cards.
 */
export function Dashboard() {
  const navigate = useNavigate()
  const { user } = useTelegram()

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-7"
      >
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-tg-blue-light" />
          <span className="text-xs font-medium text-tg-muted uppercase tracking-widest">AEROX</span>
        </div>
        <h1 className="text-2xl font-bold text-tg-text mb-1">
          {user ? `Hey, ${user.first_name} 👋` : 'IP & Proxy Intelligence'}
        </h1>
        <p className="text-sm text-tg-muted leading-relaxed">
          Advanced network analysis tools built for Telegram.
        </p>
      </motion.div>

      {/* Feature grid */}
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <motion.button
              key={feature.id}
              id={feature.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: feature.delay }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(feature.path)}
              className={`
                glass text-left p-4 relative overflow-hidden
                border border-tg-border/40
                hover:border-tg-blue/30 hover:shadow-glow
                transition-all duration-300 group
              `}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-60`} />

              {/* Content */}
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-tg-bg/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                  <Icon className="w-5 h-5 text-tg-blue-light" />
                </div>
                <h3 className="text-sm font-semibold text-tg-text mb-1 leading-tight">
                  {feature.emoji} {feature.title}
                </h3>
                <p className="text-[10px] text-tg-muted leading-snug">
                  {feature.description}
                </p>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>
          )
        })}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-[10px] text-tg-muted/50">
          Powered by ip-api · ipinfo · proxycheck.io · AbuseIPDB
        </p>
      </motion.div>
    </div>
  )
}

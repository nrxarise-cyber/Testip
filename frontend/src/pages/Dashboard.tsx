import { useNavigate } from 'react-router-dom'
import { Globe, Plug, LayoutGrid, Clock, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTelegram } from '@/hooks/useTelegram'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlowEffect } from '@/components/ui/GlowEffect'

interface FeatureCard {
  id: string
  icon: React.ElementType
  title: string
  subtitle: string
  path: string
  gradient: string
  glowColor: 'primary' | 'cyan' | 'success' | 'danger'
  delay: number
}

const features: FeatureCard[] = [
  {
    id: 'ip-checker',
    icon: Globe,
    title: 'IP Checker',
    subtitle: 'Full network intelligence',
    path: '/ip',
    gradient: 'from-purple-primary/20 to-purple-secondary/10',
    glowColor: 'primary',
    delay: 0.1,
  },
  {
    id: 'proxy-checker',
    icon: Plug,
    title: 'Proxy Checker',
    subtitle: 'Live status & analytics',
    path: '/proxy',
    gradient: 'from-cyan/15 to-cyan-light/5',
    glowColor: 'cyan',
    delay: 0.15,
  },
  {
    id: 'bulk-checker',
    icon: LayoutGrid,
    title: 'Bulk Checker',
    subtitle: 'Check up to 10 proxies',
    path: '/bulk',
    gradient: 'from-success/15 to-success-dark/5',
    glowColor: 'success',
    delay: 0.2,
  },
  {
    id: 'history',
    icon: Clock,
    title: 'History',
    subtitle: 'Browse all previous checks',
    path: '/history',
    gradient: 'from-warning/15 to-warning-dark/5',
    glowColor: 'danger',
    delay: 0.25,
  },
]

export function Dashboard() {
  const navigate = useNavigate()
  const { user } = useTelegram()

  return (
    <div className="min-h-full flex flex-col">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative px-4 pt-8 pb-8"
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <GlowEffect color="primary" intensity="low" className="w-64 h-64 -top-20 -right-20" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="w-5 h-5 text-cyan" />
            </motion.div>
            <span className="text-xs font-semibold text-cyan uppercase tracking-widest">AEROX</span>
          </div>
          <h1 className="text-3xl font-black text-text-primary leading-tight">
            {user ? `Good ${getTimeGreeting()}, ${user.first_name}` : 'Welcome to AEROX'}
          </h1>
          <p className="text-sm text-text-muted mt-2">Advanced network intelligence platform</p>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <div className="flex-1 px-4 pb-8">
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: feature.delay, ease: 'easeOut' }}
                whileTap={{ scale: 0.95 }}
              >
                <GlassCard
                  hoverable
                  className="h-full"
                  onClick={() => navigate(feature.path)}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl`} />

                  {/* Glow effect */}
                  <div className="absolute inset-0 pointer-events-none">
                    <GlowEffect
                      color={feature.glowColor}
                      intensity="low"
                      className="w-32 h-32 -top-8 -right-8"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-4 space-y-3 h-full flex flex-col">
                    {/* Icon container */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-primary/20 to-cyan/10 flex items-center justify-center border border-purple-primary/20"
                    >
                      <Icon className="w-6 h-6 text-cyan" />
                    </motion.div>

                    {/* Text */}
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-text-primary leading-tight">{feature.title}</h3>
                      <p className="text-xs text-text-muted mt-1 leading-snug">{feature.subtitle}</p>
                    </div>

                    {/* Arrow indicator */}
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-cyan text-xs font-semibold"
                    >
                      →
                    </motion.div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="px-4 py-4 text-center border-t border-aerox-border/20"
      >
        <p className="text-xs text-text-muted/50">Powered by IP-API • Proxycheck • AbuseIPDB</p>
      </motion.div>
    </div>
  )
}

function getTimeGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return '🌅 Morning'
  if (hour < 17) return '☀️ Afternoon'
  if (hour < 21) return '🌆 Evening'
  return '🌙 Night'
}

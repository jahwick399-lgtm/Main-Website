import { motion } from 'framer-motion'

const BADGES = [
  { icon: '🔒', title: 'Safe & Private',   glow: 'rgba(52,211,153,0.15)' },
  { icon: '✅', title: 'Verified Vendors', glow: 'rgba(255,215,0,0.12)'  },
  { icon: '⚡', title: 'Instant Access',   glow: 'rgba(255,215,0,0.12)'  },
  { icon: '🔄', title: 'Always Updated',   glow: 'rgba(96,165,250,0.15)' },
  { icon: '📩', title: 'Real Support',     glow: 'rgba(196,132,252,0.15)'},
  { icon: '🏆', title: 'Proven Results',   glow: 'rgba(255,215,0,0.15)'  },
]

export default function TrustBadges() {
  return (
    <section className="relative py-16 px-4">
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl sm:text-5xl">
            <span className="gold-text">Why</span>
            <span className="text-white"> Members Trust Us</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {BADGES.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
              className="group glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center cursor-default overflow-hidden relative"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 30%, ${badge.glow}, transparent 70%)` }}
              />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `radial-gradient(circle, ${badge.glow}, rgba(255,215,0,0.04))`, border: '1px solid rgba(255,215,0,0.12)' }}
              >
                {badge.icon}
              </div>
              <div className="font-body font-semibold text-white/70 text-xs leading-tight">{badge.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

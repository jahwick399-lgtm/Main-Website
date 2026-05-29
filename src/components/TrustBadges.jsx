import { motion } from 'framer-motion'

const BADGES = [
  {
    icon: '🔒',
    title: 'Secure & Private',
    desc: 'Your data is never sold. All transactions are encrypted end-to-end.',
    glow: 'rgba(52,211,153,0.15)',
  },
  {
    icon: '✅',
    title: 'Verified Vendors',
    desc: 'Every supplier is manually reviewed before making it onto the list.',
    glow: 'rgba(255,215,0,0.12)',
  },
  {
    icon: '⚡',
    title: 'Instant Access',
    desc: 'Get your vendors and guides the second your plan is activated.',
    glow: 'rgba(255,215,0,0.12)',
  },
  {
    icon: '🔄',
    title: 'Always Updated',
    desc: 'Vendors and strategies are refreshed regularly so you never get stale info.',
    glow: 'rgba(96,165,250,0.15)',
  },
  {
    icon: '💬',
    title: 'Community Support',
    desc: 'Join thousands of resellers sharing wins, tips, and supplier links daily.',
    glow: 'rgba(196,132,252,0.15)',
  },
  {
    icon: '🏆',
    title: 'Proven Results',
    desc: 'Members report an average ROI of 3-10x their subscription cost monthly.',
    glow: 'rgba(255,215,0,0.15)',
  },
]

export default function TrustBadges() {
  return (
    <section className="relative py-24 px-5">
      {/* Section glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 800, height: 400,
          background: 'radial-gradient(ellipse, rgba(255,215,0,0.03) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-5xl sm:text-6xl mb-4">
            <span className="gold-text">Why</span>
            <span className="text-white"> Members Trust Us</span>
          </h2>
          <p className="text-white/45 font-body text-base max-w-md mx-auto">
            Built on transparency, accountability, and real results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BADGES.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="group glass-card rounded-2xl p-6 relative overflow-hidden cursor-default"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${badge.glow}, transparent 70%)` }}
              />

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `radial-gradient(circle, ${badge.glow}, rgba(255,215,0,0.05))`, border: '1px solid rgba(255,215,0,0.15)' }}
              >
                {badge.icon}
              </div>

              <h3 className="font-display text-xl text-white mb-2 tracking-wide">{badge.title}</h3>
              <p className="text-white/45 font-body text-sm leading-relaxed">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

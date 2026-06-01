import { motion } from 'framer-motion'

const BADGES = [
  { icon: '✅', label: 'Verified Vendors' },
  { icon: '🔒', label: 'Secure Checkout' },
  { icon: '⚡', label: 'Instant Access' },
  { icon: '💰', label: 'Proven Results' },
  { icon: '📱', label: 'Mobile First' },
  { icon: '🤝', label: '1,000+ Resellers' },
]

export default function TrustBadges() {
  return (
    <section className="relative py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {BADGES.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-xs font-semibold"
              style={{
                background: 'rgba(14,10,24,0.95)',
                border: '1px solid rgba(255,215,0,0.3)',
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

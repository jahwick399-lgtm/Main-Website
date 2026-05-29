import { motion } from 'framer-motion'

const VENDORS_URL = 'https://vendor-website-two.vercel.app/?canceled=true#vendors'

const CATEGORIES = [
  { icon: '👟', label: 'Shoes' },
  { icon: '👕', label: 'Clothing' },
  { icon: '💎', label: 'Jewelry' },
  { icon: '📱', label: 'Electronics' },
  { icon: '🕶️', label: 'Accessories' },
  { icon: '⌚', label: 'Watches' },
]

export default function GetVendors() {
  return (
    <section className="relative py-24 px-5">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(255,215,0,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card-gold rounded-2xl p-10 text-center"
        >
          {/* Icon cluster */}
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {CATEGORIES.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)' }}
              >
                {c.icon}
              </motion.div>
            ))}
          </div>

          <h2 className="font-display text-4xl sm:text-5xl mb-3">
            <span className="gold-text">Access</span>
            <span className="text-white"> Real Vendors</span>
          </h2>

          <p className="text-white/55 font-body text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Skip the middlemen. Our verified vendor directory gives you direct access to the same suppliers top resellers use to generate real income.
          </p>

          <div className="gold-divider max-w-xs mx-auto mb-8" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[
              { v: '300+', l: 'Verified Suppliers' },
              { v: 'Low MOQ', l: 'Minimum Orders' },
              { v: 'Direct', l: 'No Middlemen' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl py-3 px-4" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.1)' }}>
                <div className="font-display text-2xl gold-text">{s.v}</div>
                <div className="text-xs text-white/40 font-body mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>

          <a
            href={VENDORS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-block px-10 py-3.5 rounded-full text-dark font-body font-bold text-sm tracking-wide"
          >
            Browse Vendor Directory ↗
          </a>

          <p className="text-white/25 font-body text-xs mt-4">Free to browse. No credit card required.</p>
        </motion.div>
      </div>
    </section>
  )
}

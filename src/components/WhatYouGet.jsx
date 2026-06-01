import { motion } from 'framer-motion'

const FEATURES = [
  { icon: '⚡', title: 'Instant Vendor Access', desc: 'Links hit your dashboard the second you pay' },
  { icon: '📚', title: '40+ Lessons', desc: 'Beginner to business owner. All in here.' },
  { icon: '🧮', title: 'Built-In Tools', desc: 'Profit calc, listing generator, budget planner' },
  { icon: '🗺️', title: 'Milestone Roadmap', desc: '$0 to $10k mapped out step by step' },
  { icon: '📱', title: 'Phone First', desc: 'Built for mobile. Learn anywhere, anytime.' },
  { icon: '🔒', title: 'Gated By Tier', desc: 'Upgrade and instantly unlock more' },
  { icon: '💡', title: 'Real Strategies', desc: 'What actually works right now. Not theory.' },
  { icon: '🔄', title: 'Always Updated', desc: 'New vendors and lessons added regularly' },
]

export default function WhatYouGet() {
  return (
    <section className="relative py-14 sm:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-white mb-2" style={{ fontSize: 'clamp(2rem, 7vw, 4rem)' }}>
            EVERYTHING YOU NEED
          </h2>
          <p className="text-white/45 font-body text-sm">
            One platform. Full system. Real results.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'rgba(14,10,24,0.95)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 16 }}
            >
              <div
                style={{
                  aspectRatio: '1/1',
                  background: 'radial-gradient(circle, rgba(14,10,24,0.4) 0%, rgba(184,134,11,0.4) 70%, rgba(255,215,0,0.6) 100%)',
                  borderRadius: '16px 16px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '2rem' }}>{f.icon}</span>
              </div>
              <div style={{ padding: '12px' }}>
                <div className="font-body" style={{ color: 'white', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: 4 }}>
                  {f.title}
                </div>
                <div className="font-body" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem', lineHeight: 1.4 }}>
                  {f.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

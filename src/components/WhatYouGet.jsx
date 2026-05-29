import { motion } from 'framer-motion'

const FEATURES = [
  { icon: '⚡', title: 'Instant Vendor Access', desc: 'Get supplier links the second you pay.' },
  { icon: '📚', title: 'Full Reselling Curriculum', desc: '40+ lessons from beginner to business.' },
  { icon: '🧮', title: 'Built-In Tools', desc: 'Calculators, generators, planners in your dashboard.' },
  { icon: '🗺️', title: 'Milestone Roadmap', desc: 'Clear path from $0 to $10k.' },
  { icon: '📱', title: 'Built For Mobile', desc: 'Learn and manage your business anywhere.' },
  { icon: '🔒', title: 'Grows With You', desc: 'Unlock more vendors and tools as you upgrade.' },
  { icon: '💡', title: 'Real Strategies', desc: 'Based on how real resellers make money now.' },
  { icon: '🔄', title: 'Always Updated', desc: 'Fresh vendor drops and lessons added regularly.' },
]

export default function WhatYouGet() {
  return (
    <section className="relative py-14 sm:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}
          className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-widest uppercase mb-4"
            style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}>
            What's Inside
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-3">
            <span className="text-white">Everything You Need.</span>
            <br />
            <span className="gold-text">Nothing You Don't.</span>
          </h2>
          <p className="text-white/40 font-body text-sm sm:text-base max-w-md mx-auto mt-3">
            This isn't a YouTube video. This is a full system.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-4 rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,215,0,0.1)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)' }}>
                {f.icon}
              </div>
              <div>
                <div className="font-body font-bold text-white text-sm mb-1">{f.title}</div>
                <div className="text-white/45 font-body text-sm leading-relaxed">{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

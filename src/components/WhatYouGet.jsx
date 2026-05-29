import { motion } from 'framer-motion'

const FEATURES = [
  { icon: '⚡', title: 'Instant Vendor Access', desc: 'Get your supplier links the second your payment goes through. No waiting, no approval process.' },
  { icon: '📚', title: 'Full Reselling Curriculum', desc: '40+ lessons covering everything from your first listing to running a real business.' },
  { icon: '🧮', title: 'Built-In Tools', desc: 'Profit calculators, listing generators, budget planners — all inside your dashboard.' },
  { icon: '🗺️', title: 'Milestone Roadmap', desc: 'A clear path from $0 to $10k with exact action steps at every stage.' },
  { icon: '📱', title: 'Built For Your Phone', desc: 'The entire platform is designed to be used on mobile. Learn and manage your business from anywhere.' },
  { icon: '🔒', title: 'Gated Content That Grows With You', desc: 'Upgrade your plan and instantly unlock more vendors, more lessons, more tools.' },
  { icon: '💡', title: 'Real Strategies, Not Theory', desc: 'Everything taught here is based on how real resellers actually make money right now.' },
  { icon: '🔄', title: 'Always Updated', desc: 'New vendor drops, hot product alerts, and lesson updates added regularly.' },
]

export default function WhatYouGet() {
  return (
    <section className="relative py-20 sm:py-28 px-5">
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

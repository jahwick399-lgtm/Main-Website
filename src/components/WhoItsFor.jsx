import { motion } from 'framer-motion'

const FOR = [
  'You want to make money outside of a 9-5',
  "You're starting with little to no money",
  'You want a real system, not random YouTube tips',
  "You're willing to put in the work to see results",
  'You want to learn at your own pace from your phone',
  'You want verified vendor links without hunting for them yourself',
]

const NOT_FOR = [
  'You want to get rich without doing anything',
  "You're not willing to follow the system",
  'You expect results overnight with zero effort',
]

export default function WhoItsFor() {
  return (
    <section className="relative py-20 sm:py-28 px-5">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}
          className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-3">
            <span className="text-white">This Is Built</span>{' '}
            <span className="gold-text">For You If…</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* FOR */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.2)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="text-xl">✅</div>
              <h3 className="font-display text-lg text-white">This IS for you</h3>
            </div>
            <ul className="space-y-3">
              {FOR.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-sm mt-0.5 flex-shrink-0" style={{ color: '#34d399' }}>✓</span>
                  <span className="text-white/65 font-body text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* NOT FOR */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.18)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="text-xl">❌</div>
              <h3 className="font-display text-lg text-white">This is NOT for you</h3>
            </div>
            <ul className="space-y-3">
              {NOT_FOR.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-sm mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }}>✗</span>
                  <span className="text-white/65 font-body text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)' }}>
              <p className="text-white/50 font-body text-xs leading-relaxed">
                If you're willing to follow the system and put in the work,{' '}
                <span className="text-white/80 font-semibold">results are almost guaranteed.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

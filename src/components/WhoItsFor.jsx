import { motion } from 'framer-motion'

const FOR = [
  'You want income outside a 9-5',
  "You're willing to follow a system",
  'You want verified vendors not random YouTube tips',
  'You can start with as little as $50',
  "You're tired of watching others win",
]

const NOT_FOR = [
  'You want money without doing anything',
  "You won't follow the steps",
  'You think this is too good to be true',
  "You're going to overthink and never start",
]

export default function WhoItsFor() {
  return (
    <section className="relative py-14 sm:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-white" style={{ fontSize: 'clamp(1.75rem, 6vw, 3.5rem)' }}>
            BE HONEST WITH YOURSELF
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* FOR */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: 'rgba(14,10,24,0.95)', border: '1px solid rgba(255,215,0,0.4)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="text-xl">✅</div>
              <h3 className="font-display text-lg text-white">THIS IS YOU ✅</h3>
            </div>
            <ul className="space-y-3">
              {FOR.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-sm mt-0.5 flex-shrink-0" style={{ color: '#FFD700' }}>✓</span>
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
            style={{ background: 'rgba(14,10,24,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="text-xl">❌</div>
              <h3 className="font-display text-lg text-white">THIS IS NOT FOR YOU ❌</h3>
            </div>
            <ul className="space-y-3">
              {NOT_FOR.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-sm mt-0.5 flex-shrink-0" style={{ color: 'rgba(239,68,68,0.7)' }}>✗</span>
                  <span className="text-white/45 font-body text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center flex flex-col items-center gap-5"
        >
          <p className="font-body text-sm font-semibold gold-text">
            If you saw yourself in the left column — what are you waiting for?
          </p>
          <a
            href="/signup"
            className="btn-gold rounded-full font-body font-bold text-base text-dark"
            style={{ padding: '15px 32px', minHeight: 52 }}
          >
            JOIN NOW →
          </a>
        </motion.div>
      </div>
    </section>
  )
}

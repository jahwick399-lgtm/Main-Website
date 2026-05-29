import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    icon: '🎯',
    title: 'Pick Your Plan',
    desc: 'Start free and upgrade when you\'re ready.',
  },
  {
    num: '02',
    icon: '📦',
    title: 'Get Vendors + Training',
    desc: 'Unlock your vendor links and full curriculum instantly.',
  },
  {
    num: '03',
    icon: '💰',
    title: 'Sell and Stack',
    desc: 'Follow the system, make sales, reinvest your profits.',
  },
]

export default function HowItWorks() {
  return (
    <section className="relative py-14 sm:py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,215,0,0.03) 0%, transparent 70%)' }} />

      <div className="relative max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}
          className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-widest uppercase mb-4"
            style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}>
            The Process
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-3">
            <span className="text-white">How It</span>{' '}
            <span className="gold-text">Works</span>
          </h2>
          <div className="h-0.5 w-16 mx-auto mt-3" style={{ background: 'linear-gradient(to right,transparent,#FFD700,transparent)' }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl p-6 sm:p-7 flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,215,0,0.1)', backdropFilter: 'blur(12px)' }}
            >
              {/* Connector line for desktop */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-8 h-px z-10"
                  style={{ background: 'linear-gradient(to right,rgba(255,215,0,0.4),transparent)' }} />
              )}

              <div className="flex items-start gap-4">
                <div className="font-display text-5xl leading-none"
                  style={{ backgroundImage: 'linear-gradient(135deg,#FFE566,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {step.num}
                </div>
                <div className="text-3xl mt-1">{step.icon}</div>
              </div>

              <div>
                <h3 className="font-display text-xl text-white mb-2">{step.title}</h3>
                <p className="text-white/50 font-body text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

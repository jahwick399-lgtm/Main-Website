import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    title: 'PICK YOUR PLAN',
    desc: 'Choose your level. Free to Pro.',
  },
  {
    num: '02',
    title: 'GET INSTANT ACCESS',
    desc: 'Vendors and lessons unlock immediately.',
  },
  {
    num: '03',
    title: 'START STACKING',
    desc: 'Follow the system. Make sales. Level up.',
  },
]

export default function HowItWorks() {
  return (
    <section className="relative py-14 sm:py-20 px-4 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,215,0,0.03) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-white" style={{ fontSize: 'clamp(2rem, 7vw, 4rem)' }}>
            HOW IT WORKS
          </h2>
        </motion.div>

        <div className="flex flex-col gap-0">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex gap-6 items-start"
              style={{ paddingBottom: i < STEPS.length - 1 ? 0 : 0 }}
            >
              {/* Left: number + connector */}
              <div className="flex flex-col items-center" style={{ minWidth: 48 }}>
                <div
                  className="font-display leading-none flex-shrink-0"
                  style={{
                    fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                    backgroundImage: 'linear-gradient(135deg,#FFE566,#FFD700)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {step.num}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 40,
                      background: 'linear-gradient(to bottom, rgba(255,215,0,0.4), rgba(255,215,0,0.05))',
                      margin: '8px 0',
                    }}
                  />
                )}
              </div>

              {/* Right: content */}
              <div
                className="rounded-2xl flex-1"
                style={{
                  background: 'rgba(14,10,24,0.95)',
                  border: '1px solid rgba(255,215,0,0.15)',
                  padding: '20px 20px',
                  marginBottom: i < STEPS.length - 1 ? 16 : 0,
                }}
              >
                <h3 className="font-display text-white mb-1" style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>
                  {step.title}
                </h3>
                <p className="text-white/50 font-body text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

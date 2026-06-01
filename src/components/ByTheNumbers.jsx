import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function Counter({ end, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0
        const step = end / 40
        const t = setInterval(() => {
          start += step
          if (start >= end) { setVal(end); clearInterval(t) }
          else setVal(Math.floor(start))
        }, 30)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end])
  return <span ref={ref}>{prefix}{val}{suffix}</span>
}

const STATS = [
  { end: 1000, suffix: '+', label: 'Active Resellers' },
  { end: 40,   suffix: '+', label: 'Lessons Inside' },
  { end: 7,    suffix: '',  label: 'Vendor Categories' },
  { end: 50,   prefix: '$', suffix: '', label: 'Average Starting Budget' },
]

export default function ByTheNumbers() {
  return (
    <section className="relative py-14 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-white" style={{ fontSize: 'clamp(2rem, 7vw, 4rem)' }}>
            BY THE NUMBERS
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl p-6 text-center flex flex-col items-center gap-2"
              style={{ background: 'rgba(14,10,24,0.95)', border: '1px solid rgba(255,215,0,0.15)' }}
            >
              <div
                className="font-display leading-none"
                style={{
                  fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                  backgroundImage: 'linear-gradient(135deg,#FFE566,#FFD700,#FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.3))',
                }}
              >
                <Counter end={s.end} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="text-white/45 font-body text-xs tracking-wide text-center leading-snug">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

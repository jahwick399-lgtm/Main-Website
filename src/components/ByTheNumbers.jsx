import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0)
  const [active, setActive] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return
    let start = 0
    const steps = Math.ceil(duration / 16)
    const inc = target / steps
    const id = setInterval(() => {
      start += inc
      if (start >= target) { setCount(target); clearInterval(id) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(id)
  }, [active, target, duration])

  return [count, ref]
}

function StatCard({ prefix = '', target, suffix = '', label, delay }) {
  const [count, ref] = useCountUp(target)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center gap-2"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,215,0,0.12)', backdropFilter: 'blur(16px)' }}
    >
      <div className="font-display text-4xl sm:text-5xl md:text-6xl leading-none"
        style={{ backgroundImage: 'linear-gradient(135deg,#FFE566,#FFD700,#FFA500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textShadow: 'none', filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.3))' }}>
        {prefix}{count}{suffix}
      </div>
      <div className="text-white/45 font-body text-sm tracking-wide">{label}</div>
    </motion.div>
  )
}

export default function ByTheNumbers() {
  return (
    <section className="relative py-14 sm:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}
          className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl mb-3">
            <span className="text-white">By the</span>{' '}
            <span className="gold-text">Numbers</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard target={500} suffix="+" label="Active Resellers" delay={0} />
          <StatCard target={7}              label="Vendor Categories" delay={0.1} />
          <StatCard prefix="$" target={50}  label="Average Starting Budget" delay={0.2} />
          <StatCard target={40} suffix="+"  label="Lessons Inside" delay={0.3} />
        </div>
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const VENDORS_URL = 'https://vendor-website-two.vercel.app/?canceled=true#vendors'

const HEADLINE = 'Turn Products Into Profit'

const goldStyle = {
  backgroundImage: 'linear-gradient(135deg,#FFE566,#FFD700,#FFA500)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

function LetterReveal({ text, style, baseDelay, globalOffset }) {
  return (
    <>
      {[...text].map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 18, filter: 'brightness(0)' }}
          animate={{
            opacity: [0, 1, 1],
            y: [18, 0, 0],
            filter: ['brightness(0)', 'brightness(4.5)', 'brightness(1)'],
          }}
          transition={{
            duration: 0.55,
            delay: baseDelay + (globalOffset + i) * 0.045,
            times: [0, 0.28, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
          style={char === ' ' ? { display: 'inline-block', width: '0.28em' } : style}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </>
  )
}

function MobileLiveCounter() {
  const [count, setCount] = useState(67)

  useEffect(() => {
    let timeout
    const tick = () => {
      setCount(v => Math.min(98, Math.max(54, v + Math.floor(Math.random() * 5) - 2)))
      timeout = setTimeout(tick, Math.random() * 4000 + 4000)
    }
    timeout = setTimeout(tick, Math.random() * 4000 + 4000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{ background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.18)' }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"
              style={{ boxShadow: '0 0 5px rgba(52,211,153,0.9)' }} />
      </span>
      <motion.span
        key={count}
        initial={{ opacity: 0, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs font-body font-medium text-white/60"
      >
        <span className="text-white font-bold">{count}</span> viewing
      </motion.span>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 pt-24 pb-10 overflow-hidden"
      style={{ minHeight: 'calc(100svh - 0px)' }}>

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 700, height: 400,
          background: 'radial-gradient(ellipse, rgba(255,215,0,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Live counter — top right, visible on all sizes */}
      <div className="absolute top-20 right-4 md:hidden">
        <MobileLiveCounter />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-body font-semibold tracking-widest uppercase"
        style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.22)', color: '#FFD700' }}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
        </span>
        2,400+ active resellers
      </motion.div>

      {/* Headline — letter by letter, mobile-first size */}
      <h1
        className="font-display leading-none tracking-wide mb-4 w-full"
        style={{ fontSize: 'clamp(28px, 8.5vw, 72px)' }}
      >
        <LetterReveal text={HEADLINE} style={goldStyle} baseDelay={0.15} globalOffset={0} />
      </h1>

      {/* Subheadline — one line */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="font-body text-white/55 mb-8 leading-snug"
        style={{ fontSize: 'clamp(13px, 3.5vw, 17px)', maxWidth: 360 }}
      >
        Real vendors and guides to start making money today.
      </motion.p>

      {/* CTAs — stacked, full width on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.25 }}
        className="flex flex-col gap-3 w-full"
        style={{ maxWidth: 380 }}
      >
        <a
          href="#plans"
          className="btn-gold rounded-full text-dark font-body font-bold text-base text-center active:scale-[0.97] transition-transform"
          style={{ padding: '15px 24px', minHeight: 52 }}
        >
          Start For Free
        </a>
        <a
          href={VENDORS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold-outline rounded-full font-body font-semibold text-base text-center active:scale-[0.97] transition-transform"
          style={{ padding: '15px 24px', minHeight: 52 }}
        >
          Browse Vendors ↗
        </a>
      </motion.div>
    </section>
  )
}

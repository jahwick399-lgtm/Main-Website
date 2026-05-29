import { motion } from 'framer-motion'

const VENDORS_URL = 'https://vendor-website-two.vercel.app/?canceled=true#vendors'

const HEADLINE_GOLD  = "The Reselling Service"
const HEADLINE_WHITE = "Everyone's Running To"

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
          initial={{ opacity: 0, y: 22, filter: 'brightness(0)' }}
          animate={{
            opacity:    [0, 1,   1],
            y:          [22, 0,  0],
            filter:     ['brightness(0)', 'brightness(4.5)', 'brightness(1)'],
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
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </>
  )
}

export default function Hero() {
  const goldLen  = [...HEADLINE_GOLD].length
  const whiteOff = goldLen + 1  // +1 for the space between lines

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 pt-24 pb-16 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 800, height: 500,
          background: 'radial-gradient(ellipse, rgba(255,215,0,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Logo */}
      <motion.img
        src="/logo.png"
        alt="Flip Labs"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="h-24 sm:h-32 mx-auto mb-2 object-contain"
        onError={e => { e.target.style.display = 'none' }}
      />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-widest uppercase"
        style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700' }}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
        </span>
        Trusted by 2,400+ resellers worldwide
      </motion.div>

      {/* Headline — letter by letter */}
      <h1 className="max-w-4xl text-4xl sm:text-6xl md:text-7xl font-display leading-none tracking-wide mb-6">
        {/* Gold line */}
        <span className="block">
          <LetterReveal text={HEADLINE_GOLD} style={goldStyle} baseDelay={0.2} globalOffset={0} />
        </span>
        {/* White line */}
        <span className="block mt-1">
          <LetterReveal text={HEADLINE_WHITE} style={{ color: '#ffffff' }} baseDelay={0.2} globalOffset={whiteOff} />
        </span>
      </h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="max-w-xl text-base sm:text-lg font-body text-white/55 leading-relaxed mb-10 px-2"
      >
        Real vendors. Real strategies. Real profit.{' '}
        <span className="text-white/75">Built for people who are serious about the bag.</span>
      </motion.p>

      {/* CTAs — stacked on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.25 }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto px-6 sm:px-0"
      >
        <a
          href="#plans"
          className="btn-gold w-full sm:w-auto px-8 py-4 sm:py-3.5 rounded-full text-dark font-body font-bold text-sm tracking-wide text-center"
          style={{ minWidth: 180 }}
        >
          Start For Free
        </a>
        <a
          href={VENDORS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold-outline w-full sm:w-auto px-8 py-4 sm:py-3.5 rounded-full font-body font-semibold text-sm tracking-wide text-center"
          style={{ minWidth: 180 }}
        >
          Browse Vendors ↗
        </a>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.45 }}
        className="mt-14 grid grid-cols-3 gap-4 sm:gap-12"
      >
        {[
          { value: '2,400+', label: 'Active Members' },
          { value: '$1.2M+', label: 'Member Revenue' },
          { value: '300+', label: 'Verified Vendors' },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div
              className="font-display text-2xl sm:text-4xl"
              style={{
                backgroundImage: 'linear-gradient(135deg,#FFE566,#FFD700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {s.value}
            </div>
            <div className="text-xs font-body text-white/40 mt-1 tracking-wide">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-white/20 text-xs font-body tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent" />
      </motion.div>
    </section>
  )
}

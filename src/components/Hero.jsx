import { useEffect, useRef } from 'react'

const VENDORS_URL = 'https://vendor-website-two.vercel.app/?canceled=true#vendors'

const AVATAR_DATA = [
  { i: 'M', c: 'linear-gradient(135deg,#FFD700,#B8860B)' },
  { i: 'J', c: 'linear-gradient(135deg,#c084fc,#7c3aed)' },
  { i: 'T', c: 'linear-gradient(135deg,#FFD700,#FFA500)' },
  { i: 'D', c: 'linear-gradient(135deg,#34d399,#059669)' },
  { i: 'K', c: 'linear-gradient(135deg,#f472b6,#db2777)' },
  { i: 'A', c: 'linear-gradient(135deg,#FFD700,#B8860B)' },
  { i: 'R', c: 'linear-gradient(135deg,#60a5fa,#2563eb)' },
  { i: 'C', c: 'linear-gradient(135deg,#c084fc,#9333ea)' },
]

function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const isMobile = window.innerWidth < 768
    const MAX = isMobile ? 20 : 50

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: MAX }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 200,
      r: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.y -= p.speed
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,215,0,${p.opacity})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />
}

export default function Hero() {
  return (
    <section
      data-hero
      className="relative flex flex-col items-center justify-center text-center px-4 overflow-hidden"
      style={{
        minHeight: '100svh',
        paddingTop: 120,
        paddingBottom: 48,
        background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(255,215,0,0.12) 0%, transparent 65%), #080808',
      }}
    >
      <ParticleCanvas />

      <div className="relative max-w-lg mx-auto w-full" style={{ zIndex: 2 }}>
        {/* Headline */}
        <h1 className="font-display leading-none tracking-tight mb-8" style={{ fontSize: 'clamp(2rem, 8.5vw, 5.5rem)' }}>
          <span className="block text-white">THE RESELLING SYSTEM</span>
          <span className="block text-white">THAT ACTUALLY</span>
          <span className="block gold-text">MAKES YOU MONEY</span>
        </h1>

        {/* Trust line */}
        <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
          <span className="font-display text-white text-2xl sm:text-3xl">Trusted by</span>
          <span className="font-display text-2xl sm:text-3xl gold-text">1,000+</span>
          <span className="font-display text-white text-2xl sm:text-3xl">Resellers</span>
        </div>

        {/* Avatars */}
        <div className="flex items-center justify-center mb-6">
          {AVATAR_DATA.map((a, i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-full flex items-center justify-center font-body font-bold text-xs text-dark shrink-0"
              style={{
                background: a.c,
                border: '2px solid #080808',
                boxShadow: '0 0 8px rgba(255,215,0,0.35)',
                marginLeft: i === 0 ? 0 : -8,
                position: 'relative',
                zIndex: AVATAR_DATA.length - i,
              }}
            >
              {a.i}
            </div>
          ))}
          <span className="ml-3 font-body text-white/45 text-xs">& thousands more</span>
        </div>

        {/* Urgency badge */}
        <div className="flex justify-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-xs font-bold"
            style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.4)', color: '#FFD700' }}
          >
            🔥 Limited spots available at current price
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full" style={{ maxWidth: 400, margin: '0 auto' }}>
          <a
            href="/signup"
            className="btn-gold rounded-full font-body font-bold text-base text-dark text-center"
            style={{ padding: '16px 24px', minHeight: 52, display: 'block' }}
          >
            START MAKING MONEY →
          </a>
          <a
            href={VENDORS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold-outline rounded-full font-body font-semibold text-base text-center"
            style={{ padding: '16px 24px', minHeight: 52, display: 'block' }}
          >
            BROWSE VENDORS
          </a>
        </div>
      </div>
    </section>
  )
}

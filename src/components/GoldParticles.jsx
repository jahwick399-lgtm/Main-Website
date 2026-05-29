import { useEffect, useRef } from 'react'

const DESKTOP_COUNT = 75
const MOBILE_COUNT  = 30

function makeParticle(w, h) {
  return {
    x:            Math.random() * w,
    y:            Math.random() * h,
    r:            Math.random() * 2.2 + 0.5,
    speed:        Math.random() * 0.45 + 0.15,
    opacity:      Math.random() * 0.55 + 0.18,
    drift:        (Math.random() - 0.5) * 0.25,
    twinkle:      Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.02 + 0.008,
  }
}

export default function GoldParticles() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas   = ref.current
    const ctx      = canvas.getContext('2d')
    const isMobile = window.innerWidth < 768
    const count    = isMobile ? MOBILE_COUNT : DESKTOP_COUNT
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const particles = Array.from({ length: count }, () =>
      makeParticle(canvas.width, canvas.height)
    )

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.y -= p.speed
        p.x += p.drift
        p.twinkle += p.twinkleSpeed

        const tw = 0.5 + 0.5 * Math.sin(p.twinkle)
        const op = p.opacity * (0.6 + 0.4 * tw)

        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width }
        if (p.x < -4)              p.x = canvas.width + 4
        if (p.x > canvas.width + 4) p.x = -4

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle  = `rgba(255,215,0,${op})`
        ctx.shadowColor = '#FFD700'
        ctx.shadowBlur  = isMobile ? p.r * 2 : p.r * 4
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animId = requestAnimationFrame(draw)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(animId)
      } else {
        animId = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden
    />
  )
}

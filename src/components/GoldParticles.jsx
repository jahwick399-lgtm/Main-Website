import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 75

function makeParticle(w, h) {
  return {
    x:       Math.random() * w,
    y:       Math.random() * h,
    r:       Math.random() * 2.2 + 0.5,
    speed:   Math.random() * 0.45 + 0.15,
    opacity: Math.random() * 0.55 + 0.18,
    drift:   (Math.random() - 0.5) * 0.25,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.02 + 0.008,
  }
}

export default function GoldParticles() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const particles = Array.from({ length: PARTICLE_COUNT }, () =>
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

        // Reset if offscreen
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width }
        if (p.x < -4)  p.x = canvas.width + 4
        if (p.x > canvas.width + 4) p.x = -4

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,215,0,${op})`
        ctx.shadowColor = '#FFD700'
        ctx.shadowBlur  = p.r * 4
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
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

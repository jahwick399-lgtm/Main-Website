import { useState, useEffect } from 'react'

export default function StickyBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero  = document.querySelector('[data-hero]')
    const plans = document.getElementById('plans')
    if (!hero || !plans) return

    const heroObs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) setVisible(true)
      else setVisible(false)
    }, { threshold: 0.1 })

    const plansObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(false)
    }, { threshold: 0.3 })

    heroObs.observe(hero)
    plansObs.observe(plans)
    return () => { heroObs.disconnect(); plansObs.disconnect() }
  }, [])

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{
        background: 'rgba(8,6,14,0.97)',
        borderTop: '1px solid rgba(255,215,0,0.25)',
        boxShadow: '0 -4px 30px rgba(255,215,0,0.1)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <span className="font-body text-white/60 text-xs leading-tight">
        🔥 <span className="text-white font-semibold">1,000+ resellers</span> already inside
      </span>
      <a
        href="/signup"
        className="btn-gold rounded-full font-body font-bold text-xs text-dark shrink-0"
        style={{ padding: '10px 16px', minHeight: 40, whiteSpace: 'nowrap' }}
      >
        JOIN NOW →
      </a>
    </div>
  )
}

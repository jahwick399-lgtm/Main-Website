import { useState, useEffect } from 'react'

const MESSAGES = [
  'Marcus just made his first $200 flip',
  'Jaylen copped the Electronics vendor and already sold out',
  'Tre went from $50 to $300 in 6 days',
  'Devon just hit his first $1,000 week',
  'Jordan upgraded to Pro and unlocked everything',
]

export default function FomoSection() {
  const [idx, setIdx]       = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIdx(i => (i + 1) % MESSAGES.length); setVisible(true) }, 400)
    }, 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="py-16 px-4">
      <div
        className="max-w-lg mx-auto rounded-2xl p-8 text-center"
        style={{
          background: 'rgba(12,8,20,0.96)',
          border: '1px solid rgba(255,215,0,0.35)',
          boxShadow: '0 0 40px rgba(255,215,0,0.1), 0 0 80px rgba(255,215,0,0.04)',
        }}
      >
        <div className="gold-divider mb-6" />

        <h2 className="font-display text-white mb-4" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)' }}>
          ⚠️ While You're Reading This...
        </h2>

        <div className="mb-6" style={{ minHeight: 48 }}>
          <p
            className="font-body font-semibold text-base gold-text"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}
          >
            "{MESSAGES[idx]}"
          </p>
        </div>

        <p className="text-white/45 font-body text-sm leading-relaxed mb-8">
          Every day you wait is money someone else is making.
          The system is here. The vendors are verified.{' '}
          <span className="text-white/70 font-semibold">The only thing missing is you.</span>
        </p>

        <a
          href="/signup"
          className="btn-gold rounded-full font-body font-bold text-sm text-dark w-full text-center inline-block"
          style={{ padding: '15px 24px', minHeight: 52 }}
        >
          STOP WAITING — JOIN NOW →
        </a>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getSession } from '../utils/auth'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const PLANS = [
  {
    name: 'Free',
    planKey: null,
    price: '$0',
    originalPrice: null,
    period: 'forever',
    cta: 'Get Started Free',
    badge: null,
    emoji: '🌱',
    features: [
      'Make your first $100-500',
      'Side hustle starter guide',
      'AI photo hack for listings',
      'Platform setup walkthrough',
      'Free jewelry vendor links',
    ],
  },
  {
    name: 'Beginner',
    planKey: 'beginner',
    price: '$14.99',
    originalPrice: '$29.99',
    period: '/mo',
    cta: 'Start Beginner',
    badge: null,
    emoji: '📦',
    features: [
      'Electronics, Fragrance & Clothing vendors',
      'Pricing guide for every product',
      'Listing templates that sell',
      'Milestone money map',
      'Platform mastery guides',
    ],
  },
  {
    name: 'Intermediate',
    planKey: 'intermediate',
    price: '$29.99',
    originalPrice: '$59.99',
    period: '/mo',
    cta: 'Go Intermediate',
    badge: null,
    emoji: '📈',
    features: [
      'Every vendor unlocked',
      'Bulk flipping strategy',
      'SEO guide for eBay & Depop',
      'DM scripts to close buyers',
      'Weekly restock alerts',
    ],
  },
  {
    name: 'Pro',
    planKey: 'pro',
    price: '$49.99',
    originalPrice: '$99.99',
    period: '/mo',
    cta: 'Go Pro',
    badge: 'BEST VALUE',
    emoji: '👑',
    features: [
      'Everything in Intermediate',
      'Hot product alerts weekly',
      '$1k/week scaling roadmap',
      'Full business setup guide',
      'Pro-only exclusive vendors',
    ],
  },
]

function PlanCard({ plan, i }) {
  const [loading, setLoading]   = useState(false)
  const [err, setErr]           = useState('')
  const [expanded, setExpanded] = useState(false)

  const VISIBLE = 5
  const teaser = plan.features.slice(0, VISIBLE)
  const rest   = plan.features.slice(VISIBLE)
  const hasMore = rest.length > 0

  const handleCheckout = async () => {
    setLoading(true); setErr('')
    try {
      const session = getSession()
      const res  = await fetch(`${API}/create-checkout-session`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.planKey, email: session?.email || '' }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else { setErr('Something went wrong. Try again.'); setLoading(false) }
    } catch { setErr('Could not connect. Try again.'); setLoading(false) }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{ background: 'rgba(14,10,24,0.95)', border: '1px solid rgba(255,215,0,0.2)' }}
    >
      {/* Square image area */}
      <div
        style={{
          aspectRatio: '1/1',
          background: 'radial-gradient(circle at 50% 50%, rgba(14,10,24,0.4) 0%, rgba(184,134,11,0.5) 70%, rgba(255,215,0,0.7) 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {plan.badge && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: 'linear-gradient(135deg,#FFE566,#FFD700)',
              color: '#080808',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              padding: '3px 8px',
              borderRadius: 999,
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
            }}
          >
            {plan.badge}
          </div>
        )}
        <span style={{ fontSize: '3rem' }}>{plan.emoji}</span>
      </div>

      {/* Card body */}
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          className="font-body"
          style={{ color: 'white', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: 4 }}
        >
          {plan.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
          <span style={{ color: '#FFD700', fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'inherit' }}>
            {plan.price}
          </span>
          {plan.originalPrice && (
            <span style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', fontSize: '0.7rem' }}>
              {plan.originalPrice}
            </span>
          )}
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem' }}>{plan.period}</span>
        </div>

        {/* Bullets */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', flex: 1 }}>
          {teaser.map((item, fi) => (
            <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 5 }}>
              <span style={{ color: '#FFD700', fontSize: '0.6rem', marginTop: 3, flexShrink: 0 }}>✓</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', lineHeight: 1.4 }}>{item}</span>
            </li>
          ))}
        </ul>

        {/* Expanded bullets */}
        {hasMore && (
          <>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', overflow: 'hidden' }}
                >
                  {rest.map((item, fi) => (
                    <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 5 }}>
                      <span style={{ color: '#FFD700', fontSize: '0.6rem', marginTop: 3, flexShrink: 0 }}>✓</span>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', lineHeight: 1.4 }}>{item}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
            <button
              onClick={() => setExpanded(v => !v)}
              className="font-body font-semibold text-left transition-colors mb-2"
              style={{ color: '#FFD700', fontSize: '0.65rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {expanded ? 'Show less ↑' : 'See all included →'}
            </button>
          </>
        )}

        {err && <p style={{ color: '#f87171', fontSize: '0.65rem', marginBottom: 6, textAlign: 'center' }}>{err}</p>}

        {/* CTA */}
        {plan.planKey ? (
          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`w-full text-center rounded-full font-body font-bold tracking-wide transition-all active:scale-[0.97] btn-gold text-dark ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            style={{ padding: '10px 12px', minHeight: 40, fontSize: '0.7rem' }}
          >
            {loading ? 'Redirecting…' : plan.cta}
          </button>
        ) : (
          <a
            href="/signup"
            className="w-full text-center rounded-full font-body font-bold tracking-wide btn-gold-outline flex items-center justify-center"
            style={{ padding: '10px 12px', minHeight: 40, fontSize: '0.7rem' }}
          >
            {plan.cta}
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default function Plans() {
  return (
    <section id="plans" className="relative py-16 px-4">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 900, height: 300, background: 'radial-gradient(ellipse, rgba(255,215,0,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <h2 className="font-display mb-2" style={{ fontSize: 'clamp(2rem, 7vw, 4rem)', color: 'white' }}>
            CHOOSE YOUR LEVEL
          </h2>
          <p className="text-white/45 font-body text-sm">
            Start free. Scale fast. No excuses.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PLANS.map((plan, i) => <PlanCard key={plan.name} plan={plan} i={i} />)}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-white/25 font-body text-xs mt-8"
        >
          Cancel anytime. No hidden fees. Instant access after payment.
        </motion.p>
      </div>
    </section>
  )
}

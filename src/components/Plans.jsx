import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const PLANS = [
  {
    name: 'Free',
    planKey: null,
    price: '$0',
    period: 'forever',
    cta: 'Get Started Free',
    badge: null,
    highlight: false,
    features: [
      { h: 'FOUNDATION' },
      { t: 'What reselling is and why it works' },
      { t: 'Beginner mindset — profit, loss, reinvesting' },
      { t: 'Find items around your house to sell now' },
      { h: 'PLATFORMS' },
      { t: 'Full breakdown: Depop, eBay, FB, Poshmark, Mercari' },
      { t: 'Phone photography guide — no equipment needed' },
      { h: 'GETTING CAPITAL' },
      { t: '7 side hustles to build startup cash fast' },
      { t: 'How much you actually need to start' },
      { t: 'Beginner mistakes and how to avoid them' },
    ],
  },
  {
    name: 'Beginner',
    planKey: 'beginner',
    price: '$14.99',
    period: '/mo',
    cta: 'Start Beginner',
    badge: null,
    highlight: false,
    features: [
      { t: 'Everything in Free, plus:' },
      { h: 'VENDOR ACCESS' },
      { t: 'Electronics, Fragrance & Clothing vendors' },
      { t: 'Exact price ranges for every product' },
      { t: 'Platform fee breakdown — eBay, Depop, Poshmark' },
      { h: 'LISTINGS' },
      { t: 'Full listing templates for every category' },
      { t: 'Buyer message templates for every situation' },
      { h: 'OPERATIONS' },
      { t: '$0 to $500 milestone action plan' },
      { t: 'Packaging, shipping & carrier guide' },
      { t: 'First Sale checklist' },
    ],
  },
  {
    name: 'Intermediate',
    planKey: 'intermediate',
    price: '$29.99',
    period: '/mo',
    cta: 'Go Intermediate',
    badge: '🔥 MOST POPULAR',
    highlight: true,
    features: [
      { t: 'Everything in Beginner, plus:' },
      { h: 'VENDOR ACCESS' },
      { t: 'ALL 7 vendor categories unlocked' },
      { t: 'Vendor comparison — fastest sell-through' },
      { h: 'ADVANCED STRATEGY' },
      { t: 'Bulk flipping guide — buy 5–20 units' },
      { t: 'Cross-listing strategy — 3+ platforms' },
      { t: 'Seasonal resell calendar' },
      { h: 'PLATFORM MASTERY' },
      { t: 'eBay SEO deep dive' },
      { t: 'Depop algorithm guide' },
      { h: 'FINANCE' },
      { t: 'Built-in profit margin calculator' },
      { t: 'Inventory tracking system' },
      { t: 'Financial tracking: income, expenses, profit' },
    ],
  },
  {
    name: 'Pro',
    planKey: 'pro',
    price: '$49.99',
    period: '/mo',
    cta: 'Go Pro',
    badge: '⭐ BEST VALUE',
    highlight: false,
    features: [
      { t: 'Everything in Intermediate, plus:' },
      { h: 'PRO VENDORS' },
      { t: 'Exclusive Pro-only vendor drops' },
      { t: 'Hot Product Alert — weekly curated buy list' },
      { h: 'BUSINESS SETUP' },
      { t: 'LLC setup step-by-step guide' },
      { t: 'Business bank account + tax 101' },
      { t: 'Reseller permit — buy tax-free' },
      { h: 'SCALING' },
      { t: '$1,000/week roadmap — weekly steps' },
      { t: 'Cashflow management system' },
      { h: 'PRO TOOLS' },
      { t: 'Listing description writer' },
      { t: 'Monthly income goal tracker' },
      { t: 'Resell profit journal' },
    ],
  },
]

function Check() {
  return (
    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
      style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)' }}>
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
        <path d="M1 3l2 2 4-4" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  )
}

function PlanCard({ plan, i }) {
  const [loading, setLoading]   = useState(false)
  const [err, setErr]           = useState('')
  const [expanded, setExpanded] = useState(false)

  // Split features: show first 5 `t` items + their preceding `h` headers, rest hidden
  const teaser = []
  const rest   = []
  let tCount = 0
  let done   = false
  for (const f of plan.features) {
    if (done) { rest.push(f); continue }
    if (f.t) {
      tCount++
      if (tCount > 5) { done = true; rest.push(f); continue }
    }
    teaser.push(f)
  }
  const hasMore = rest.length > 0

  const handleCheckout = async () => {
    setLoading(true); setErr('')
    try {
      const res  = await fetch(`${API}/create-checkout-session`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.planKey }),
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
      className={`relative rounded-2xl p-5 flex flex-col ${plan.highlight ? 'gold-border-glow-intense' : 'glass-card'}`}
      style={plan.highlight ? { background: 'rgba(255,215,0,0.05)', border: '1.5px solid rgba(255,215,0,0.45)' } : {}}
    >
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 rounded-full text-xs font-body font-bold tracking-wide whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg,#FFE566,#FFD700)', color: '#080808' }}>
            {plan.badge}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="mb-4">
        <div className="font-display text-lg tracking-wide text-white/70 mb-0.5">{plan.name}</div>
        <div className="flex items-end gap-1">
          <span className="font-display text-4xl"
            style={{ backgroundImage: 'linear-gradient(135deg,#FFE566,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {plan.price}
          </span>
          <span className="text-white/35 text-xs font-body pb-1.5">{plan.period}</span>
        </div>
      </div>

      <div className="gold-divider mb-4" />

      {/* Teaser features */}
      <ul className="space-y-2 mb-3 flex-1">
        {teaser.map((f, fi) =>
          f.h ? (
            <li key={fi} className="text-white/25 font-body text-[10px] uppercase tracking-widest pt-2 pb-0">{f.h}</li>
          ) : (
            <li key={fi} className="flex items-start gap-2.5 text-xs font-body text-white/65">
              <Check />{f.t}
            </li>
          )
        )}
      </ul>

      {/* Expand / collapse */}
      {hasMore && (
        <>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden space-y-2 mb-3"
              >
                {rest.map((f, fi) =>
                  f.h ? (
                    <li key={fi} className="text-white/25 font-body text-[10px] uppercase tracking-widest pt-2 pb-0">{f.h}</li>
                  ) : (
                    <li key={fi} className="flex items-start gap-2.5 text-xs font-body text-white/65">
                      <Check />{f.t}
                    </li>
                  )
                )}
              </motion.ul>
            )}
          </AnimatePresence>
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-xs font-body font-semibold mb-4 text-left transition-colors"
            style={{ color: '#FFD700' }}
          >
            {expanded ? 'Show less ↑' : `See everything included →`}
          </button>
        </>
      )}

      {err && <p className="text-red-400 font-body text-xs mb-2 text-center">{err}</p>}

      {/* CTA */}
      {plan.planKey ? (
        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full text-center rounded-full text-sm font-body font-bold tracking-wide transition-all active:scale-[0.97] ${plan.highlight ? 'btn-gold text-dark' : 'btn-gold-outline'} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          style={{ padding: '15px 24px', minHeight: 52 }}
        >
          {loading ? 'Redirecting…' : plan.cta}
        </button>
      ) : (
        <a
          href="/dashboard"
          className="w-full text-center rounded-full text-sm font-body font-bold tracking-wide btn-gold-outline flex items-center justify-center"
          style={{ padding: '15px 24px', minHeight: 52 }}
        >
          {plan.cta}
        </a>
      )}
    </motion.div>
  )
}

export default function Plans() {
  return (
    <section id="plans" className="relative py-16 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 900, height: 300, background: 'radial-gradient(ellipse, rgba(255,215,0,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-widest uppercase mb-4"
            style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}>
            Pricing Plans
          </span>
          <h2 className="font-display text-3xl sm:text-5xl mb-3">
            <span className="gold-text">Choose</span><span className="text-white"> Your Level</span>
          </h2>
          <p className="text-white/50 font-body text-sm max-w-xs mx-auto">
            Start free. Upgrade when you're ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {PLANS.map((plan, i) => <PlanCard key={plan.name} plan={plan} i={i} />)}
        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center text-white/25 font-body text-xs mt-8"
        >
          Cancel anytime. No hidden fees. Instant access after payment.
        </motion.p>
      </div>
    </section>
  )
}

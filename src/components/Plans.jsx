import { useState } from 'react'
import { motion } from 'framer-motion'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const PLANS = [
  {
    name: 'Free',
    planKey: null,
    price: '$0',
    period: 'forever',
    description: 'Make your first $100–$500 before spending a single dollar.',
    cta: 'Get Started Free',
    badge: null,
    highlight: false,
    features: [
      { h: 'FOUNDATION' },
      { t: 'What reselling is and why people do it full-time' },
      { t: 'Beginner mindset — profit, loss, and reinvesting' },
      { t: 'How to find items around your house worth selling now' },
      { h: 'PLATFORMS' },
      { t: 'Full breakdown: Depop, eBay, FB Marketplace, Poshmark, Mercari' },
      { t: 'Phone photography guide — no equipment needed' },
      { t: 'Free AI tools for professional product photos' },
      { h: 'GETTING CAPITAL' },
      { t: '7 side hustles to build startup cash fast' },
      { t: 'How much you actually need to start (less than you think)' },
      { t: 'Beginner mistakes and exactly how to avoid them' },
      { t: 'Reselling glossary every beginner needs to know' },
    ],
  },
  {
    name: 'Beginner',
    planKey: 'beginner',
    price: '$14.99',
    period: 'per month',
    description: 'Your first real reselling operation.',
    cta: 'Start Beginner',
    badge: null,
    highlight: false,
    features: [
      { t: 'Everything in Free, plus:' },
      { h: 'VENDOR ACCESS' },
      { t: 'Electronics vendor access (phones, tablets, gaming)' },
      { t: 'Fragrance vendor access (designer cologne & perfume)' },
      { t: 'Clothing vendor access (hoodies, streetwear, basics)' },
      { h: 'PRICING & PROFIT' },
      { t: 'Exact price ranges for every product in your plan' },
      { t: 'Platform fee breakdown — eBay, Depop, Poshmark, Mercari' },
      { t: 'Profit margin formula — know your profit before you buy' },
      { h: 'LISTINGS THAT SELL' },
      { t: 'Full listing templates for every vendor category' },
      { t: 'How to write descriptions that answer every buyer question' },
      { h: 'OPERATIONS' },
      { t: 'Milestone Money Map — $0 to $500+ action plan' },
      { t: 'Packaging, shipping, and carrier comparison guide' },
      { t: 'Buyer message templates for every situation' },
      { t: 'First Sale checklist — do this before you list anything' },
    ],
  },
  {
    name: 'Intermediate',
    planKey: 'intermediate',
    price: '$29.99',
    period: 'per month',
    description: 'Stop guessing. Start scaling.',
    cta: 'Go Intermediate',
    badge: '🔥 MOST POPULAR',
    highlight: true,
    features: [
      { t: 'Everything in Beginner, plus:' },
      { h: 'VENDOR ACCESS' },
      { t: 'ALL 7 vendor categories unlocked (Electronics, Fragrance, Clothing, Hoodies, Shoes, Watches, Jewelry)' },
      { t: 'Vendor comparison — fastest sell-through categories' },
      { h: 'ADVANCED STRATEGY' },
      { t: 'Bulk flipping guide — buy 5–20 units and move them fast' },
      { t: 'Cross-listing strategy — same item on 3+ platforms' },
      { t: 'Seasonal resell calendar — best months for each category' },
      { t: 'Competitor research method — reverse engineer top sellers' },
      { h: 'PLATFORM MASTERY' },
      { t: 'eBay SEO deep dive — rank higher in search' },
      { t: 'Depop algorithm guide — how to get on explore' },
      { h: 'OPERATIONS & FINANCE' },
      { t: 'Built-in profit margin calculator' },
      { t: 'Inventory tracking system' },
      { t: 'Chargeback defense + dispute handling guide' },
      { t: 'Stale inventory strategy — move items stuck 30+ days' },
      { t: 'Financial tracking: income, expenses, and profit' },
    ],
  },
  {
    name: 'Pro',
    planKey: 'pro',
    price: '$49.99',
    period: 'per month',
    description: 'Run this like a real business. Scale like one too.',
    cta: 'Go Pro',
    badge: '⭐ BEST VALUE',
    highlight: false,
    features: [
      { t: 'Everything in Intermediate, plus:' },
      { h: 'PRO VENDORS' },
      { t: 'Exclusive Pro-only vendor drops not on any other plan' },
      { t: 'Hot Product Alert — weekly curated buy list with suggested prices' },
      { t: 'Sourcing roadmap — what to buy this week based on trends' },
      { h: 'BUSINESS SETUP' },
      { t: 'LLC setup step-by-step — protect yourself and your money' },
      { t: 'Business bank account + tax 101 for resellers' },
      { t: 'Reseller permit guide — buy products tax-free' },
      { h: 'BRAND BUILDING' },
      { t: 'Build your own reselling storefront + brand identity' },
      { t: 'How to get repeat customers and a loyal buyer base' },
      { h: 'SCALING' },
      { t: 'Scaling to $1,000/week roadmap — broken into weekly steps' },
      { t: 'Cashflow management — always have buying power' },
      { h: 'PRO DASHBOARD TOOLS' },
      { t: 'Listing description writer — copy-paste ready in seconds' },
      { t: 'Monthly income goal tracker with reverse-engineered plan' },
      { t: 'Resell profit journal — track every sale, auto-calculates totals' },
      { t: 'Personal reselling audit — detailed breakdown of what to fix' },
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
  const [loading, setLoading] = useState(false)
  const [err, setErr]         = useState('')

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
      className={`relative rounded-2xl p-6 flex flex-col ${plan.highlight ? 'gold-border-glow-intense' : 'glass-card'}`}
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

      <div className="mb-4">
        <div className="font-display text-xl tracking-wide text-white/80 mb-1">{plan.name}</div>
        <div className="flex items-end gap-1.5">
          <span className="font-display text-4xl"
            style={{ backgroundImage: 'linear-gradient(135deg,#FFE566,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {plan.price}
          </span>
          <span className="text-white/35 text-xs font-body pb-1.5">{plan.period}</span>
        </div>
      </div>

      <p className="text-white/40 font-body text-sm leading-relaxed mb-5">{plan.description}</p>

      <div className="gold-divider mb-5" />

      <ul className="space-y-2 mb-8 flex-1">
        {plan.features.map((f, fi) =>
          f.h ? (
            <li key={fi} className="text-white/25 font-body text-[10px] uppercase tracking-widest pt-3 pb-0.5">{f.h}</li>
          ) : (
            <li key={fi} className="flex items-start gap-2.5 text-sm font-body text-white/65">
              <Check />{f.t}
            </li>
          )
        )}
      </ul>

      {err && <p className="text-red-400 font-body text-xs mb-2 text-center">{err}</p>}

      {plan.planKey ? (
        <button onClick={handleCheckout} disabled={loading}
          className={`text-center py-3.5 rounded-full text-sm font-body font-bold tracking-wide transition-all active:scale-[0.97] min-h-[48px] ${plan.highlight ? 'btn-gold text-dark' : 'btn-gold-outline'} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
          {loading ? 'Redirecting…' : plan.cta}
        </button>
      ) : (
        <a href="#" className="text-center py-3.5 rounded-full text-sm font-body font-bold tracking-wide btn-gold-outline min-h-[48px] flex items-center justify-center">
          {plan.cta}
        </a>
      )}
    </motion.div>
  )
}

export default function Plans() {
  return (
    <section id="plans" className="relative py-24 px-5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 900, height: 300, background: 'radial-gradient(ellipse, rgba(255,215,0,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}
          className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-widest uppercase mb-4"
            style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}>
            Pricing Plans
          </span>
          <h2 className="font-display text-5xl sm:text-6xl mb-4">
            <span className="gold-text">Choose</span><span className="text-white"> Your Level</span>
          </h2>
          <p className="text-white/50 font-body text-base max-w-lg mx-auto">
            Start free, scale when you're ready. Every paid plan unlocks real vendors, real guides, and real results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {PLANS.map((plan, i) => <PlanCard key={plan.name} plan={plan} i={i} />)}
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center text-white/25 font-body text-xs mt-10">
          Cancel anytime. No hidden fees. Instant dashboard access after payment.
        </motion.p>
      </div>
    </section>
  )
}

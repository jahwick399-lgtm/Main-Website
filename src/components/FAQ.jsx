import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'What exactly do I get with a paid plan?',
    a: 'A curated directory of verified vendors across multiple categories plus step-by-step reselling guides and pricing templates. Higher tiers unlock more vendors and direct supplier introductions.',
  },
  {
    q: 'Are these vendors actually verified?',
    a: "Yes — every supplier is manually checked before being added. We verify they're legitimate, have workable minimums, and remove anyone who goes inactive.",
  },
  {
    q: 'Can I cancel at any time?',
    a: "Absolutely. Cancel anytime and keep access until the end of your billing period. No questions asked.",
  },
  {
    q: 'Do I need experience to start?',
    a: "Not at all — Free and Beginner plans are built for complete beginners. We walk you through sourcing, pricing, and where to sell before anything advanced.",
  },
  {
    q: "What's the difference between Intermediate and Pro?",
    a: 'Intermediate gives you all 7 vendor categories plus advanced strategy and platform mastery guides. Pro adds exclusive vendor drops, business setup guides, and Pro-only dashboard tools.',
  },
  {
    q: 'How often are vendors updated?',
    a: 'Vendor lists are reviewed and refreshed regularly. You always get a live, working list — not a dusty PDF.',
  },
  {
    q: 'Is my payment secure?',
    a: 'Yes — all payments are processed securely and your card is never stored. Your data is never sold or shared.',
  },
  {
    q: 'Can I share access with a partner?',
    a: "Plans are for individual use. Contact us at support@fliplabs.com for team arrangements.",
  },
]

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,215,0,0.12)' }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ background: open ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.02)' }}
      >
        <span className="font-body font-semibold text-white/85 text-sm leading-snug pr-4">
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-lg leading-none"
          style={{
            background: open ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.06)',
            border: open ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.1)',
            color: open ? '#FFD700' : 'rgba(255,255,255,0.4)',
          }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pb-4 pt-2 font-body text-sm text-white/50 leading-relaxed"
              style={{ borderLeft: '2px solid rgba(255,215,0,0.35)' }}
            >
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <section className="relative py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl sm:text-5xl mb-2">
            <span className="text-white">Got </span>
            <span className="gold-text">Questions?</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <FAQItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

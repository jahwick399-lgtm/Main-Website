import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'What exactly do I get with a paid plan?',
    a: 'You get access to a curated directory of verified vendors and suppliers across multiple categories (shoes, electronics, clothing, jewelry, watches, and more), along with step-by-step reselling guides, pricing templates, and access to the Flip Labs community. Higher tiers include more vendors, automation resources, and direct supplier introductions.',
  },
  {
    q: 'Are these vendors actually verified?',
    a: 'Yes. Every supplier on our list is manually checked before it\'s added. We verify that they\'re legitimate businesses, have workable minimum order quantities, and are actively fulfilling orders. We remove suppliers that go inactive or receive consistent complaints.',
  },
  {
    q: 'Can I cancel at any time?',
    a: 'Absolutely. There are no contracts or commitments. You can cancel your subscription at any time and you\'ll retain access until the end of your billing period. No questions asked.',
  },
  {
    q: 'Do I need experience to start?',
    a: 'Not at all. The Free and Beginner plans are built specifically for people who are new to reselling. We walk you through the basics — how to source, how to price, and where to sell — before going into more advanced strategy.',
  },
  {
    q: 'What\'s the difference between Intermediate and Pro?',
    a: 'The Intermediate plan gives you access to 150+ vendors, automation guides, and monthly sourcing calls. Pro unlocks 300+ elite vendors including exclusive brand accounts, direct supplier introductions, early restock alerts, and a 1-on-1 onboarding call to get your operation dialed in fast.',
  },
  {
    q: 'How often are vendors updated?',
    a: 'The vendor lists are reviewed and refreshed regularly. New suppliers are added as we verify them and inactive or problematic ones are removed. You\'re always getting a live, working list — not a dusty PDF from years ago.',
  },
  {
    q: 'Is my payment secure?',
    a: 'Yes. All payments are processed securely. We never store your card information. Your data is never sold or shared with third parties.',
  },
  {
    q: 'Can I share access with a partner or team?',
    a: 'Plans are for individual use. If you\'re running a team operation, reach out to us and we can discuss a custom arrangement that works for your situation.',
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
        className="w-full flex items-center justify-between px-6 py-5 text-left group"
        style={{ background: open ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.02)' }}
      >
        <span className="font-body font-semibold text-white/85 text-sm sm:text-base leading-snug pr-4">
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
              className="px-6 pb-5 pt-2 font-body text-sm text-white/50 leading-relaxed"
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
    <section className="relative py-24 px-5">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-widest uppercase mb-4"
            style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}
          >
            FAQ
          </span>
          <h2 className="font-display text-5xl sm:text-6xl mb-4">
            <span className="text-white">Got</span>{' '}
            <span className="gold-text">Questions?</span>
          </h2>
          <p className="text-white/45 font-body text-base">
            Everything you need to know before you get started.
          </p>
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

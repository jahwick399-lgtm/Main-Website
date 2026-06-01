import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'What do I actually get when I sign up?',
    a: 'Instant dashboard access with vendor links and lessons for your tier. Free gets you started. Paid tiers unlock vendors, tools, and the full curriculum.',
  },
  {
    q: 'Is this legit?',
    a: 'Real vendors, real suppliers, real resellers using them right now. The reviews on this page are real.',
  },
  {
    q: 'How much money do I need to start?',
    a: 'As little as $50. The Free plan even shows you how to make startup money before you spend anything.',
  },
  {
    q: 'How fast can I make my money back?',
    a: 'Depends on your effort. Many resellers see returns in their first week. Some in their first flip.',
  },
  {
    q: 'What if I want to upgrade later?',
    a: 'Upgrade any time. New content unlocks instantly.',
  },
  {
    q: 'What platforms do these vendors work on?',
    a: 'eBay, Depop, Facebook Marketplace, Poshmark, Mercari — all of them.',
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
      style={{ border: open ? '1px solid rgba(255,215,0,0.35)' : '1px solid rgba(255,215,0,0.12)' }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ background: open ? 'rgba(255,215,0,0.05)' : 'rgba(14,10,24,0.95)' }}
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
    <section id="faq" className="relative py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-white" style={{ fontSize: 'clamp(2rem, 7vw, 4rem)' }}>
            FAQ
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

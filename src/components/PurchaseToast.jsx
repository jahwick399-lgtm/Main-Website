import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MESSAGES = [
  { name: 'Jordan M.',   location: 'Atlanta, GA',     plan: 'Pro Plan',          time: '2 min ago' },
  { name: 'Aaliyah T.',  location: 'Houston, TX',     plan: 'Intermediate Plan', time: 'just now' },
  { name: 'Chris R.',    location: 'Chicago, IL',     plan: 'Beginner Plan',     time: '5 min ago' },
  { name: 'Destiny W.',  location: 'Miami, FL',       plan: 'Pro Plan',          time: '1 min ago' },
  { name: 'Marcus L.',   location: 'New York, NY',    plan: 'Intermediate Plan', time: '3 min ago' },
  { name: 'Priya S.',    location: 'Los Angeles, CA', plan: 'Pro Plan',          time: 'just now' },
  { name: 'Tyrone B.',   location: 'Dallas, TX',      plan: 'Beginner Plan',     time: '4 min ago' },
]

const AVATAR_COLORS = [
  'linear-gradient(135deg,#FFD700,#FFA500)',
  'linear-gradient(135deg,#c084fc,#7c3aed)',
  'linear-gradient(135deg,#34d399,#059669)',
  'linear-gradient(135deg,#f472b6,#db2777)',
  'linear-gradient(135deg,#60a5fa,#2563eb)',
]

const SHOW_DURATION = 5000

export default function PurchaseToast() {
  const [current, setCurrent] = useState(null)
  const [progress, setProgress] = useState(1)
  const timerRef    = useRef(null)
  const progressRef = useRef(null)
  const indexRef    = useRef(0)

  const showNext = () => {
    const msg = MESSAGES[indexRef.current % MESSAGES.length]
    indexRef.current += 1
    setCurrent(msg)
    setProgress(1)

    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const ratio = Math.max(0, 1 - elapsed / SHOW_DURATION)
      setProgress(ratio)
      if (ratio > 0) {
        progressRef.current = requestAnimationFrame(tick)
      } else {
        setCurrent(null)
        timerRef.current = setTimeout(showNext, Math.random() * 30000 + 30000)
      }
    }
    progressRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    timerRef.current = setTimeout(showNext, Math.random() * 8000 + 5000)
    return () => {
      clearTimeout(timerRef.current)
      cancelAnimationFrame(progressRef.current)
    }
  }, [])

  return (
    <div className="fixed bottom-5 left-5 z-50 pointer-events-none">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.name + indexRef.current}
            initial={{ x: -60, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -60, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="toast-card rounded-2xl overflow-hidden pointer-events-auto"
            style={{ width: 270 }}
          >
            <div className="p-4 flex items-center gap-3">
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-dark font-display text-base flex-shrink-0"
                style={{ background: AVATAR_COLORS[(indexRef.current - 1) % AVATAR_COLORS.length] }}
              >
                {current.name[0]}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="text-white/85 font-body text-xs font-semibold leading-tight truncate">
                  {current.name} <span className="text-white/35 font-normal">from {current.location}</span>
                </div>
                <div className="text-white/55 font-body text-xs mt-0.5">
                  Just joined{' '}
                  <span style={{ color: '#FFD700' }} className="font-semibold">{current.plan}</span>
                </div>
                <div className="text-white/25 font-body text-xs mt-0.5">{current.time}</div>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="h-0.5 w-full"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <div
                className="h-full transition-none"
                style={{
                  width: `${progress * 100}%`,
                  background: 'linear-gradient(to right, #FFD700, #FFA500)',
                  boxShadow: '0 0 6px rgba(255,215,0,0.6)',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

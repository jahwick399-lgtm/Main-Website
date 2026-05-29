import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getSession } from '../utils/auth'

const VENDORS_URL = 'https://vendor-website-two.vercel.app/?canceled=true#vendors'

function LiveCounter() {
  const [count, setCount] = useState(67)

  useEffect(() => {
    let timeout
    const tick = () => {
      setCount(v => Math.min(98, Math.max(54, v + Math.floor(Math.random() * 5) - 2)))
      timeout = setTimeout(tick, Math.random() * 4000 + 4000)
    }
    timeout = setTimeout(tick, Math.random() * 4000 + 4000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
         style={{ background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.18)' }}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"
              style={{ boxShadow: '0 0 6px rgba(52,211,153,0.9)' }} />
      </span>
      <motion.span
        key={count}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs font-body font-medium text-white/70"
      >
        <span className="text-white font-bold">{count}</span> people viewing
      </motion.span>
    </div>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const hasAccess = !!getSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleRestoreAccess = () => navigate('/dashboard')

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled ? 'nav-glass' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-dark font-display text-lg"
               style={{ background: 'linear-gradient(135deg,#FFE566,#FFD700,#FFA500)', boxShadow: '0 0 14px rgba(255,215,0,0.5)' }}>
            F
          </div>
          <span className="font-display text-2xl tracking-wider">
            <span className="gold-text">FLIP</span>
            <span className="text-white"> LABS</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <LiveCounter />
          <a
            href="#plans"
            className="relative text-white/60 hover:text-white text-sm font-body font-medium tracking-wide transition-colors group"
          >
            Plans
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full rounded-full" />
          </a>
          <a
            href={VENDORS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-white/60 hover:text-white text-sm font-body font-medium tracking-wide transition-colors group"
          >
            Get Vendors
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full rounded-full" />
          </a>
          {hasAccess ? (
            <button
              onClick={handleRestoreAccess}
              className="btn-gold px-5 py-2 rounded-full text-dark text-sm font-body font-bold"
            >
              My Dashboard →
            </button>
          ) : (
            <a href="/signup" className="btn-gold-outline px-5 py-2 rounded-full text-sm">
              Get Started
            </a>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="block w-6 h-0.5 bg-current rounded-full"
                animate={{
                  rotate:  menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0,
                  y:       menuOpen && i === 0 ? 8  : menuOpen && i === 2 ? -8  : 0,
                  opacity: menuOpen && i === 1 ? 0  : 1,
                }}
                transition={{ duration: 0.22 }}
              />
            ))}
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden md:hidden nav-glass border-t border-gold/10"
          >
            <div className="px-5 py-5 flex flex-col gap-4">
              <a href="#plans" onClick={() => setMenuOpen(false)}
                 className="text-white/60 hover:text-white font-body text-base py-1 border-b border-white/5 pb-3 transition-colors">
                Plans
              </a>
              <a href={VENDORS_URL} target="_blank" rel="noopener noreferrer"
                 onClick={() => setMenuOpen(false)}
                 className="text-white/60 hover:text-white font-body text-base py-1 border-b border-white/5 pb-3 transition-colors">
                Get Vendors ↗
              </a>
              {hasAccess && (
                <button
                  onClick={() => { setMenuOpen(false); handleRestoreAccess() }}
                  className="text-left font-body text-base py-1 border-b border-white/5 pb-3 transition-colors"
                  style={{ color: '#FFD700' }}
                >
                  My Dashboard →
                </button>
              )}
              {!hasAccess && (
                <a href="/signup" onClick={() => setMenuOpen(false)}
                   className="btn-gold text-center py-2.5 rounded-full text-dark font-body font-bold text-sm">
                  Get Started
                </a>
              )}
              <div className="flex items-center gap-2 pt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-white/40 text-xs font-body">Live viewers active now</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

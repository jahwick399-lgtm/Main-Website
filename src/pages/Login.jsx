import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import GoldParticles from '../components/GoldParticles'
import { login, getSession, restoreAccessFromStripe } from '../utils/auth'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const [restoreOpen,   setRestoreOpen]   = useState(false)
  const [restoreEmail,  setRestoreEmail]  = useState('')
  const [restoreErr,    setRestoreErr]    = useState('')
  const [restoreLoad,   setRestoreLoad]   = useState(false)
  const [restoreOk,     setRestoreOk]     = useState('')

  const handleRestore = async (e) => {
    e.preventDefault()
    if (!restoreEmail) return setRestoreErr('Enter your email.')
    setRestoreLoad(true); setRestoreErr('')

    // Check local storage first — fastest path
    const { getUser, setSession } = await import('../utils/userStore')
    const localUser = getUser(restoreEmail.trim())
    if (localUser) {
      setSession(localUser)
      setRestoreOk(`Welcome back! ${localUser.planDisplay || 'Access'} restored. Redirecting…`)
      setTimeout(() => navigate('/dashboard'), 1800)
      return
    }

    // Fall back to Stripe lookup via backend
    try {
      const res  = await fetch(`${API}/restore-access?email=${encodeURIComponent(restoreEmail.trim())}`)
      const data = await res.json()
      if (!data.found) {
        setRestoreErr('No account or subscription found for that email. Email support@fliplabs.shop with your receipt.')
        setRestoreLoad(false); return
      }
      restoreAccessFromStripe(data.email, data.tier)
      setRestoreOk(`Access restored — ${data.planDisplay}. Redirecting…`)
      setTimeout(() => navigate('/dashboard'), 1800)
    } catch {
      setRestoreErr('Could not connect. Try again in 30 seconds.')
      setRestoreLoad(false)
    }
  }

  useEffect(() => {
    const session = getSession()
    if (session) navigate('/dashboard', { replace: true })
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    const result = login(email, password)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 relative overflow-hidden">
      <GoldParticles />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full"
        style={{ maxWidth: 400 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-dark font-display text-lg"
              style={{ background: 'linear-gradient(135deg,#FFE566,#FFD700,#FFA500)', boxShadow: '0 0 18px rgba(255,215,0,0.5)' }}>
              F
            </div>
            <span className="font-display text-2xl tracking-wider">
              <span className="gold-text">FLIP</span>
              <span className="text-white"> LABS</span>
            </span>
          </div>
          <p className="text-white/40 font-body text-sm">Log in to your account</p>
        </div>

        <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(255,215,0,0.15)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/50 font-body text-xs mb-1.5 uppercase tracking-widest">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,215,0,0.5)'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div>
              <label className="block text-white/50 font-body text-xs mb-1.5 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl font-body text-sm text-white placeholder-white/20 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,215,0,0.5)'}
                  onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1">
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="text-red-400 font-body text-sm text-center py-2 px-3 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading}
              className={`w-full btn-gold rounded-full font-body font-bold text-dark text-base active:scale-[0.97] transition-transform ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              style={{ padding: '14px 24px', minHeight: 52 }}>
              {loading ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-white/30 font-body text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold transition-colors" style={{ color: '#FFD700' }}>
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        {/* Restore My Access */}
        <div className="mt-4">
          <button
            onClick={() => setRestoreOpen(v => !v)}
            className="w-full text-center text-white/30 font-body text-xs hover:text-white/60 transition-colors py-2"
          >
            {restoreOpen ? '▲ Hide' : '🔑 Already paid? Restore my access'}
          </button>

          <AnimatePresence initial={false}>
            {restoreOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="glass-card rounded-2xl p-5 mt-2" style={{ border: '1px solid rgba(255,215,0,0.15)' }}>
                  <p className="text-white/40 font-body text-xs mb-3 text-center">
                    Enter the email you used to pay — we'll restore your access instantly.
                  </p>
                  <form onSubmit={handleRestore} className="space-y-3">
                    <input
                      type="email"
                      value={restoreEmail}
                      onChange={e => setRestoreEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder-white/20 outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                    {restoreErr && <p className="text-red-400 font-body text-xs">{restoreErr}</p>}
                    {restoreOk  && <p className="font-body text-xs" style={{ color: '#FFD700' }}>{restoreOk}</p>}
                    <button
                      type="submit"
                      disabled={restoreLoad}
                      className={`w-full btn-gold rounded-full font-body font-bold text-dark text-sm ${restoreLoad ? 'opacity-60 cursor-not-allowed' : ''}`}
                      style={{ padding: '12px 24px', minHeight: 48 }}
                    >
                      {restoreLoad ? 'Checking…' : 'Restore Access →'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { updateOrCreateUserFromStripe, setPasswordForUser } from '../utils/auth'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// ─── Password setup for brand-new accounts created via Stripe ────────────────

function PasswordSetup({ email, planDisplay, onDone }) {
  const [pw,  setPw]  = useState('')
  const [pw2, setPw2] = useState('')
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (pw.length < 6)    return setErr('Password must be at least 6 characters.')
    if (pw !== pw2)        return setErr('Passwords do not match.')
    const result = setPasswordForUser(email, pw)
    if (result.error) return setErr(result.error)
    onDone()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="text-5xl mb-5">🎉</div>
      <h2 className="font-display text-4xl text-white mb-1">
        You're <span className="gold-text">In.</span>
      </h2>
      <div className="inline-block px-4 py-1.5 rounded-full text-sm font-body font-semibold mb-5"
        style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700' }}>
        {planDisplay}
      </div>

      <p className="text-white/50 font-body text-sm mb-1">Account created for:</p>
      <p className="text-white font-body font-semibold text-sm mb-6">{email}</p>

      <div className="glass-card rounded-2xl p-6 text-left mb-4" style={{ border: '1px solid rgba(255,215,0,0.2)' }}>
        <p className="text-white/60 font-body text-xs uppercase tracking-widest mb-4">Set a password to log in next time</p>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="Password (min 6 characters)"
            className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder-white/20 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <input
            type="password"
            value={pw2}
            onChange={e => setPw2(e.target.value)}
            placeholder="Confirm password"
            className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder-white/20 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          {err && <p className="text-red-400 font-body text-xs">{err}</p>}
          <button type="submit" className="w-full btn-gold rounded-full font-body font-bold text-dark text-sm"
            style={{ padding: '14px 24px', minHeight: 52 }}>
            Save Password & Go to Dashboard →
          </button>
        </form>
        <button
          onClick={onDone}
          className="w-full text-center text-white/30 font-body text-xs mt-3 hover:text-white/60 transition-colors"
        >
          Skip for now — go to dashboard
        </button>
      </div>
    </motion.div>
  )
}

// ─── Main Success page ────────────────────────────────────────────────────────

export default function Success() {
  const [params]      = useSearchParams()
  const navigate      = useNavigate()
  const session_id    = params.get('session_id')

  const [status,      setStatus]      = useState('verifying') // verifying | success | new-user | error
  const [planDisplay, setPlanDisplay] = useState('')
  const [userEmail,   setUserEmail]   = useState('')

  useEffect(() => {
    if (!session_id) { navigate('/'); return }

    fetch(`${API}/verify-session?session_id=${session_id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setStatus('error'); return }

        const email = (data.customerEmail || '').toLowerCase()
        const tier  = data.tier
        const now   = Date.now()

        // Save subscription details (kept for backward compat / billing lookup)
        localStorage.setItem('rm_subscription', JSON.stringify({
          subscriptionId: data.subscriptionId,
          tier,
          planDisplay:    data.planDisplay,
          email,
          content:        data.content,
          verifiedAt:     now,
        }))

        // Find or create user with full subscription dates saved permanently
        const isNewUser = updateOrCreateUserFromStripe(email, tier, {
          subscriptionId:  data.subscriptionId,
          stripeSessionId: session_id,
          paidAt:          now,
        })

        setUserEmail(email)
        setPlanDisplay(data.planDisplay)
        setStatus(isNewUser ? 'new-user' : 'success')
      })
      .catch(() => setStatus('error'))
  }, [session_id])

  // Auto-redirect 3s after confirming existing account
  useEffect(() => {
    if (status !== 'success') return
    const t = setTimeout(() => navigate('/dashboard'), 3000)
    return () => clearTimeout(t)
  }, [status])

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 700, height: 500,
          background: 'radial-gradient(ellipse, rgba(255,215,0,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="relative z-10 text-center px-5 w-full" style={{ maxWidth: 440 }}>

        {status === 'verifying' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 rounded-full border-2 border-gold/30 border-t-gold animate-spin mx-auto mb-6" />
            <p className="text-white/50 font-body text-base">Confirming your payment…</p>
          </motion.div>
        )}

        {status === 'new-user' && (
          <PasswordSetup
            email={userEmail}
            planDisplay={planDisplay}
            onDone={() => navigate('/dashboard')}
          />
        )}

        {status === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
              style={{
                background: 'linear-gradient(135deg,rgba(255,215,0,0.15),rgba(255,215,0,0.05))',
                border: '2px solid rgba(255,215,0,0.4)',
                boxShadow: '0 0 40px rgba(255,215,0,0.2)',
              }}
            >
              <motion.svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <motion.path
                  d="M8 20l8 8 16-16"
                  stroke="#FFD700" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              </motion.svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="font-display text-5xl sm:text-6xl mb-3"
            >
              <span className="gold-text">You're In.</span><br />
              <span className="text-white">Welcome to the team.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="inline-block px-4 py-1.5 rounded-full text-sm font-body font-semibold mb-8 mt-3"
              style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700' }}
            >
              {planDisplay}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-gold px-10 py-3.5 rounded-full text-dark font-body font-bold text-sm tracking-wide block mx-auto mb-4"
              >
                Go To Dashboard →
              </button>
              <p className="text-white/25 font-body text-xs">Redirecting automatically in 3 seconds…</p>
            </motion.div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="font-display text-3xl text-white mb-3">Payment confirmed but something went wrong</h2>
            <p className="text-white/45 font-body text-sm mb-4">
              Your payment went through. Use "Restore My Access" on the login page to recover your account — or email us directly.
            </p>
            <div className="glass-card rounded-xl p-4 mb-6" style={{ border: '1px solid rgba(255,215,0,0.2)' }}>
              <p className="text-white/50 font-body text-xs">
                📧 Email <span className="text-gold font-semibold">support@fliplabs.shop</span> with your receipt and we'll fix it within 1 hour.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate('/login')} className="btn-gold rounded-full font-body font-bold text-dark text-sm"
                style={{ padding: '14px 24px', minHeight: 52 }}>
                Restore My Access →
              </button>
              <button onClick={() => navigate('/')} className="btn-gold-outline rounded-full font-body text-sm"
                style={{ padding: '14px 24px', minHeight: 52 }}>
                Back to Homepage
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

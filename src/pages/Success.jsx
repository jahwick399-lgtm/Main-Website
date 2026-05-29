import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Success() {
  const [params]       = useSearchParams()
  const navigate       = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying | success | error
  const [planDisplay, setPlanDisplay] = useState('')
  const session_id = params.get('session_id')

  useEffect(() => {
    if (!session_id) { navigate('/'); return }

    fetch(`${API}/verify-session?session_id=${session_id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setStatus('error'); return }
        localStorage.setItem('rm_subscription', JSON.stringify({
          subscriptionId: data.subscriptionId,
          tier:           data.tier,
          planDisplay:    data.planDisplay,
          email:          data.customerEmail,
          content:        data.content,
          verifiedAt:     Date.now(),
        }))
        setPlanDisplay(data.planDisplay)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [session_id])

  // Auto-redirect after 3 seconds once verified
  useEffect(() => {
    if (status !== 'success') return
    const t = setTimeout(() => navigate('/dashboard'), 3000)
    return () => clearTimeout(t)
  }, [status])

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 700, height: 500,
          background: 'radial-gradient(ellipse, rgba(255,215,0,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="relative z-10 text-center px-5 max-w-lg mx-auto">
        {status === 'verifying' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 rounded-full border-2 border-gold/30 border-t-gold animate-spin mx-auto mb-6" />
            <p className="text-white/50 font-body text-base">Confirming your payment…</p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            {/* Animated checkmark */}
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
              <motion.svg
                width="40" height="40" viewBox="0 0 40 40" fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.path
                  d="M8 20l8 8 16-16"
                  stroke="#FFD700"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              </motion.svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-display text-5xl sm:text-6xl mb-3"
            >
              <span className="gold-text">You're In.</span>
              <br />
              <span className="text-white">Welcome to the team.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="inline-block px-4 py-1.5 rounded-full text-sm font-body font-semibold mb-8 mt-3"
              style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700' }}
            >
              {planDisplay}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1}}>
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="font-display text-3xl text-white mb-3">Something went wrong</h2>
            <p className="text-white/45 font-body text-sm mb-6">
              Your payment may have gone through. If so, use the Restore Access button on the homepage to get into your dashboard.
            </p>
            <button onClick={() => navigate('/')} className="btn-gold-outline px-8 py-3 rounded-full font-body text-sm">
              Back to Homepage
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

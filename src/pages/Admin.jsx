import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getSession, clearSession } from '../utils/auth'
import { getUsers, saveAllUsers, getDaysRemaining } from '../utils/userStore'

const TIERS = ['free', 'beginner', 'intermediate', 'pro']

function exportCSV(users) {
  const rows = [['Email', 'Plan', 'Sub Active', 'Expires', 'Join Date']]
  users.forEach(u => {
    rows.push([
      u.email, u.tier,
      u.subscriptionActive ? 'Yes' : 'No',
      u.subscriptionEnd ? new Date(u.subscriptionEnd).toLocaleDateString() : '—',
      new Date(u.createdAt).toLocaleDateString(),
    ])
  })
  const csv  = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'users.csv'; a.click()
  URL.revokeObjectURL(url)
}

function SubBadge({ user }) {
  const days = getDaysRemaining(user)
  if (!user.subscriptionActive && !user.subscriptionEnd) return (
    <span className="text-[10px] font-body px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>Free</span>
  )
  if (user.expiredAt || (!user.subscriptionActive && user.subscriptionEnd)) return (
    <span className="text-[10px] font-body px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>Expired</span>
  )
  const color = days !== null && days <= 7 ? '#f87171' : '#34d399'
  return (
    <span className="text-[10px] font-body px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.1)', color }}>
      {days !== null ? `${days}d left` : 'Active'}
    </span>
  )
}

export default function Admin() {
  const navigate  = useNavigate()
  const [users,   setUsers]   = useState([])
  const [toast,   setToast]   = useState('')

  useEffect(() => {
    const session = getSession()
    if (!session || session.tier !== 'admin') { navigate('/login', { replace: true }); return }
    setUsers(getUsers())
  }, [navigate])

  const refresh = () => setUsers(getUsers())

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const handleTierChange = (email, tier) => {
    const all = getUsers()
    const u   = all.find(u => u.email === email)
    if (!u) return
    u.tier              = tier
    u.planDisplay       = { free:'Free Plan', beginner:'Beginner Plan', intermediate:'Intermediate Plan', pro:'Pro Plan' }[tier] || tier
    u.subscriptionActive = tier !== 'free' && tier !== 'admin'
    saveAllUsers(all)
    refresh()
    showToast(`✅ Tier updated → ${tier} for ${email}`)
  }

  const extend30 = (email) => {
    const all = getUsers()
    const u   = all.find(u => u.email === email)
    if (!u) return
    const now  = Date.now()
    const base = u.subscriptionEnd && u.subscriptionEnd > now ? u.subscriptionEnd : now
    u.subscriptionEnd   = base + 30 * 24 * 60 * 60 * 1000
    u.subscriptionActive = true
    delete u.expiredAt; delete u.graceUntil
    saveAllUsers(all); refresh()
    showToast(`✅ Extended 30 days for ${email}`)
  }

  const resetToFree = (email) => {
    const all = getUsers()
    const u   = all.find(u => u.email === email)
    if (!u) return
    u.tier = 'free'; u.subscriptionActive = false
    u.expiredAt = Date.now()
    saveAllUsers(all); refresh()
    showToast(`Reset ${email} to free`)
  }

  const grantLifetime = (email) => {
    const all = getUsers()
    const u   = all.find(u => u.email === email)
    if (!u) return
    u.subscriptionEnd   = new Date('2099-01-01').getTime()
    u.subscriptionActive = true
    delete u.expiredAt; delete u.graceUntil
    saveAllUsers(all); refresh()
    showToast(`👑 Lifetime access granted to ${email}`)
  }

  const handleSignOut = () => { clearSession(); navigate('/login', { replace: true }) }

  const paid = users.filter(u => ['beginner','intermediate','pro'].includes(u.tier))

  return (
    <div className="min-h-screen bg-dark text-white font-body">
      {/* Header */}
      <div className="border-b px-5 py-4 flex items-center justify-between sticky top-0 z-50"
        style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,215,0,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-dark font-display text-sm"
            style={{ background: 'linear-gradient(135deg,#FFE566,#FFD700,#FFA500)' }}>F</div>
          <span className="font-display text-lg tracking-wider">
            <span className="gold-text">FLIP</span><span className="text-white"> LABS</span>
          </span>
          <span className="text-xs font-body px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.25)' }}>👑 Admin</span>
        </div>
        <button onClick={handleSignOut}
          className="text-white/40 hover:text-white/70 font-body text-sm transition-colors px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          Sign Out
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full font-body text-sm font-semibold"
          style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.4)', color: '#FFD700' }}>
          {toast}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Users', value: users.length },
            { label: 'Free',        value: users.filter(u => u.tier === 'free').length },
            { label: 'Paid',        value: paid.length },
            { label: 'Pro',         value: users.filter(u => u.tier === 'pro').length },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.12)' }}>
              <div className="font-display text-3xl gold-text">{s.value}</div>
              <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Header row */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-white">All <span className="gold-text">Users</span></h2>
          <button onClick={() => exportCSV(users)}
            className="btn-gold-outline px-4 py-2 rounded-full font-body font-bold text-xs active:scale-[0.97] transition-transform">
            Export CSV
          </button>
        </motion.div>

        {/* User list */}
        {users.length === 0 ? (
          <div className="text-center py-16 text-white/30 font-body">No users registered yet.</div>
        ) : (
          <div className="space-y-2">
            {users.map((user, i) => (
              <motion.div key={user.email}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,215,0,0.08)' }}>

                {/* Top row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-display flex-shrink-0"
                    style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700' }}>
                    {user.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/80 font-body text-sm truncate">{user.email}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="text-white/25 font-body text-xs">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      <SubBadge user={user} />
                      {user.subscriptionEnd && (
                        <span className="text-white/20 font-body text-[10px]">
                          exp {new Date(user.subscriptionEnd).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Tier selector */}
                  <select
                    value={user.tier}
                    onChange={e => handleTierChange(user.email, e.target.value)}
                    className="px-3 py-2 rounded-xl font-body text-sm text-white outline-none cursor-pointer"
                    style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}>
                    {TIERS.map(t => (
                      <option key={t} value={t} style={{ background: '#111' }}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => extend30(user.email)}
                    className="px-3 py-1.5 rounded-full font-body text-xs font-semibold transition-all active:scale-[0.96]"
                    style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}>
                    +30 Days
                  </button>
                  <button onClick={() => grantLifetime(user.email)}
                    className="px-3 py-1.5 rounded-full font-body text-xs font-semibold transition-all active:scale-[0.96]"
                    style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}>
                    Lifetime
                  </button>
                  <button onClick={() => resetToFree(user.email)}
                    className="px-3 py-1.5 rounded-full font-body text-xs font-semibold transition-all active:scale-[0.96]"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                    Reset Free
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

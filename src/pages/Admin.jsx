import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getSession, getUsers, updateUserTier, clearSession } from '../utils/auth'

const TIERS = ['free', 'beginner', 'intermediate', 'pro']

function exportCSV(users) {
  const rows = [['Email', 'Plan', 'Join Date']]
  Object.values(users).forEach(u => {
    rows.push([u.email, u.tier, new Date(u.createdAt).toLocaleDateString()])
  })
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'users.csv'; a.click()
  URL.revokeObjectURL(url)
}

export default function Admin() {
  const navigate = useNavigate()
  const [users, setUsers] = useState({})

  useEffect(() => {
    const session = getSession()
    if (!session || session.tier !== 'admin') { navigate('/login', { replace: true }); return }
    setUsers(getUsers())
  }, [navigate])

  const handleTierChange = (email, tier) => {
    updateUserTier(email, tier)
    setUsers(getUsers())
  }

  const handleSignOut = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  const userList = Object.values(users)

  return (
    <div className="min-h-screen bg-dark text-white font-body">
      {/* Header */}
      <div className="border-b px-5 py-4 flex items-center justify-between sticky top-0 z-50"
        style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,215,0,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-dark font-display text-sm"
            style={{ background: 'linear-gradient(135deg,#FFE566,#FFD700,#FFA500)' }}>
            F
          </div>
          <div>
            <span className="font-display text-lg tracking-wider">
              <span className="gold-text">FLIP</span>
              <span className="text-white"> LABS</span>
            </span>
            <span className="ml-2 text-xs font-body px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.25)' }}>
              👑 Admin
            </span>
          </div>
        </div>
        <button onClick={handleSignOut}
          className="text-white/40 hover:text-white/70 font-body text-sm transition-colors px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          Sign Out
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Users', value: userList.length },
            { label: 'Free',        value: userList.filter(u => u.tier === 'free').length },
            { label: 'Paid',        value: userList.filter(u => ['beginner','intermediate','pro'].includes(u.tier)).length },
            { label: 'Pro',         value: userList.filter(u => u.tier === 'pro').length },
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
        {userList.length === 0 ? (
          <div className="text-center py-16 text-white/30 font-body">No users registered yet.</div>
        ) : (
          <div className="space-y-2">
            {userList.map((user, i) => (
              <motion.div key={user.email}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl px-4 py-3 flex items-center gap-4"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,215,0,0.08)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-display flex-shrink-0"
                  style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700' }}>
                  {user.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white/80 font-body text-sm truncate">{user.email}</div>
                  <div className="text-white/25 font-body text-xs">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

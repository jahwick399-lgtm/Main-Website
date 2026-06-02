// auth.js — thin wrapper around userStore.
// All function signatures kept for backward compatibility.

import {
  getUsers as _getUsers,
  getUser,
  saveUser,
  getSession as _getSession,
  setSession as _setSession,
  clearSession as _clearSession,
  updateUserTier as _updateUserTier,
  updateOrCreateUserFromStripe as _updateOrCreateUserFromStripe,
  setPasswordForUser as _setPasswordForUser,
  restoreAccessFromStripe as _restoreAccessFromStripe,
} from './userStore'

const ADMIN_EMAIL    = 'jahwick399@gmail.com'
const ADMIN_PASSWORD = 'Admin123'

const PLAN_LABELS = {
  free: 'Free Plan', beginner: 'Beginner Plan',
  intermediate: 'Intermediate Plan', pro: 'Pro Plan', admin: '👑 Admin',
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

export function signup(email, password) {
  const key   = email.toLowerCase()
  const users = _getUsers()
  if (users.find(u => u.email === key)) return { error: 'An account with this email already exists.' }
  const newUser = {
    email: key, password, tier: 'free', planDisplay: 'Free Plan',
    createdAt: Date.now(), subscriptionActive: false,
    subscriptionEnd: null, paidAt: null, stripeSessionId: null,
  }
  saveUser(newUser)
  _setSession(newUser)
  console.log('SIGNUP:', { email: key, tier: 'free', rp_users: _getUsers() })
  return { success: true }
}

export function login(email, password) {
  const key = email.toLowerCase()

  if (key === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const adminUser = { email: key, tier: 'admin', planDisplay: '👑 Admin' }
    _setSession(adminUser)
    return { success: true, isAdmin: true }
  }

  let user = getUser(key)

  // Fallback: check legacy fl_users system and migrate on the fly
  if (!user) {
    try {
      const old = JSON.parse(localStorage.getItem('fl_users') || '{}')
      const oldUser = old[key]
      if (oldUser) {
        const migrated = {
          email: key,
          password: oldUser.password || null,
          tier: oldUser.tier || 'free',
          planDisplay: PLAN_LABELS[oldUser.tier] || PLAN_LABELS.free,
          createdAt: oldUser.createdAt ? new Date(oldUser.createdAt).getTime() : Date.now(),
          subscriptionActive: !!(oldUser.tier && oldUser.tier !== 'free'),
          subscriptionEnd: null, paidAt: null, stripeSessionId: null,
        }
        saveUser(migrated)
        user = migrated
        console.log('MIGRATED legacy user on login:', key)
      }
    } catch {}
  }

  if (!user) return { error: 'Incorrect email or password. Try again.' }
  if (user.password !== password) return { error: 'Incorrect email or password. Try again.' }

  // Check expiry inline and downgrade before setting session
  const now = Date.now()
  if (user.tier !== 'free' && user.tier !== 'admin' &&
      user.subscriptionEnd && now > user.subscriptionEnd &&
      (!user.graceUntil || now > user.graceUntil)) {
    user.tier               = 'free'
    user.subscriptionActive = false
    user.expiredAt          = now
    saveUser(user)
  }

  _setSession(user)

  console.log('LOGIN DEBUG:', {
    email: key,
    userFound: true,
    tier: user.tier,
    subscriptionEnd: user.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString() : 'N/A',
    allUsers: _getUsers(),
  })

  return { success: true }
}

export function getSession() {
  return _getSession()
}

export function clearSession() {
  _clearSession()
  // Keep rm_subscription so restore-access can still use it
}

// Returns array of all users (Admin page expects an object keyed by email for now)
export function getUsers() {
  const arr = _getUsers()
  const obj = {}
  arr.forEach(u => { obj[u.email] = u })
  return obj
}

export function updateUserTier(email, tier) {
  _updateUserTier(email, tier)
}

// Called from Success page after Stripe confirms payment
export function updateOrCreateUserFromStripe(email, tier, opts = {}) {
  const { isNew } = _updateOrCreateUserFromStripe(email, tier, opts)
  return isNew
}

export function setPasswordForUser(email, password) {
  return _setPasswordForUser(email, password)
}

export function restoreAccessFromStripe(email, tier) {
  _restoreAccessFromStripe(email, tier)
}

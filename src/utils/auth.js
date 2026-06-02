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

// ─── Auth actions ─────────────────────────────────────────────────────────────

export function signup(email, password) {
  const key = email.toLowerCase()
  const users = _getUsers()
  if (users.find(u => u.email === key)) return { error: 'An account with this email already exists.' }
  const newUser = {
    email: key, password, tier: 'free', planDisplay: 'Free Plan',
    createdAt: Date.now(), subscriptionActive: false,
  }
  saveUser(newUser)
  _setSession(newUser)
  return { success: true }
}

export function login(email, password) {
  const key = email.toLowerCase()

  if (key === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const adminUser = { email: key, tier: 'admin', planDisplay: '👑 Admin' }
    _setSession(adminUser)
    return { success: true, isAdmin: true }
  }

  const user = getUser(key)
  if (!user || user.password !== password) return { error: 'Incorrect email or password. Try again.' }

  _setSession(user)
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

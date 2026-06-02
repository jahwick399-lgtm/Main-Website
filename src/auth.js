// src/auth.js — All auth calls go to the backend.
// Session (email + tier) still cached in localStorage for this origin.

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const SESSION_KEY = 'rp_session'

// ─── Session (localStorage — same origin, always safe) ───────────────────────

export const getSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null } catch { return null }
}

export const setSession = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    email:           user.email,
    tier:            user.tier,
    isLoggedIn:      true,
    loginTime:       Date.now(),
    subscriptionEnd: user.subscriptionEnd || null,
  }))
}

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY)
}

export const isLoggedIn = () => getSession()?.isLoggedIn === true

// ─── Signup ──────────────────────────────────────────────────────────────────

export const signUp = async (email, password) => {
  try {
    const res  = await fetch(`${API}/auth/signup`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.success) setSession(data.user)
    return data
  } catch {
    return { success: false, error: 'Server error. Try again in 30 seconds.' }
  }
}

// Alias for backward compat
export const signup = signUp

// ─── Login ───────────────────────────────────────────────────────────────────

export const logIn = async (email, password) => {
  try {
    const res  = await fetch(`${API}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.success) setSession(data.user)
    return data
  } catch {
    return { success: false, error: 'Server error. Try again in 30 seconds.' }
  }
}

// Alias for backward compat
export const login = logIn

// ─── Get current user from backend ───────────────────────────────────────────

export const getCurrentUser = async () => {
  const session = getSession()
  if (!session?.email) return null
  try {
    const res  = await fetch(`${API}/auth/get-user`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: session.email }),
    })
    const data = await res.json()
    if (data.success) {
      setSession(data.user)
      return data.user
    }
    return null
  } catch {
    // Backend down — fall back to cached session
    return session?.email ? { email: session.email, tier: session.tier || 'free' } : null
  }
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export const logOut = () => clearSession()

// ─── Apply paid tier after Stripe ────────────────────────────────────────────

export const applyPaidTier = async (email, plan, stripeSessionId) => {
  try {
    await fetch(`${API}/auth/update-tier`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, tier: plan, stripeSessionId }),
    })
  } catch {}
  // Always update the local session so the success page works even if backend is slow
  const session = getSession()
  if (session) {
    session.tier = plan
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }
}

// ─── Set password for accounts created via Stripe ────────────────────────────

export const setPasswordForUser = async (email, password) => {
  try {
    const res  = await fetch(`${API}/auth/set-password`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })
    return await res.json()
  } catch {
    return { error: 'Server error.' }
  }
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export const ADMIN_EMAIL    = 'jahwick399@gmail.com'
export const ADMIN_PASSWORD = 'Admin123'

export const checkAdmin = (email, password) =>
  email.trim().toLowerCase() === ADMIN_EMAIL && password.trim() === ADMIN_PASSWORD

// ─── Restore access via Stripe ───────────────────────────────────────────────

export const restoreAccess = async (email, tier) => {
  try {
    await fetch(`${API}/auth/update-tier`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, tier, stripeSessionId: 'restored' }),
    })
    setSession({ email: email.trim().toLowerCase(), tier })
  } catch {}
}

// Alias for backward compat
export const restoreAccessFromStripe = restoreAccess

// ─── Shims for any remaining code that imports from utils/auth or utils/userStore

export const getAllUsers = () => []
export const findUser   = () => null
export const saveUser   = () => {}
export const saveAllUsers = () => {}
export const getUser    = () => null
export const syncSession = setSession
export const checkAndExpireSubscriptions = () => {}
export const getDaysRemaining  = (user) => {
  if (!user?.subscriptionEnd) return null
  return Math.ceil((user.subscriptionEnd - Date.now()) / (1000 * 60 * 60 * 24))
}
export const isInGracePeriod = (user) => {
  const now = Date.now()
  return !!(user?.subscriptionEnd && now > user.subscriptionEnd && user?.graceUntil && now < user.graceUntil)
}
export const migrateOldUsers = () => {}

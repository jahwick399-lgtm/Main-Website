const ADMIN_EMAIL    = 'jahwick399@gmail.com'
const ADMIN_PASSWORD = 'Admin123'

export function getUsers() {
  try { return JSON.parse(localStorage.getItem('fl_users') || '{}') } catch { return {} }
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem('fl_session') || 'null') } catch { return null }
}

export function setSession(email, tier) {
  localStorage.setItem('fl_session', JSON.stringify({ email, tier }))
}

export function clearSession() {
  localStorage.removeItem('fl_session')
  localStorage.removeItem('rm_subscription')
  localStorage.removeItem('rm_free_tier')
}

export function signup(email, password) {
  const key = email.toLowerCase()
  const users = getUsers()
  if (users[key]) return { error: 'An account with this email already exists.' }
  users[key] = { email: key, password, tier: 'free', createdAt: new Date().toISOString() }
  localStorage.setItem('fl_users', JSON.stringify(users))
  setSession(key, 'free')
  return { success: true }
}

export function login(email, password) {
  const key = email.toLowerCase()
  if (key === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    setSession(key, 'admin')
    return { success: true, isAdmin: true }
  }
  const users = getUsers()
  const user = users[key]
  if (!user || user.password !== password) return { error: 'Incorrect email or password. Try again.' }
  setSession(key, user.tier)
  return { success: true }
}

export function updateUserTier(email, tier) {
  const users = getUsers()
  const key = email.toLowerCase()
  if (!users[key]) return
  users[key].tier = tier
  localStorage.setItem('fl_users', JSON.stringify(users))
}

// Called from Success page after Stripe payment confirmed.
// Creates user if they don't exist, updates tier if they do.
// Returns true if this is a brand new account (no password yet).
export function updateOrCreateUserFromStripe(email, tier) {
  const key   = email.toLowerCase()
  const users = getUsers()
  const isNew = !users[key]
  if (isNew) {
    users[key] = { email: key, password: null, tier, createdAt: new Date().toISOString(), fromStripe: true }
  } else {
    users[key].tier = tier
  }
  localStorage.setItem('fl_users', JSON.stringify(users))
  setSession(key, tier)
  return isNew
}

// Set a password for an account created via Stripe (no prior password).
export function setPasswordForUser(email, password) {
  const users = getUsers()
  const key   = email.toLowerCase()
  if (!users[key]) return { error: 'Account not found.' }
  users[key].password    = password
  users[key].fromStripe  = false
  localStorage.setItem('fl_users', JSON.stringify(users))
  return { success: true }
}

// Restore access from Stripe data (already verified by caller).
export function restoreAccessFromStripe(email, tier) {
  updateOrCreateUserFromStripe(email, tier)
}

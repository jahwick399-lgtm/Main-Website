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

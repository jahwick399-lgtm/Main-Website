// Single source of truth for all user data.
// Users stored as an array in 'rp_users'.
// Session stored in 'rp_session'.
// Tier ALWAYS lives on the user object — never only in the session.

const USERS_KEY   = 'rp_users'
const SESSION_KEY = 'rp_session'

const PLAN_LABELS = {
  free:         'Free Plan',
  beginner:     'Beginner Plan',
  intermediate: 'Intermediate Plan',
  pro:          'Pro Plan',
  admin:        '👑 Admin',
}

// ─── User CRUD ────────────────────────────────────────────────────────────────

export function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}

export function getUser(email) {
  const key = email.toLowerCase()
  return getUsers().find(u => u.email === key) || null
}

export function saveUser(userObj) {
  const users = getUsers()
  const idx   = users.findIndex(u => u.email === userObj.email)
  if (idx >= 0) users[idx] = userObj
  else          users.push(userObj)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function saveAllUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// ─── Session ─────────────────────────────────────────────────────────────────

export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    email:     user.email,
    tier:      user.tier,
    isLoggedIn: true,
    loginTime:  Date.now(),
  }))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

// ─── Tier management ──────────────────────────────────────────────────────────

// updateUserTier — called after Stripe payment confirmed.
// Saves tier permanently on user object. Also syncs the active session.
export function updateUserTier(email, tier, opts = {}) {
  const key   = email.toLowerCase()
  const users = getUsers()
  const idx   = users.findIndex(u => u.email === key)
  if (idx < 0) return null

  const now = Date.now()
  const user = users[idx]

  user.tier              = tier
  user.subscriptionActive = tier !== 'free' && tier !== 'admin'
  user.planDisplay        = PLAN_LABELS[tier] || tier

  if (opts.subscriptionId) user.subscriptionId = opts.subscriptionId
  if (opts.stripeSessionId) user.stripeSessionId = opts.stripeSessionId

  if (tier !== 'free' && tier !== 'admin') {
    user.paidAt            = opts.paidAt || now
    user.subscriptionStart = opts.paidAt || now
    user.subscriptionEnd   = (opts.paidAt || now) + 30 * 24 * 60 * 60 * 1000
    delete user.expiredAt
    delete user.graceUntil
  }

  saveAllUsers(users)

  // Sync live session if this is the logged-in user
  const session = getSession()
  if (session && session.email === key) setSession(user)

  return user
}

// updateOrCreateUserFromStripe — called from Success page.
// Creates the account if it doesn't exist yet; upgrades tier if it does.
// Returns { user, isNew }.
export function updateOrCreateUserFromStripe(email, tier, opts = {}) {
  const key   = email.toLowerCase()
  const users = getUsers()
  const idx   = users.findIndex(u => u.email === key)
  const now   = Date.now()
  const isNew = idx < 0

  const base = isNew
    ? { email: key, password: null, createdAt: now, fromStripe: true }
    : users[idx]

  const paidAt = opts.paidAt || now

  base.tier               = tier
  base.planDisplay        = PLAN_LABELS[tier] || tier
  base.subscriptionActive = true
  base.paidAt             = paidAt
  base.subscriptionStart  = paidAt
  base.subscriptionEnd    = paidAt + 30 * 24 * 60 * 60 * 1000
  if (opts.subscriptionId)  base.subscriptionId  = opts.subscriptionId
  if (opts.stripeSessionId) base.stripeSessionId = opts.stripeSessionId
  delete base.expiredAt
  delete base.graceUntil

  if (isNew) users.push(base)
  else        users[idx] = base

  saveAllUsers(users)
  setSession(base)
  return { user: base, isNew }
}

export function setPasswordForUser(email, password) {
  const key   = email.toLowerCase()
  const users = getUsers()
  const idx   = users.findIndex(u => u.email === key)
  if (idx < 0) return { error: 'Account not found.' }
  users[idx].password   = password
  users[idx].fromStripe = false
  saveAllUsers(users)
  return { success: true }
}

export function restoreAccessFromStripe(email, tier) {
  const user = getUser(email)
  if (user) {
    user.tier = tier
    user.planDisplay = PLAN_LABELS[tier] || tier
    user.subscriptionActive = true
    saveUser(user)
    setSession(user)
  } else {
    const now = Date.now()
    const newUser = {
      email: email.toLowerCase(), password: null, tier,
      planDisplay: PLAN_LABELS[tier] || tier,
      createdAt: now, fromStripe: true, subscriptionActive: true,
      subscriptionStart: now, subscriptionEnd: now + 30 * 24 * 60 * 60 * 1000,
    }
    saveUser(newUser)
    setSession(newUser)
  }
}

// ─── Subscription expiry ─────────────────────────────────────────────────────

export function checkAndExpireSubscriptions() {
  const now   = Date.now()
  const users = getUsers()
  let anyChanged = false

  users.forEach(user => {
    if (!user.tier || user.tier === 'free' || user.tier === 'admin') return
    if (!user.subscriptionEnd) return

    // Start grace period the moment subscription ends (if not already started)
    if (now > user.subscriptionEnd && !user.graceUntil) {
      user.graceUntil = user.subscriptionEnd + 3 * 24 * 60 * 60 * 1000
      anyChanged = true
    }

    // After grace period: hard downgrade
    if (user.graceUntil && now > user.graceUntil) {
      user.expiredAt         = user.expiredAt || user.subscriptionEnd
      user.tier              = 'free'
      user.planDisplay       = PLAN_LABELS.free
      user.subscriptionActive = false
      anyChanged = true

      const session = getSession()
      if (session && session.email === user.email) setSession(user)
    }
  })

  if (anyChanged) saveAllUsers(users)
}

export function getDaysRemaining(user) {
  if (!user?.subscriptionEnd) return null
  return Math.ceil((user.subscriptionEnd - Date.now()) / (1000 * 60 * 60 * 24))
}

export function isInGracePeriod(user) {
  const now = Date.now()
  return !!(user?.subscriptionEnd && now > user.subscriptionEnd && user?.graceUntil && now < user.graceUntil)
}

// ─── Migration from old fl_users / fl_session ────────────────────────────────

export function migrateOldUsers() {
  if (localStorage.getItem('rp_migrated') === 'true') return

  try {
    const oldObj = JSON.parse(localStorage.getItem('fl_users') || '{}')
    const oldSub = JSON.parse(localStorage.getItem('rm_subscription') || 'null')
    const oldSes = JSON.parse(localStorage.getItem('fl_session') || 'null')

    const existing = getUsers()
    const existingEmails = new Set(existing.map(u => u.email))

    Object.values(oldObj).forEach(u => {
      if (!u.email || existingEmails.has(u.email)) return
      const migrated = {
        email:     u.email.toLowerCase(),
        password:  u.password || null,
        tier:      u.tier || 'free',
        planDisplay: PLAN_LABELS[u.tier] || PLAN_LABELS.free,
        createdAt: u.createdAt ? new Date(u.createdAt).getTime() : Date.now(),
        subscriptionActive: u.tier && u.tier !== 'free',
      }

      // If there's a subscription record for this user, attach dates
      if (oldSub && oldSes && oldSes.email === u.email && oldSub.subscriptionId) {
        migrated.subscriptionId    = oldSub.subscriptionId
        migrated.subscriptionStart = oldSub.verifiedAt || Date.now()
        migrated.subscriptionEnd   = (oldSub.verifiedAt || Date.now()) + 30 * 24 * 60 * 60 * 1000
      }

      existing.push(migrated)
    })

    saveAllUsers(existing)

    // Migrate active session
    if (oldSes && !getSession()) {
      const user = getUser(oldSes.email)
      if (user) setSession(user)
    }
  } catch (e) {
    console.error('[userStore] Migration error:', e)
  }

  localStorage.setItem('rp_migrated', 'true')
}

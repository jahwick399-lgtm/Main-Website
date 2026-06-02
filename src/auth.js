// src/auth.js — Single source of truth for all auth and user storage.
// Every other file imports from here. No other files touch localStorage for users.

const USERS_KEY   = 'rp_users'
const SESSION_KEY = 'rp_session'

// ─── USER STORAGE ─────────────────────────────────────────────────────────────

export const getAllUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}

export const saveAllUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const findUser = (email) => {
  const users = getAllUsers()
  return users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase()) || null
}

export const saveUser = (userObj) => {
  const users = getAllUsers()
  const index = users.findIndex(u => u.email.trim().toLowerCase() === userObj.email.trim().toLowerCase())
  if (index >= 0) users[index] = userObj
  else            users.push(userObj)
  saveAllUsers(users)
}

// ─── SESSION ──────────────────────────────────────────────────────────────────

export const getSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null } catch { return null }
}

export const setSession = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    email:     user.email,
    tier:      user.tier,
    isLoggedIn: true,
    loginTime:  Date.now(),
  }))
}

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY)
}

export const isLoggedIn = () => {
  const s = getSession()
  return s?.isLoggedIn === true
}

export const getCurrentTier = () => {
  const s = getSession()
  if (!s?.email) return 'free'
  const user = findUser(s.email)
  return user?.tier || 'free'
}

// ─── SIGNUP ───────────────────────────────────────────────────────────────────

export const signUp = (email, password) => {
  const trimmedEmail = email.trim().toLowerCase()

  const existing = findUser(trimmedEmail)
  if (existing) return { success: false, error: 'Account already exists. Please log in.' }

  const newUser = {
    email:              trimmedEmail,
    password:           password.trim(),
    tier:               'free',
    createdAt:          Date.now(),
    subscriptionActive: false,
    subscriptionEnd:    null,
    subscriptionStart:  null,
    paidAt:             null,
    stripeSessionId:    null,
    graceUntil:         null,
    expiredAt:          null,
  }

  saveUser(newUser)
  setSession(newUser)

  console.log('SIGNUP SUCCESS:', trimmedEmail)
  console.log('ALL USERS NOW:', getAllUsers())

  return { success: true, user: newUser }
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

export const logIn = (email, password) => {
  const trimmedEmail    = email.trim().toLowerCase()
  const trimmedPassword = password.trim()

  console.log('LOGIN ATTEMPT:', trimmedEmail)
  console.log('ALL USERS:', getAllUsers())

  let user = findUser(trimmedEmail)

  // Fallback: check legacy fl_users system and migrate on the fly
  if (!user) {
    try {
      const old     = JSON.parse(localStorage.getItem('fl_users') || '{}')
      const oldUser = old[trimmedEmail]
      if (oldUser) {
        const LABELS = { free:'Free Plan', beginner:'Beginner Plan', intermediate:'Intermediate Plan', pro:'Pro Plan' }
        const migrated = {
          email:              trimmedEmail,
          password:           oldUser.password || null,
          tier:               oldUser.tier || 'free',
          planDisplay:        LABELS[oldUser.tier] || LABELS.free,
          createdAt:          oldUser.createdAt ? new Date(oldUser.createdAt).getTime() : Date.now(),
          subscriptionActive: !!(oldUser.tier && oldUser.tier !== 'free'),
          subscriptionEnd:    null, subscriptionStart: null,
          paidAt: null, stripeSessionId: null, graceUntil: null, expiredAt: null,
        }
        saveUser(migrated)
        user = migrated
        console.log('MIGRATED legacy user:', trimmedEmail)
      }
    } catch {}
  }

  if (!user) {
    console.log('USER NOT FOUND')
    return { success: false, error: 'No account found with that email.' }
  }

  if (user.password !== trimmedPassword) {
    console.log('PASSWORD WRONG')
    return { success: false, error: 'Incorrect password. Try again.' }
  }

  // Check expiry inline before setting session
  const now = Date.now()
  if (user.tier !== 'free' && user.tier !== 'admin' &&
      user.subscriptionEnd && now > user.subscriptionEnd &&
      (!user.graceUntil || now > user.graceUntil)) {
    user.tier               = 'free'
    user.subscriptionActive = false
    user.expiredAt          = now
    saveUser(user)
  }

  setSession(user)

  console.log('LOGIN SUCCESS:', { email: user.email, tier: user.tier })

  return { success: true, user }
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────

export const logOut = () => { clearSession() }

// ─── APPLY PAID TIER AFTER STRIPE ────────────────────────────────────────────

export const applyPaidTier = (email, plan, stripeSessionId) => {
  const trimmedEmail = email.trim().toLowerCase()
  const now          = Date.now()
  const thirtyDays   = 30 * 24 * 60 * 60 * 1000

  let user = findUser(trimmedEmail)

  if (user) {
    user.tier               = plan
    user.subscriptionActive = true
    user.subscriptionStart  = now
    user.subscriptionEnd    = now + thirtyDays
    user.paidAt             = now
    user.stripeSessionId    = stripeSessionId
    user.graceUntil         = null
    user.expiredAt          = null
  } else {
    user = {
      email: trimmedEmail, password: null, tier: plan,
      createdAt: now, subscriptionActive: true,
      subscriptionStart: now, subscriptionEnd: now + thirtyDays,
      paidAt: now, stripeSessionId, graceUntil: null, expiredAt: null,
      needsPassword: true,
    }
  }

  saveUser(user)
  setSession(user)

  console.log('PAID TIER APPLIED:', { email: trimmedEmail, plan, expiresOn: new Date(now + thirtyDays).toLocaleDateString() })

  return user
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────

export const ADMIN_EMAIL    = 'jahwick399@gmail.com'
export const ADMIN_PASSWORD = 'Admin123'

export const checkAdmin = (email, password) =>
  email.trim().toLowerCase() === ADMIN_EMAIL && password.trim() === ADMIN_PASSWORD

// ─── SUBSCRIPTION EXPIRY ─────────────────────────────────────────────────────

export const checkAndExpireSubscriptions = () => {
  const now   = Date.now()
  const users = getAllUsers()
  let changed = false

  users.forEach(user => {
    if (!user.tier || user.tier === 'free' || user.tier === 'admin') return
    if (!user.subscriptionEnd) return

    if (now > user.subscriptionEnd && !user.graceUntil) {
      user.graceUntil = user.subscriptionEnd + 3 * 24 * 60 * 60 * 1000
      changed = true
    }
    if (user.graceUntil && now > user.graceUntil) {
      user.expiredAt          = user.expiredAt || user.subscriptionEnd
      user.tier               = 'free'
      user.subscriptionActive = false
      changed = true
      const s = getSession()
      if (s?.email === user.email) setSession(user)
    }
  })

  if (changed) saveAllUsers(users)
}

export const getDaysRemaining = (user) => {
  if (!user?.subscriptionEnd) return null
  return Math.ceil((user.subscriptionEnd - Date.now()) / (1000 * 60 * 60 * 24))
}

export const isInGracePeriod = (user) => {
  const now = Date.now()
  return !!(user?.subscriptionEnd && now > user.subscriptionEnd && user?.graceUntil && now < user.graceUntil)
}

// ─── MIGRATION FROM OLD SYSTEM ────────────────────────────────────────────────

export const migrateOldUsers = () => {
  if (localStorage.getItem('rp_migrated') === 'true') return
  try {
    const oldObj = JSON.parse(localStorage.getItem('fl_users') || '{}')
    const oldSub = JSON.parse(localStorage.getItem('rm_subscription') || 'null')
    const oldSes = JSON.parse(localStorage.getItem('fl_session') || 'null')
    const existing = getAllUsers()
    const emails = new Set(existing.map(u => u.email))
    const LABELS = { free:'Free Plan', beginner:'Beginner Plan', intermediate:'Intermediate Plan', pro:'Pro Plan' }

    Object.values(oldObj).forEach(u => {
      if (!u.email || emails.has(u.email.toLowerCase())) return
      const m = {
        email: u.email.toLowerCase(), password: u.password || null,
        tier: u.tier || 'free', planDisplay: LABELS[u.tier] || LABELS.free,
        createdAt: u.createdAt ? new Date(u.createdAt).getTime() : Date.now(),
        subscriptionActive: !!(u.tier && u.tier !== 'free'),
        subscriptionEnd: null, subscriptionStart: null, paidAt: null, stripeSessionId: null,
      }
      if (oldSub && oldSes?.email === u.email && oldSub.subscriptionId) {
        m.subscriptionId    = oldSub.subscriptionId
        m.subscriptionStart = oldSub.verifiedAt || Date.now()
        m.subscriptionEnd   = (oldSub.verifiedAt || Date.now()) + 30 * 24 * 60 * 60 * 1000
      }
      existing.push(m)
    })

    saveAllUsers(existing)
    if (oldSes && !getSession()) {
      const user = findUser(oldSes.email)
      if (user) setSession(user)
    }
  } catch (e) { console.error('[auth] Migration error:', e) }
  localStorage.setItem('rp_migrated', 'true')
}

// ─── SET PASSWORD (for accounts created via Stripe with no password) ─────────

export const setPasswordForUser = (email, password) => {
  const user = findUser(email)
  if (!user) return { error: 'Account not found.' }
  user.password    = password.trim()
  user.needsPassword = false
  saveUser(user)
  return { success: true }
}

// ─── RESTORE ACCESS ───────────────────────────────────────────────────────────

export const restoreAccess = (email, tier) => {
  const trimmedEmail = email.trim().toLowerCase()
  const LABELS = { free:'Free Plan', beginner:'Beginner Plan', intermediate:'Intermediate Plan', pro:'Pro Plan' }
  let user = findUser(trimmedEmail)
  if (user) {
    user.tier = tier
    user.subscriptionActive = tier !== 'free'
  } else {
    const now = Date.now()
    user = {
      email: trimmedEmail, password: null, tier,
      planDisplay: LABELS[tier] || LABELS.free,
      createdAt: now, fromStripe: true, subscriptionActive: tier !== 'free',
      subscriptionStart: now, subscriptionEnd: now + 30 * 24 * 60 * 60 * 1000,
    }
  }
  saveUser(user)
  setSession(user)
}

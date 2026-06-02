// Re-exports from src/auth.js — backward compat for Admin, Success, Navbar, App.
import { getAllUsers, findUser, saveUser, getSession, setSession } from '../auth'

export {
  getSession,
  clearSession,
  checkAndExpireSubscriptions,
  signUp as signup,
  logIn as login,
  applyPaidTier as updateOrCreateUserFromStripe,
  restoreAccess as restoreAccessFromStripe,
  setPasswordForUser,
} from '../auth'

// getUsers returns object keyed by email (Admin expects this format)
export function getUsers() {
  const obj = {}
  getAllUsers().forEach(u => { obj[u.email] = u })
  return obj
}

// updateUserTier — keeps old (email, tier) signature
export function updateUserTier(email, tier) {
  const user = findUser(email)
  if (!user) return
  user.tier = tier
  user.subscriptionActive = tier !== 'free' && tier !== 'admin'
  saveUser(user)
  const s = getSession()
  if (s?.email === email.toLowerCase()) setSession(user)
}

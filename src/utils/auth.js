// Re-exports from src/auth.js for backward compat (Admin, Navbar, Plans, App).
export {
  getSession,
  clearSession,
  signUp as signup,
  logIn as login,
  applyPaidTier as updateOrCreateUserFromStripe,
  restoreAccess as restoreAccessFromStripe,
  setPasswordForUser,
  checkAndExpireSubscriptions,
  migrateOldUsers,
  getAllUsers as getUsers,
} from '../auth'

// updateUserTier is deprecated in backend mode — use /auth/admin/update-user
export function updateUserTier() {
  console.warn('[updateUserTier] Deprecated in backend mode.')
}

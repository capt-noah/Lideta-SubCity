import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { adminContext } from '../utils/AdminContext'

// Default landing path per role when they hit a page they can't access
const ROLE_DEFAULT_PATH = {
  admin:           '/admin',
  complaint_admin: '/admin/complaints',
  event_admin:     '/admin/events',
  news_admin:      '/admin/news',
  vacancy_admin:   '/admin/vacancy',
  superadmin:      '/superadmin/home',
}

/**
 * RoleGuard
 *
 * Renders children only if the logged-in admin's role is in `allowedRoles`.
 * Superadmin bypasses all role checks (full access everywhere).
 *
 * If the role isn't allowed, redirects to that role's default landing page.
 * Returns null while admin data is still loading.
 */
function RoleGuard({ allowedRoles, children }) {
  const { admin } = useContext(adminContext)

  // Still loading — don't redirect yet
  if (!admin) return null

  // Superadmin has unrestricted access
  if (admin.role === 'superadmin') return children

  if (allowedRoles.includes(admin.role)) return children

  // Redirect to the admin's permitted landing page
  const fallback = ROLE_DEFAULT_PATH[admin.role] ?? '/admin'
  return <Navigate to={fallback} replace />
}

export default RoleGuard

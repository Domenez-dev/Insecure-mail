import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Gate for Root Access-only pages (the archive).
 * - Not logged in        -> bounce to /login
 * - Logged in, not root   -> show an upgrade nudge
 * - Logged in + root       -> render children
 */
export default function ProtectedRoute({ children }) {
  const { user, isRoot, loading } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center font-mono text-sm text-ink-soft">
        <span className="cursor">authenticating</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (!isRoot) {
    return (
      <div className="mx-auto grid min-h-[50vh] max-w-md place-items-center px-5 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-deep">
            403 · forbidden
          </p>
          <h1 className="mt-3 font-display text-2xl font-bold">Root Access required</h1>
          <p className="mt-2 text-ink-soft">
            The newsletter archive is a Root Access perk. Upgrade to read every issue ever
            sent — including the ones before you joined.
          </p>
          <a
            href="/#tiers"
            className="mt-6 inline-flex rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            See Root Access
          </a>
        </div>
      </div>
    )
  }

  return children
}

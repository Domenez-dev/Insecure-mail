import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { BRAND } from '../config.js'

export default function Navbar() {
  const { user, isRoot, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="group flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-ink text-cyan-glow font-mono text-sm font-bold">
            ~$
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            {BRAND.name}
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="/#tiers"
            className="hidden text-sm font-medium text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Plans
          </a>
          {user ? (
            <>
              {isRoot && (
                <Link
                  to="/archive"
                  className="hidden text-sm font-medium text-ink-soft transition-colors hover:text-ink sm:block"
                >
                  Archive
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium transition-colors hover:border-ink"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-sm font-medium text-ink-soft transition-colors hover:text-ink sm:block"
              >
                Log in
              </Link>
              <a
                href="/#tiers"
                className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Subscribe
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

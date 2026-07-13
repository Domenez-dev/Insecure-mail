import { Link } from 'react-router-dom'
import { BRAND } from '../config.js'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-ink font-mono text-xs font-bold text-cyan-glow">
            ~$
          </span>
          <span className="font-display text-sm font-semibold">{BRAND.name}</span>
          <span className="font-mono text-xs text-ink-soft">· {BRAND.domain}</span>
        </div>

        <nav className="flex items-center gap-5 text-sm text-ink-soft">
          <a href="/#inside" className="transition-colors hover:text-ink">What’s inside</a>
          <a href="/#tiers" className="transition-colors hover:text-ink">Plans</a>
          <Link to="/login" className="transition-colors hover:text-ink">Log in</Link>
        </nav>

        <p className="font-mono text-xs text-ink-soft">
          © {new Date().getFullYear()} — stay patched.
        </p>
      </div>
    </footer>
  )
}

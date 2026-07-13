import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isSupabaseConfigured } from '../lib/supabase.js'
import { Arrow, Check, Mail } from '../components/icons.jsx'

export default function Login() {
  const { user, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | loading | sent | error
  const [message, setMessage] = useState('')

  if (user) return <Navigate to="/archive" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setState('loading')
    if (!isSupabaseConfigured) {
      setState('error')
      setMessage('Auth not connected yet. Add your Supabase keys in .env (see supabase.md).')
      return
    }
    const { error } = await signIn(email.trim().toLowerCase())
    if (error) {
      setState('error')
      setMessage(error.message)
      return
    }
    setState('sent')
  }

  return (
    <section className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-5">
      <div className="w-full">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-deep">
          // root access
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">Log in</h1>
        <p className="mt-2 text-ink-soft">
          Root Access members sign in with a magic link — no password to remember. Enter
          the email you subscribed with.
        </p>

        {state === 'sent' ? (
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-cyan/40 bg-cyan/5 px-4 py-4 text-sm">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-cyan-deep" />
            <span>
              Magic link sent to <strong>{email}</strong>. Open it on this device to reach
              your archive.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8">
            <label className="mb-2 flex items-center gap-2 font-mono text-xs text-ink-soft">
              <Mail className="h-4 w-4" /> email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-cyan focus:ring-2 focus:ring-cyan/30"
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className="group mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {state === 'loading' ? 'Sending…' : 'Send magic link'}
              <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            {state === 'error' && <p className="mt-2 text-xs text-red-600">{message}</p>}
          </form>
        )}

        <p className="mt-6 text-center font-mono text-xs text-ink-soft">
          Not a member yet?{' '}
          <a href="/#tiers" className="text-cyan-deep hover:underline">
            Get Root Access →
          </a>
        </p>
      </div>
    </section>
  )
}

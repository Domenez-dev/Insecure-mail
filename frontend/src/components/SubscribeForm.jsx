import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import { Arrow, Check } from './icons.jsx'

/**
 * Email capture form.
 * @param {'recon'|'root'} tier  which plan this form signs the user up for
 * @param {'light'|'dark'} variant  color scheme for the surface it sits on
 */
export default function SubscribeForm({ tier = 'recon', variant = 'light', cta = 'Subscribe' }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | loading | done | error
  const [message, setMessage] = useState('')

  const dark = variant === 'dark'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setState('loading')

    // No backend wired up yet — don't hard-fail, just tell the user.
    if (!isSupabaseConfigured) {
      setState('error')
      setMessage('Backend not connected yet. Add your Supabase keys in .env (see supabase.md).')
      return
    }

    // Plain insert (never upsert from the browser — the anon key must not be
    // able to *modify* existing rows). A duplicate email is treated as success
    // so re-subscribing is idempotent. Tier is forced to 'recon' here and also
    // enforced by an RLS check policy server-side (see supabase.md).
    const { error } = await supabase
      .from('subscribers')
      .insert({ email: email.trim().toLowerCase(), tier, status: 'pending', source: 'landing' })

    // 23505 = unique_violation -> already on the list, that's fine.
    if (error && error.code !== '23505') {
      setState('error')
      setMessage(error.message)
      return
    }
    setState('done')
  }

  if (state === 'done') {
    return (
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm ${
          dark ? 'border-cyan/40 bg-cyan/10 text-white' : 'border-cyan/40 bg-cyan/5 text-ink'
        }`}
      >
        <Check className="h-5 w-5 shrink-0 text-cyan-deep" />
        <span>
          You’re on the list. Check <strong>{email}</strong> to confirm your subscription.
        </span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={`min-w-0 flex-1 rounded-xl border px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-cyan focus:ring-2 focus:ring-cyan/30 ${
            dark
              ? 'border-white/15 bg-white/5 text-white placeholder:text-white/40'
              : 'border-line bg-white text-ink placeholder:text-ink-soft/60'
          }`}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-cyan-glow disabled:opacity-60"
        >
          {state === 'loading' ? 'Adding…' : cta}
          <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      {state === 'error' && (
        <p className={`mt-2 text-xs ${dark ? 'text-red-300' : 'text-red-600'}`}>{message}</p>
      )}
      <p className={`mt-2 text-xs ${dark ? 'text-white/50' : 'text-ink-soft'}`}>
        No spam. One-click unsubscribe. We never sell your address.
      </p>
    </form>
  )
}

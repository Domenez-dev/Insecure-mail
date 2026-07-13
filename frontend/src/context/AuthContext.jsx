import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [tier, setTier] = useState(null) // 'recon' | 'root' | null
  const [loading, setLoading] = useState(true)

  // Load current session and subscribe to auth changes.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Whenever the logged-in user changes, look up their subscription tier.
  useEffect(() => {
    const email = session?.user?.email
    if (!email) {
      setTier(null)
      return
    }
    supabase
      .from('subscribers')
      .select('tier, status')
      .eq('email', email)
      .maybeSingle()
      .then(({ data }) => setTier(data?.status === 'active' ? data.tier : null))
  }, [session])

  const value = {
    session,
    user: session?.user ?? null,
    tier,
    isRoot: tier === 'root',
    loading,
    // Passwordless login: Supabase emails a magic link / OTP.
    signIn: (email) =>
      supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/archive` },
      }),
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

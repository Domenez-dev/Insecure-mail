import { createClient } from '@supabase/supabase-js'

// Values come from frontend/.env  (see .env.example).
// Vite only exposes vars prefixed with VITE_ to the browser.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fail loudly in dev if the project isn't wired up yet, but don't crash
// the whole app — the landing page should still render for previews.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Insecure Mail] Supabase env vars missing. Copy .env.example to .env ' +
      'and fill VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (see supabase.md).'
  )
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

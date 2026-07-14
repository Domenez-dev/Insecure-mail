// ============================================================================
// Supabase connectivity check (diagnostic).
//
// Runs once at startup and prints a labeled report to the browser console so we
// can see WHY a request fails (the login page only surfaces "NetworkError when
// attempting to fetch resource", which hides the real cause).
//
// Safe to ship: the anon key is a *public* key (it already lives in the browser
// bundle), and we only print enough of it to spot an obviously-wrong value.
// Remove the call in main.jsx once the deployment is healthy.
// ============================================================================

// NOTE: Vite inlines VITE_* vars at BUILD time, so these reflect exactly what
// was baked into the deployed bundle — which is what we want to inspect.
const rawUrl = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const P = '[Supabase check]'

export async function checkSupabaseConnectivity() {
  // --- 1. What did the build actually receive? --------------------------------
  console.log(`${P} page origin        :`, window.location.origin)
  console.log(`${P} VITE_SUPABASE_URL  :`, rawUrl || '(missing)')
  console.log(
    `${P} VITE_SUPABASE_ANON_KEY :`,
    anonKey
      ? `present (length ${anonKey.length}, starts "${anonKey.slice(0, 6)}…")`
      : '(missing)',
  )

  if (!rawUrl || !anonKey) {
    console.error(
      `${P} ❌ Env vars are missing from this build. In Vercel → Project → ` +
        `Settings → Environment Variables add VITE_SUPABASE_URL and ` +
        `VITE_SUPABASE_ANON_KEY, then REDEPLOY (Vite bakes them in at build time).`,
    )
    return { ok: false, reason: 'env-missing' }
  }

  const url = rawUrl.replace(/\/$/, '')

  // --- 2. Catch the common misconfigurations before hitting the network -------
  if (/YOUR-PROJECT-ref|your-project/i.test(url)) {
    console.error(
      `${P} ❌ VITE_SUPABASE_URL is still the placeholder from .env.example. ` +
        `Replace it with your real Project URL (Dashboard → Settings → API).`,
    )
    return { ok: false, reason: 'placeholder-url' }
  }

  const pageIsLocal = /localhost|127\.0\.0\.1/.test(window.location.hostname)
  if (/localhost|127\.0\.0\.1/.test(url) && !pageIsLocal) {
    console.error(
      `${P} ❌ VITE_SUPABASE_URL points at a LOCAL Supabase (${url}) but the ` +
        `app is served from ${window.location.origin}. A browser on the internet ` +
        `cannot reach your machine's localhost. Use your hosted project URL ` +
        `(https://<ref>.supabase.co) in Vercel.`,
    )
    return { ok: false, reason: 'localhost-url' }
  }

  if (url.startsWith('http://') && window.location.protocol === 'https:') {
    console.error(
      `${P} ❌ Mixed content: the page is https:// but VITE_SUPABASE_URL is ` +
        `http:// (${url}). The browser blocks that request. Use an https:// URL.`,
    )
    return { ok: false, reason: 'mixed-content' }
  }

  if (!anonKey.startsWith('eyJ')) {
    console.warn(
      `${P} ⚠️ The anon key doesn't look like a JWT (should start with "eyJ"). ` +
        `Make sure you copied the anon/public key, not the URL or service key.`,
    )
  }

  // --- 3. Actually reach the project (GoTrue health endpoint via the gateway) --
  const healthUrl = `${url}/auth/v1/health`
  console.log(`${P} probing            :`, healthUrl)
  const started = performance.now()

  let res
  try {
    res = await fetch(healthUrl, { headers: { apikey: anonKey } })
  } catch (err) {
    // This is the SAME failure the login form reports as "NetworkError".
    console.error(
      `${P} ❌ NETWORK ERROR — could not reach ${url}. This is the same ` +
        `failure your login sees.`,
      err,
    )
    console.error(
      `${P} Likely causes: (a) the project URL is wrong/typo'd, (b) the ` +
        `Supabase project is PAUSED — free projects pause after ~1 week idle; ` +
        `open the dashboard to resume it, or (c) a DNS/CORS problem.`,
    )
    return { ok: false, reason: 'network-error', error: err }
  }

  const ms = Math.round(performance.now() - started)
  if (res.ok) {
    let body = ''
    try {
      body = JSON.stringify(await res.json())
    } catch {
      /* health endpoint returned non-JSON; status is enough */
    }
    console.log(`${P} ✅ Reachable — HTTP ${res.status} in ${ms}ms.`, body)
    console.log(
      `${P} Connectivity is fine. If login still fails, the problem is auth ` +
        `config (Site URL / redirect URLs / email sending) rather than the network.`,
    )
    return { ok: true, status: res.status }
  }

  console.warn(
    `${P} ⚠️ Reachable but HTTP ${res.status} in ${ms}ms. The host is up ` +
      `(connectivity OK); a 401/403 here usually means the anon key is wrong.`,
  )
  return { ok: false, reason: 'http-error', status: res.status }
}

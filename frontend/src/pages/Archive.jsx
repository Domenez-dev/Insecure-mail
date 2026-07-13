import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function Archive() {
  const [issues, setIssues] = useState([])
  const [selected, setSelected] = useState(null)
  const [state, setState] = useState('loading') // loading | ready | error

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setState('error')
      return
    }
    supabase
      .from('newsletters')
      .select('id, title, edition, summary, body_html, sent_at')
      .eq('status', 'sent')
      .order('sent_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) return setState('error')
        setIssues(data || [])
        setSelected((data && data[0]) || null)
        setState('ready')
      })
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-deep">
          // root access · archive
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Newsletter archive
        </h1>
        <p className="mt-2 text-ink-soft">
          Every issue ever sent — including the ones before you joined.
        </p>
      </div>

      {state === 'loading' && (
        <p className="font-mono text-sm text-ink-soft cursor">loading archive</p>
      )}

      {state === 'error' && (
        <div className="rounded-xl border border-line bg-white p-6 text-sm text-ink-soft">
          Couldn’t load the archive. Make sure the <code className="font-mono">newsletters</code>{' '}
          table exists and your Supabase keys are set (see supabase.md).
        </div>
      )}

      {state === 'ready' && issues.length === 0 && (
        <div className="rounded-xl border border-line bg-white p-6 text-sm text-ink-soft">
          No issues published yet. Once n8n sends the first newsletter, it’ll appear here.
        </div>
      )}

      {state === 'ready' && issues.length > 0 && (
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Issue list */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <ul className="space-y-1">
              {issues.map((issue) => {
                const active = selected?.id === issue.id
                return (
                  <li key={issue.id}>
                    <button
                      onClick={() => setSelected(issue)}
                      className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                        active
                          ? 'border-cyan bg-cyan/5'
                          : 'border-transparent hover:border-line hover:bg-white'
                      }`}
                    >
                      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                        {issue.edition} · {formatDate(issue.sent_at)}
                      </span>
                      <p className="mt-0.5 line-clamp-2 text-sm font-medium">{issue.title}</p>
                    </button>
                  </li>
                )
              })}
            </ul>
          </aside>

          {/* Reader */}
          <article className="min-w-0 rounded-2xl border border-line bg-white p-6 sm:p-8">
            {selected && (
              <>
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-deep">
                  {selected.edition} · {formatDate(selected.sent_at)}
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
                  {selected.title}
                </h2>
                {selected.summary && (
                  <p className="mt-2 text-ink-soft">{selected.summary}</p>
                )}
                <div
                  className="prose-newsletter mt-6 border-t border-line pt-6 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selected.body_html || '' }}
                />
              </>
            )}
          </article>
        </div>
      )}
    </section>
  )
}

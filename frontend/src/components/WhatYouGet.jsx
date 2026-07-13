import { Shield, Rss, Cpu, Terminal, Clock, Lock } from './icons.jsx'

const FEATURES = [
  {
    icon: Rss,
    title: 'Curated, not scraped',
    desc: 'We pull from a hand-picked set of reputable security feeds — no SEO spam, no rewritten press releases.',
  },
  {
    icon: Cpu,
    title: 'AI-assisted, human-shaped',
    desc: 'Gemini drafts the summary from the raw sources; the format stays consistent and skimmable.',
  },
  {
    icon: Shield,
    title: 'CVEs that matter',
    desc: 'The vulnerabilities worth your attention, with severity and whether they’re being exploited in the wild.',
  },
  {
    icon: Terminal,
    title: 'Tooling & techniques',
    desc: 'One useful open-source tool or technique per issue — the kind you’ll actually bookmark.',
  },
  {
    icon: Clock,
    title: 'A 5-minute read',
    desc: 'Tight by design. Enough to stay current without drowning in tabs.',
  },
  {
    icon: Lock,
    title: 'Your data stays yours',
    desc: 'Just an email address. One-click unsubscribe. Never sold, never shared.',
  },
]

export default function WhatYouGet() {
  return (
    <section id="inside" className="mx-auto max-w-6xl px-5 py-20">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-deep">
          // what’s inside
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Every issue, same reliable shape
        </h2>
        <p className="mt-3 text-lg text-ink-soft">
          No two weeks in security look alike, but the brief always reads the same way — so
          you know exactly where to look.
        </p>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="group bg-white p-6 transition-colors hover:bg-cyan/5">
            <div className="grid h-10 w-10 place-items-center rounded-lg border border-line text-cyan-deep transition-colors group-hover:border-cyan">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

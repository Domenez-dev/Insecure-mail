import { SCHEDULE } from '../config.js'

export default function Schedule() {
  return (
    <section className="border-y border-line bg-ink text-white">
      <div className="grid-bg">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-glow">
              // the weekly cadence
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Three sends a week. One of them is free.
            </h2>
            <p className="mt-3 text-lg text-white/60">
              Recon subscribers get the Thursday Brief. Root Access unlocks Sunday and
              Tuesday too — plus the full archive.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {SCHEDULE.map((s) => {
              const free = s.tier === 'all'
              return (
                <div
                  key={s.day}
                  className={`relative rounded-2xl border p-6 ${
                    free ? 'border-cyan bg-cyan/10' : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm uppercase tracking-widest text-white/50">
                      {s.day}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                        free ? 'bg-cyan text-black' : 'border border-white/20 text-white/60'
                      }`}
                    >
                      {free ? 'Free' : 'Root Access'}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

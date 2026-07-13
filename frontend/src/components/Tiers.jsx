import { TIERS } from '../config.js'
import { Check, X } from './icons.jsx'
import SubscribeForm from './SubscribeForm.jsx'

export default function Tiers() {
  return (
    <section id="tiers" className="mx-auto max-w-6xl px-5 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-deep">
          // choose your access level
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Start free. Escalate when you’re ready.
        </h2>
        <p className="mt-3 text-lg text-ink-soft">
          Both tiers land in your inbox. Root Access adds the extra sends and the platform
          archive.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`relative flex flex-col rounded-2xl border p-7 ${
              tier.highlighted
                ? 'border-cyan bg-white shadow-[0_0_0_1px_var(--color-cyan),0_20px_60px_-20px_rgba(6,182,212,0.4)]'
                : 'border-line bg-white'
            }`}
          >
            {tier.highlighted && (
              <span className="absolute -top-3 left-7 rounded-full bg-cyan px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-black">
                Most popular
              </span>
            )}

            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-xl font-bold">{tier.name}</h3>
              <div className="text-right">
                <span className="font-display text-2xl font-bold">{tier.price}</span>
                <p className="font-mono text-[11px] text-ink-soft">{tier.priceNote}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-ink-soft">{tier.blurb}</p>

            <ul className="mt-6 flex-1 space-y-3">
              {tier.perks.map((perk) => (
                <li key={perk.text} className="flex items-start gap-3 text-sm">
                  {perk.included ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-deep" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft/40" />
                  )}
                  <span className={perk.included ? 'text-ink' : 'text-ink-soft/50 line-through'}>
                    {perk.text}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              {tier.id === 'recon' ? (
                <SubscribeForm tier="recon" cta={tier.cta} />
              ) : (
                <a
                  href="#"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  {tier.cta}
                </a>
              )}
              {tier.id === 'root' && (
                <p className="mt-2 text-center font-mono text-[11px] text-ink-soft">
                  Pay with card or crypto · checkout wired up at launch
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

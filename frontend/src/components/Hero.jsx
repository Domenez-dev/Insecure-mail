import SubscribeForm from "./SubscribeForm.jsx";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 md:grid-cols-2 md:items-center">
        {/* Left: pitch + subscribe */}
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            weekly cybersecurity brief
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            The internet is <span className="text-cyan-deep">insecure</span>.
            <br />
            Your inbox stays informed.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-soft">
            Insecure Mail reads the noisy world of security feeds so you don’t
            have to, then sends a tight human-readable brief three times a week.
          </p>

          <div className="mt-8 max-w-md">
            <SubscribeForm tier="recon" cta="Get the free brief" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-ink-soft">
            <span>▸ curated from trusted feeds</span>
            <span>▸ 5-min read</span>
            <span>▸ no fluff</span>
          </div>
        </div>

        {/* Right: terminal-style sample */}
        <div className="relative">
          <div className="grid-bg overflow-hidden rounded-2xl border border-ink/80 bg-ink text-white shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <span className="h-3 w-3 rounded-full bg-green-400/80" />
              <span className="ml-3 font-mono text-xs text-white/50">
                insecure-mail — thu edition
              </span>
            </div>
            <div className="space-y-4 p-6 font-mono text-sm leading-relaxed">
              <p className="text-cyan-glow">$ cat this_week.md</p>
              <div>
                <p className="text-white/40"># Top Story</p>
                <p className="text-white">
                  Critical RCE in a widely-used CI runner: patch is out, exploit
                  is public. Here’s the 90-second version.
                </p>
              </div>
              <div>
                <p className="text-white/40"># CVEs worth your time</p>
                <p className="text-white">
                  CVE-2026-XXXX · CVSS 9.8 · actively exploited
                </p>
                <p className="text-white">
                  CVE-2026-YYYY · CVSS 8.1 · auth bypass
                </p>
              </div>
              <div>
                <p className="text-white/40"># Tooling</p>
                <p className="text-white">
                  One new open-source scanner worth a look.
                </p>
              </div>
              <p className="text-cyan-glow cursor">$ </p>
            </div>
          </div>
          {/* soft cyan glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 -z-10 h-40 w-40 rounded-full bg-cyan/30 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

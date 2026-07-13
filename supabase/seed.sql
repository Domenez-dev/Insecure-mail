-- ============================================================================
-- Seed data for LOCAL development (`supabase db reset` / `supabase start`).
-- Do NOT rely on this in production — it's just so the archive & lists aren't
-- empty while you build the UI.
-- ============================================================================

-- Sample subscribers ---------------------------------------------------------
insert into public.subscribers (email, tier, status, source, confirmed_at)
values
  ('free@example.com', 'recon', 'active', 'seed', now()),
  ('you@example.com',  'root',  'active', 'seed', now())   -- pretend paid member
on conflict (email) do nothing;

-- Sample sent newsletters (what the /archive reader shows) -------------------
insert into public.newsletters (edition, slug, title, summary, body_html, send_tier, status, sent_at)
values
  (
    'Thu · The Brief', 'the-brief-sample-1',
    'Critical CI runner RCE, and a quiet auth bypass',
    'The 90-second version of this week''s biggest story, plus two CVEs worth patching now.',
    '<h2>Top story</h2><p>A critical remote code execution bug in a widely-used CI runner is now public, with a patch available. If you self-host runners, update today.</p><h2>CVEs worth your time</h2><ul><li><code>CVE-2026-0001</code> · CVSS 9.8 · actively exploited</li><li><code>CVE-2026-0002</code> · CVSS 8.1 · auth bypass</li></ul><h2>Tooling</h2><p>A new open-source secrets scanner worth a look this week.</p>',
    'recon', 'sent', now() - interval '2 days'
  ),
  (
    'Tue · Deep Dive', 'deep-dive-sample-1',
    'Taking apart the CI runner RCE',
    'A step-by-step walkthrough of how the runner vulnerability actually works.',
    '<h2>How it works</h2><p>We trace the bug from untrusted input to code execution, and show the one-line config change that mitigates it if you can''t patch immediately.</p><hr><p>Root Access members get this deep dive every Tuesday.</p>',
    'root', 'sent', now() - interval '4 days'
  ),
  (
    'Sun · Threat Radar', 'threat-radar-sample-1',
    'What broke over the weekend',
    'The weekend''s security noise, filtered down to what actually matters Monday morning.',
    '<h2>On the radar</h2><ul><li>Two npm packages caught exfiltrating env vars.</li><li>A ransomware crew shifts to a new initial-access technique.</li></ul>',
    'root', 'sent', now() - interval '7 days'
  )
on conflict (slug) do nothing;

// Central place for copy that appears in more than one component.

export const BRAND = {
  name: 'Insecure Mail',
  tagline: 'The weekly cybersecurity brief for people who patch on time.',
  domain: 'insecuremail.tech',
}

export const ROOT_ACCESS_PRICE = import.meta.env.VITE_ROOT_ACCESS_PRICE || '$4/mo'

// The two subscription tiers.
//   recon = free tier  (Thursday email only)
//   root  = paid tier   ("Root Access" — everything + archive)
export const TIERS = [
  {
    id: 'recon',
    name: 'Recon',
    price: 'Free',
    priceNote: 'no card, no catch',
    blurb: 'A single weekly signal to keep you oriented.',
    cta: 'Start with Recon',
    highlighted: false,
    perks: [
      { text: 'The Thursday edition, every week', included: true },
      { text: 'Top story + key CVEs of the week', included: true },
      { text: 'Unsubscribe in one click', included: true },
      { text: 'Sunday & Tuesday editions', included: false },
      { text: 'Full searchable newsletter archive', included: false },
    ],
  },
  {
    id: 'root',
    name: 'Root Access',
    price: ROOT_ACCESS_PRICE,
    priceNote: 'cancel anytime',
    blurb: 'Full privileges. Every send, plus the entire back catalog.',
    cta: 'Get Root Access',
    highlighted: true,
    perks: [
      { text: 'All 3 editions — Sun, Tue & Thu', included: true },
      { text: 'Deep dives & exploit breakdowns', included: true },
      { text: 'Full archive of past newsletters', included: true },
      { text: 'Read issues sent before you joined', included: true },
      { text: 'Priority on reader Q&A', included: true },
    ],
  },
]

// Weekly cadence shown on the landing page.
export const SCHEDULE = [
  { day: 'Sun', title: 'Threat Radar', desc: 'What broke over the weekend and what to watch this week.', tier: 'root' },
  { day: 'Tue', title: 'Deep Dive', desc: 'One vulnerability or technique, taken apart end to end.', tier: 'root' },
  { day: 'Thu', title: 'The Brief', desc: 'The week distilled: top story, CVEs, and tooling. Free for everyone.', tier: 'all' },
]

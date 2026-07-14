# Insecure Mail

A weekly cybersecurity newsletter. It reads security RSS feeds, uses Gemini to
pick and write up the news, and emails a tight brief **three times a week**
(Sun / Tue / Thu). The Thursday edition is free; the rest — plus the full
newsletter archive — are a paid perk.

## Two tiers

| Tier | Name | Gets |
|---|---|---|
| Free | **Recon** | the Thursday "Brief" email |
| Paid | **Root Access** | all 3 editions + login to the full newsletter archive |

## Repo layout

```
Insecure-Mail/
├── frontend/            React + Vite + Tailwind landing page & member archive
├── supabase.md          step-by-step backend setup (DB, RLS, auth)
├── n8n.md               the automation workflows (RSS → Gemini → email)
├── figma-make-prompt.md a prompt to regenerate the UI in Figma Make, to compare
├── architecture.png     target production architecture
└── backend/             (empty — see "Backend choice" below; not used)
```

## Stack

- **Frontend:** React 19 + Vite + Tailwind v4. Hosted on Vercel.
- **Backend:** Supabase (Postgres + Auth + RLS). No custom server.
- **Automation:** n8n (RSS + Gemini + email), self-hosted (local now, DigitalOcean later).
- **Email:** Gmail SMTP (app password) for now → Resend once the domain is bought.
- **Payments:** Sellix / Helio → Root Access upgrade via webhook.

## Run the frontend

```bash
cd frontend
cp .env.example .env      # paste your Supabase URL + anon key (see supabase.md)
npm install
npm run dev               # http://localhost:5173
```

The landing page renders without any keys; subscribe/login/archive need Supabase
configured.

## Backend choice: Supabase (recommended)

This project uses **Supabase, not a custom Django/FastAPI backend.** The app is
mostly auth + gated content + a subscribers table, and n8n already does the heavy
lifting (scheduling, AI, email). Supabase gives you auth, Postgres, an instant
API, and row-level security with zero server to run — which matches the "keep it
simple" goal and the architecture diagram. The empty `backend/` folder is a
leftover from evaluating a Python backend and isn't used; it can be deleted.

See `supabase.md` and `n8n.md` for setup.

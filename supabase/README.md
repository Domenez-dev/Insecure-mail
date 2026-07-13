# supabase/

Version-controlled database for Insecure Mail. See the full walkthrough in
[`../supabase.md`](../supabase.md); this folder is the code form of it.

```
supabase/
├── config.toml                      # local dev + auth settings
├── seed.sql                         # sample rows for local dev only
├── migrations/
│   └── 20260713120000_init_schema.sql   # subscribers + newsletters + RLS
└── .gitignore
```

## Applying it

**If you linked the project with the CLI** (`supabase link --project-ref <ref>`):

```bash
supabase db push        # applies migrations/ to your linked project
```

**If you connected via the Supabase dashboard's GitHub integration:** merging
this folder to your production branch applies new files in `migrations/`
automatically — no manual step.

**Local development:**

```bash
supabase start          # spins up Postgres + Studio + Inbucket locally
supabase db reset       # re-applies migrations/ then runs seed.sql
```

## Already ran the SQL by hand?

If you already pasted the schema from `../supabase.md` into the dashboard SQL
editor, this migration is the same thing captured as a tracked file. It's
idempotent (`create table if not exists`, `drop policy if exists` before create),
so `db push` won't error on the existing objects — it just brings them under
version control.

## Notes

- `seed.sql` runs only locally. It makes `you@example.com` a fake active `root`
  member so `/archive` has content while you build. It never touches production.
- Auth users live in the `auth` schema (managed by Supabase) and can't be seeded
  from SQL — to test login locally, sign in via the app; the magic link lands in
  Inbucket at http://localhost:54324.
- The `service_role` key (used by n8n) bypasses RLS — keep it out of the
  frontend and out of git.

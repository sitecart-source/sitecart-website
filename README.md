# SITECART Website

Standalone Vite + React landing page for SITECART, deployed on Vercel.
Lead submissions go to a Vercel serverless function that emails the
SITECART team via [Resend](https://resend.com).

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
```

The lead form posts to `/api/sitecart-leads`, which only runs in the
Vercel build. To exercise the form end-to-end locally, install the
[Vercel CLI](https://vercel.com/docs/cli) and run:

```bash
npm install -g vercel
vercel dev           # serves the SPA + the serverless function together
```

## Production build

```bash
npm run build        # output: dist/
```

## Deployment (Vercel + GitHub)

This repo is wired so that **every push to `main` auto-deploys to Vercel**.

### 1. Create the GitHub repo

```bash
git init
git add .
git commit -m "Initial SITECART website build"
git branch -M main
git remote add origin https://github.com/<your-org>/sitecart-website.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to <https://vercel.com/new> and import the GitHub repo.
2. Framework preset: **Vite** (auto-detected).
3. Build command: `npm run build` · Output: `dist`.
4. Add the environment variables below.
5. Deploy.

Vercel will then auto-deploy on every push to `main`. Pull-request
branches get preview deployments automatically.

### 3. Required environment variables (Vercel project settings)

| Variable | What it is |
| --- | --- |
| `RESEND_API_KEY` | API key from <https://resend.com/api-keys> |
| `SITECART_LEAD_TO_EMAIL` | Inbox that receives lead notifications, e.g. `theslabstudios@outlook.com` |
| `SITECART_LEAD_FROM_EMAIL` | Verified Resend sender, e.g. `sitecart@yourdomain.com` |

The sender domain must be verified in Resend before production sends
will succeed. For initial smoke testing you can send from
`onboarding@resend.dev`.

## Updating the site

1. Edit files locally (or in Replit).
2. `git add . && git commit -m "..." && git push`.
3. Vercel auto-deploys within ~1 minute.

## What's NOT in this standalone

The original Replit monorepo version persists every lead in Postgres
and exposes a private `/admin` lead inbox. This standalone is
**email-only** by design (one less moving part to operate on Vercel).
If you ever need the lead history beyond your inbox, either:

- Add the leads to a Resend-friendly store (Vercel Postgres, Vercel KV,
  Supabase, Notion, Google Sheets) inside `api/sitecart-leads.ts`, or
- Keep the Replit deployment running in parallel and point the form
  there instead by changing the `fetch` URL in `src/App.tsx`.

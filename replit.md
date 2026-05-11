# SITECART

A landing page and early-access registration site for SITECART — a rugged, battery-powered, driveable mobile jobsite hub built for Australian tradespeople.

## Run & Operate

- Workflows manage both services automatically (sitecart frontend + api-server)
- `pnpm run typecheck` — full typecheck across all packages
- Required env for email submissions: `RESEND_API_KEY`, `SITECART_LEAD_TO_EMAIL`, `SITECART_LEAD_FROM_EMAIL`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Vite + React 19, Tailwind CSS v4, framer-motion, react-hook-form
- API: Express 5, Zod validation, Resend (email delivery)
- Build: esbuild (CJS bundle for api-server)

## Where things live

- `artifacts/sitecart/src/App.tsx` — entire landing page (hero, features, models, add-ons, ROI, specs, registration form)
- `artifacts/sitecart/src/index.css` — theme tokens (dark industrial, lime-green primary, Inter font)
- `artifacts/sitecart/src/assets/` — product images and logo
- `artifacts/sitecart/public/` — favicons, OG image, web manifest
- `artifacts/api-server/src/routes/sitecart-leads.ts` — lead submission endpoint with Zod validation, honeypot, duplicate detection, Resend email

## Architecture decisions

- No database — lead submissions are emailed via Resend rather than stored, keeping the stack minimal
- In-memory duplicate detection (24h window per email) — sufficient for a pre-launch landing page
- Single-page app with smooth scroll navigation — no client-side routing needed
- API endpoint preserved at `/api/sitecart-leads` (matches original Vercel function path)

## Product

- Hero section with product imagery and CTA buttons
- Problem / solution sections targeting Australian tradies
- Features grid, models comparison (Core / Pro / Custom), add-ons, ROI calculator, tech specs
- Early access registration form (name, business, trade, location, phone, email, model interest)
- Form submissions emailed to configured address via Resend

## Gotchas

- Email functionality requires three env vars: `RESEND_API_KEY`, `SITECART_LEAD_TO_EMAIL`, `SITECART_LEAD_FROM_EMAIL`
- Without those vars the API returns 503; the form will show an error but won't crash the frontend
- `SITECART_LEAD_FROM_EMAIL` must be a verified sender domain in your Resend account

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

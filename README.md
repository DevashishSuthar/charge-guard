# ChargeGuard

Recharge reminders for your family — mobile + broadband, one setup, notified before the due date.

## Stack
Next.js App Router (API routes only, no separate backend), Prisma 7, Postgres (Neon recommended), custom JWT auth (jose + bcryptjs), Serwist for PWA/service worker, web-push for browser notifications, Telegram Bot API as the optional second channel.

## 1. Local setup

```bash
npm install
```

`npm install` will try to run `prisma generate` automatically (see `postinstall` in package.json). If that fails here for any reason, run it manually — it needs real internet access to fetch Prisma's query engine binaries:

```bash
npx prisma generate
```

Copy the env template and fill in real values:

```bash
cp .env.example .env
```

## 2. Environment variables

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Create a free project at neon.tech, copy the pooled connection string |
| `AUTH_SECRET` | Any long random string, e.g. `openssl rand -base64 32` |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | Run `npx web-push generate-vapid-keys` |
| `TELEGRAM_BOT_TOKEN` | Message @BotFather on Telegram, `/newbot`, copy the token |
| `CRON_SECRET` | Any random string — protects `/api/cron/check-reminders` from being called by randoms |

## 3. Database

```bash
npx prisma migrate dev --name init
```

This creates the `User`, `RechargeItem`, and `PushSubscription` tables on Neon.

## 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000` — it redirects to `/login`. Sign up, then you land on the dashboard.

Note: the service worker (`disable: process.env.NODE_ENV === "development"` in `next.config.ts`) is turned off in dev to avoid stale-cache headaches. Push notifications only work in a production build:

```bash
npm run build && npm run start
```

## 5. Deploy to Vercel

1. Push to GitHub, import into Vercel.
2. Add all the env vars above in the Vercel project settings.
3. Deploy. `vercel.json` already configures the daily cron (9:00 AM IST) — Vercel adds the `Authorization: Bearer $CRON_SECRET` header automatically when it calls your cron route, matching what `check-reminders/route.ts` expects.
4. **Hobby plan note:** Vercel Cron on the free tier only supports daily granularity, which is exactly what this needs. If you upgrade later you can run it more often.

## What's real vs. what to build next
- Auth, CRUD, push, Telegram sending, and the cron reminder logic are fully wired and type-checked against Prisma 7's generated client shape.
- The Telegram *receiving* side (a bot that replies with the user's chat ID when they send `/start`) isn't included yet — right now users have to get their chat ID some other way (e.g. @userinfobot) and paste it into Settings. Worth adding a tiny webhook route (`/api/telegram/webhook`) later so the bot can reply with the ID itself, matching the onboarding copy already in Settings.
- Icons in `public/icons/` are placeholders generated for this scaffold — swap in real artwork before you'd want to actually install this as a home-screen app.

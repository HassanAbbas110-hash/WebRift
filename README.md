# WebRift website

The WebRift marketing site, with a quote builder, a saved/shareable quote page, a free health-check form, a small admin area, and an AI chat assistant.

## Run it on your computer

```
npm install
npm run dev
```

Then open http://localhost:3000. Copy `.env.example` to `.env.local` and fill it in (see below).

## Settings (environment variables)

| Name | What it does |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. Where quotes, leads and floors are stored. Optional locally. |
| `ADMIN_PASSWORD` | Password for `/admin/login`. |
| `SALES_PIN` | PIN the team types in sales mode (footer "Team"). |
| `AUTH_SECRET` | Secret used to sign login cookies. Make one with `openssl rand -base64 32`. |
| `AI_GATEWAY_API_KEY` | Key for the AI assistant. Not needed on Vercel if OIDC is enabled. |
| `CHAT_MODEL` | Optional. Which AI model the assistant uses. |
| `NEXT_PUBLIC_SITE_URL` | The public address of the site (e.g. `https://webrift.co.za`), used in links and sharing. |

Without `DATABASE_URL`, quotes and leads are kept in memory and lost on restart. That is fine for trying it out, not for real use.

## Changing prices

- **A price:** edit `src/data/catalogue.ts`, then redeploy.
- **A negotiable floor** (the lowest a salesperson may go): sign in at `/admin/login`, open the **Floors** tab, set or clear it. No redeploy needed.

## Sales mode

Click **Team** in the footer and enter the `SALES_PIN`. On the quote page a discount slider appears (never lower than the floor). Quotes saved this way show "Negotiated price". The public quote page never shows the client's name or phone.

## Deploy on Vercel

1. Push the code to GitHub and import the repo in Vercel.
2. In the project, add a Postgres database from the Vercel Marketplace (e.g. Neon). This sets `DATABASE_URL`.
3. Add the other environment variables above.
4. Create the tables once: `node scripts/migrate.mjs` (with `DATABASE_URL` set in your terminal).
5. For the AI assistant, set `AI_GATEWAY_API_KEY`, or enable OIDC on Vercel.

## Security notes

- Use a long `SALES_PIN` (8+ characters) and a strong `ADMIN_PASSWORD`. The login rate limit is per server instance, so it is not a hard guarantee.
- The chat has a rate limit of 30 messages per 10 minutes per IP, counted per server instance (so not a hard guarantee). The quote and lead endpoints have no rate limit of their own; see the checklist below.
- The AI assistant shows "offline" until the gateway key is set.

## Before go-live

- [ ] Set a spend limit on the AI Gateway (Vercel dashboard → AI Gateway).
- [ ] Add a Vercel Firewall rate-limit rule for `/api/*`.
- [ ] Set `DATABASE_URL` (without it, production pages that need the database show an error instead of keeping quotes and leads in memory) and run `node scripts/migrate.mjs`.

## Known limits / not yet verified

- Live AI answers have not been tested (no key during development).
- The Postgres path has not been tested against a real database.
- Not checked in Safari, Firefox or on a real phone.

## Turning the AI chat on

The chat button is hidden by default. To show it: add a card in Vercel > AI Gateway (set a spend limit too), add the environment variable `NEXT_PUBLIC_CHAT_ENABLED` with value `1` to the Vercel project, and redeploy.

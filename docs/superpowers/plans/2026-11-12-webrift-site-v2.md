# Webrift Site v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the new WebRift site: the full catalogue, a quote builder (printable, shareable on WhatsApp, with its own link), sales mode, an AI assistant that captures leads, and an admin page, all on Vercel.

**Architecture:** One Next.js App Router app. All prices come from a single typed catalogue file. A pure `computeQuote()` function is the only place quote maths happens; the client calls it for the live preview, and the server recomputes it on save, so totals sent by the client are never trusted. Quotes, leads and settings live in Postgres. Auth for sales mode and admin is an HMAC-signed cookie.

**Tech Stack:** Next.js 15 (App Router, TypeScript), Tailwind CSS v4, Motion, GSAP ScrollTrigger (scroll story only), AI SDK v6 + Vercel AI Gateway, `@neondatabase/serverless` Postgres, Vitest. Node 24.

**Spec:** `docs/superpowers/specs/2026-11-12-webrift-site-design.md` (source material is in `docs/source/`; `catalogue.txt` is the PDF as text).

## Global Constraints

- Prices are in ZAR, excluding VAT. Format them as `R14,800` (comma thousands, no decimals).
- Vape packs: Starter R4,000 + R500/mo (floor R3,500); Pro R7,000 + R650/mo; Complete R11,000 + R750/mo. Every other price comes from the catalogue's "WebRift suggested" figures.
- Year 1 = setup + 12 × monthly. Prepay = setup + 10 × monthly. Instalment = setup ÷ 3, rounded up to the nearest rand. Deposit = 50% of setup.
- The quote disclaimer, verbatim: "Estimate only. Prices in ZAR, excluding VAT and third-party costs. Prices may change; this quote is valid until {date}. Final price confirmed on order."
- Quotes are valid for 14 days. IDs look like `WR-2026-0142` (year, then a 4-digit sequence padded with zeros).
- No email sending. No payments. No WhatsApp Business API; WhatsApp links are `https://wa.me/27609658641?text=…`.
- Contact: WhatsApp 060 965 8641, phone 081 717 9974.
- POPIA: every form or chat step that stores a name or number needs an unticked consent checkbox (or an explicit "yes" in chat) and a link to `/privacy`.
- Never show a negotiable floor to a public visitor.
- Every animation respects `prefers-reduced-motion`. The hero falls back to a static gradient when reduced motion is on or `navigator.hardwareConcurrency <= 4`.
- Brand name in copy: "WebRift".
- Secrets: `DATABASE_URL`, `ADMIN_PASSWORD`, `SALES_PIN`, `AUTH_SECRET`, `AI_GATEWAY_API_KEY` (on Vercel, OIDC covers the gateway). Add all of them to `.env.example`.

## Review Focus

1. A client posts a quote with doctored totals or a discount below the floor → the server recomputes, clamps the discount to the floor, and stores the server's numbers (Task 4 test).
2. A quote is saved with nothing in it → rejected with 400 (Task 4 test).
3. A lead is posted without consent → rejected with 400, and nothing is stored (Task 4 test).
4. Someone opens an expired quote link → the page still shows, with an "Expired, ask for a new quote" banner, and the "go ahead" button is hidden (Task 6 test).
5. A quote has a pack plus an item already in that pack → the item shows as "Included" at R0 and is not charged twice (Task 3 test).
6. The sales/admin cookie is tampered with or forged → treated as logged out (Task 5 test).

---

## File Structure

```
src/
  data/catalogue.ts        products, packs, extras, terms, FAQ, cities (single source of truth)
  lib/quote.ts             computeQuote(), formatZAR(), quote text for WhatsApp
  lib/auth.ts              sign/verify cookie, role checks
  lib/db.ts                Postgres client + repo functions (quotes, leads, settings)
  lib/ai.ts                system prompt builder + tool definitions
  app/(site)/…             public pages
  app/q/[id]/page.tsx      saved quote (print + share)
  app/admin/…              admin
  app/api/quotes/route.ts  POST save quote
  app/api/leads/route.ts   POST lead (health check form)
  app/api/chat/route.ts    AI chat stream
  app/api/auth/route.ts    POST sales PIN / admin password, DELETE logout
  components/brand/        Logo, LogoMark (SVG)
  components/quote/        QuoteBuilder, QuoteSummary, PrintQuote
  components/chat/         ChatWidget
  components/fx/           HeroShader, ScrollStory, PhoneDemo/*, Timeline, CityMap, Reveal
  components/sections/     home page sections
db/schema.sql
tests/*.test.ts
```

---

### Task 1: Scaffold, brand and layout shell

**Files:**
- Create: the Next.js app (`npx create-next-app@15 . --ts --tailwind --app --src-dir --eslint --use-npm --yes`), `vitest.config.ts`, `.env.example`, `src/components/brand/Logo.tsx`, `src/components/brand/LogoMark.tsx`, `src/app/icon.svg`, `src/components/layout/{Nav,Footer,WhatsAppFab}.tsx`, `src/app/globals.css`
- Test: `tests/smoke.test.ts`

**Interfaces:**
- Produces: `<Logo className? variant?: 'full'|'mono' />` and `<LogoMark size? />`; the CSS tokens `--bg #070b1a`, `--panel`, `--cyan #22d3ee`, `--blue #3b82f6`, `--violet #7c3aed`, and `--grad` (cyan → blue → violet).

- [ ] Scaffold into the existing repo (keep `docs/` and `.gitignore`). Add `vitest`, `motion`, `gsap`, `ai`, `@ai-sdk/react`, `zod`, `@neondatabase/serverless`.
- [ ] Redraw the logo as hand-written SVG from `docs/source/logo-current.png`. The W is two overlapping rounded ribbons with gradient fills, inside four corner brackets, with 4 evenly spaced node pins. The wordmark "WebRift" uses the Space Grotesk font. Make a mono variant in `currentColor`.
- [ ] Build the layout: a sticky glass nav (Home, Services, Packs, Quote, About, Contact, plus a "Build a quote" CTA), a footer with contact details, quick links and `/privacy`, and a floating WhatsApp button. Load the Inter and Space Grotesk fonts via `next/font`.
- [ ] Smoke test: `expect(1).toBe(1)` runs. Then `npm run build` passes.
- [ ] Commit `feat: scaffold app, brand, layout`.

### Task 2: Catalogue data

**Files:**
- Create: `src/data/catalogue.ts`
- Test: `tests/catalogue.test.ts`

**Interfaces:**
- Produces:
```ts
type Category = 'storefront'|'found'|'design'|'retention'|'reports'|'control'
type Product = { id: string; num: number; name: string; category: Category; summary: string; why: string;
  includes: string[]; setup: number; monthly: number; market: {low:number;avg:number;high:number};
  marketMonthly?: {low:number;high:number;avg:number}; note?: string; vapeFit: 'Built for vape'|'High'|'Medium';
  adoption: number; rating: number; monthlyOnly?: boolean }
type Pack = { id: 'vape-starter'|'vape-pro'|'vape-complete'|'retail-starter'|'retail-online'|'repeat-combo';
  name: string; audience: 'VAPE SHOPS'|'ANY SHOP'|'ADD-ON COMBO'; tagline: string; blurb: string;
  setup: number; monthly: number; defaultFloor?: number; productIds: string[]; bonuses: {label:string; worth:number}[];
  marketY1: number; separatelyY1: number; popular?: boolean }
type Extra = { id: string; name: string; bestFor: string; setup: number; monthly: number; avg: number }
export const products: Product[]; packs: Pack[]; extras: Extra[]; terms: string[]; faq: {q:string;a:string}[]; cities: string[]
export const productById: (id: string) => Product | undefined
```
- Product ids, numbered 1–20 in catalogue order: `storefront, age-check, coil-finder, flavour-finder, click-collect, price-list, google-maps, profiles, domain-email, qr-stand, photography, posters, loyalty-card, vip-restock, review-manager, social-media, health-check, growth-report, stock-tracker, cash-up`. Extras: `booking-engine, social-videos, tv-menu, wifi-capture`.

- [ ] Write the tests: 20 products; 6 packs; 4 extras; vape-pro is `{setup:7000, monthly:650, marketY1:55650, separatelyY1:32920}`; vape-complete is `{setup:11000, monthly:750}`; vape-starter `defaultFloor === 3500`; every `pack.productIds` id resolves via `productById`; retail-online is `{setup:4000, monthly:800}`.
- [ ] Run them and confirm they fail.
- [ ] Fill in the data from `docs/source/catalogue.txt`. The pack contents come from the "WHAT'S INCLUDED" lists on pp.4–9. FAQ: the old site's 7 questions (`old-site-4.png`) plus the catalogue's "Questions owners ask" (p.3), with answers taken from the catalogue. Cities: the 8 on `old-site-3.png`.
- [ ] Run them and confirm they pass. Commit `feat: catalogue data`.

### Task 3: Quote engine

**Files:**
- Create: `src/lib/quote.ts`
- Test: `tests/quote.test.ts`

**Interfaces:**
- Consumes: Task 2 types.
- Produces:
```ts
type Payment = 'standard'|'instalments'|'prepay'
type QuoteInput = { packId?: Pack['id']; productIds: string[]; extraIds: string[]; payment: Payment;
  setupDiscount?: number; customLines?: {label:string; setup:number; monthly:number}[] }
type QuoteLine = { kind:'pack'|'product'|'extra'|'custom'|'discount'; id?: string; label: string; setup: number; monthly: number; included?: boolean }
type QuoteTotals = { lines: QuoteLine[]; setup: number; monthly: number; year1: number; prepayTotal: number;
  instalment: number | null; deposit: number; marketY1: number; saveVsMarket: number;
  bonuses: {label:string;worth:number}[]; payment: Payment; discountApplied: number }
computeQuote(input: QuoteInput, floors: Partial<Record<Pack['id'], number>>): QuoteTotals
formatZAR(n: number): string                  // 14800 -> "R14,800"
quoteWhatsAppText(id: string, t: QuoteTotals, url: string): string
```
- Rules: a product in the chosen pack becomes an `included` line at 0/0. `instalments` without a pack falls back to `standard`. The discount is clamped to `max(0, min(setupDiscount, pack.setup - floor))`, and is 0 when the pack has no floor (or there is no pack). Market Y1 = the pack's `marketY1`, plus for each loose product `market.avg + 12 × (marketMonthly?.avg ?? monthly)`, plus for each extra `avg`.

- [ ] Write the tests:
  - `{packId:'vape-pro', payment:'standard'}` gives setup 7000, monthly 650, year1 14800, prepayTotal 13500, deposit 3500, saveVsMarket 40850.
  - `vape-complete` with `instalments` gives year1 20000 and instalment 3667.
  - `vape-starter` with `setupDiscount:1000` and floors `{'vape-starter':3500}` gives discountApplied 500 and setup 3500.
  - `vape-pro` with `setupDiscount:500` and floors `{}` gives discountApplied 0.
  - `vape-starter` plus `productIds:['google-maps']` adds no extra setup, and that line has `included:true`.
  - `productIds:['qr-stand']` with `instalments` gives `payment === 'standard'` and `instalment === null`.
  - `formatZAR(14800) === 'R14,800'`.
- [ ] Run them and confirm they fail. Implement. Run them and confirm they pass. Commit `feat: quote engine`.

### Task 4: Database and save APIs

**Files:**
- Create: `db/schema.sql`, `src/lib/db.ts`, `src/app/api/quotes/route.ts`, `src/app/api/leads/route.ts`, `scripts/migrate.mjs`
- Test: `tests/api.test.ts` (it mocks `src/lib/db.ts` with `vi.mock`)

**Interfaces:**
- Schema: `quotes(id text pk, seq serial, created_at, valid_until date, input jsonb, totals jsonb, client_name, client_phone, shop_name, marketer, negotiated bool, status text default 'new')`, `leads(id uuid pk, created_at, source text ('chat'|'health-check'|'quote'), name, phone, shop, summary, intent int, transcript jsonb, consent bool not null, status text default 'new')`, `settings(key text pk, value jsonb)`.
- Produces: `createQuote(input: QuoteInput, totals: QuoteTotals, meta): Promise<{id:string; validUntil:string}>`, `getQuote(id)`, `listQuotes()`, `createLead(l)`, `listLeads()`, `updateStatus(table, id, status)`, `getFloors(): Promise<Partial<Record<Pack['id'],number>>>` (merges the DB value over each pack's `defaultFloor`), `setFloor(packId, n)`.
- The ID comes from the sequence: `` `WR-${year}-${String(seq).padStart(4,'0')}` ``.
- POST `/api/quotes` body: a zod-validated `{input, client?:{name,phone,shop,consent}}`. The server calls `computeQuote(input, await getFloors())`. `setupDiscount` and `customLines` are only honoured when the sales cookie is valid (Task 5); otherwise they are stripped. Returns `{id, url}`.

- [ ] Write the tests: a tampered body `{input:{packId:'vape-pro',payment:'standard'}, totals:{setup:1}}` stores totals with setup 7000; an empty quote (no pack, products or extras) returns 400; a lead with `consent:false` returns 400 and `createLead` is not called; `setupDiscount:3000` without the sales cookie stores discountApplied 0.
- [ ] Run them and confirm they fail. Implement. Run them and confirm they pass.
- [ ] Shortcut: when `DATABASE_URL` is unset, `db.ts` uses an in-memory Map so local dev works; it is lost on restart. Upgrade once the Marketplace DB is linked.
- [ ] Commit `feat: quote and lead persistence`.

### Task 5: Auth, sales mode and admin

**Files:**
- Create: `src/lib/auth.ts`, `src/app/api/auth/route.ts`, `src/app/admin/page.tsx`, `src/app/admin/login/page.tsx`, `src/app/admin/actions.ts`, `src/components/quote/SalesModeToggle.tsx`
- Test: `tests/auth.test.ts`

**Interfaces:**
- Produces: `sign(role:'sales'|'admin', ttlDays:number): string`, `verify(token?:string): 'sales'|'admin'|null` (HMAC-SHA256 with `AUTH_SECRET`, compared with `timingSafeEqual`, with expiry), `getRole(): Promise<Role|null>` (reads the `wr_auth` httpOnly cookie). Admin also counts as sales.
- POST `/api/auth` `{kind:'sales', pin}` or `{kind:'admin', password}` sets the cookie (sales: 30 days, admin: 7 days). DELETE clears it. Five wrong tries per IP in 15 minutes return 429. Shortcut: the try counter is in memory per instance; move it to the DB if it gets abused.
- Admin page: tabs for Quotes, Leads and Floors. Each row has a status select (new / contacted / won / lost) and a "Message on WhatsApp" link; chat leads expand to show the transcript. The Floors form edits vape-pro and vape-complete (and can override vape-starter).

- [ ] Write the tests: verify(sign('admin',7)) returns 'admin'; a token with one character changed returns null; an expired token (fake timers +8 days) returns null; verify(undefined) returns null.
- [ ] Run them and confirm they fail. Implement. Run them and confirm they pass. Commit `feat: sales mode and admin`.

### Task 6: Quote builder, saved quote, print and share

**Files:**
- Create: `src/app/(site)/quote/page.tsx`, `src/components/quote/{QuoteBuilder,QuoteSummary,PrintQuote}.tsx`, `src/app/q/[id]/page.tsx`, `src/app/print.css`
- Test: `tests/quote-page.test.ts` (it tests `quoteStatus(validUntil: string, now: Date): 'valid'|'expired'`, exported from `src/lib/quote.ts`)

**Interfaces:**
- The builder reads the URL params `?pack=vape-pro&p=google-maps,qr-stand&x=…&pay=prepay`, so the quiz, the chat and "Add to quote" buttons can deep-link into it. Builder state lives in the URL; that is the only state.
- Flow: step 1 choose a pack (or "build my own"); step 2 add products and extras (grouped by category; items in the pack show as "Included"); step 3 payment option; step 4 your details (optional, with consent) and Save. The summary is sticky on desktop and a bottom sheet on mobile, and the numbers count up as they change.
- In sales mode: a discount slider (0 up to setup − floor, hidden when there is no floor), a custom line form, a marketer name field (stored in localStorage), and the label "Negotiated price".
- `/q/[id]` shows logo, ID, date, valid until, lines, totals, the payment plan, bonuses, the terms list and the disclaimer. Buttons: Print (`window.print()`), Send on WhatsApp (`wa.me/?text=`), Copy link, and "I want to go ahead" (`wa.me/27609658641?text=` with the ID). Expired quotes show the banner and hide "go ahead". `print.css` hides the nav, footer, chat and buttons, and lays the quote out on A4.

- [ ] Write the tests: `quoteStatus('2026-11-26', new Date('2026-11-26T20:00'))` returns 'valid'; `quoteStatus('2026-11-26', new Date('2026-11-27T00:01'))` returns 'expired'.
- [ ] Run them and confirm they fail. Implement. Run them and confirm they pass.
- [ ] Manual check in the browser: build the Vape Pro quote, save it, open `/q/…`, and the print preview is a clean one-page A4.
- [ ] Commit `feat: quote builder and shareable quotes`.

### Task 7: Pages and content

**Files:**
- Create: `src/app/(site)/page.tsx`, `services/page.tsx`, `packs/page.tsx`, `health-check/page.tsx`, `about/page.tsx`, `contact/page.tsx`, `privacy/page.tsx`, `src/components/sections/*`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/seo/JsonLd.tsx`

- [ ] Home, in order: Hero → "Everything a local shop needs online" (6 category tiles) → featured packs (Vape Pro highlighted, and a "Pricing negotiable on packs, chat to us" note) → the "Which pack fits me?" quiz (4 questions: shop type, has a website?, main headache, budget; result deep-links to `/quote`) → live demos (Task 8) → the scroll story → WebRift vs DIY/agency/freelancer (p.23 table plus an animated bar chart) → how we deliver timeline (p.24) → cities → FAQ accordion → final CTA.
- [ ] Services: category filter chips; product cards with an expandable detail (why, includes, market low/avg/high as a small range bar, suggested price, "Add to quote" deep-link); the optional extras table marked "Quote on request".
- [ ] Packs: 6 pack cards (included items, bonuses, Year 1, "You save", instalment and prepay figures from `computeQuote`), the comparison table and the savings table, all computed from the catalogue rather than hard-coded.
- [ ] Health check: the sample report from p.22 with animated gauges, and a form (shop name, area, name, WhatsApp, consent) → POST `/api/leads` source 'health-check' → success screen with a WhatsApp button.
- [ ] About (story, vape focus and compliance notes from p.13, team placeholder cards), Contact, and Privacy (POPIA notice: what is collected, why, retention, contact for deletion).
- [ ] SEO: per-page metadata, an OG image (`opengraph-image.tsx`), a sitemap, and JSON-LD for `LocalBusiness` and `FAQPage`.
- [ ] `npm run build` passes. Commit `feat: site pages`.

### Task 8: Motion and "wow" layer

**Files:**
- Create: `src/components/fx/{HeroShader,ScrollStory,Reveal,Timeline,CityMap,Counter,MagneticButton,TiltCard}.tsx`, `src/components/fx/demos/{PhoneFrame,CoilFinder,FlavourFinder,LoyaltyCard,AgeGate}.tsx`

- [ ] HeroShader: a raw WebGL fragment shader (flowing gradient noise in the brand colours, which follows the pointer or device tilt), paused when off-screen. It falls back to a CSS gradient under the Global Constraints rule. The logo mark draws itself in (SVG stroke-dash), then the headline reveals word by word.
- [ ] ScrollStory (GSAP ScrollTrigger, pinned): a messy WhatsApp thread turns into a tidy order card ("2× Coil 0.4Ω, 1× Mango Ice 30ml, Collect 15:00, ID required").
- [ ] Phone demos with tabs: CoilFinder (brand → model → compatible coils/pods with "Order on WhatsApp"); FlavourFinder (5 questions → 3 picks); LoyaltyCard (tap to stamp, the 10th stamp shows a reward); AgeGate (the 18+ modal). All use sample data.
- [ ] Reveal-on-scroll, count-up counters, the timeline line drawing, a CityMap (a simplified SVG outline of South Africa with pulse dots for the 8 cities), magnetic CTAs and tilt/glow cards. Route transitions use Motion.
- [ ] Manual check: with Chrome DevTools at 4× CPU throttle on mobile size, scrolling stays smooth. With reduced motion turned on, nothing animates and all content is visible.
- [ ] Commit `feat: motion and live demos`.

### Task 9: AI assistant

**Files:**
- Create: `src/lib/ai.ts`, `src/app/api/chat/route.ts`, `src/components/chat/ChatWidget.tsx`
- Test: `tests/ai.test.ts`

**Interfaces:**
- Produces: `buildSystemPrompt(): string` (role, rules, and a compact rendering of every product, pack, extra, term, FAQ and compliance note; it never includes floors) and `tools` = `recommendPack({shopType, budget, needs}) -> {packId, reason, quoteUrl}`, `openQuote({packId?, productIds?, payment?}) -> {quoteUrl}`, `saveLead({consent:true, name, phone, shop?, summary, intent:1-5}) -> {ok, whatsappUrl}` (the zod schema requires `consent` to be the literal `true`; the route attaches the transcript from the request messages).
- Route: `streamText` with model `'anthropic/claude-haiku-5-5'` through the AI Gateway, using the tools above, `stopWhen` at 5 steps, and prompt caching on the system prompt. A message is capped at 1,000 characters and a conversation at 40 messages. Rate limit: 30 requests per IP per 10 minutes (an in-memory shortcut; same upgrade note as Task 5).
- Rules in the prompt: answer only from the catalogue; quote prices as "from" and say "estimate, excl. VAT"; never invent discounts; offer to save the chat only after buying intent, and ask "Can I pass this chat to the WebRift team so they can follow up?" before calling `saveLead`; give no legal advice beyond the catalogue's compliance notes.
- Widget: a floating button (above the WhatsApp FAB), streamed messages, suggested starter chips, tool results rendered as cards (a pack card with "Open quote", and a lead-saved card with "Send to WebRift on WhatsApp"), history in `sessionStorage`, and a privacy note in the footer.

- [ ] Write the tests: `buildSystemPrompt()` contains every product name and "R14,800", and does not contain "3500" or "floor"; the `saveLead` input schema rejects `{consent:false,…}` and accepts `{consent:true, name:'A', phone:'0600000000', summary:'x', intent:4}`.
- [ ] Run them and confirm they fail. Implement. Run them and confirm they pass.
- [ ] Manual check (needs `AI_GATEWAY_API_KEY` or `vercel env pull`): ask "what's in Vape Pro?" and get correct prices; "I want it, I'm Sam from Cloud 9 Vapes" leads to a consent question, then the lead appears in `/admin`.
- [ ] Commit `feat: AI assistant with lead capture`.

### Task 10: Verify and ship-ready

- [ ] `npx vitest run`: all pass. `npm run lint` and `npm run build`: no errors.
- [ ] Browser pass at 375px and 1440px over every page, plus the full flow: quiz → quote → save → `/q` → print preview → WhatsApp link. Check the console for errors.
- [ ] Write a `README.md`: how to run locally, the env vars, how to change a price (`src/data/catalogue.ts`), how to deploy (`vercel`, link the Marketplace Postgres, run `node scripts/migrate.mjs`).
- [ ] Commit `chore: readme and verification`. Push once the GitHub remote exists.

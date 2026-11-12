# Webrift Site v2 — Design

Date: 2026-11-12 · Status: draft, awaiting owner approval

## Intent and the why

Webrift has grown from a website builder into a digital-tools company for local South African shops: 20 products in 6 categories, 6 packs, optional extras, health checks, monthly reports and shop-control tools. More than 60% of clients are vape shops. The old site (dark theme, blue-to-violet gradient, particle hero, "We Build Websites That Sell") only sells websites.

The new site has to do two jobs:

1. **Self-serve:** a shop owner lands on the site, understands what Webrift offers, builds their own quote, and prints it or sends it on WhatsApp.
2. **Sales tool:** the marketer opens the same site on a phone or tablet in front of the owner, walks through it, and builds a quote live, with the option to negotiate within set limits.

It should look and move better than the old site: animated, premium, and clearly a level up.

## Goals

- Show the full catalogue (20 products, 6 packs, optional extras) so it is easy to browse and compare.
- A quote builder that is printable, shareable on WhatsApp, has its own link, and states clearly that prices may change.
- An AI assistant that answers questions from the catalogue, can start a quote, and saves the conversation as a lead when the person is a serious prospect.
- A private admin page where the owner sees saved quotes and leads.
- Fast on mid-range Android phones over mobile data. Most visitors are on mobile.

## Non-goals (v1)

- **No email sending** (owner's decision). Leads reach Webrift through the admin page and a WhatsApp hand-off (below).
- No online payments or checkout. Deposits are handled the way they are today.
- No client accounts or logins for shop owners.
- No editing prices from the admin page in v1. Prices live in one data file in the code (see Catalogue data).
- No automated WhatsApp Business API messages (it costs money and needs Meta approval).

## Anti-goals (a failure even if it works)

- Heavy animation that makes the site slow or janky on cheap phones.
- A quote that reads like a binding contract, or that shows a price the owner did not set.
- A chatbot that invents prices, products or promises that are not in the catalogue.
- Saving someone's chat or phone number without their clear opt-in (POPIA).
- Copy or tools that promote vape products themselves. Webrift markets services *to* vape shops; it does not advertise vapes.

## Constraints

- Hosting: **Vercel** (owner's decision).
- Prices in ZAR, excluding VAT. Third-party costs (domain, mailboxes, WhatsApp fees, print runs) are extra.
- Terms from the catalogue: 50% deposit, or setup in 3 instalments on packs; monthly plans billed in advance with a 6-month minimum, then 30 days' notice; prepay 12 months and get 2 free; up to 5 free edits a month on packs (about 15 min each, no roll-over), extra edits R120.
- POPIA: any form or chat that collects a name or number needs opt-in consent and a link to a privacy notice.
- Vape compliance notes from catalogue p.13 stay true on the site: the 18+ check is self-declaration only; no vape ad management; content is not legal advice.
- Contact details (from the old site): WhatsApp 060 965 8641, phone 081 717 9974, plus the owner's email.

## Pricing (source of truth for v1)

### Vape packs: new prices from the owner

| Pack | Setup | Negotiable floor | Monthly | Year 1 (setup + 12 mo) | Prepay 12 mo, 2 free (setup + 10 mo) | 3 instalments |
|---|---|---|---|---|---|---|
| 1 Vape Starter | R4,000 | R3,500 | R500 | **R10,000** | R9,000 | 3 × R1,333 |
| 2 Vape Pro (most popular) | R7,000 | not set | R650 | **R14,800** | R13,500 | 3 × R2,333 |
| 3 Vape Complete | R11,000 | not set | R750 | **R20,000** | R18,500 | 3 × R3,667 |

The 13,350 and 16k figures in the owner's message were the old year-1 totals. The totals above are recalculated on the new setup prices.

Recalculated savings (market and "bought separately" figures from catalogue p.11):

| Pack | Market Y1 | Separately Y1 | Pack Y1 | Save vs market | Save vs separately |
|---|---|---|---|---|---|
| Vape Starter | R25,600 | R16,110 | R10,000 | R15,600 | R6,110 |
| Vape Pro | R55,650 | R32,920 | R14,800 | R40,850 | R18,120 |
| Vape Complete | R86,150 | R53,810 | R20,000 | R66,150 | R33,810 |

Pack copy that changes: "Setup is R7,200 lower (51% off)" for Vape Pro (R14,200 separately vs R7,000) and "Setup is R7,650 lower (41% off)" for Vape Complete (R18,650 vs R11,000). Vape Starter is unchanged (R2,750 lower, 41%). The monthly-saving lines are unchanged.

### Everything else: unchanged from the catalogue

- Retail Starter R2,200 + R250/mo; Retail Online Shop R4,000 + R800/mo; Repeat Combo R2,900 + R350/mo.
- The 20 single products use the "WebRift suggested" setup and monthly prices from their product cards (pp.14–20), including notes such as "vape edition +R700" and "R1,000 per platform; WhatsApp Business adds R500".
- Optional extras (p.21) use their suggested prices and are marked "quote on request".
- Market low/avg/high stays on each product card as a "typical market" comparison.

## Approaches considered

1. **Next.js (React) on Vercel + Postgres + AI SDK (chosen).** A single app covers the static marketing pages, the interactive quote builder, the streaming chat, quote links (`/q/[id]`) and an admin page. It runs natively on Vercel, has the best animation libraries available, and the server routes keep the AI key and database off the client.
2. **Astro with React islands.** It ships less JavaScript on the marketing pages. But this site is mostly interactive (quote builder, chat, demos, admin), so the islands add complexity with little gain.
3. **Plain HTML/JS like a typical one-page site.** The cheapest to start, but quotes with their own links, a saved-leads admin and a server-side AI key need a backend anyway. It would end up as a second project glued on.

The owner handed over the technical choices, so option 1 is the builder's call, not an owner decision.

## Design

### Brand

- **Logo:** a polished SVG redraw of the current mark: the "W" made of overlapping ribbons inside corner brackets, with small node/pin details. Use cleaner geometry, a cyan → blue → violet gradient, fewer and evenly spaced nodes, and a crisp wordmark "WebRift" in a geometric sans. Deliver a full logo, a mark-only icon (favicon and app icon) and a one-colour version for print. Drop the garbled small text from the source image.
- **Look:** keep the dark navy base and the cyan-to-violet gradient from the old site so it stays recognisable. Take a more editorial layout with bigger type, more depth (glass panels, soft glows, grain) and less clutter than the old particle field.
- **Brand name in copy:** "WebRift" (matches the catalogue).

### Site map

- **Home:** hero → "what we do" across the 6 categories → featured packs → "Which pack fits me?" quiz → live product demos → WebRift vs agency/freelancer/DIY → how we deliver (Day 0 → Month 2+) → cities we serve → FAQ → call to action.
- **Services** (`/services`): the full catalogue with category filters. Each product card shows what it is, why shops buy it, what's included, the suggested price, typical market low/avg/high, and "Add to quote".
- **Packs** (`/packs`): the 6 packs, the side-by-side comparison table, and the savings table.
- **Quote builder** (`/quote`).
- **Saved quote** (`/q/[id]`): read-only, printable, shareable.
- **Free Health Check** (`/health-check`): a request form and the sample report.
- **About** (`/about`): the story, the team, the vape focus, and how we work.
- **Contact** (`/contact`): WhatsApp, phone, email, cities.
- **Privacy** (`/privacy`): the POPIA notice.
- **Admin** (`/admin`): private.

### Quote builder

- Start from a pack or from scratch; add single products and extras; packs and items can be mixed. If an item is already in the chosen pack, it shows as "included" and is not charged twice.
- Choose the payment option: standard (50% deposit), setup in 3 instalments (packs only), or prepay 12 months with 2 free.
- A live summary shows once-off setup, monthly, year-1 total, "you save vs typical market", the free bonuses included, and the first month's amount due.
- On save, the quote gets an ID such as `WR-2026-0142`, a valid-until date (14 days), and a link at `/q/[id]`. It is stored in the database.
- **Print:** an A4 print stylesheet with logo, quote number, date, line items, totals, terms and the disclaimer. Browser "Save as PDF" covers PDF output, so no PDF library is needed in v1.
- **Share:** a "Send on WhatsApp" button opens `wa.me` with a short text summary and the quote link. A second button sends the quote to WebRift's own WhatsApp number to say "I want to go ahead".
- **Disclaimer on every quote:** "Estimate only. Prices in ZAR, excluding VAT and third-party costs. Prices may change; this quote is valid until [date]. Final price confirmed on order."

### Sales mode (for the marketer)

- A PIN-protected toggle (PIN stored as a server secret) switches the site into sales mode on that device.
- In sales mode the marketer can apply a discount to a pack's setup, but never below its floor (Vape Starter floor R3,500; packs without a floor cannot be discounted until the owner sets one). The marketer can also add a custom line item with a note, and attach the client's shop name and number with their consent.
- Negotiated quotes are marked "Negotiated price" and carry the marketer's name.
- Public visitors only ever see "pricing negotiable on packs, chat to us". They never see the floor itself.

### AI assistant

- A floating chat button on every page, opening a full panel on mobile.
- It runs on Claude through the Vercel AI SDK and AI Gateway, with the catalogue data, terms, FAQ and compliance notes in its context. It must answer only from that material and say "let me get the team to confirm" when unsure. It never quotes a negotiated price.
- **Tools it can call:** recommend a pack; open the quote builder pre-filled; and save a lead.
- **Lead capture:** when the chat shows buying intent (shop name, budget, timeline, asks for a quote or a call), the bot asks permission: "Can I pass this chat to the WebRift team so they can follow up?" Only on a yes does it ask for a name and WhatsApp number, then save the lead (name, number, shop, a short summary, an intent score, the full transcript) to the database. The visitor then gets a "Send to WebRift on WhatsApp" button with the summary prefilled.
- Chat memory within a visit is kept in the browser. Nothing is stored on the server unless the visitor agrees.
- Basic abuse limits: a rate limit per visitor and a cap on message length.

### "Wow" layer (animations and interactive pieces)

- **Hero:** the polished logo builds itself in, with a soft animated gradient/shader background that reacts to the cursor or tilt, plus the headline (new positioning beyond "websites"). On low-end devices and with reduced motion turned on, it falls back to a static gradient.
- **Scroll story:** a messy WhatsApp chat turns into a tidy click-and-collect order as the user scrolls.
- **Live demos in a phone frame:** a working Coil & Pod Finder, Flavour Finder quiz, loyalty card being stamped, and the 18+ gate, all with sample data, so owners try the product before buying.
- Animated counters, a savings bar chart (Webrift vs agency/freelancer/DIY), a Health Check sample report with animated gauges, a delivery timeline that draws as it scrolls into view, and a map of the cities we serve with pulse markers.
- Smooth page transitions, magnetic buttons, and cards that tilt or glow on hover. All motion respects `prefers-reduced-motion`.

### Admin

- Password-protected (a server secret plus a signed cookie). It is only for the owner and marketer.
- Lists quotes and leads, newest first, with status (new / contacted / won / lost), the transcript for chat leads, and a "Message on WhatsApp" button.
- Sets the negotiable floors for packs 2 and 3.

### Catalogue data

- All products, packs, prices, terms and FAQ live in one typed data file in the repo. The pages, the quote maths, the print layout and the AI's context all read from it, so a price change happens in one place followed by a redeploy.
- Quote maths has unit tests covering pack totals, prepay, instalments, the "included in pack" de-duplication, and the discount floor.

### Tech (builder's calls)

- Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Vercel.
- Motion for UI animation; GSAP ScrollTrigger for the scroll story only; a lightweight canvas/WebGL shader for the hero.
- AI SDK + Vercel AI Gateway with a current Claude model.
- Postgres from the Vercel Marketplace (Neon or Supabase) for quotes, leads and settings.
- GitHub repo `webrift`, private.

### SEO

- Keep the old site's local-SEO content: city pages, FAQ ("How much does a website cost in South Africa?" and so on), meta tags, Open Graph images, a sitemap, and LocalBusiness/FAQ structured data.

## Left to the builder

- Exact page copy, section order within pages, and the animation details.
- Choice of Neon or Supabase, and of Claude model tier, within cost.
- Sample data for the live demos.
- Rate-limit numbers and the shape of the quote ID counter.

## Source material (in the repo)

- `docs/source/WebRift_Product_Catalogue_2026_Finalized.pdf` and its text dump `docs/source/catalogue.txt`: the products, packs, inclusions, bonuses, terms, FAQ and compliance notes. The pricing above overrides the PDF for the three vape packs.
- `docs/source/logo-current.png`: the logo to polish.
- `docs/source/old-site-1..6.png`: screenshots of the old site (hero, why us, cities and services, FAQ, CTA and footer, comparison).

## Calls made by the designer (owner can override)

- **Mixed quotes:** if the quote contains a pack, the 3-instalment option covers the *whole* once-off setup. Prepay 12 months with 2 free applies to the whole monthly total. Single items bought without a pack get standard terms only (50% deposit).
- **Floors:** stored in the database settings table and edited on the admin page. Vape Starter is seeded at R3,500, and packs 2 and 3 start empty, which means no discount. A discounted setup flows through to the instalments, the year-1 total and the savings figures.
- **Sales vs admin access:** two separate secrets. The sales PIN unlocks sales mode on a device, and the marketer types their name once on that device (stored locally). The admin password opens `/admin`. No per-user accounts in v1.

## Open questions for the owner

- Domain: what is the old site's domain, and does v2 replace it there? Do old URLs need redirects?
- AI budget: what is the monthly ceiling for chat costs?

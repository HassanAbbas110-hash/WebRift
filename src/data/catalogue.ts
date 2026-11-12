// Single source of truth for prices, products and packs. ZAR, excl. VAT.
// Source: WebRift Product & Service Catalogue 2026/27 (v4), with owner overrides for the vape packs.
// adoption is a percentage (90 = 90%); rating is the catalogue's out-of-10 score.

export type Category = "storefront" | "found" | "design" | "retention" | "reports" | "control";

export type Product = {
  id: string;
  num: number;
  name: string;
  category: Category;
  summary: string;
  why: string;
  includes: string[];
  setup: number;
  monthly: number;
  market: { low: number; avg: number; high: number };
  marketMonthly?: { low: number; high: number; avg: number };
  note?: string;
  vapeFit: "Built for vape" | "High" | "Medium";
  adoption: number;
  rating: number;
  monthlyOnly?: boolean;
};

export type Pack = {
  id: "vape-starter" | "vape-pro" | "vape-complete" | "retail-starter" | "retail-online" | "repeat-combo";
  name: string;
  audience: "VAPE SHOPS" | "ANY SHOP" | "ADD-ON COMBO";
  tagline: string;
  blurb: string;
  setup: number;
  monthly: number;
  defaultFloor?: number;
  productIds: string[];
  bonuses: { label: string; worth: number }[];
  marketY1: number;
  separatelyY1: number;
  popular?: boolean;
};

export type Extra = { id: string; name: string; bestFor: string; setup: number; monthly: number; avg: number };

export const products: Product[] = [
  {
    id: "storefront", num: 1, name: "Website Storefront", category: "storefront",
    summary: "A fast mobile website that works as the shop's online store. Customers browse products, add to a cart and send the order straight to the shop's WhatsApp.",
    why: "Customers stop scrolling through photos on WhatsApp, orders arrive complete and tidy, and the shop sells while the owner is busy. No card machine and no checkout fees.",
    includes: ["Up to ~100 products loaded", "Cart + WhatsApp order button", "Mobile-first, fast design", "Stock badges and deals", "Hosting included", "Easy price and stock updates"],
    setup: 3500, monthly: 500,
    market: { low: 4500, avg: 7000, high: 9500 }, marketMonthly: { low: 350, high: 850, avg: 600 },
    note: "Vape edition +R700. Monthly: hosting and support. Edits R120 each (free in packs).",
    vapeFit: "High", adoption: 90, rating: 10,
  },
  {
    id: "age-check", num: 2, name: "18+ Age Check & Compliance Setup", category: "storefront",
    summary: "A pop-up that asks visitors to confirm they are 18 or older, a tick-box at checkout, and consent wording on sign-up forms, with an 'ID required at collection or delivery' line on every order message.",
    why: "It shows the shop takes under-18 sales seriously, keeps consent records tidy and makes marketing messages POPIA-friendly. It is a self-declaration, not proof of age, so real ID checks still happen at the counter or the door.",
    includes: ["18+ entry pop-up", "Checkout age confirmation", "POPIA consent wording", "ID reminder in every order", "Print-ready counter signs"],
    setup: 600, monthly: 100,
    market: { low: 400, avg: 950, high: 1500 }, marketMonthly: { low: 100, high: 250, avg: 200 },
    note: "Small fee: it takes real set-up and testing. Not legal advice: have an attorney confirm the wording.",
    vapeFit: "Built for vape", adoption: 90, rating: 9,
  },
  {
    id: "coil-finder", num: 3, name: "Coil & Pod Finder", category: "storefront",
    summary: "The customer picks their device (brand, then model) and instantly sees the coils, pods and juices that fit it, each with an Order on WhatsApp button.",
    why: "'What fits my device?' is the most common counter question. The finder answers it 24/7, cuts wrong-coil returns and sells accessories the customer didn't know they needed.",
    includes: ["Device-to-coil lookup", "Up to ~150 products loaded", "Order button on every result", "Works on any phone", "Easy to update"],
    setup: 1600, monthly: 160,
    market: { low: 1500, avg: 2500, high: 3500 }, marketMonthly: { low: 150, high: 400, avg: 300 },
    note: "Add-on to the Website Storefront.",
    vapeFit: "Built for vape", adoption: 70, rating: 8.5,
  },
  {
    id: "flavour-finder", num: 4, name: "Flavour Finder", category: "storefront",
    summary: "A 5-question quiz (fruity, menthol, dessert, nicotine strength, device type) that recommends 3 products and records what customers ask for.",
    why: "New customers get a confident pick instead of guessing, slow-moving flavours get pushed, and the shop learns which flavours people ask for but can't find.",
    includes: ["5-question quiz", "3 product picks", "Order button on results", "Answers saved to a sheet"],
    setup: 1050, monthly: 110,
    market: { low: 900, avg: 1700, high: 2500 }, marketMonthly: { low: 100, high: 300, avg: 200 },
    note: "Add-on to the Website Storefront.",
    vapeFit: "Built for vape", adoption: 65, rating: 8,
  },
  {
    id: "click-collect", num: 5, name: "Click & Collect / Local Delivery", category: "storefront",
    summary: "Customers choose collect or delivery, pick their area (with delivery fee) and see an 'ID required at handover' note. The shop gets a clean order message and can send status updates.",
    why: "It turns messy WhatsApp ordering into tidy orders with the address, fee and time already filled in, so there are fewer mistakes and fewer back-and-forth messages.",
    includes: ["Collect or deliver choice", "Delivery areas and fees", "Clean order message", "Order log sheet", "Status update messages"],
    setup: 1700, monthly: 260,
    market: { low: 1500, avg: 2750, high: 4000 }, marketMonthly: { low: 200, high: 600, avg: 400 },
    note: "Monthly covers hosting, order log and support.",
    vapeFit: "Built for vape", adoption: 70, rating: 8.5,
  },
  {
    id: "price-list", num: 6, name: "Price-List Page (mini site)", category: "storefront",
    summary: "A single clean page with the shop's products and prices and a WhatsApp order button, without the full cart. Quick to build and easy to update from a phone.",
    why: "A low-cost first website for tiny shops that can't afford a full storefront yet. It beats sending the same price screenshot to every customer, and it can be upgraded to a storefront later.",
    includes: ["One mobile page", "Products and prices", "WhatsApp order button", "Hours and map link", "Your own link and QR"],
    setup: 1600, monthly: 260,
    market: { low: 1500, avg: 2500, high: 3500 }, marketMonthly: { low: 250, high: 650, avg: 450 },
    note: "Good entry product for the smallest shops.",
    vapeFit: "Medium", adoption: 80, rating: 8.5,
  },
  {
    id: "google-maps", num: 7, name: "Google Maps & Local Listings", category: "found",
    summary: "We claim and verify the shop on Google Maps, set the correct pin, hours, categories, photos and keywords, and add it to Apple Maps, Bing and key local directories.",
    why: "People searching 'vape shop near me' tap the top Google results. A verified, complete profile puts the shop in front of walk-in customers with no ad spend.",
    includes: ["Google profile claimed and verified", "Pin, hours and categories", "Photos and keywords", "Apple Maps and Bing listings", "Local directory clean-up"],
    setup: 1350, monthly: 130,
    market: { low: 1200, avg: 1850, high: 2500 }, marketMonthly: { low: 150, high: 300, avg: 250 },
    note: "Optional ongoing rank management: about R450/mo.",
    vapeFit: "High", adoption: 85, rating: 9.5,
  },
  {
    id: "profiles", num: 8, name: "Social & WhatsApp Profile Setup", category: "found",
    summary: "We create and polish the shop's business profiles on Facebook, Instagram, TikTok and WhatsApp Business: name, bio, logo and cover images, contact links, opening hours, quick replies and a simple starter content plan.",
    why: "Customers look a shop up on social before they visit. A professional, consistent profile builds trust, and WhatsApp quick replies save the owner typing the same answers all day.",
    includes: ["Profile creation and branding", "Bio, logo and cover images", "Links to site and WhatsApp", "WhatsApp greeting and quick replies", "Starter content plan"],
    setup: 1000, monthly: 0,
    market: { low: 800, avg: 1400, high: 2000 },
    note: "R1,000 per platform; WhatsApp Business setup adds R500. Vape shops: information pages only, no sales content or ads (platform rules).",
    vapeFit: "Medium", adoption: 80, rating: 8,
  },
  {
    id: "domain-email", num: 9, name: "Domain, Hosting & Business Email", category: "found",
    summary: "We register the shop's own web address (e.g. yourshop.co.za), connect it to the website, and set up professional email (name@yourshop.co.za) on every phone and computer.",
    why: "A .co.za address and matching email replace the @gmail.com look, make the shop look established to customers and suppliers, and keep the contact details under the owner's control.",
    includes: ["Domain registration help", "Website and email connected", "Up to 3 mailboxes set up", "Phone and laptop setup", "Set up so mail avoids spam"],
    setup: 600, monthly: 50,
    market: { low: 500, avg: 1000, high: 1500 }, marketMonthly: { low: 50, high: 100, avg: 100 },
    note: "The only item that bills yearly: domain renewal (about R100-R250/yr, confirm with registrar) and mailboxes from about $1-$7 per user per month are paid at cost.",
    vapeFit: "High", adoption: 65, rating: 8,
  },
  {
    id: "qr-stand", num: 10, name: "Countertop QR Stand", category: "found",
    summary: "A branded acrylic stand for the till with a QR code that opens the shop's website, WhatsApp chat or Google review page.",
    why: "It is a physical, always-on prompt at the point of sale. Customers scan once and are in the shop's channel for good, and it collects Google reviews too.",
    includes: ["Branded acrylic stand", "Dynamic QR (can change later)", "Artwork design", "Delivered ready to place"],
    setup: 850, monthly: 0,
    market: { low: 650, avg: 1250, high: 1800 },
    note: "Price is per stand; set of 3: R2,200. Included free as a bonus in every pack.",
    vapeFit: "High", adoption: 90, rating: 9.5,
  },
  {
    id: "photography", num: 11, name: "Shop & Product Photography", category: "design",
    summary: "An on-site photo session with a ring light and clean backgrounds: product photos for the website plus shop-front, interior and team photos for the Google profile. Edited and delivered ready to upload.",
    why: "Poor or supplier-stock photos lose sales and make the Google profile look neglected. Crisp, consistent photos lift website sales and Google profile views.",
    includes: ["Up to 20 products shot", "Shop front and interior photos", "Backgrounds cleaned up", "Web and Google-ready files", "Delivered within 3 days"],
    setup: 2000, monthly: 0,
    market: { low: 1500, avg: 3550, high: 5600 },
    note: "Studio photographers charge about R200-R280 per product for 11-25 products; ours is an on-site phone shoot, so priced lower.",
    vapeFit: "High", adoption: 80, rating: 8.5,
  },
  {
    id: "posters", num: 12, name: "Posters, Templates & Brand Design", category: "design",
    summary: "Print-ready posters and counter cards, editable post templates ('New Drop', 'Weekend Special', 'Price Slash') and, when the shop needs one, a simple logo or brand refresh.",
    why: "Consistent, professional signs and posts make the shop look established, and the editable templates let staff post in minutes without paying a designer each time.",
    includes: ["A2/A3 poster artwork", "Counter cards", "5 to 15 editable templates", "Logo refresh (if needed)", "Print-ready files"],
    setup: 1000, monthly: 0,
    market: { low: 850, avg: 2700, high: 4500 },
    note: "Posters and templates from R1,000. A full brand kit is quoted separately (market R1,800 to R4,500).",
    vapeFit: "Medium", adoption: 65, rating: 8,
  },
  {
    id: "loyalty-card", num: 13, name: "Digital Loyalty Card", category: "retention",
    summary: "A loyalty card in Apple Wallet or Google Pay. The cashier scans the customer's phone and visits are tracked automatically (e.g. every 10th juice free). Customers who go quiet for 30+ days automatically get a 'We miss you' coupon.",
    why: "Vape customers buy every week, so a card on their phone gives them a reason to choose this shop over the next one, and the win-back message brings lapsed customers back without the owner lifting a finger.",
    includes: ["Wallet loyalty card", "Scan-and-stamp at the till", "Reward rules you choose", "'We miss you' coupon at 30 days", "Monthly visit count"],
    setup: 1600, monthly: 250,
    market: { low: 1800, avg: 2900, high: 4000 }, marketMonthly: { low: 350, high: 750, avg: 550 },
    note: "Monthly covers the card platform, messages, support.",
    vapeFit: "High", adoption: 80, rating: 9,
  },
  {
    id: "vip-restock", num: 14, name: "VIP Restock List", category: "retention",
    summary: "A signup link that collects opted-in numbers by interest (brand, flavour, device) so the shop can message restocks and flash sales to exactly the right people.",
    why: "When a hot flavour lands or a deal drops, the shop can fill the counter in an hour instead of hoping people see a post. It builds a customer list the owner owns.",
    includes: ["Signup link and QR", "Interest tags", "Opt-in consent saved", "Message templates", "Customer list in a sheet"],
    setup: 1200, monthly: 200,
    market: { low: 1000, avg: 1750, high: 2500 }, marketMonthly: { low: 250, high: 500, avg: 400 },
    note: "Opt-in only. Sent as chat messages, never ads.",
    vapeFit: "High", adoption: 80, rating: 9,
  },
  {
    id: "review-manager", num: 15, name: "Google Review Manager", category: "retention",
    summary: "We ask happy customers for a Google review (QR or WhatsApp link) and use AI to draft and post polite replies to every review, good or bad.",
    why: "More reviews and fast replies push the shop higher on Google Maps and show new customers the owner cares. A bad review answered well often wins the customer back.",
    includes: ["Review request link and QR", "AI-drafted replies", "Owner approval option", "Alert on bad reviews", "Monthly review summary"],
    setup: 1150, monthly: 260,
    market: { low: 1200, avg: 1600, high: 2000 }, marketMonthly: { low: 250, high: 500, avg: 400 },
    note: "Monthly covers monitoring and tone changes.",
    vapeFit: "High", adoption: 70, rating: 9,
  },
  {
    id: "social-media", num: 16, name: "Social Media Management", category: "retention",
    summary: "We run the shop's social pages: regular posts, community replies, optional paid-ad management and a monthly performance report.",
    why: "Owners want to be visible but don't have time to post. Steady, professional content keeps the shop top of mind between visits.",
    includes: ["Regular content and posting", "Replies and community care", "Ad management (optional)", "Monthly analytics report", "Strategy tweaks and tips"],
    setup: 0, monthly: 2500, monthlyOnly: true,
    market: { low: 1300, avg: 4700, high: 8100 }, // monthly market
    note: "Priced by scope: platforms and posts a month. Suggested price is a starting package. Vape shops: information-style content only; no ad management.",
    vapeFit: "Medium", adoption: 60, rating: 7.5,
  },
  {
    id: "health-check", num: 17, name: "Business Health Check", category: "reports",
    summary: "A one-off review of the shop against 5 nearby competitors: Google rating and review count, photos, reply rate, website, socials and, where public, price position. The shop gets a score out of 10, a side-by-side comparison and a short action plan.",
    why: "Owners rarely see how they stack up. The report shows exactly where they win, where they lose customers and what to fix first, so spending goes where it matters.",
    includes: ["Score out of 10", "5-competitor comparison", "Google profile and review audit", "Website and social review", "Action plan in priority order"],
    setup: 2000, monthly: 0,
    market: { low: 1500, avg: 2500, high: 3500 },
    note: "Agency SEO audits cost R10,000-R31,000 (ProCompare) but cover a different, technical scope. This is a local-shop snapshot. Free bonus in the top packs.",
    vapeFit: "High", adoption: 70, rating: 9,
  },
  {
    id: "growth-report", num: 18, name: "Monthly Growth Report", category: "reports",
    summary: "Every month: rating and review count vs competitors, new reviews and replies, website and WhatsApp activity, top sellers and dead stock (when the Stock Tracker is on) and 3 recommended actions.",
    why: "It proves the work is paying off, flags problems early, and gives the owner a simple plan each month, so they keep the service and keep growing.",
    includes: ["Rating and review tracking", "Competitor movement", "Sales and stock highlights", "3 recommended actions", "One-page PDF on WhatsApp"],
    setup: 0, monthly: 700, monthlyOnly: true,
    market: { low: 450, avg: 850, high: 1200 }, // monthly market
    note: "Monthly-only service with no setup fee. Run the Health Check first for a baseline.",
    vapeFit: "High", adoption: 70, rating: 9,
  },
  {
    id: "stock-tracker", num: 19, name: "Stock & Warranty Tracker", category: "control",
    summary: "One sheet tracking stock by brand, flavour, nicotine strength and size, with low-stock alerts to the manager's WhatsApp, reorder suggestions, and a log for faulty coils, pods and batteries with photos so warranty claims are never missed.",
    why: "Running out of the best-seller loses sales on the spot, and unclaimed faulty stock is money left with the supplier. This keeps both under control.",
    includes: ["Stock by flavour and strength", "Low-stock WhatsApp alerts", "Reorder suggestions", "Faulty-stock log with photos", "Warranty claim tracking"],
    setup: 2100, monthly: 210,
    market: { low: 1800, avg: 3150, high: 4500 }, marketMonthly: { low: 200, high: 500, avg: 350 },
    note: "Merges the old stock tracker, low-stock button and defect log.",
    vapeFit: "High", adoption: 75, rating: 9,
  },
  {
    id: "cash-up", num: 20, name: "Cash-Up & Till Theft Alert", category: "control",
    summary: "Staff enter note counts and card totals at closing; the system compares them to the expected balance, logs variances and alerts the owner on WhatsApp when a shortfall is over R50. Expenses are logged in the same sheet.",
    why: "Cash going missing is the owner's biggest worry when they aren't in the shop. Daily checking stops small leaks becoming big ones.",
    includes: ["Closing cash-up form", "Variance log", "WhatsApp alert over R50", "Expense logging", "Daily summary to the owner"],
    setup: 1500, monthly: 160,
    market: { low: 1200, avg: 2000, high: 2800 }, marketMonthly: { low: 150, high: 400, avg: 300 },
    note: "One-time price.",
    vapeFit: "High", adoption: 85, rating: 9,
  },
];

const QR = { label: "Countertop QR stand", worth: 850 };
const SIGNS = { label: "Printed 18+ counter signs", worth: 300 };
const CHECK = { label: "Business Health Check", worth: 2000 };

export const packs: Pack[] = [
  {
    id: "vape-starter", name: "Vape Starter", audience: "VAPE SHOPS",
    tagline: "Get online and get found",
    blurb: "The essentials for a vape shop to look professional, take orders on WhatsApp and be found on Google.",
    setup: 4000, monthly: 500, defaultFloor: 3500,
    productIds: ["storefront", "age-check", "google-maps", "domain-email"],
    bonuses: [QR, SIGNS], marketY1: 25600, separatelyY1: 16110,
  },
  {
    id: "vape-pro", name: "Vape Pro", audience: "VAPE SHOPS",
    tagline: "Add the smart vape tools",
    blurb: "Starter plus the tools that make vape shops sell more: device and flavour finders, tidy click-and-collect orders, social profiles and a loyalty card.",
    setup: 7000, monthly: 650, popular: true,
    productIds: ["storefront", "age-check", "coil-finder", "flavour-finder", "click-collect", "google-maps", "profiles", "domain-email", "loyalty-card"],
    bonuses: [QR, SIGNS], marketY1: 55650, separatelyY1: 32920,
  },
  {
    id: "vape-complete", name: "Vape Complete", audience: "VAPE SHOPS",
    tagline: "Run the whole shop smarter",
    blurb: "Pro plus restock messaging, review management, stock and warranty control and a monthly report, with a free Business Health Check to start.",
    setup: 11000, monthly: 750,
    productIds: ["storefront", "age-check", "coil-finder", "flavour-finder", "click-collect", "google-maps", "profiles", "domain-email", "loyalty-card", "vip-restock", "review-manager", "growth-report", "stock-tracker"],
    bonuses: [QR, SIGNS, CHECK], marketY1: 86150, separatelyY1: 53810,
  },
  {
    id: "retail-starter", name: "Retail Starter", audience: "ANY SHOP",
    tagline: "A simple first website",
    blurb: "A low-cost first step for any small shop: a price-list page, Google Maps, profiles and a professional email address.",
    setup: 2200, monthly: 250,
    productIds: ["price-list", "google-maps", "profiles", "domain-email"],
    bonuses: [QR], marketY1: 17750, separatelyY1: 10330,
  },
  {
    id: "retail-online", name: "Retail Online Shop", audience: "ANY SHOP",
    tagline: "Sell on WhatsApp 24/7",
    blurb: "A full online storefront with loyalty, review management and a monthly report, built for non-vape shops that want to take orders on WhatsApp.",
    setup: 4000, monthly: 800,
    productIds: ["storefront", "google-maps", "profiles", "domain-email", "loyalty-card", "review-manager", "growth-report"],
    bonuses: [QR, CHECK], marketY1: 50150, separatelyY1: 32380,
  },
  {
    id: "repeat-combo", name: "Repeat Combo", audience: "ADD-ON COMBO",
    tagline: "Posters, loyalty card and restock list",
    blurb: "Three tools that bring customers back: branded posters and templates, a digital loyalty card and a VIP restock list. Works for any shop, and adds well to any other pack.",
    setup: 2900, monthly: 350,
    productIds: ["posters", "loyalty-card", "vip-restock"],
    bonuses: [], marketY1: 18750, separatelyY1: 9200,
  },
];

export const extras: Extra[] = [
  { id: "booking-engine", name: "WhatsApp Booking Engine", bestFor: "service shops (barbers, tattooists)", setup: 4500, monthly: 350, avg: 5250 },
  { id: "social-videos", name: "Short-Form Social Videos", bestFor: "per batch of 5 reels", setup: 1900, monthly: 0, avg: 2100 },
  { id: "tv-menu", name: "In-Store TV Menu Board", bestFor: "price or menu screen", setup: 3500, monthly: 350, avg: 3750 },
  { id: "wifi-capture", name: "In-Store Wi-Fi Data Capture", bestFor: "captive portal setup", setup: 2300, monthly: 0, avg: 2500 },
];

export const terms: string[] = [
  "A 50% deposit starts the work, or setup can be paid in 3 instalments on packs, with the balance due on delivery.",
  "Monthly plans are billed in advance, with a 6-month minimum and then 30 days' notice.",
  "Prices exclude VAT (if registered) and third-party costs such as domain and mailbox renewals, WhatsApp message fees and print runs.",
  "Anything that collects customer numbers needs clear opt-in consent and a privacy notice in line with POPIA.",
  "Free monthly edits on packs are small changes of about 15 minutes each, up to 5 a month, and do not roll over; bigger work is quoted.",
  "Prepay 12 months of a monthly plan up front and get 2 months free.",
  "Estimates are guides, not guarantees.",
];

export const cities: string[] = [
  "Rustenburg", "Johannesburg", "Pretoria", "Cape Town", "Durban", "Bloemfontein", "Port Elizabeth", "East London",
];

export const faq: { q: string; a: string }[] = [
  { q: "How much does a website cost in South Africa?",
    a: "WebRift packs start at R2,200 setup and go up to R11,000, with a monthly plan of R250 to R800 that covers hosting, support and free edits. For comparison, a typical agency charges R30,000 to R85,000 setup plus R2,000 to R2,700 a month, and a freelancer R6,000 to R25,000 plus R500 a month and up. Prices exclude VAT." },
  { q: "How long does it take to build a website?",
    a: "Usually days rather than weeks. After the deposit and a short shop questionnaire we build and send a preview in days 3 to 7, then launch around day 7 to 10 after one round of changes. Vape shops need an age-check test before launch, so allow a little extra time." },
  { q: "Do you provide website hosting and domain registration?",
    a: "Yes. Hosting is included in the monthly plan, and we register your own web address (e.g. yourshop.co.za), connect it to the site and set up to 3 business mailboxes. The shop pays domain and mailbox renewals at cost, directly to the provider." },
  { q: "Will my website work on mobile phones?",
    a: "Yes. Every site is built mobile-first and fast, because most customers browse and chat on their phones. Orders go straight to the shop's WhatsApp." },
  { q: "Can you help with SEO (Search Engine Optimization)?",
    a: "Yes, local SEO for shops: we claim and verify your Google Maps listing, add Apple Maps, Bing and local directories, and manage reviews. The Monthly Growth Report and the Business Health Check show how you compare with nearby competitors. We do not do large technical agency SEO audits." },
  { q: "Do you serve businesses outside of Rustenburg?",
    a: "Yes. We work with shops in Rustenburg, Johannesburg, Pretoria, Cape Town, Durban, Bloemfontein, Port Elizabeth and East London, and anywhere else in South Africa remotely over WhatsApp." },
  { q: "What if I need changes after my website is launched?",
    a: "Packs include up to 5 free edits a month (small changes of about 15 minutes, such as prices, photos, hours or banners); unused edits do not roll over. Without a pack each small change is R120, and bigger work such as a new page or feature is quoted." },
  { q: "Why is setup so low?",
    a: "We keep setup affordable so small shops can start. The monthly fee covers hosting, support, free edits and improvements. Setup on packs can be paid in 3 instalments." },
  { q: "Is there a cheaper 'annual' price instead of setup?",
    a: "No. Setup is always paid once. The only yearly option is prepaying the monthly fees for 2 months free." },
  { q: "Do I have to pay monthly?",
    a: "The storefront, loyalty card, review manager, VIP list and reports need a monthly plan because they run and send things every month. Quick wins like Google Maps, photos and posters are once-off." },
  { q: "What if I cancel?",
    a: "The site stays ours to host; we hand over files for once-off items, and monthly services stop at the end of the notice month. Monthly plans have a 6-month minimum, then 30 days' notice." },
  { q: "Who pays for the domain and email?",
    a: "The shop does, at cost, directly to the provider. We set it all up for you." },
];

export const productById = (id: string): Product | undefined => products.find((p) => p.id === id);

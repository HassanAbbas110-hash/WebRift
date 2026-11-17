import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import { Mascot } from "@/components/pitch/Mascot";
import { packs, products } from "@/data/catalogue";
import { clients, fmt, sources } from "@/data/pitch";
import { projects } from "@/data/projects";
import { CATEGORIES, COMPARE_COLS, compareRows, packFigures } from "@/lib/content";
import { formatZAR } from "@/lib/quote";
import { CONTACT_EMAIL, PHONE_DISPLAY, WHATSAPP_DISPLAY } from "@/lib/site";
import "./brochure.css";

// Print-first partner brochure (A4 portrait). Export to PDF with headless Chrome; see README.
export const metadata = {
  title: "Partner brochure",
  description: "WebRift partner brochure for local shop owners.",
  robots: { index: false },
};

const MIKI = { name: "Miki", whatsapp: "073 182 8542" };
const SITE = "webrift-nine.vercel.app";
const REG_FEE = 200;

const { carWash: A, salon: B } = clients;
const figs = packs.map((p) => packFigures(p.id));
const cheapest = figs.reduce((a, b) => (b.setup < a.setup ? b : a));
const cheapestYear = Math.min(...figs.map((f) => f.year1));
const shot = (id: string) => projects.find((p) => p.id === id)!;

function Page({ n, children, className = "" }: { n: number; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bro-page ${className}`} aria-label={`Page ${n}`}>
      {n > 1 && (
        <header className="bro-head">
          <Logo className="h-[7mm] w-auto" />
          <span>PARTNER BROCHURE · FOR LOCAL SHOP OWNERS</span>
        </header>
      )}
      <div className="bro-body">{children}</div>
      {n > 1 && (
        <footer className="bro-foot">
          <span>WebRift · Talk to {MIKI.name}: WhatsApp {MIKI.whatsapp} · {SITE}</span>
          <b>{String(n).padStart(2, "0")}</b>
        </footer>
      )}
    </section>
  );
}

const Kicker = ({ children }: { children: React.ReactNode }) => <p className="bro-kicker">{children}</p>;
const Src = ({ n }: { n: number }) => <sup className="bro-src">[{n}]</sup>;

function Icon({ d }: { d: string }) {
  return <svg viewBox="0 0 24 24" className="bro-icon" aria-hidden><path d={d} /></svg>;
}

function Shot({ id, className = "" }: { id: string; className?: string }) {
  const p = shot(id);
  return (
    <figure className={`bro-shot ${className}`}>
      <div className="bro-shot-bar"><i /><i /><i /><span>{p.name}</span></div>
      <div className="bro-shot-img"><Image src={p.image!} alt={`${p.name} website design`} fill sizes="600px" className="object-cover object-top" /></div>
    </figure>
  );
}

export default function BrochurePage() {
  return (
    <div className="bro">
      {/* 1. COVER */}
      <Page n={1} className="bro-cover">
        <div className="cover-top">
          <Logo className="h-[11mm] w-auto" />
          <p className="cover-tag">Premium websites for local shops.</p>
        </div>
        <p className="bro-kicker mt-[16mm]">PARTNER BROCHURE · FOR LOCAL SHOP OWNERS</p>
        <h1 className="cover-h">YOUR SHOP.<br /><span className="grad">FOUND EVERYWHERE.</span></h1>
        <p className="cover-lead">Premium websites, Google visibility and loyalty tools built for South African shops. WhatsApp-first, live in days, and priced for a small business.</p>
        <div className="cover-art">
          <Shot id="msh-attorneys" className="cover-main" />
          <Shot id="serenity" className="cover-side cover-side-a" />
          <Shot id="barakah" className="cover-side cover-side-b" />
          <Mascot pose="wave" className="cover-bot" />
        </div>
        <ul className="chips">
          {["PREMIUM DESIGN", "FOUND ON GOOGLE", "ORDERS ON WHATSAPP", "CUSTOMERS WHO RETURN"].map((c) => <li key={c}>{c}</li>)}
        </ul>
        <div className="cover-card">
          <b>NOW TAKING ON NEW SHOPS</b>
          <span>Packs from {formatZAR(cheapest.setup)} setup + {formatZAR(cheapest.monthly)}/month · Rustenburg, Johannesburg, Pretoria and nationwide over WhatsApp.</span>
        </div>
      </Page>

      {/* 2. THE OPPORTUNITY */}
      <Page n={2}>
        <Kicker>THE OPPORTUNITY</Kicker>
        <h2 className="h2">Your customers are searching.<br /><span className="grad">Are they finding you?</span></h2>
        <p className="lead">Before people walk into a shop, they look it up on their phone: the hours, the photos, the prices, the reviews. If you are not there, they choose a shop that is.</p>
        <div className="stat-row">
          <div><b>50.8M</b><span>South Africans online, about 78% of the country<Src n={1} /></span></div>
          <div><b>97%</b><span>of consumers read reviews when choosing a local business<Src n={2} /></span></div>
          <div><b>0.05s</b><span>for a visitor to form a first impression of your website<Src n={3} /></span></div>
        </div>
        <div className="grid3">
          {[
            ["Searched before visited", "Your site and Google profile answer the questions people ask before they make the trip."],
            ["Open 24/7", "Your shop keeps selling at night and on Sundays, while you are closed."],
            ["Orders that arrive complete", "Customers build their order and send it to your WhatsApp. No back-and-forth."],
            ["Beyond walking distance", "Reach people across your area, not just the ones who walk past your door."],
            ["Customers who come back", "Loyalty cards and restock messages turn one-time buyers into regulars."],
            ["Trust at first glance", "A premium look tells people you are established and worth choosing."],
          ].map(([t, s]) => <div key={t} className="card"><i className="bar" /><b>{t}</b><p>{s}</p></div>)}
        </div>
        <div className="maths">
          <p className="maths-h">What just one extra customer a day can mean (example)</p>
          <div className="maths-row"><span>1 new customer a day × R150 spend</span><b>R150 a day</b></div>
          <div className="maths-row"><span>Over a 30-day month</span><b>≈ R4,500</b></div>
          <div className="maths-row"><span>Over a year</span><b>≈ R54,000</b></div>
          <div className="maths-row maths-total"><span>A full first year of a WebRift pack</span><b>from {formatZAR(cheapestYear)}</b></div>
          <p className="fine">An example to show the maths, not a promise. Real results depend on your area, products and customers.</p>
        </div>
        <div className="callout">A website doesn&apos;t replace your walk-ins.<br /><span>It brings new ones through the door.</span></div>
      </Page>

      {/* 3. WHY WEBRIFT */}
      <Page n={3}>
        <Kicker>WHY WEBRIFT</Kicker>
        <h2 className="h2">Premium look.<br /><span className="grad">Not a template.</span></h2>
        <p className="lead">Most small-business sites look the same. Yours should look like your business, work on every phone, and make ordering easy.</p>
        <div className="split">
          <ul className="ticks">
            {[
              ["Designed around your brand.", "A law firm, a salon and a car wash should not look the same. We design each one."],
              ["WhatsApp-first ordering.", "Customers order on the channel they already use. You get a tidy order message."],
              ["Found on Google and Maps.", "Your profile set up properly, so nearby customers see you first."],
              ["Built for local shops.", "Tools like product finders, age checks, loyalty cards and click-and-collect."],
              ["Fast on cheap phones.", "Light pages that load quickly on slow data, where most of your customers are."],
              ["A local team you can WhatsApp.", "We set you up, make your edits and reply within one working day."],
            ].map(([t, s]) => <li key={t}><b>{t}</b> {s}</li>)}
          </ul>
          <div className="why-art">
            <Shot id="seolwane" />
            <p className="cap">CLIENT PROJECT · SEOLWANE</p>
          </div>
        </div>
        <div className="callout">One setup, one monthly plan.<br /><span>Hosting, support and up to 5 free edits a month included.</span></div>
      </Page>

      {/* 4. WHAT YOU GET */}
      <Page n={4}>
        <Kicker>WHAT YOU GET</Kicker>
        <h2 className="h2">Six kinds of tools.<br /><span className="grad">One simple plan.</span></h2>
        <p className="lead">Start with a website, then add what your shop needs. Packs bundle the most useful tools at a lower price.</p>
        <div className="grid2">
          {CATEGORIES.map((c) => (
            <div key={c.id} className="card cat">
              <div className="cat-h"><Icon d={c.icon} /><b>{c.label}</b></div>
              <p>{c.blurb}</p>
              <ul>{products.filter((p) => p.category === c.id).map((p) => <li key={p.id}>{p.name}</li>)}</ul>
            </div>
          ))}
        </div>
      </Page>

      {/* 5. HOW IT WORKS */}
      <Page n={5}>
        <Kicker>HOW IT WORKS</Kicker>
        <h2 className="h2">From first message to live shop.<br /><span className="grad">You only do two things.</span></h2>
        <p className="lead">You send your content and approve the preview. We handle the design, the build, Google, hosting and support.</p>
        <div className="steps">
          {[
            ["DAY 0", "PICK A PACK", "Choose a pack, sign the form and pay the deposit or first instalment.", false],
            ["DAY 1–2", "SEND YOUR CONTENT", "Logo, product or price list, photos, hours and the WhatsApp number for orders.", true],
            ["DAY 3–7", "WE BUILD", "We design and build your site and tools, then send you a preview link.", false],
            ["DAY 7–10", "APPROVE AND LAUNCH", "One round of changes, then we go live and set up Google and your profiles.", true],
            ["MONTH 2+", "WE LOOK AFTER IT", "Hosting, backups, free edits, support and, on bigger packs, a monthly report.", false],
          ].map(([d, t, s, you], i) => (
            <div key={t as string} className={`step ${you ? "step-you" : ""}`}>
              <span className="step-n">{i + 1}</span>
              {you && <span className="you">YOU DO THIS</span>}
              <small>{d}</small><b>{t}</b><p>{s}</p>
            </div>
          ))}
        </div>
        <div className="also">
          <b>Also included</b>
          <ul>
            <li><b>Hosting and backups:</b> your site stays online and safe. Small fixes if anything breaks.</li>
            <li><b>Free edits:</b> up to 5 small changes a month on packs: prices, photos, hours, banners.</li>
            <li><b>WhatsApp support:</b> a local team that replies within one working day.</li>
          </ul>
        </div>
        <div className="callout">Live in 7 to 10 days.<br /><span>Once your content is ready. Setup can be paid in 3 instalments.</span></div>
      </Page>

      {/* 6. OUR WORK */}
      <Page n={6}>
        <Kicker>OUR WORK</Kicker>
        <h2 className="h2">Different businesses.<br /><span className="grad">Their own identity.</span></h2>
        <p className="lead">Client projects and business demos, each designed around its own customers. Demos show design and functionality, not client results.</p>
        <div className="work">
          {projects.map((p) => (
            <div key={p.id} className="work-item">
              <Shot id={p.id} />
              <p><b>{p.name}</b><span>{p.kind} · {p.sector}</span></p>
            </div>
          ))}
        </div>
      </Page>

      {/* 7. REAL RESULTS */}
      <Page n={7}>
        <Kicker>REAL RESULTS</Kicker>
        <h2 className="h2">Found on Google.<br /><span className="grad">Chosen by customers.</span></h2>
        <p className="lead">Google Search Console figures from two WebRift client sites over 16 months, with names removed. Unpaid search only. No ads.<Src n={7} /></p>
        <div className="result">
          <p className="result-h">{A.label.toUpperCase()}</p>
          <div className="stat-row stat-row-4">
            <div><b>{fmt(A.impressions)}</b><span>times shown on Google</span></div>
            <div><b>{A.clicks}</b><span>people clicked through to the site</span></div>
            <div><b>{A.localShare}%</b><span>of searches came from South Africa</span></div>
            <div><b>Page 1</b><span>average position {A.position}</span></div>
          </div>
        </div>
        <div className="result">
          <p className="result-h">{B.label.toUpperCase()}</p>
          <div className="split-even">
            <div className="stat-row stat-row-2">
              <div><b>{B.impressions}</b><span>times shown on Google</span></div>
              <div><b>{B.clicks}</b><span>people clicked to see more</span></div>
            </div>
            <div className="bars">
              {[["Typical click rate for that spot", B.typicalCtr, false, 6], ["This salon", B.ctr, true, 0], ["This salon, South Africa", B.ctrLocal, true, 0]].map(([l, v, hi, s]) => (
                <div key={l as string} className="bar-row">
                  <span>{l as string}{s ? <Src n={s as number} /> : null}</span><b>{(v as number).toFixed(1)}%</b>
                  <div className="bar"><i className={hi ? "hi" : ""} style={{ width: `${((v as number) / B.ctrLocal) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="callout">About six times the usual click rate.<br /><span>A clear, beautiful site makes people want to tap.</span></div>
        <p className="fine">Results differ from business to business. Clicks count visits from unpaid Google search only, so total visitors are higher.</p>
      </Page>

      {/* 8. PRICING */}
      <Page n={8}>
        <Kicker>SIMPLE, HONEST PRICING</Kicker>
        <h2 className="h2">Low setup.<br /><span className="grad">One monthly plan.</span></h2>
        <p className="lead">No hidden fees. Setup is paid once, the monthly plan keeps everything running. Prices exclude VAT.</p>
        <div className="price3">
          <div className="card"><b className="price">R{REG_FEE}</b><strong>Once-off registration</strong><p>Opens your client account and covers onboarding. Paid with your application form.</p></div>
          <div className="card"><b className="price">From {formatZAR(cheapest.setup)}</b><strong>Setup, paid once</strong><p>Design, build and launch. On packs, split it into 3 instalments.</p></div>
          <div className="card"><b className="price">From {formatZAR(cheapest.monthly)}</b><strong>Per month</strong><p>Hosting, support, updates and up to 5 free edits. 6-month minimum, then month to month.</p></div>
        </div>
        <table className="tbl">
          <thead><tr><th>Pack</th><th>Made for</th><th>Setup</th><th>Monthly</th><th>Year 1</th><th>Or 3 ×</th></tr></thead>
          <tbody>
            {figs.map((f) => (
              <tr key={f.pack.id} className={f.pack.popular ? "hot" : ""}>
                <td><b>{f.pack.name}</b>{f.pack.popular && <span className="pill">MOST POPULAR</span>}</td>
                <td>{f.pack.audience.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</td>
                <td>{formatZAR(f.setup)}</td><td>{formatZAR(f.monthly)}</td><td><b>{formatZAR(f.year1)}</b></td><td>{formatZAR(f.instalment)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="callout">Prepay 12 months, get 2 free.<br /><span>Pricing on packs is negotiable. Your quote confirms the final price.</span></div>
        <p className="fine">Year 1 = setup + 12 months. Third-party costs (domain renewals, mailboxes, print runs) are paid at cost. Build your own quote at {SITE}/quote.</p>
      </Page>

      {/* 9. HOW WE COMPARE */}
      <Page n={9}>
        <Kicker>HOW WE COMPARE</Kicker>
        <h2 className="h2">Where WebRift sits<br /><span className="grad">among your options.</span></h2>
        <p className="lead">An honest side-by-side of the usual ways a local shop gets online.</p>
        <table className="tbl tbl-cmp">
          <thead><tr><th />{COMPARE_COLS.map((c) => <th key={c} className={c === "WebRift" ? "us" : ""}>{c}</th>)}</tr></thead>
          <tbody>{compareRows().map((r) => <tr key={r.label}><td><b>{r.label}</b></td>{r.cells.map((c, i) => <td key={i} className={i === 3 ? "us" : ""}>{c}</td>)}</tr>)}</tbody>
        </table>
        <div className="grid3 mt">
          {[["Agencies", "Strong for big projects, but setup often runs into tens of thousands of rand."], ["Freelancers", "Can be good value, but support and ongoing edits vary a lot."], ["DIY builders", "Cheap to start, but they cost you evenings, and shop tools are extra."]].map(([t, s]) => <div key={t} className="card"><b>{t}</b><p>{s}</p></div>)}
        </div>
        <p className="fine">Agency, freelancer and Shopify prices are from ProCompare, &quot;The real cost of an e-commerce website in SA&quot;. Other cells are our own view; offerings vary by provider.</p>
      </Page>

      {/* 10. 10 REASONS */}
      <Page n={10}>
        <Kicker>THE SHORT VERSION</Kicker>
        <h2 className="h2">10 reasons<br /><span className="grad">to say yes today.</span></h2>
        <div className="reasons">
          {[
            ["Premium design, not a template", "A look that matches your brand and builds trust."],
            ["Found on Google and Maps", "Nearby customers see you when they search."],
            ["Orders on WhatsApp", "Complete orders, on the app your customers already use."],
            ["Live in 7 to 10 days", "Once your content is ready. Not months."],
            ["Low setup, split in 3", `From ${formatZAR(cheapest.setup)}, in instalments on packs.`],
            ["Everything in one plan", "Hosting, support and up to 5 free edits a month."],
            ["Customers who come back", "Loyalty cards, restock lists and review requests."],
            ["You own your content", "Your logo, photos, products and customer lists stay yours."],
            ["No spam, no gimmicks", "We never push ads in your customers' faces."],
            ["A local team you can WhatsApp", "Real people who reply within one working day."],
          ].map(([t, s], i) => <div key={t} className="reason"><span>{String(i + 1).padStart(2, "0")}</span><div><b>{t}</b><p>{s}</p></div></div>)}
        </div>
        <div className="callout">Every week offline is a week your customers find someone else.<br /><span>The sooner you start, the sooner Google starts showing you.</span></div>
      </Page>

      {/* 11. OUR PROMISE */}
      <Page n={11}>
        <Kicker>OUR PROMISE</Kicker>
        <h2 className="h2">What we promise.<br /><span className="grad">And what we never will.</span></h2>
        <p className="lead">Most agencies promise you thousands of customers and fill people&apos;s screens with ads. Nobody can force a customer through your door. We build the reason they choose you.</p>
        <div className="grid3">
          {[
            ["A premium presence", "Design, photos and copy that make your shop look established."],
            ["Easy to find", "Google, Maps, WhatsApp and social pages that all point to you."],
            ["Easy to choose", "Clear prices, hours and reviews, so the decision is simple."],
            ["Your data stays yours", "Customer lists, products and content belong to your business."],
            ["Privacy done properly", "Opt-in lists and consent wording in line with POPIA."],
            ["Honest numbers", "On bigger packs, a monthly report shows what is working."],
          ].map(([t, s]) => <div key={t} className="card"><i className="bar" /><b>{t}</b><p>{s}</p></div>)}
        </div>
        <div className="never">
          <b>What we never do</b>
          <ul>
            <li>Promise you a number of customers we cannot guarantee</li>
            <li>Run annoying ads at your customers 24/7</li>
            <li>Hide fees or lock your content away from you</li>
          </ul>
          <p>{fmt(64)}% of people who installed an ad blocker did it because ads were annoying or intrusive.<Src n={4} /> Keeping just 5% more of your customers can raise profits by 25% to 95%.<Src n={5} /> We focus on being chosen, and on being chosen again.</p>
        </div>
      </Page>

      {/* 12. GET STARTED */}
      <Page n={12}>
        <Kicker>GET STARTED</Kicker>
        <h2 className="h2">Four steps.<br /><span className="grad">Let&apos;s set you up.</span></h2>
        <ol className="timeline">
          {[
            ["Ask for a quote or a free health check", "Build a quote yourself at " + SITE + "/quote, or ask us to check how your shop looks online."],
            ["Fill in the application form", `Your business, contact details and the pack you want. R${REG_FEE} registration.`],
            ["Send your content", "Logo, products, photos and hours. We help if you don't have everything."],
            ["Launch in 7 to 10 days", "We go live, set up Google and your profiles, and train you on edits."],
          ].map(([t, s], i) => <li key={t}><span>{i + 1}</span><div><b>{t}</b><p>{s}</p></div></li>)}
        </ol>
        <div className="grid2">
          <div className="card">
            <b className="card-h">WHAT WE NEED FROM YOU</b>
            <ul className="dots">
              <li>Logo (or we make a simple one)</li><li>Product or price list</li><li>Opening hours and address</li>
              <li>WhatsApp number for orders</li><li>Photos of your shop and best sellers</li><li>Someone who can approve within 48 hours</li>
            </ul>
          </div>
          <div className="card card-hi">
            <b className="card-h">SERIOUS PARTNERS ONLY</b>
            <p>We work with shops that want to grow: owners who send content on time, approve quickly and want to look their best online. In return you get a team that works hard to make you the obvious choice.</p>
          </div>
        </div>
        <div className="callout">Not sure which pack fits?<br /><span>Ask {MIKI.name} for a free check of how your shop looks online today. No obligation.</span></div>
      </Page>

      {/* 13. BACK COVER */}
      <Page n={13} className="bro-back">
        <div className="back-top">
          <Kicker>READY WHEN YOU ARE</Kicker>
          <h2 className="back-h">LET&apos;S GROW<br />YOUR SHOP<br /><span className="grad">TOGETHER.</span></h2>
          <p className="lead">A premium online presence, customers who find you and come back, and a local team in your corner.</p>
        </div>
        <Mascot pose="cheer" className="back-bot" />
        <div className="contact">
          <div className="contact-main">
            <p className="bro-kicker">TALK TO {MIKI.name.toUpperCase()}</p>
            <b className="contact-big">WhatsApp {MIKI.whatsapp}</b>
            <p>Ask for a live demo on your phone, or a free check of how your shop looks online.</p>
            <ul>
              <li>WebRift WhatsApp <b>{WHATSAPP_DISPLAY}</b></li>
              <li>Phone <b>{PHONE_DISPLAY}</b></li>
              <li>Email <b>{CONTACT_EMAIL}</b></li>
              <li>Website <b>{SITE}</b></li>
            </ul>
          </div>
          <div className="qrs">
            <figure><Image src="/brochure/qr-miki.svg" alt="QR code to WhatsApp Miki" width={150} height={150} unoptimized /><figcaption>WhatsApp {MIKI.name}</figcaption></figure>
            <figure><Image src="/brochure/qr-quote.svg" alt="QR code to build a quote" width={150} height={150} unoptimized /><figcaption>Build your quote</figcaption></figure>
          </div>
        </div>
        <p className="back-chips">Premium design · Found on Google · Orders on WhatsApp · Customers who return</p>
        <ol className="srcs">
          {sources.map((s) => <li key={s.id}>[{s.id}] {s.text}{s.url ? ` ${s.url.replace(/^https?:\/\//, "")}` : ""}</li>)}
        </ol>
        <p className="fine">Prices exclude VAT. Fees and terms are confirmed in your quote and the WebRift service agreement. Examples are illustrations, not guarantees.</p>
      </Page>
    </div>
  );
}

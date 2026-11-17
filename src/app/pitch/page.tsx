import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { DeckMotion } from "@/components/pitch/DeckMotion";
import { Mascot, type Pose } from "@/components/pitch/Mascot";
import { packs } from "@/data/catalogue";
import { clients, fmt, sources } from "@/data/pitch";
import { formatZAR } from "@/lib/quote";
import { waLink } from "@/lib/site";
import "./pitch.css";

export const metadata = {
  title: "Why your business needs a website",
  description: "A short guide from WebRift: how customers choose local businesses today, with real client results.",
  robots: { index: false },
};

const entry = packs.reduce((a, b) => (b.setup < a.setup ? b : a));
const { carWash: A, salon: B } = clients;

/** Number that counts up when its slide appears. Server HTML holds the final value, so no-JS and the PDF are correct. */
function N({ v, d = 0 }: { v: number; d?: number }) {
  return <span data-count={v} data-decimals={d} className="tabular-nums">{fmt(v, d)}</span>;
}
const Src = ({ n }: { n: number }) => <sup className="src">[{n}]</sup>;

function Guide({ pose, children, side = "right" }: { pose: Pose; children: React.ReactNode; side?: "left" | "right" }) {
  return (
    <div className={`guide guide-${side} a`} style={{ "--d": "0.35s" } as React.CSSProperties}>
      <p className="bubble">{children}</p>
      <Mascot pose={pose} className="guide-bot" />
    </div>
  );
}

function Slide({ n, eyebrow, children, className = "" }: { n: number; eyebrow?: string; children: React.ReactNode; className?: string }) {
  return (
    <section data-slide aria-label={`Slide ${n}`} className={`slide ${className}`}>
      <div className="slide-inner">
        {eyebrow && <p className="eyebrow a">{eyebrow}</p>}
        {children}
      </div>
      <span className="slide-no">{String(n).padStart(2, "0")}</span>
    </section>
  );
}

export default function PitchPage() {
  return (
    <div data-pitch data-deck className="deck">
      <DeckMotion />
      <nav aria-label="Slides" className="dots">
        {Array.from({ length: 12 }, (_, i) => <span key={i} data-dot />)}
      </nav>

      <Slide n={1} className="slide-cover">
        <div className="cover">
          <div>
            <div className="a"><Logo className="h-9 w-auto" /></div>
            <h1 className="title a" style={{ "--d": "0.1s" } as React.CSSProperties}>Your next customer is <span className="text-grad">already looking for you.</span></h1>
            <p className="lead a" style={{ "--d": "0.2s" } as React.CSSProperties}>The only question is whether they find you, or the business down the road.</p>
            <p className="hint a" style={{ "--d": "0.5s" } as React.CSSProperties}>Swipe or scroll to begin <span aria-hidden className="hint-arrow">↓</span></p>
          </div>
          <Guide pose="wave">Hi, I&apos;m Rift. Give me two minutes and I&apos;ll show you how customers choose a business today.</Guide>
        </div>
      </Slide>

      <Slide n={2} eyebrow="The street moved">
        <div className="split">
          <div>
            <h2 className="title a">Your customers moved <span className="text-grad">onto their phones.</span></h2>
            <div className="big a" style={{ "--d": "0.15s" } as React.CSSProperties}><N v={50.8} d={1} /> million</div>
            <p className="lead a" style={{ "--d": "0.25s" } as React.CSSProperties}>South Africans are online. That is about 78% of the country, up 2.6 million in a single year.<Src n={1} /></p>
          </div>
          <Guide pose="point">Before they walk in, they look you up. Every time.</Guide>
        </div>
      </Slide>

      <Slide n={3} eyebrow="How people choose now">
        <h2 className="title a">The new road to <span className="text-grad">your front door.</span></h2>
        <ol className="journey">
          {[["Search", "\"salon near me\""], ["Compare", "photos, prices, hours"], ["Read reviews", "who do others trust?"], ["Message", "WhatsApp, call, book"], ["Visit", "and pay"]].map(([t, s], i) => (
            <li key={t} className="step a" style={{ "--d": `${0.12 + i * 0.12}s` } as React.CSSProperties}><span className="step-n">{i + 1}</span><b>{t}</b><span>{s}</span></li>
          ))}
        </ol>
        <p className="lead a" style={{ "--d": "0.8s" } as React.CSSProperties}><b className="text-white"><N v={97} />%</b> of consumers read reviews when choosing a local business.<Src n={2} /> If you are not in that search, you are not in that choice.</p>
      </Slide>

      <Slide n={4} eyebrow="First impressions">
        <div className="split">
          <div>
            <h2 className="title a">You get <span className="text-grad">50 milliseconds.</span></h2>
            <p className="lead a" style={{ "--d": "0.15s" } as React.CSSProperties}>That is how fast people form a first impression of a website, and it sticks with their later judgements.<Src n={3} /></p>
            <p className="lead a" style={{ "--d": "0.25s" } as React.CSSProperties}>A premium look tells them you are established, careful and worth the trip, before they read a single word.</p>
          </div>
          <div className="stopwatch a" style={{ "--d": "0.2s" } as React.CSSProperties} aria-hidden>
            <svg viewBox="0 0 120 120"><circle cx="60" cy="64" r="46" className="sw-ring" /><circle cx="60" cy="64" r="46" className="sw-sweep" /><rect x="52" y="6" width="16" height="10" rx="3" /><line x1="60" y1="64" x2="60" y2="30" className="sw-hand" /></svg>
            <span>0.05s</span>
          </div>
        </div>
      </Slide>

      <Slide n={5} eyebrow="The quiet cost">
        <div className="split">
          <div>
            <h2 className="title a">Not online means <span className="text-grad">not on the list.</span></h2>
            <p className="lead a" style={{ "--d": "0.15s" } as React.CSSProperties}>When someone searches for what you sell, Google shows the businesses it can find. The customer picks from that list.</p>
            <ul className="ticks">
              {["Your competitors already appear there.", "Their photos, prices and reviews do the selling while they sleep.", "Every search you are missing from is a customer who never knew you existed."].map((t, i) => (
                <li key={t} className="a" style={{ "--d": `${0.25 + i * 0.12}s` } as React.CSSProperties}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="serp a" style={{ "--d": "0.2s" } as React.CSSProperties} aria-hidden>
            <p className="serp-q">beauty salon near me</p>
            {["Competitor A ★★★★★", "Competitor B ★★★★☆", "Competitor C ★★★★★"].map((t) => <p key={t} className="serp-row">{t}</p>)}
            <p className="serp-row serp-missing">Your business</p>
          </div>
        </div>
      </Slide>

      <Slide n={6} eyebrow="Real proof · client 1">
        <h2 className="title a">{A.label}: found <span className="text-grad">thousands of times.</span></h2>
        <div className="stats">
          <div className="stat a" style={{ "--d": "0.15s" } as React.CSSProperties}><b><N v={A.impressions} /></b><span>times shown on Google</span></div>
          <div className="stat a" style={{ "--d": "0.25s" } as React.CSSProperties}><b><N v={A.clicks} /></b><span>people clicked through to the site</span></div>
          <div className="stat a" style={{ "--d": "0.35s" } as React.CSSProperties}><b><N v={A.localShare} />%</b><span>of searches came from South Africa</span></div>
          <div className="stat a" style={{ "--d": "0.45s" } as React.CSSProperties}><b>Page 1</b><span>average position {A.position}</span></div>
        </div>
        <p className="note a" style={{ "--d": "0.6s" } as React.CSSProperties}>16 months of unpaid Google search. No ads. Every one of those searches was someone looking for this kind of business.<Src n={7} /></p>
      </Slide>

      <Slide n={7} eyebrow="Real proof · client 2">
        <div className="split">
          <div>
            <h2 className="title a">{B.label}: people <span className="text-grad">chose to click.</span></h2>
            <p className="lead a" style={{ "--d": "0.15s" } as React.CSSProperties}>Out of <N v={B.impressions} /> times on Google, <b className="text-white"><N v={B.clicks} /> people</b> clicked to see more. In South Africa, nearly 1 in 5 did.<Src n={7} /></p>
            <div className="bars a" style={{ "--d": "0.25s" } as React.CSSProperties}>
              <div className="bar-row"><span>Typical for that spot on Google<Src n={6} /></span><div className="bar"><i style={{ "--w": `${(B.typicalCtr / B.ctrLocal) * 100}%` } as React.CSSProperties} /></div><b>{B.typicalCtr}%</b></div>
              <div className="bar-row"><span>This salon</span><div className="bar"><i className="bar-hi" style={{ "--w": `${(B.ctr / B.ctrLocal) * 100}%` } as React.CSSProperties} /></div><b><N v={B.ctr} d={1} />%</b></div>
              <div className="bar-row"><span>This salon, South Africa</span><div className="bar"><i className="bar-hi" style={{ "--w": "100%" } as React.CSSProperties} /></div><b><N v={B.ctrLocal} d={1} />%</b></div>
            </div>
          </div>
          <Guide pose="present">About six times the usual click rate. A beautiful, clear site makes people want to tap.</Guide>
        </div>
      </Slide>

      <Slide n={8} eyebrow="What most agencies sell">
        <h2 className="title a">More ads in people&apos;s faces? <span className="text-grad">They don&apos;t work like that.</span></h2>
        <div className="vs">
          <div className="vs-card vs-bad a" style={{ "--d": "0.15s" } as React.CSSProperties}>
            <p className="vs-h">The usual promise</p>
            <ul><li>&quot;We&apos;ll boost you to thousands&quot;</li><li>Ads chasing people 24/7</li><li>Pay every month or disappear</li></ul>
            <p className="vs-f"><b><N v={64} />%</b> of people who installed an ad blocker did it because ads were annoying or intrusive.<Src n={4} /></p>
          </div>
          <div className="vs-card vs-good a" style={{ "--d": "0.3s" } as React.CSSProperties}>
            <p className="vs-h">The WebRift promise</p>
            <ul><li>A premium look that earns trust</li><li>Found on Google, Maps, WhatsApp and social</li><li>Easy to choose you, every time</li></ul>
            <p className="vs-f">Nobody can force a customer through your door. We make sure that when they look, <b>you are the obvious choice.</b></p>
          </div>
        </div>
      </Slide>

      <Slide n={9} eyebrow="Customers who stay">
        <div className="split">
          <div>
            <h2 className="title a">Win them once. <span className="text-grad">Keep them for years.</span></h2>
            <p className="lead a" style={{ "--d": "0.15s" } as React.CSSProperties}>Keeping just <b className="text-white">5% more</b> of your customers can raise profits by <b className="text-white"><N v={25} />% to <N v={95} />%</b>.<Src n={5} /></p>
            <ul className="ticks">
              {["Digital loyalty card on their phone", "Restock and special-offer messages they asked for", "Reviews that bring their friends"].map((t, i) => <li key={t} className="a" style={{ "--d": `${0.3 + i * 0.12}s` } as React.CSSProperties}>{t}</li>)}
            </ul>
          </div>
          <Guide pose="cheer">A happy regular is worth more than a hundred ads.</Guide>
        </div>
      </Slide>

      <Slide n={10} eyebrow="An asset you own">
        <h2 className="title a">Your website works <span className="text-grad">for your business, not for a platform.</span></h2>
        <div className="own">
          {[["Rented", "Social pages", "The platform decides who sees your posts, and can change the rules overnight."], ["Owned", "Your website", "Your name, your domain, your customer list. It grows in value every month it is live."]].map(([tag, t, s], i) => (
            <div key={t} className={`own-card a ${i ? "own-yes" : ""}`} style={{ "--d": `${0.15 + i * 0.15}s` } as React.CSSProperties}><span className="own-tag">{tag}</span><b>{t}</b><p>{s}</p></div>
          ))}
        </div>
        <p className="lead a" style={{ "--d": "0.5s" } as React.CSSProperties}>A business with a strong online presence, reviews and a loyal customer list is easier to grow, and easier to sell one day.</p>
      </Slide>

      <Slide n={11} eyebrow="Getting started">
        <div className="split">
          <div>
            <h2 className="title a">Premium look. <span className="text-grad">Small-business price.</span></h2>
            <div className="big a" style={{ "--d": "0.15s" } as React.CSSProperties}>{formatZAR(entry.setup)}<small> setup + {formatZAR(entry.monthly)}/month</small></div>
            <ul className="ticks">
              {["Live in 7 to 10 days once your content is ready", "Hosting, support and up to 5 free edits a month", "Setup can be split into 3 instalments", "Start with a free health check of your online presence"].map((t, i) => <li key={t} className="a" style={{ "--d": `${0.25 + i * 0.1}s` } as React.CSSProperties}>{t}</li>)}
            </ul>
            <div className="cta a" style={{ "--d": "0.7s" } as React.CSSProperties}>
              <Link href="/quote" className="btn-grad">Build my quote →</Link>
              <a href={waLink("Hi WebRift, I saw the 'why you need a website' guide and I'd like to chat.")} target="_blank" rel="noopener noreferrer" className="btn-line">WhatsApp us</a>
            </div>
          </div>
          <Guide pose="wave">Let&apos;s make your business the one they find, and the one they come back to.</Guide>
        </div>
      </Slide>

      <Slide n={12} eyebrow="Sources" className="slide-sources">
        <h2 className="title-sm a">Where these numbers come from</h2>
        <ol className="sources a" style={{ "--d": "0.1s" } as React.CSSProperties}>
          {sources.map((s) => <li key={s.id}><span>[{s.id}]</span> {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.text}</a> : s.text}</li>)}
        </ol>
        <p className="note">Results differ from business to business. WebRift does not promise a number of customers; we build the presence that makes customers choose you. Prices exclude VAT; your quote confirms the final price.</p>
      </Slide>
    </div>
  );
}

// Facts and figures for the "Why your business needs a website" sales deck (/pitch).
// Every number here has a source below. Do not add a figure you cannot source.

export interface Source { id: number; text: string; url?: string }

export const sources: Source[] = [
  { id: 1, text: "DataReportal, Digital 2025: South Africa (internet users, January 2025)", url: "https://datareportal.com/reports/digital-2025-south-africa" },
  { id: 2, text: "BrightLocal, Local Consumer Review Survey 2026 (consumers who read reviews for local businesses)", url: "https://www.brightlocal.com/research/local-consumer-review-survey/" },
  { id: 3, text: "Lindgaard et al., \"Attention web designers: You have 50 milliseconds to make a good first impression!\", Behaviour & Information Technology, 2006", url: "https://www.nature.com/news/2006/060109/full/news060109-13.html" },
  { id: 4, text: "HubSpot and AdBlock Plus survey of 1,055 internet users: reasons for installing an ad blocker", url: "https://blog.hubspot.com/marketing/why-people-block-ads-and-what-it-means-for-marketers-and-advertisers" },
  { id: 5, text: "Bain & Company research (F. Reichheld), as reported in Harvard Business Review, \"The Value of Keeping the Right Customers\", 2014", url: "https://hbr.org/2014/10/the-value-of-keeping-the-right-customers" },
  { id: 6, text: "First Page Sage, Google click-through rates by ranking position (position 8: about 2.1%)", url: "https://firstpagesage.com/reports/google-click-through-rates-ctrs-by-ranking-position/" },
  { id: 7, text: "Google Search Console data for two WebRift client websites, 16 months to November 2026. Names removed. Clicks are visits from unpaid Google search only, so total visitors are higher." },
];

/** Real Search Console figures, anonymised at the owner's request. */
export const clients = {
  carWash: { label: "A car wash & eatery", impressions: 8420, clicks: 125, position: 7.5, localShare: 92 },
  salon: { label: "A beauty salon", impressions: 483, clicks: 62, ctr: 12.8, ctrLocal: 17.8, position: 7.9, typicalCtr: 2.1 },
} as const;

/** Comma thousands, dot decimals. Used on the server and while counting up, so both render the same text. */
export function fmt(n: number, decimals = 0) {
  const [i, f] = n.toFixed(decimals).split(".");
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (f ? "." + f : "");
}

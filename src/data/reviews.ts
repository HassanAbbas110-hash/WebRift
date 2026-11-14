// Real client reviews only. The home page section stays hidden while this list is empty.
// Never add a review the client did not write or approve: it is unlawful under the Consumer Protection Act.
export interface Review {
  quote: string;
  name: string;
  /** Role and business, e.g. "Owner, MS Haroon Attorneys". */
  role: string;
  /** Where it came from, e.g. "Google review" or "WhatsApp message, shared with permission". */
  source: string;
  /** Optional id from src/data/projects.ts to link the review to that project. */
  projectId?: string;
}

export const reviews: Review[] = [];

/** Optional Google rating strip. Leave null until there is a Google Business Profile with reviews. */
export const googleRating: { value: number; count: number; url: string } | null = null;

import { defineCollection, z } from 'astro:content';

const eatsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Article title — shown in <h1> and <title> tag
    title: z.string(),

    // Meta description — shown in Google search results
    description: z.string(),

    // Primary target keyword — for the owner's keyword-tracking spreadsheet, NOT rendered on page
    keyword: z.string(),

    // Location name (城市/地區) — used in JSON-LD contentLocation and URL path
    // Default is "埔里"; future cities will have different values here
    location: z.string().default('埔里'),

    // Cover image path (relative to /public)
    coverImage: z.string().optional(),

    // Cover image alt text — required for SEO + accessibility when coverImage is set
    coverAlt: z.string().optional(),

    // Publication date
    pubDate: z.coerce.date(),

    // Draft flag — true = not published; lets the owner save unfinished drafts
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  eats: eatsCollection,
};

import source from "@/data/site.json";
import { publicUrl } from "@/lib/urls";
export type Block = { type: string; text: string };
export type Section = { id: string; title: string; blocks: Block[] };
export type Post = {
  id: number;
  slug: string;
  title: string;
  date: string;
  category: string;
  categories?: string[];
  excerpt: string;
  source: string;
};
export type Article = Post & { html: string };
export const site = source;
const pages = source as unknown as Record<string, { sections: Section[] }>;
export const sections = (path: string) => pages[path]?.sections ?? [];
export const paragraphs = (section: Section) =>
  section.blocks.filter((x) => x.type === "paragraph").map((x) => x.text);
export const dateLabel = (date: string) =>
  new Date(date + "T12:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const strategyPages = [
  { slug: "asset-based-finance", image: "asset-based-finance-header.png" },
  { slug: "fixed-income-credit", image: "fixed-income-credit-header.png" },
  { slug: "private-equity", image: "privacy-equity-header.png" },
  { slug: "quantitative", image: "quantitative-header.png" },
  { slug: "real-assets", image: "real-assets-header.png" },
  { slug: "regional-thematic", image: "regional-thematic-header.png" },
];
export const strategies = strategyPages.map(strategy => ({
  ...strategy,
  name: sections("/investment-universe/" + strategy.slug)[0].title,
}));
export const regions = [
  "Greater China",
  "North Asia",
  "South East Asia",
  "India",
  "Europe",
  "MENA",
];
let cachedPosts: Promise<Post[]> | null = null;
export function getPosts() {
  if (!cachedPosts)
    cachedPosts = fetch(publicUrl("/content/posts.json"))
      .then((r) => {
        if (!r.ok) throw new Error("Unable to load the research archive.");
        return r.json();
      })
      .catch((e) => {
        cachedPosts = null;
        throw e;
      });
  return cachedPosts;
}

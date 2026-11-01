# Rostrum Grand - enhanced original website

The modern Rostrum Grand design developed for this project, paired with the original website's content, headings, fonts, logo and navy and gold palette. Built with React, TypeScript, Vite and shadcn/ui components backed by Radix.

## Website and hosting guide

- [GitHub Pages website](https://elliotnis.github.io/rostrum-grand/)
- [Existing GCP website](https://rostrum-grand-46003867652.asia-east2.run.app/)
- [Full hosting guide](docs/HOSTING.md): local setup, automatic GitHub Pages deployment, GCP deployment, Docker, maintenance and troubleshooting.

## Run locally

Use Node.js 24 (see `.nvmrc`). Clone this repository, then run:

```bash
npm ci
npm run dev
```

Open http://localhost:5180. The development server uses a strict port.

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 5181
```

## Original content and structure

Headings and copy come from `src/data/site.json`, captured from https://rostrumgrand.com. The homepage follows the original order: Research-Driven Investing in Alternatives; Intellectual capital built through hands-on experience; ADDDing value; Create, Curate, Connect; The power of scale / The beauty of detail; and Recent updates. The original Our Partners placeholder remains hidden because it contains no partner names or logos. Recent updates uses actual articles from the archive instead of the original empty placeholders.

RG Lab presents its original sections in sequence, with jump links, all five selection criteria, all eight D3M pillars and all eight product-design factors. About Us retains the original vision, values, background, global presence and eight team profiles. All six investment categories, philanthropy, contact details, original article titles and 570 complete articles are retained. Two credit descriptions contained as direct text in the original accordion markup were recovered during the content comparison.

Em dashes in displayed copy were replaced with ordinary punctuation. Article slugs, source links, dates and category memberships are preserved. Broken empty source footnote links remain removed. The source privacy page has no published policy body, so the site provides the actual contact email instead of inventing policy text.

## Original branding and responsive refinements

The developed design retains its spacious editorial layouts, architectural photography, investment illustrations and relationship diagram. The page canvas and header use the original artwork's navy `#13202f`, allowing the illustrations to blend into their surroundings. Raised panels use secondary navy `#1d3045`, with cream text and gold accents. D3M and Design icons have matching navy cards and brighter blue details for readability. Headings use Cormorant Garamond, paragraphs use Lato, and navigation uses Crimson Text, matching the original website. Font files are served locally. The versioned font stylesheet prevents older cached redesign fonts from being reused after deployment.

Cards have 24px corners. Controls have larger touch targets, phone forms stack in one column, the mobile navigation scrolls, and article tables scroll within their own container. Body text is 18px on desktop, 20px on wide screens and 17px on phones, with 18px phone article text. The architectural hero image from the modern design is retained. Entrance and reveal effects respect reduced-motion settings.

## Contact form and content scope

The form preserves the original first name, last name, phone, email and message fields. It prepares a draft for review, then opens the visitor's email app. It does not claim to have delivered a message or connect to the original production mail server. The saved content snapshot does not synchronize subsequent CMS updates.

## Files

- `src/pages/`: page layouts and archive interactions.
- `src/components/site.tsx`: original navigation, logo, footer, notice and shared layouts.
- `src/components/ui/`: shadcn/ui components.
- `src/index.css`, `src/readability.css` and `src/visuals.css`: the developed modern layouts, readable type scale and illustrations.
- `src/brand-refinements.css`: original fonts and brand colours, rounded components and phone refinements.
- `src/navy-theme.css`: the continuous navy background, matching illustrations, and dark forms, navigation, dialogs and cards.
- `src/components/investment-visuals.tsx`: the developed investment illustrations and relationship diagram.
- `src/components/motion.tsx` and `src/motion.css`: optional, reduced-motion-aware transitions.
- `src/data/site.json`: original page copy and biographies.
- `public/content/`: article index and 570 complete articles.
- `public/assets/`: original imagery and portraits, modern architectural photography, and local fonts.

## Deployment

A push to `main` runs the included GitHub Actions workflow and publishes [GitHub Pages](https://elliotnis.github.io/rostrum-grand/). The build handles the repository prefix and generates direct links for every page and all 570 articles.

```bash
npm run build:pages
npm run preview:pages -- --host 127.0.0.1 --port 5181
```

Preview that build at http://localhost:5181/rostrum-grand/. A plain `npm run build` creates the root-path build used by GCP and Docker.

The existing GCP service remains in `finance-department-494117`, region `asia-east2`, service `rostrum-grand`. Pushing to GitHub does not deploy to GCP. Follow [docs/HOSTING.md](docs/HOSTING.md) for the tested deployment command and rollback instructions.

The latest GCP deployment record is in `deploy/gcp-deployment.json`. The production container uses Node 24 to build and NGINX to serve the site, with SPA routing, gzip, cache headers and the `/health` endpoint.

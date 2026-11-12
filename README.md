# Ampliflow product preview rebuild

An unofficial rebuild of the product preview on [ampliflow.in](https://ampliflow.in/), the Analytics, Workflow, Leads and Smart Inbox tabs under the hero. Built by [Tushar Mishra](https://tushar-mishra-cse-portfolio.vercel.app/) as part of an application for the Frontend Developer Intern role. Not affiliated with Ampliflow, and all demo data is fictional.

## What changed

| | Original | Rebuild |
| --- | --- | --- |
| Preview | Four 2400 × 1528 WebP screenshots, about 1 MB | Live React components, no images |
| Numbers | 874, 1,000 and 1,074 total leads across tabs, 0 active campaigns, 0% acceptance and reply rate | Every number derived from one data file, checked by tests |
| Phone | Desktop screenshot shrunk to about 350 px | Separate mobile layout for each tab |
| Tabs | Buttons with `aria-selected` and no tab role | `tab` and `tabpanel` roles, arrow keys, Home and End |
| Autoplay | Every 4 s, pauses on hover only | Every 8 s, pauses on hover, focus, off screen and hidden tabs, stops after a choice, off with reduced motion |
| Lighthouse mobile | Performance 71, Accessibility 86, LCP 4.5 s | Performance 96, Accessibility 100, LCP 1.9 s (local build) |

## Stack

React 19, TypeScript, Tailwind CSS v4, Vite, Vitest, self hosted Inter.

## Run it

```bash
npm install
npm run dev
npm test
npm run build
```

## Where things live

- `src/data/demo.ts`: the single demo dataset, with every rate and count derived from raw counts
- `src/components/ProductPreview.tsx`: accessible tabs and the autoplay rules
- `src/components/panels/`: the four panels, each with its own phone layout

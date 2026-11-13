# Ampliflow product preview rebuild

An unofficial rebuild of the product preview on [ampliflow.in](https://ampliflow.in/), made by [Tushar Mishra](https://tushar-mishra-cse-portfolio.vercel.app/) for the Frontend Developer Intern application. Not affiliated with Ampliflow. All people, companies and numbers in the demo are fictional.

Live: https://ampliflow-preview-rebuild.vercel.app

## What changed

|                   | ampliflow.in today                                                         | This rebuild                                                                     |
| ----------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Preview           | Four 2400 × 1528 screenshots, about 1 MB                                   | Live React components that you can use                                           |
| Numbers           | 874, 1,000 and 1,074 total leads across tabs, 0% acceptance and reply rate | One dataset, every count and rate derived, unit tests fail on any mismatch       |
| Phone             | Desktop screenshot shrunk to about 350 px, text 2 to 3 px                  | Container queries lay out each panel by its own width                            |
| Tabs and controls | Buttons with `aria-selected` and no tab role                               | Tabs, radio groups, listboxes and a combobox, all with full keyboard support     |
| Motion            | Rotates every 4 s, pauses on hover only                                    | 8 s with a visible timer, WCAG 2.2.2 pause control, stops on interaction         |
| Lighthouse mobile | Performance 38 to 72, Accessibility 86, LCP 4.5 to 6.5 s, 388 to 620 KB    | Performance 91 typical, Accessibility 100, Best Practices 100, LCP 1.9 s, 164 KB |

## Inside the preview

- **Analytics:** 7, 14 and 30 day ranges recalculate everything. Count-up figures, trend sparklines, and a daily chart that draws the 25 a day safety limit, with hover and keyboard tooltips, live announcements and a table view.
- **Workflow:** selectable steps with an inspector, a template or preview toggle that fills in a sample lead, a character counter, and dots flowing along the connectors.
- **Leads:** search plus status filters whose counts always add up to the total, a live result count and an empty state.
- **Smart inbox:** conversations you can move through with the arrow keys, and a reply box that really sends.
- **Around it:** dark mode that follows your system with a View Transitions reveal and no flash on load, a lazy loaded command menu (Ctrl K or ⌘K), and a phone frame that runs the same component next to the original.

## The rest of the page, rebuilt from an audit

I checked all 33 links on ampliflow.in, ran Lighthouse and axe, reviewed it on phone and desktop, and read every line of copy. The 17 findings live in `src/features/audit/findings.ts` and render as a filterable section. The rebuilt sections fix them:

- **Six systems:** the heading counts the list it introduces (the original says six above five cards), and integrations are listed once by status.
- **How it works:** honest timing, setup in under an hour and replies over days, on a scroll driven timeline.
- **Pricing:** no phantom "Everything in Free" tier, founding and regular prices side by side, daily limits per plan, and no dependency on the spots counter endpoint that returns 404 on the live site.
- **Testimonials:** quoted word for word, in an accessible marquee with a pause control.
- **FAQ:** answers generated from the same plan data as the pricing cards, no HTTP status codes, and questions tied to their answers.

Motion is CSS first and respects reduced motion: a scroll linked progress bar, border beams, cursor spotlights, a light sweep on primary buttons and the marquee. Below the fold sections use `content-visibility: auto` and mount in a React transition, so the longer page still loads quickly.

## Engineering notes

- `src/data/demo.ts` holds 30 days of raw counts. Range summaries, lead statuses, inbox tags and the workflow are all derived from it, and `demo.test.ts` checks that they agree.
- `useRovingFocus` gives every tab list, radio group and listbox one tab stop plus arrow keys, Home and End.
- The preview controller has stable callbacks, so memoised panels do not re-render on every tab change and the command menu can drive the preview.
- The command menu is a native `<dialog>` (focus trap, Escape and focus return for free) with the ARIA 1.2 combobox pattern, split into its own 2 KB chunk.
- Heavy parts load only when needed: the phone preview and the remote screenshot mount near the viewport, and count-ups start when the preview is first seen.
- Semantic color tokens pass WCAG AA in both themes. `axe-core` reports zero violations across both themes, phone and desktop, every tab and the open command menu.

## Scripts

```bash
npm install
npm run dev           # local dev server
npm test              # Vitest and Testing Library
npm run lint          # oxlint
npm run format:check  # Prettier with Tailwind class sorting
npm run build         # type check and production build
```

CI runs formatting, lint, tests and the build on every push and pull request.

## Structure

```
src/
  data/                 demo dataset and its consistency tests
  lib/                  hooks, theme store, formatting helpers
  components/           small UI primitives
  features/preview/     the preview, its controller, window frame and four panels
  features/command/     command menu, commands and filtering
  features/hero, compare, results, story, site   page sections
```

// Findings from auditing ampliflow.in and ampliflow.in/pricing on 13 Nov 2026: every
// link checked, Lighthouse and axe runs, a headless Chrome review on phone and desktop,
// and a read through of all the copy.

export type Category = 'messaging' | 'reliability' | 'accessibility' | 'performance' | 'polish'
export type Severity = 'high' | 'medium' | 'low'

export type Finding = {
  id: string
  category: Category
  severity: Severity
  title: string
  found: string
  fix: string
  /** `fixed` means this page already does it right. `quick-win` is for changes outside its scope. */
  status: 'fixed' | 'quick-win'
  /** Section where the fix can be seen. Absent when it applies to the whole page. */
  where?: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  messaging: 'Messaging',
  reliability: 'Reliability',
  accessibility: 'Accessibility',
  performance: 'Performance',
  polish: 'Polish and privacy',
}

export const LINKS_CHECKED = 33

export const findings: Finding[] = [
  {
    id: 'trial-vs-waitlist',
    category: 'messaging',
    severity: 'high',
    title: 'The hero promises a free trial, then gives a waitlist',
    found:
      '“Get 7 days free” collects an email for an invite and a referral leaderboard, while the FAQ says the product is live and /pricing links straight to sign up.',
    fix: 'One path. The form here starts the trial and shows the next three steps.',
    status: 'fixed',
    where: 'top',
  },
  {
    id: 'dead-dashboard',
    category: 'messaging',
    severity: 'high',
    title: 'The demo dashboard works against the pitch',
    found: '0 active campaigns, 0% acceptance and reply rate, and three different lead totals: 874, 1,000 and 1,074.',
    fix: 'Every number comes from one dataset, and tests fail the build if two disagree.',
    status: 'fixed',
    where: 'preview',
  },
  {
    id: 'six-systems',
    category: 'messaging',
    severity: 'medium',
    title: '“Six systems” lists five',
    found: 'The heading “The complete outreach engine, in six systems” sits above five cards.',
    fix: 'The heading counts the list it introduces, so it cannot drift again.',
    status: 'fixed',
    where: 'features',
  },
  {
    id: 'phantom-plan',
    category: 'messaging',
    severity: 'medium',
    title: 'A plan that does not exist',
    found: 'The Standard plan says “Everything in Free”, but there is no Free plan.',
    fix: 'Each plan builds on one that is actually listed.',
    status: 'fixed',
    where: 'pricing',
  },
  {
    id: 'hour-claim',
    category: 'messaging',
    severity: 'medium',
    title: '“First reply in under an hour” fights the safety pitch',
    found: 'The product’s own sequences wait 1 and 3 days between steps and only run in working hours.',
    fix: 'Setup takes under an hour, and replies arrive over the following days.',
    status: 'fixed',
    where: 'how',
  },
  {
    id: 'zapier',
    category: 'messaging',
    severity: 'low',
    title: 'Zapier is both live and on the roadmap',
    found: 'The pricing table lists “Webhooks & Zapier” while the homepage lists Zapier as coming later.',
    fix: 'Integrations are listed once, by status. Which one is true needs a product decision.',
    status: 'fixed',
    where: 'features',
  },
  {
    id: 'error-code-copy',
    category: 'messaging',
    severity: 'low',
    title: 'An HTTP status code in customer copy',
    found: 'The pricing FAQ says “you’ll see a 402 on the Campaigns page”.',
    fix: 'The answer explains what happens in plain language.',
    status: 'fixed',
    where: 'faq',
  },
  {
    id: 'spots-counter',
    category: 'reliability',
    severity: 'high',
    title: 'The spots left counter is broken',
    found:
      'Every page calls app.ampliflow.in/api/waitlist/count, which returns 404, so the scarcity number never loads and each page logs an error.',
    fix: 'Nothing here depends on that endpoint, and the offer reads correctly without a live count.',
    status: 'fixed',
    where: 'pricing',
  },
  {
    id: 'tabs',
    category: 'accessibility',
    severity: 'high',
    title: 'The preview tabs are not real tabs',
    found: 'Buttons carry aria-selected without a tab role, so screen readers never announce them as tabs.',
    fix: 'Tabs, radio groups, listboxes and a combobox with full keyboard support.',
    status: 'fixed',
    where: 'preview',
  },
  {
    id: 'tiny-text',
    category: 'accessibility',
    severity: 'medium',
    title: 'Text as small as 7.5 pixels',
    found: '28 pieces of text on the homepage are under 12 pixels, and the smallest tags fail contrast at 4.37 to 1.',
    fix: 'Readable sizes throughout, with AA contrast checked by axe in both themes.',
    status: 'fixed',
  },
  {
    id: 'targets',
    category: 'accessibility',
    severity: 'medium',
    title: 'Tap targets under 24 pixels',
    found: 'More than 20 links, including the main navigation, are under the 24 pixel minimum in WCAG 2.5.8.',
    fix: 'Controls on this page are at least 28 pixels tall.',
    status: 'fixed',
  },
  {
    id: 'faq-controls',
    category: 'accessibility',
    severity: 'low',
    title: 'FAQ answers are not tied to their questions',
    found: 'The toggles report aria-expanded but never point at the answer they open.',
    fix: 'Each question controls a labelled answer region.',
    status: 'fixed',
    where: 'faq',
  },
  {
    id: 'lcp',
    category: 'performance',
    severity: 'medium',
    title: 'Render blocking fonts and a hidden hero line',
    found:
      'PageSpeed Insights flags about 690 ms of render blocking requests, including a Google Fonts stylesheet, and the hero subtitle starts invisible for a fade in.',
    fix: 'Self hosted fonts and nothing hidden above the fold. The largest paint goes from 1.7 to 1.4 seconds.',
    status: 'fixed',
    where: 'results',
  },
  {
    id: 'screenshots',
    category: 'performance',
    severity: 'medium',
    title: 'A megabyte of screenshots nobody can read on a phone',
    found: 'Four 2400 pixel images make up the preview, shrunk to about 350 pixels on phones.',
    fix: 'Live components that lay themselves out for any width.',
    status: 'fixed',
    where: 'phone',
  },
  {
    id: 'real-people',
    category: 'polish',
    severity: 'medium',
    title: 'Real looking people in the screenshots',
    found:
      'The leads screenshot appears to show real names and companies, and the dashboard greets a co-founder by name.',
    fix: 'Every person and company in this demo is fictional.',
    status: 'fixed',
    where: 'preview',
  },
  {
    id: 'typo',
    category: 'polish',
    severity: 'low',
    title: 'A typo in the showcased message',
    found: 'The inbox screenshot opens with “Nice connect with you over linkedin”, in a product that sells outreach.',
    fix: 'Every sample message is proofread.',
    status: 'fixed',
    where: 'preview',
  },
  {
    id: 'titles',
    category: 'polish',
    severity: 'low',
    title: 'Double periods in page titles',
    found:
      'Six hub pages end their titles with “..”, for example “LinkedIn automation tools, compared honestly.. Ampliflow”.',
    fix: 'A one line template fix on the live site.',
    status: 'quick-win',
  },
]

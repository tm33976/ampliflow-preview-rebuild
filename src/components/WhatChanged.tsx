import { ArrowUpRight } from 'lucide-react'

const changes = [
  {
    title: 'Numbers that agree',
    body: 'Every count and percentage comes from one data file. The original shows 874, 1,000 and 1,074 total leads across its tabs, and its Analytics tab shows 0 active campaigns with a 0% acceptance and reply rate.',
  },
  {
    title: 'Readable on a phone',
    body: 'Below 768 pixels each tab gets its own mobile layout, instead of a 2400 pixel screenshot shrunk to about 350 pixels.',
  },
  {
    title: 'Real tabs',
    body: 'Tab and tabpanel roles, arrow keys, Home and End, and a focusable panel. Lighthouse flags the original tabs because they are plain buttons with aria-selected.',
  },
  {
    title: 'Calmer autoplay',
    body: 'Eight seconds per tab with a progress line. It pauses on hover, on focus, off screen and in background tabs, stops once you pick a tab, and stays still when reduced motion is on.',
  },
  {
    title: 'Lighter and faster',
    body: 'The preview is HTML and SVG instead of about 1 MB of screenshots. Inter is self hosted, and the hero text is never hidden behind a fade in, so it paints right away.',
  },
  {
    title: 'Fictional demo data',
    body: 'Every name and company in the preview is made up, so it can never show a real prospect.',
  },
]

const links = [
  { label: 'Source on GitHub', href: 'https://github.com/tm33976/ampliflow-preview-rebuild' },
  { label: 'Original ampliflow.in', href: 'https://ampliflow.in/' },
  { label: 'My portfolio', href: 'https://tushar-mishra-cse-portfolio.vercel.app/' },
]

export function WhatChanged() {
  return (
    <section aria-labelledby="changes-heading" className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
      <h2 id="changes-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
        What I changed, and why
      </h2>
      <p className="mt-3 text-muted">
        The original preview is four static screenshots that switch every 4 seconds. This version is built from live
        components and one demo dataset.
      </p>
      <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {changes.map((change) => (
          <div key={change.title}>
            <dt className="font-semibold">{change.title}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted">{change.body}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-10 flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-sm font-medium transition-colors hover:border-brand hover:text-brand"
            >
              {link.label}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

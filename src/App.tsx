import { Hero } from './components/Hero'
import { ProductPreview } from './components/ProductPreview'
import { Wordmark } from './components/ui'
import { WhatChanged } from './components/WhatChanged'

export default function App() {
  return (
    <>
      <p className="bg-ink px-4 py-2 text-center text-xs text-white/80 sm:text-sm">
        Unofficial redesign prototype by{' '}
        <a
          href="https://tushar-mishra-cse-portfolio.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-white underline underline-offset-2"
        >
          Tushar Mishra
        </a>
        . Not affiliated with Ampliflow.
      </p>

      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Wordmark />
          <a
            href="https://ampliflow.in/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            See the original
          </a>
        </div>
      </header>

      <main>
        <Hero />
        <ProductPreview />
        <WhatChanged />
      </main>

      <footer className="border-t border-line bg-white px-5 py-6 text-center text-sm text-muted">
        Built by Tushar Mishra with React, TypeScript and Tailwind CSS. All demo data is fictional.
      </footer>
    </>
  )
}

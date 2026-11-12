import { LINKS } from '../../lib/links'

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <p>
          Built by{' '}
          <a
            href={LINKS.portfolio}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ink underline-offset-4 hover:underline"
          >
            Tushar Mishra
          </a>{' '}
          with React 19, TypeScript, Tailwind CSS v4 and Vite.
        </p>
        <p>All demo data is fictional. Not affiliated with Ampliflow.</p>
      </div>
    </footer>
  )
}

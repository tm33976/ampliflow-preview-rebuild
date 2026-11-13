import { Code2, Search } from 'lucide-react'
import { Kbd, Wordmark } from '../../components/ui'
import { LINKS, shortcutLabel } from '../../lib/links'
import { ThemeToggle } from './ThemeToggle'

const sections = [
  { href: '#preview', label: 'Preview' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
  { href: '#audit', label: 'Audit' },
  { href: '#decisions', label: 'Decisions' },
]

type Props = { onOpenPalette: () => void; onPrefetchPalette: () => void }

export function SiteHeader({ onOpenPalette, onPrefetchPalette }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 glass">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <a href="#top" aria-label="ampliflow, back to top" className="rounded-md">
          <Wordmark />
        </a>
        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {sections.map((section) => (
              <li key={section.href}>
                <a
                  href={section.href}
                  className="rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            onPointerEnter={onPrefetchPalette}
            onFocus={onPrefetchPalette}
            aria-keyshortcuts="Control+K Meta+K"
            className="flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-sm whitespace-nowrap text-muted shadow-card transition-colors hover:text-ink sm:w-48"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Search or jump</span>
            <span className="ml-auto hidden sm:inline">
              <Kbd>{shortcutLabel()}</Kbd>
            </span>
          </button>
          <ThemeToggle />
          <a
            href={LINKS.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Source on GitHub"
            title="Source on GitHub"
            className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-muted shadow-card transition-colors hover:text-ink"
          >
            <Code2 className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  )
}

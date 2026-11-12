import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { PhoneCompare } from './features/compare/PhoneCompare'
import { useCommands } from './features/command/useCommands'
import { Hero, HeroBackdrop } from './features/hero/Hero'
import { HeroPreview } from './features/hero/HeroPreview'
import { usePreviewController } from './features/preview/controller'
import { Results } from './features/results/Results'
import { Closing } from './features/site/Closing'
import { SiteFooter } from './features/site/SiteFooter'
import { SiteHeader } from './features/site/SiteHeader'
import { Story } from './features/story/Story'
import { LINKS } from './lib/links'
import { useTheme } from './lib/theme'

const loadPalette = () => import('./features/command/CommandPalette')
const CommandPalette = lazy(loadPalette)

export default function App() {
  const preview = usePreviewController()
  const { preference } = useTheme()
  const commands = useCommands(preview, preference)
  const [palette, setPalette] = useState({ mounted: false, open: false })

  const openPalette = useCallback(() => setPalette({ mounted: true, open: true }), [])
  const closePalette = useCallback(() => setPalette((current) => ({ ...current, open: false })), [])
  const prefetchPalette = useCallback(() => void loadPalette(), [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPalette((current) => ({ mounted: true, open: !current.open }))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-brand px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <aside
        id="top"
        aria-label="Prototype notice"
        className="bg-[#0d0f14] px-4 py-2 text-center text-xs text-white/80 sm:text-sm"
      >
        Unofficial redesign prototype by Tushar Mishra. Not affiliated with Ampliflow.{' '}
        <a
          href={LINKS.original}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-white underline underline-offset-2"
        >
          See the original
        </a>
      </aside>
      <SiteHeader onOpenPalette={openPalette} onPrefetchPalette={prefetchPalette} />

      <main id="main" tabIndex={-1} className="outline-none">
        <div className="relative isolate">
          <HeroBackdrop />
          <Hero />
          <HeroPreview controller={preview} />
        </div>
        <PhoneCompare />
        <Results />
        <Story />
        <Closing onOpenPalette={openPalette} />
      </main>

      <SiteFooter />

      {palette.mounted && (
        <Suspense fallback={null}>
          <CommandPalette open={palette.open} onClose={closePalette} commands={commands} />
        </Suspense>
      )}
    </>
  )
}

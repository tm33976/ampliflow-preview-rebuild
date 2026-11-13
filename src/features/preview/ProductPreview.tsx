import { Pause, Play } from 'lucide-react'
import { useId, useState, type AnimationEvent, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { RevealContext } from '../../components/reveal'
import { cx } from '../../lib/cx'
import { useInView, usePageVisible, useRovingFocus } from '../../lib/hooks'
import { AppFrame } from './AppFrame'
import { TAB_IDS, TAB_LABELS, usePreviewController, type PreviewController, type TabId } from './controller'
import { AnalyticsPanel } from './panels/AnalyticsPanel'
import { InboxPanel } from './panels/InboxPanel'
import { LeadsPanel } from './panels/LeadsPanel'
import { WorkflowPanel } from './panels/WorkflowPanel'

const SECONDS_PER_TAB = 8

type Props = {
  /** Pass a controller to drive the preview from outside (the command palette does). */
  controller?: PreviewController
  label?: string
  className?: string
}

export function ProductPreview({ controller, label = 'Product preview', className }: Props) {
  const own = usePreviewController()
  const preview = controller ?? own
  const uid = useId()
  const pageVisible = usePageVisible()
  const [rootRef, inView] = useInView<HTMLDivElement>(0.3)
  const [seen, setSeen] = useState(false)
  if (inView && !seen) setSeen(true)
  const playing = preview.autoplay && inView && pageVisible
  const activeIndex = TAB_IDS.indexOf(preview.tab)
  const roving = useRovingFocus<HTMLButtonElement>(TAB_IDS.length, activeIndex, (i) => preview.selectTab(TAB_IDS[i]))

  const ids = (tab: TabId) => ({ tab: `${uid}-tab-${tab}`, panel: `${uid}-panel-${tab}` })

  // Any real interaction with the panels means the person is exploring, so rotation stops.
  const engage = (event: PointerEvent | KeyboardEvent) => {
    if (preview.rotation !== 'playing') return
    if ((event.target as Element).closest('[data-autoplay-toggle]')) return
    if ('key' in event && (event.key === 'Tab' || event.key === 'Shift')) return
    preview.stop()
  }

  const onProgressEnd = (event: AnimationEvent) => {
    if (event.animationName === 'tab-progress') preview.advance()
  }

  return (
    <div
      ref={rootRef}
      data-preview
      data-playing={playing}
      onPointerDownCapture={engage}
      onKeyDownCapture={engage}
      style={{ '--tab-duration': `${SECONDS_PER_TAB}s` } as CSSProperties}
      className={className}
    >
      <h2 className="sr-only">{label}</h2>
      <div className="@container/tabs mx-auto mb-4 flex max-w-2xl items-center gap-2">
        <div
          role="tablist"
          aria-label={label}
          className="relative grid flex-1 grid-cols-4 rounded-xl border border-line bg-surface p-1 shadow-card"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/4)] rounded-lg bg-brand-soft transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          >
            {preview.rotation !== 'stopped' && (
              <span
                key={preview.tab}
                onAnimationEnd={onProgressEnd}
                className="tab-progress absolute inset-x-3 bottom-0 h-0.5 origin-left animate-tab-progress rounded-full bg-brand-ink"
              />
            )}
          </span>
          {TAB_IDS.map((tab, i) => {
            const selected = i === activeIndex
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                id={ids(tab).tab}
                aria-controls={ids(tab).panel}
                aria-selected={selected}
                data-tab={tab}
                {...roving(i)}
                onClick={() => preview.selectTab(tab)}
                className={cx(
                  'relative z-10 rounded-lg px-0.5 py-2 text-xs font-medium transition-colors @xs/tabs:text-[13px] @md/tabs:text-sm',
                  selected ? 'text-brand-ink' : 'text-muted hover:text-ink',
                )}
              >
                <span className="@md/tabs:hidden">{TAB_LABELS[tab].short}</span>
                <span className="hidden @md/tabs:inline">{TAB_LABELS[tab].label}</span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          data-autoplay-toggle
          onClick={() => preview.setAutoplay(!preview.autoplay)}
          aria-label={preview.autoplay ? 'Pause tab rotation' : 'Play tab rotation'}
          title={preview.autoplay ? 'Pause tab rotation' : 'Play tab rotation'}
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-muted shadow-card transition-colors hover:text-ink"
        >
          {preview.autoplay ? (
            <Pause className="size-4" aria-hidden="true" />
          ) : (
            <Play className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <div data-preview-stage>
        <AppFrame activeTab={preview.tab}>
          <RevealContext value={seen}>
            <div className="grid">
              {TAB_IDS.map((tab) => {
                const selected = tab === preview.tab
                return (
                  <div
                    key={tab}
                    role="tabpanel"
                    id={ids(tab).panel}
                    aria-labelledby={ids(tab).tab}
                    tabIndex={selected ? 0 : -1}
                    inert={!selected}
                    data-active={selected}
                    className={cx(
                      'group/panel rounded-lg transition-[opacity,translate,visibility] duration-500 [grid-area:1/1]',
                      selected ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0',
                    )}
                  >
                    {tab === 'analytics' && <AnalyticsPanel range={preview.range} onRangeChange={preview.setRange} />}
                    {tab === 'workflow' && <WorkflowPanel />}
                    {tab === 'leads' && <LeadsPanel />}
                    {tab === 'inbox' && <InboxPanel />}
                  </div>
                )
              })}
            </div>
          </RevealContext>
        </AppFrame>
      </div>
    </div>
  )
}

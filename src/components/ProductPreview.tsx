import { useRef, useState, type AnimationEvent, type CSSProperties, type KeyboardEvent } from 'react'
import { useInView, useMediaQuery, usePageVisible } from '../lib/hooks'
import { AppFrame } from './AppFrame'
import { AnalyticsPanel } from './panels/AnalyticsPanel'
import { InboxPanel } from './panels/InboxPanel'
import { LeadsPanel } from './panels/LeadsPanel'
import { WorkflowPanel } from './panels/WorkflowPanel'

const SECONDS_PER_TAB = 8

const tabs = [
  { id: 'analytics', label: 'Analytics', shortLabel: 'Analytics', Panel: AnalyticsPanel },
  { id: 'workflow', label: 'Workflow', shortLabel: 'Workflow', Panel: WorkflowPanel },
  { id: 'leads', label: 'Leads', shortLabel: 'Leads', Panel: LeadsPanel },
  { id: 'inbox', label: 'Smart Inbox', shortLabel: 'Inbox', Panel: InboxPanel },
]

const keyTargets: Record<string, (current: number, last: number) => number> = {
  ArrowRight: (current, last) => (current === last ? 0 : current + 1),
  ArrowLeft: (current, last) => (current === 0 ? last : current - 1),
  Home: () => 0,
  End: (_, last) => last,
}

export function ProductPreview() {
  const [active, setActive] = useState(0)
  const [userChose, setUserChose] = useState(false)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const pageVisible = usePageVisible()
  const [sectionRef, inView] = useInView<HTMLElement>()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const autoplay = !userChose && !reducedMotion
  const playing = autoplay && inView && pageVisible

  const choose = (index: number) => {
    setActive(index)
    setUserChose(true)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = keyTargets[event.key]?.(active, tabs.length - 1)
    if (target === undefined) return
    event.preventDefault()
    choose(target)
    tabRefs.current[target]?.focus()
  }

  const onProgressEnd = (event: AnimationEvent<HTMLSpanElement>) => {
    if (event.animationName === 'tab-progress') setActive((current) => (current + 1) % tabs.length)
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="preview-heading"
      data-preview
      data-playing={playing}
      style={{ '--tab-duration': `${SECONDS_PER_TAB}s` } as CSSProperties}
      className="mx-auto max-w-6xl px-4 sm:px-6"
    >
      <h2 id="preview-heading" className="sr-only">
        Product preview
      </h2>

      <div
        role="tablist"
        aria-label="Product preview"
        onKeyDown={onKeyDown}
        className="mx-auto mb-4 grid max-w-2xl grid-cols-4 rounded-xl border border-line bg-white p-1"
      >
        {tabs.map((tab, i) => {
          const selected = i === active
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[i] = node
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(i)}
              className={`relative overflow-hidden rounded-lg px-1 py-2 text-[13px] font-medium transition-colors sm:text-sm ${
                selected ? 'bg-brand-50 text-brand' : 'text-muted hover:text-ink'
              }`}
            >
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {selected && (
                <span
                  aria-hidden="true"
                  onAnimationEnd={autoplay ? onProgressEnd : undefined}
                  className={`absolute inset-x-2 bottom-0 h-0.5 origin-left rounded-full bg-brand ${
                    autoplay ? 'tab-progress animate-tab-progress' : ''
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>

      <AppFrame activeId={tabs[active].id}>
        <div className="grid">
          {tabs.map(({ id, Panel }, i) => {
            const selected = i === active
            return (
              <div
                key={id}
                role="tabpanel"
                id={`panel-${id}`}
                aria-labelledby={`tab-${id}`}
                tabIndex={selected ? 0 : -1}
                inert={!selected}
                className={`[grid-area:1/1] rounded-lg transition-[opacity,visibility] duration-300 motion-reduce:transition-none ${
                  selected ? 'visible opacity-100' : 'invisible opacity-0'
                }`}
              >
                <Panel />
              </div>
            )
          })}
        </div>
      </AppFrame>
    </section>
  )
}

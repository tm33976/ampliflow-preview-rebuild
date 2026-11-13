import type { CSSProperties } from 'react'
import { RevealContext } from '../../components/reveal'
import { SectionHeading } from '../../components/SectionHeading'
import { CountUp } from '../../components/ui'
import { cx } from '../../lib/cx'
import { useInView } from '../../lib/hooks'
import { metrics, MEASURED_NOTE, type Metric } from './metrics'

function Bar({
  label,
  value,
  max,
  display,
  highlight,
}: {
  label: string
  value: number
  max: number
  display: string
  highlight?: boolean
}) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr_3.5rem] items-center gap-3 text-xs">
      <span className={highlight ? 'font-medium text-ink' : 'text-muted'}>{label}</span>
      <span aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-surface-2">
        <span
          className={cx(
            'bar-fill block h-full origin-left rounded-full transition-[scale] duration-1000 ease-out',
            highlight ? 'bg-gradient-to-r from-brand to-violet' : 'bg-line-strong',
          )}
          style={{ width: `${(value / max) * 100}%`, scale: 'var(--bar-scale) 1' }}
        />
      </span>
      <span className="text-right font-medium tabular-nums">{display}</span>
    </div>
  )
}

function MetricCard({ metric }: { metric: Metric }) {
  const better = metric.higherIsBetter ? metric.after >= metric.before : metric.after <= metric.before
  return (
    <li className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card">
      <p className="text-sm font-medium text-muted">{metric.label}</p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="text-gradient text-4xl font-semibold tracking-tight tabular-nums">
          <CountUp value={metric.after} format={metric.headline} />
        </span>
        <span className="text-sm text-muted">{metric.unit}</span>
      </p>
      <p className="mt-1 text-xs text-muted">{metric.hint}</p>
      <div className="mt-auto space-y-2.5 pt-5">
        <Bar label="ampliflow.in" value={metric.before} max={metric.max} display={metric.format(metric.before)} />
        <Bar
          label="Rebuild"
          value={metric.after}
          max={metric.max}
          display={metric.format(metric.after)}
          highlight={better}
        />
      </div>
    </li>
  )
}

export function Results() {
  const [listRef, inView] = useInView<HTMLUListElement>(0.25, { once: true })
  return (
    <section id="results" aria-labelledby="results-heading" className="defer-render py-20 sm:py-28">
      <SectionHeading id="results-heading" eyebrow="Results" title="Measured, not guessed">
        {MEASURED_NOTE}
      </SectionHeading>
      <RevealContext value={inView}>
        <ul
          ref={listRef}
          style={{ '--bar-scale': inView ? 1 : 0 } as CSSProperties}
          className="mx-auto mt-14 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4"
        >
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </ul>
      </RevealContext>
    </section>
  )
}

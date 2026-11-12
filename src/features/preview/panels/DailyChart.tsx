import { useState, type KeyboardEvent } from 'react'
import type { DayStats } from '../../../data/demo'
import { cx } from '../../../lib/cx'
import { formatDay, formatWeekday } from '../../../lib/format'

type Props = { days: DayStats[]; limit: number }

const describeDay = (day: DayStats) =>
  `${formatWeekday(day.date)}: ${day.invites} invites, ${day.accepted} accepted, ${day.replies} replies`

/**
 * Bars and labels are plain HTML so text never stretches; only the acceptance
 * line is SVG. Keyboard users move through days with the arrow keys and hear
 * each day through a polite live region.
 */
export function DailyChart({ days, limit }: Props) {
  const [active, setActive] = useState<number | null>(null)
  const scale = Math.max(limit + 5, ...days.map((day) => day.invites))
  const y = (value: number) => (value / scale) * 100
  const x = (index: number) => ((index + 0.5) / days.length) * 100
  const line = days.map((day, i) => `${x(i)},${100 - y(day.accepted)}`).join(' ')
  const activeDay = active !== null ? days[active] : null

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = days.length - 1
    const current = active ?? last
    const next = { ArrowRight: Math.min(last, current + 1), ArrowLeft: Math.max(0, current - 1), Home: 0, End: last }[
      event.key
    ]
    if (next === undefined) return
    event.preventDefault()
    setActive(next)
  }

  return (
    <div>
      <div
        role="group"
        aria-label={`Daily invites and acceptances, ${formatDay(days[0].date)} to ${formatDay(days[days.length - 1].date)}. Use the arrow keys to read each day.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={() => setActive((current) => current ?? days.length - 1)}
        onBlur={() => setActive(null)}
        onMouseLeave={() => setActive(null)}
        className="relative mt-7 h-32 rounded-md @lg:h-36"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {[10, 20].map((value) => (
            <div
              key={value}
              className="absolute inset-x-0 border-t border-dashed border-line"
              style={{ bottom: `${y(value)}%` }}
            />
          ))}
          <div
            className="absolute inset-x-0 border-t-2 border-dashed border-wait/60"
            style={{ bottom: `${y(limit)}%` }}
          >
            <span className="absolute -top-5 right-0 rounded bg-wait-soft px-1.5 py-px text-[10px] font-semibold text-wait">
              Daily limit {limit}
            </span>
          </div>
        </div>

        <div aria-hidden="true" className="absolute inset-0 flex items-end gap-[2px]">
          {days.map((day, i) => (
            <div
              key={day.date.toISOString()}
              onMouseEnter={() => setActive(i)}
              className="flex h-full flex-1 items-end"
            >
              <div
                className={cx(
                  'bar-fill w-full rounded-t-[3px] transition-[height,background-color] duration-500',
                  active === i ? 'bg-brand' : 'bg-brand-soft-2',
                )}
                style={{ height: `${y(day.invites)}%` }}
              />
            </div>
          ))}
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          <polyline
            points={line}
            fill="none"
            stroke="var(--violet)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {activeDay && active !== null && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-px bg-ink/20"
              style={{ left: `${x(active)}%` }}
            />
            <div
              aria-hidden="true"
              className={cx(
                'pointer-events-none absolute top-0 z-10 w-36 rounded-lg border border-line bg-surface/95 p-2 text-[11px] shadow-float backdrop-blur',
                x(active) < 20 ? 'translate-x-0' : x(active) > 80 ? '-translate-x-full' : '-translate-x-1/2',
              )}
              style={{ left: `${x(active)}%` }}
            >
              <p className="font-semibold text-ink">{formatWeekday(activeDay.date)}</p>
              <p className="mt-1 flex justify-between text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-brand" />
                  Invites
                </span>
                <span className="font-semibold text-ink tabular-nums">{activeDay.invites}</span>
              </p>
              <p className="flex justify-between text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-violet" />
                  Accepted
                </span>
                <span className="font-semibold text-ink tabular-nums">{activeDay.accepted}</span>
              </p>
              <p className="flex justify-between text-muted">
                <span className="pl-3.5">Replies</span>
                <span className="font-semibold text-ink tabular-nums">{activeDay.replies}</span>
              </p>
            </div>
          </>
        )}
      </div>

      <div aria-hidden="true" className="mt-1.5 flex justify-between text-[11px] text-muted">
        <span>{formatDay(days[0].date)}</span>
        <span>{formatDay(days[days.length - 1].date)}</span>
      </div>
      <p className="sr-only" aria-live="polite">
        {activeDay ? describeDay(activeDay) : ''}
      </p>
    </div>
  )
}

export function DailyTable({ days }: { days: DayStats[] }) {
  return (
    <div
      role="region"
      aria-label="Daily activity table"
      tabIndex={0}
      className="mt-3 max-h-44 overflow-auto rounded-lg ring-1 ring-line @lg:max-h-48"
    >
      <table className="w-full text-left text-xs tabular-nums">
        <caption className="sr-only">Daily activity</caption>
        <thead className="sticky top-0 bg-surface-2 text-muted">
          <tr>
            {['Date', 'Invites', 'Accepted', 'Replies'].map((heading) => (
              <th key={heading} scope="col" className="px-3 py-2 font-medium">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {[...days].reverse().map((day) => (
            <tr key={day.date.toISOString()}>
              <th scope="row" className="px-3 py-1.5 font-medium">
                {formatWeekday(day.date)}
              </th>
              <td className="px-3 py-1.5">{day.invites}</td>
              <td className="px-3 py-1.5">{day.accepted}</td>
              <td className="px-3 py-1.5">{day.replies}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

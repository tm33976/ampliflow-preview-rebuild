import { ShieldCheck } from 'lucide-react'
import { memo, useId, useState } from 'react'
import { CountUp, Segmented, Sparkline, type SegmentedOption } from '../../../components/ui'
import {
  campaigns,
  DAILY_INVITE_LIMIT,
  ratio,
  runningCampaigns,
  summaries,
  totalLeads,
  type RangeDays,
  type Summary,
} from '../../../data/demo'
import { cx } from '../../../lib/cx'
import { formatNumber, formatPercent } from '../../../lib/format'
import { DailyChart, DailyTable } from './DailyChart'

const rangeOptions: SegmentedOption<RangeDays>[] = [
  { value: 7, label: '7D', srSuffix: '(last 7 days)' },
  { value: 14, label: '14D', srSuffix: '(last 14 days)' },
  { value: 30, label: '30D', srSuffix: '(last 30 days)' },
]

type StatProps = {
  label: string
  value: number
  format?: (n: number) => string
  detail: string
  trend?: number[]
}

function Stat({ label, value, format, detail, trend }: StatProps) {
  return (
    <div className="flex flex-col rounded-xl border border-line bg-surface p-3 shadow-card @lg:p-4">
      <dt className="text-xs font-medium text-muted">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
        <CountUp value={value} format={format} />
      </dd>
      <dd className="mt-0.5 text-xs text-muted">{detail}</dd>
      {trend && (
        <dd className="mt-auto pt-2 text-brand-ink">
          <Sparkline values={trend} />
        </dd>
      )}
    </div>
  )
}

type CardProps = { summary: Summary; className?: string }

function ActivityCard({ summary, className }: CardProps) {
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const headingId = useId()
  return (
    <div
      role="group"
      aria-labelledby={headingId}
      className={cx('rounded-xl border border-line bg-surface p-4 shadow-card', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 id={headingId} className="text-sm font-semibold">
          Daily activity
        </h4>
        <Segmented
          label="Show daily activity as"
          value={view}
          onChange={setView}
          options={[
            { value: 'chart', label: 'Chart' },
            { value: 'table', label: 'Table' },
          ]}
        />
      </div>
      {view === 'chart' ? (
        <>
          <DailyChart days={summary.days} limit={DAILY_INVITE_LIMIT} />
          <div aria-hidden="true" className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-brand-soft-2" />
              Invites
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 rounded-full bg-violet" />
              Accepted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 border-t-2 border-dashed border-wait/60" />
              Safety limit
            </span>
          </div>
        </>
      ) : (
        <DailyTable days={summary.days} />
      )}
    </div>
  )
}

function FunnelCard({ summary, className }: CardProps) {
  const { funnel } = summary
  const headingId = useId()
  return (
    <div
      role="group"
      aria-labelledby={headingId}
      className={cx('rounded-xl border border-line bg-surface p-4 shadow-card', className)}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h4 id={headingId} className="text-sm font-semibold">
          Pipeline
        </h4>
        <span className="text-xs text-muted">% of previous step</span>
      </div>
      <ol className="mt-3 space-y-2.5">
        {funnel.map((stage, i) => {
          const width = Math.max(ratio(stage.count, funnel[0].count) * 100, 2)
          const step = i > 0 ? ratio(stage.count, funnel[i - 1].count) : null
          return (
            <li key={stage.label} className="grid grid-cols-[6.25rem_1fr_4.75rem] items-center gap-3 text-sm">
              <span className="truncate text-muted">{stage.label}</span>
              <span aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-brand-soft">
                <span
                  className="bar-fill block h-full rounded-full bg-gradient-to-r from-brand to-violet transition-[width] duration-700 ease-out"
                  style={{ width: `${width}%` }}
                />
              </span>
              <span className="text-right tabular-nums">
                <span className="font-semibold">
                  <CountUp value={stage.count} />
                </span>
                {step !== null && <span className="ml-1.5 text-xs text-muted">{formatPercent(step)}</span>}
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-4 flex items-start gap-2 rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted">
        <ShieldCheck className="size-4 shrink-0 text-ok" aria-hidden="true" />
        Peak day {summary.peakInvites} invites, about {Math.round(summary.invitesPerDay)} a day on average, always under
        the {DAILY_INVITE_LIMIT} a day limit
      </p>
    </div>
  )
}

type Props = { range: RangeDays; onRangeChange: (range: RangeDays) => void }

export const AnalyticsPanel = memo(function AnalyticsPanel({ range, onRangeChange }: Props) {
  const [narrowView, setNarrowView] = useState<'activity' | 'pipeline'>('activity')
  const summary = summaries[range]
  const { totals } = summary
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold @lg:text-lg">Good afternoon, Riya</h3>
          <p className="text-sm text-muted">
            {formatNumber(totalLeads)} leads across {campaigns.length} campaigns
          </p>
        </div>
        <Segmented label="Date range" options={rangeOptions} value={range} onChange={onRangeChange} />
      </div>

      <dl className="grid grid-cols-2 gap-3 @2xl:grid-cols-4">
        <Stat
          label="Acceptance rate"
          value={summary.acceptanceRate}
          format={formatPercent}
          detail={`${formatNumber(totals.accepted)} of ${formatNumber(totals.invites)} invites`}
          trend={summary.acceptanceTrend}
        />
        <Stat
          label="Reply rate"
          value={summary.replyRate}
          format={formatPercent}
          detail={`${formatNumber(totals.replies)} of ${formatNumber(totals.messages)} messages`}
          trend={summary.replyTrend}
        />
        <Stat
          label="Meetings booked"
          value={totals.meetings}
          detail={`${formatPercent(summary.meetingRate)} of replies`}
        />
        <Stat
          label="Active campaigns"
          value={runningCampaigns}
          format={(n) => `${Math.round(n)} of ${campaigns.length}`}
          detail="Running right now"
        />
      </dl>

      {/* Narrow containers show one card at a time so every tab keeps a similar height. */}
      <Segmented
        label="Show"
        value={narrowView}
        onChange={setNarrowView}
        options={[
          { value: 'activity', label: 'Daily activity' },
          { value: 'pipeline', label: 'Pipeline' },
        ]}
        className="@3xl:hidden"
      />
      <div className="grid gap-4 @3xl:grid-cols-[1.2fr_1fr]">
        <ActivityCard summary={summary} className={narrowView === 'activity' ? undefined : 'hidden @3xl:block'} />
        <FunnelCard summary={summary} className={narrowView === 'pipeline' ? undefined : 'hidden @3xl:block'} />
      </div>
    </div>
  )
})

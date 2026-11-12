import { Plus, ShieldCheck } from 'lucide-react'
import { campaigns, DAILY_INVITE_LIMIT, funnel, metrics, ratio, totals } from '../../data/demo'
import { formatNumber, formatPercent, formatPoints } from '../../lib/format'
import { Sparkline } from '../ui'

type StatProps = {
  label: string
  value: string
  detail: string
  trend?: number[]
}

function Stat({ label, value, detail, trend }: StatProps) {
  return (
    <div className="flex flex-col rounded-xl border border-line bg-white p-3 sm:p-4">
      <dt className="text-xs font-medium text-muted">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</dd>
      <dd className="mt-0.5 text-xs text-muted">{detail}</dd>
      {trend && (
        <dd className="mt-auto pt-2 text-brand">
          <Sparkline values={trend} />
        </dd>
      )}
    </div>
  )
}

export function AnalyticsPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold sm:text-lg">Good afternoon, Riya</h3>
          <p className="text-sm text-muted">Last 30 days across {campaigns.length} campaigns</p>
        </div>
        <span
          aria-hidden="true"
          className="hidden items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white sm:inline-flex"
        >
          <Plus className="size-4" />
          Create campaign
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="Acceptance rate"
          value={formatPercent(metrics.acceptanceRate)}
          detail={`${formatPoints(metrics.acceptanceDelta)} in 4 weeks`}
          trend={metrics.acceptanceByWeek}
        />
        <Stat
          label="Reply rate"
          value={formatPercent(metrics.replyRate)}
          detail={`${formatPoints(metrics.replyDelta)} in 4 weeks`}
          trend={metrics.replyByWeek}
        />
        <Stat
          label="Meetings booked"
          value={formatNumber(totals.meetings)}
          detail={`From ${totals.replies} replies`}
        />
        <Stat
          label="Active campaigns"
          value={`${metrics.runningCampaigns} of ${campaigns.length}`}
          detail="Running right now"
        />
      </dl>

      <section aria-labelledby="funnel-heading" className="rounded-xl border border-line bg-white p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h4 id="funnel-heading" className="text-sm font-semibold">
            Pipeline
          </h4>
          <span className="text-xs text-muted">% of previous step</span>
        </div>
        <ol className="mt-3 space-y-2.5">
          {funnel.map((stage, i) => {
            const width = Math.max(ratio(stage.count, funnel[0].count) * 100, 2)
            const step = i > 0 ? ratio(stage.count, funnel[i - 1].count) : null
            return (
              <li key={stage.label} className="grid grid-cols-[5.75rem_1fr_5.25rem] items-center gap-3 text-sm">
                <span className="text-muted">{stage.label}</span>
                <span aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-brand-50">
                  <span className="block h-full rounded-full bg-brand" style={{ width: `${width}%` }} />
                </span>
                <span className="text-right tabular-nums">
                  <span className="font-semibold">{formatNumber(stage.count)}</span>
                  {step !== null && <span className="ml-1.5 text-xs text-muted">{formatPercent(step)}</span>}
                </span>
              </li>
            )
          })}
        </ol>
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-canvas px-3 py-2 text-xs text-muted">
          <ShieldCheck className="size-4 shrink-0 text-ok" aria-hidden="true" />
          About {Math.round(metrics.invitesPerDay)} invites a day, under the {DAILY_INVITE_LIMIT} a day safety limit
        </p>
      </section>
    </div>
  )
}

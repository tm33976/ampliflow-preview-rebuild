import { Download } from 'lucide-react'
import { campaigns, leadFilters, leads, totals, type LeadStatus } from '../../data/demo'
import { formatNumber } from '../../lib/format'
import { Avatar, Chip, type Tone } from '../ui'

const statusChip: Record<LeadStatus, { label: string; tone: Tone }> = {
  pending: { label: 'Pending', tone: 'wait' },
  connected: { label: 'Connected', tone: 'brand' },
  replied: { label: 'Replied', tone: 'brand' },
  booked: { label: 'Booked', tone: 'ok' },
}

export function LeadsPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold sm:text-lg">Leads</h3>
          <p className="text-sm text-muted">
            {formatNumber(totals.leads)} leads in {campaigns.length} campaigns
          </p>
        </div>
        <span
          aria-hidden="true"
          className="hidden items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium sm:inline-flex"
        >
          <Download className="size-4" />
          Export CSV
        </span>
      </div>

      <ul aria-label="Lead counts" className="flex flex-wrap gap-1.5">
        {leadFilters.map((filter, i) => (
          <li
            key={filter.label}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              i === 0 ? 'bg-ink text-white' : 'bg-white text-muted ring-1 ring-line ring-inset'
            }`}
          >
            {filter.label} <span className="tabular-nums">{formatNumber(filter.count)}</span>
          </li>
        ))}
      </ul>

      <ul aria-label="Recent leads" className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
        {leads.map((lead) => {
          const chip = statusChip[lead.status]
          return (
            <li
              key={lead.name}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2.5 md:grid-cols-[auto_1.3fr_1fr_auto] lg:grid-cols-[auto_1.3fr_1fr_8.5rem_8rem] lg:px-4"
            >
              <Avatar name={lead.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{lead.name}</p>
                <p className="truncate text-xs text-muted">
                  {lead.role} at {lead.company}
                </p>
                <p className="truncate text-xs text-muted lg:hidden">
                  {lead.lastAction} · {lead.when}
                </p>
              </div>
              <p className="hidden truncate text-xs text-muted md:block">{lead.campaign}</p>
              <div className="justify-self-end lg:justify-self-start">
                <Chip tone={chip.tone}>{chip.label}</Chip>
              </div>
              <p className="hidden text-xs text-muted lg:block">
                {lead.lastAction}
                <br />
                {lead.when}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

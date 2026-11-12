import { Download, Search, SearchX } from 'lucide-react'
import { memo, useDeferredValue, useId, useState } from 'react'
import { Avatar, Chip, Segmented, type SegmentedOption, type Tone } from '../../../components/ui'
import { campaigns, leads, leadStatusCounts, totalLeads, type Lead, type LeadStatus } from '../../../data/demo'
import { formatNumber } from '../../../lib/format'

type Filter = 'all' | LeadStatus

const statusMeta: Record<LeadStatus, { label: string; tone: Tone }> = {
  queued: { label: 'Queued', tone: 'neutral' },
  pending: { label: 'Pending', tone: 'wait' },
  connected: { label: 'Connected', tone: 'sky' },
  replied: { label: 'Replied', tone: 'brand' },
  booked: { label: 'Booked', tone: 'ok' },
}

const filterOptions: SegmentedOption<Filter>[] = [
  { value: 'all', label: 'All', count: totalLeads },
  ...(Object.keys(statusMeta) as LeadStatus[]).map((status) => ({
    value: status,
    label: statusMeta[status].label,
    count: leadStatusCounts[status],
  })),
]

const MAX_ROWS = 6

const matchesQuery = (lead: Lead, query: string) =>
  [lead.name, lead.company, lead.role, lead.campaign].some((field) => field.toLowerCase().includes(query))

function LeadRow({ lead }: { lead: Lead }) {
  const status = statusMeta[lead.status]
  return (
    <li className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2.5 transition-colors hover:bg-surface-2/60 @lg:grid-cols-[auto_1.3fr_1fr_auto] @2xl:grid-cols-[auto_1.3fr_1fr_6.5rem_7.5rem] @2xl:px-4">
      <Avatar name={lead.name} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{lead.name}</p>
        <p className="truncate text-xs text-muted">
          {lead.role} at {lead.company}
        </p>
        <p className="truncate text-xs text-muted @2xl:hidden">
          {lead.lastAction} · {lead.when}
        </p>
      </div>
      <p className="hidden truncate text-xs text-muted @lg:block">{lead.campaign}</p>
      <div className="justify-self-end @2xl:justify-self-start">
        <Chip tone={status.tone}>{status.label}</Chip>
      </div>
      <p className="hidden text-xs text-muted @2xl:block">
        {lead.lastAction}
        <br />
        {lead.when}
      </p>
    </li>
  )
}

export const LeadsPanel = memo(function LeadsPanel() {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const searchId = useId()

  const matches = leads.filter(
    (lead) => (filter === 'all' || lead.status === filter) && matchesQuery(lead, deferredQuery),
  )
  const rows = matches.slice(0, MAX_ROWS)
  const filterTotal = filter === 'all' ? totalLeads : leadStatusCounts[filter]
  const filterName = filter === 'all' ? '' : `${statusMeta[filter].label.toLowerCase()} `

  const status = deferredQuery
    ? `${rows.length} recent ${rows.length === 1 ? 'lead matches' : 'leads match'} “${query.trim()}”`
    : `Showing ${rows.length} of ${formatNumber(filterTotal)} ${filterName}leads`

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold @lg:text-lg">Leads</h3>
          <p className="text-sm text-muted">
            {formatNumber(totalLeads)} leads in {campaigns.length} campaigns
          </p>
        </div>
        <span
          aria-hidden="true"
          className="hidden items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium shadow-card @lg:inline-flex"
        >
          <Download className="size-4" />
          Export CSV
        </span>
      </div>

      <div className="relative">
        <label htmlFor={searchId} className="sr-only">
          Search leads
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, company or campaign"
          autoComplete="off"
          className="h-9 w-full rounded-lg border border-line bg-surface pr-3 pl-9 text-sm placeholder:text-muted focus-visible:border-brand-ink"
        />
      </div>

      <Segmented label="Filter by status" variant="chips" options={filterOptions} value={filter} onChange={setFilter} />

      {rows.length > 0 ? (
        <ul
          aria-label="Recent leads"
          className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-card"
        >
          {rows.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line-strong bg-surface px-4 py-8 text-center">
          <SearchX className="size-6 text-muted" aria-hidden="true" />
          <p className="text-sm font-medium">No recent leads match that search</p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setFilter('all')
            }}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-ink hover:bg-brand-soft"
          >
            Clear search and filters
          </button>
        </div>
      )}

      <p role="status" className="text-xs text-muted">
        {status}
      </p>
    </div>
  )
})

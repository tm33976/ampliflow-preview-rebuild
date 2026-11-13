import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { SectionHeading } from '../../components/SectionHeading'
import { Chip, CountUp, Segmented, type SegmentedOption } from '../../components/ui'
import { RevealContext } from '../../components/reveal'
import { useInView } from '../../lib/hooks'
import { CATEGORY_LABELS, findings, LINKS_CHECKED, type Category, type Finding, type Severity } from './findings'

type Filter = 'all' | Category

const severityStyle: Record<Severity, { dot: string; label: string }> = {
  high: { dot: 'bg-[#e5484d]', label: 'High priority' },
  medium: { dot: 'bg-[#f5a524]', label: 'Medium priority' },
  low: { dot: 'bg-line-strong', label: 'Low priority' },
}

const filterOptions: SegmentedOption<Filter>[] = [
  { value: 'all', label: 'All', count: findings.length },
  ...(Object.keys(CATEGORY_LABELS) as Category[]).map((category) => ({
    value: category,
    label: CATEGORY_LABELS[category],
    count: findings.filter((f) => f.category === category).length,
  })),
]

const stats = [
  { label: 'Links checked', value: LINKS_CHECKED, note: 'every page loads' },
  { label: 'Findings', value: findings.length, note: 'across both pages' },
  { label: 'High priority', value: findings.filter((f) => f.severity === 'high').length, note: 'worth fixing first' },
  {
    label: 'Fixed on this page',
    value: findings.filter((f) => f.status === 'fixed').length,
    note: 'the rest are live site quick wins',
  },
]

function FindingCard({ finding }: { finding: Finding }) {
  const severity = severityStyle[finding.severity]
  return (
    <li className="spotlight flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center gap-2 text-xs font-medium text-muted">
        <span className={`size-2 rounded-full ${severity.dot}`} aria-hidden="true" />
        <span>
          <span className="sr-only">{severity.label}, </span>
          {CATEGORY_LABELS[finding.category]}
        </span>
        <Chip tone={finding.status === 'fixed' ? 'ok' : 'wait'} className="ml-auto">
          {finding.status === 'fixed' ? 'Fixed here' : 'Quick win'}
        </Chip>
      </div>
      <h3 className="mt-3 font-semibold">{finding.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        <span className="font-medium text-ink">Found: </span>
        {finding.found}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        <span className="font-medium text-ink">Fix: </span>
        {finding.fix}
      </p>
      {finding.where && (
        <a
          href={`#${finding.where}`}
          className="mt-auto inline-flex items-center gap-1 self-start pt-3 text-sm font-medium text-brand-ink hover:underline"
        >
          See it on this page
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </a>
      )}
    </li>
  )
}

export function Audit() {
  const [filter, setFilter] = useState<Filter>('all')
  const [statsRef, statsSeen] = useInView<HTMLDListElement>(0.4, { once: true })
  const visible = findings.filter((f) => filter === 'all' || f.category === filter)

  return (
    <section
      id="audit"
      aria-labelledby="audit-heading"
      className="defer-render border-y border-line bg-surface/60 px-4 py-20 sm:px-6 sm:py-28"
    >
      <SectionHeading id="audit-heading" eyebrow="Audit" title="I audited ampliflow.in. Here is what I found.">
        Every page and link, Lighthouse and axe runs, a phone and desktop review, and the copy read end to end. Most
        fixes are small, and nearly all of them are already applied on this page.
      </SectionHeading>

      <RevealContext value={statsSeen}>
        <dl ref={statsRef} className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
              <dt className="text-sm text-muted">{stat.label}</dt>
              <dd className="mt-1 text-gradient text-4xl font-semibold tracking-tight tabular-nums">
                <CountUp value={stat.value} />
              </dd>
              <dd className="mt-1 text-xs text-muted">{stat.note}</dd>
            </div>
          ))}
        </dl>
      </RevealContext>

      <div className="mx-auto mt-10 max-w-6xl">
        <Segmented
          label="Filter findings by category"
          variant="chips"
          options={filterOptions}
          value={filter}
          onChange={setFilter}
          className="justify-center"
        />
        <p role="status" className="mt-4 text-center text-sm text-muted">
          Showing {visible.length} of {findings.length} findings
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((finding) => (
            <FindingCard key={finding.id} finding={finding} />
          ))}
        </ul>
      </div>
    </section>
  )
}

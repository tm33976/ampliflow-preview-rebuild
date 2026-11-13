import { BarChart3, Cloud, Inbox, Link2, ShieldCheck, Workflow, type LucideIcon } from 'lucide-react'
import { SectionHeading } from '../../components/SectionHeading'
import { Chip } from '../../components/ui'
import { integrations, numberWord, systems } from '../../data/site'

const icons: Record<string, LucideIcon> = {
  builder: Workflow,
  cloud: Cloud,
  import: Link2,
  safety: ShieldCheck,
  inbox: Inbox,
  analytics: BarChart3,
}

function Integrations() {
  return (
    <div className="spotlight scroll-reveal mx-auto mt-6 flex max-w-6xl flex-col gap-5 rounded-2xl border border-line bg-surface p-6 shadow-card lg:flex-row lg:items-center">
      <div className="lg:w-72">
        <h3 className="font-semibold">Plugs into the stack you already run</h3>
        <p className="mt-1 text-sm text-muted">Listed once, by status, so the homepage and pricing never disagree.</p>
      </div>
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-start">
        <div className="sm:w-56">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Live now</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {integrations.live.map((name) => (
              <li key={name}>
                <Chip tone="ok">
                  <span className="size-1.5 rounded-full bg-ok" aria-hidden="true" />
                  {name}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Rolling out through 2026</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {integrations.planned.map((name) => (
              <li key={name}>
                <Chip tone="neutral">{name}</Chip>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="defer-render px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        id="features-heading"
        eyebrow="Product"
        title={`The complete outreach engine, in ${numberWord(systems.length)} systems.`}
      >
        Built for founders, SDRs and recruiters who need outreach at scale, without the complexity or the invoice.
      </SectionHeading>

      <ul className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {systems.map((system, i) => {
          const Icon = icons[system.id]
          return (
            <li
              key={system.id}
              className="spotlight group rounded-2xl border border-line bg-surface p-6 shadow-card transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet text-white shadow-float transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-6">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-muted tabular-nums" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-5 font-semibold">{system.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{system.body}</p>
              <p className="mt-4">
                <Chip tone="brand">{system.proof}</Chip>
              </p>
            </li>
          )
        })}
      </ul>

      <Integrations />
    </section>
  )
}

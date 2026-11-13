import { ArrowRight, Check } from 'lucide-react'
import { SectionHeading } from '../../components/SectionHeading'
import { Chip } from '../../components/ui'
import { DAILY_INVITE_LIMIT } from '../../data/demo'
import { FOUNDING_SPOTS, plans, type Plan } from '../../data/site'
import { cx } from '../../lib/cx'
import { focusSignup } from '../../lib/focus'

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <li
      className={cx(
        'spotlight relative flex flex-col rounded-3xl p-6',
        plan.featured ? 'beam shadow-frame lg:-mt-4 lg:pb-10' : 'border border-line bg-surface shadow-card',
      )}
    >
      {plan.featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-brand to-violet px-3 py-1 text-xs font-semibold text-white shadow-float">
          Most popular
        </span>
      )}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        {plan.regular && <Chip tone="brand">Founding price</Chip>}
      </div>
      <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
      <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
        <span className="text-5xl font-semibold tracking-tight tabular-nums">${plan.price}</span>
        <span className="text-sm text-muted">a month</span>
        {plan.regular && (
          <s className="text-sm text-muted">
            <span className="sr-only">Regular price </span>${plan.regular}
          </s>
        )}
      </p>
      <button
        type="button"
        onClick={focusSignup}
        className={cx(
          'mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl font-semibold transition-colors',
          plan.featured
            ? 'shine bg-brand text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)] hover:bg-brand-hover'
            : 'border border-line bg-surface hover:border-line-strong',
        )}
      >
        Start 7 day trial
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
      <ul className="mt-6 space-y-2.5 text-sm">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <dl className="grid grid-cols-3 gap-2 rounded-xl bg-surface-2 p-3 text-center">
          {(
            [
              ['Invites', plan.limits.invites],
              ['Messages', plan.limits.messages],
              ['Views', plan.limits.views],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex flex-col-reverse">
              <dt className="text-[11px] text-muted">{label} a day</dt>
              <dd className="text-base font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </li>
  )
}

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="defer-render px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading id="pricing-heading" eyebrow="Pricing" title="Lock in the founding price for life">
        The first {FOUNDING_SPOTS} accounts keep founding prices for as long as the account exists. Every plan starts
        with a 7 day free trial, billed on day 7. Cancel any time.
      </SectionHeading>
      <ul className="mx-auto mt-16 grid max-w-6xl items-stretch gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </ul>
      <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted">
        Daily limits are the safe maximums Ampliflow enforces. Connection requests stay at {DAILY_INVITE_LIMIT} a day on
        every plan.
      </p>
    </section>
  )
}

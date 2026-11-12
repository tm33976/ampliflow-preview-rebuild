import { ArrowRight, Check, Gauge, Keyboard, MonitorSmartphone, Pause } from 'lucide-react'
import type { ReactNode } from 'react'
import { SectionHeading } from '../../components/SectionHeading'
import { Chip } from '../../components/ui'
import { cx } from '../../lib/cx'

function Card({
  title,
  children,
  visual,
  className,
}: {
  title: string
  children: ReactNode
  visual: ReactNode
  className?: string
}) {
  return (
    <li
      className={cx(
        'scroll-reveal group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-card',
        className,
      )}
    >
      <div aria-hidden="true" className="mb-6 flex min-h-24 items-center">
        {visual}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>
    </li>
  )
}

const a11yWins = [
  'Real tabs, radio groups and listboxes',
  'Every control works from the keyboard',
  'Screen reader announcements for changes',
  'Pause control for auto rotation (WCAG 2.2.2)',
  'Reduced motion respected everywhere',
  'AA contrast in light and dark themes',
]

const tradeOffs = [
  {
    choice: 'Live components over screenshots',
    gain: 'Sharp at every size, consistent numbers, about a megabyte lighter.',
    cost: 'Components can drift from the real app over time.',
    plan: 'Build the preview from the app’s own components with mock data, so it ships when the app ships.',
  },
  {
    choice: 'No chart library',
    gain: 'Zero extra kilobytes and full control over keyboard and screen reader behavior.',
    cost: 'More code to own than a drop in chart.',
    plan: 'Fine for two small charts. If dashboards grow, move to a library behind the same accessible wrapper.',
  },
  {
    choice: 'Container queries over breakpoints',
    gain: 'One component works in the app, on the marketing page and inside the phone demo.',
    cost: 'Needs a 2023 or newer browser.',
    plan: 'Acceptable for founders and SDRs on current browsers, and the layout still reads if queries fail.',
  },
]

const weekOne = [
  {
    title: 'Measure first',
    body: 'Track hero signups, tab clicks and scroll depth for a week, so the redesign is judged on data instead of taste.',
  },
  {
    title: 'Ship behind a flag',
    body: 'Mount the preview as a small island on the static site, keep the screenshots as a fallback, and compare signups.',
  },
  {
    title: 'Fix the quick wins',
    body: 'Self host the fonts, stop hiding the hero subtitle behind a fade in, and correct the “six systems” heading that lists five.',
  },
]

export function Story() {
  return (
    <section
      id="decisions"
      aria-labelledby="decisions-heading"
      className="border-t border-line bg-surface/60 py-20 sm:py-28"
    >
      <SectionHeading id="decisions-heading" eyebrow="Decisions" title="What changed, and the thinking behind it">
        The goal was never a prettier screenshot. It was a preview a founder can trust, read on any screen and use with
        any input.
      </SectionHeading>

      <ul className="mx-auto mt-14 grid max-w-6xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Numbers that agree"
          className="lg:col-span-2"
          visual={
            <div className="flex flex-wrap items-center gap-3">
              {['874', '1,000', '1,074'].map((value) => (
                <span
                  key={value}
                  className="rounded-lg bg-rose-soft px-3 py-1.5 text-lg font-semibold text-rose line-through"
                >
                  {value}
                </span>
              ))}
              <ArrowRight className="size-5 text-muted" />
              <span className="rounded-lg bg-ok-soft px-3 py-1.5 text-lg font-semibold text-ok">1,000 everywhere</span>
            </div>
          }
        >
          The original shows three different lead totals across its tabs and a dashboard with 0% acceptance. Here every
          count and rate comes from one dataset, and unit tests fail the build if any two numbers disagree.
        </Card>

        <Card
          title="Accessible by default"
          className="lg:row-span-2"
          visual={
            <span className="grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
              <Keyboard className="size-7" />
            </span>
          }
        >
          <span className="mt-1 flex flex-col gap-2.5">
            {a11yWins.map((win) => (
              <span key={win} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden="true" />
                {win}
              </span>
            ))}
          </span>
        </Card>

        <Card
          title="Laid out by its container"
          visual={
            <div className="flex items-end gap-3">
              <span className="flex h-20 w-32 flex-col gap-1.5 rounded-lg border border-line-strong bg-surface-2 p-2">
                <span className="h-2 w-12 rounded bg-brand-soft-2" />
                <span className="grid flex-1 grid-cols-4 gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="rounded bg-brand-soft" />
                  ))}
                </span>
              </span>
              <span className="flex h-20 w-11 flex-col gap-1 rounded-lg border border-line-strong bg-surface-2 p-1.5">
                <span className="h-1.5 w-5 rounded bg-brand-soft-2" />
                <span className="grid flex-1 grid-cols-2 gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="rounded bg-brand-soft" />
                  ))}
                </span>
              </span>
              <MonitorSmartphone className="mb-1 size-5 text-muted" />
            </div>
          }
        >
          Panels react to their own width with container queries, so the exact same component runs full width, in a
          tablet column and inside the phone above.
        </Card>

        <Card
          title="Motion that respects people"
          visual={
            <div className="flex items-center gap-3">
              <span className="relative h-9 w-40 overflow-hidden rounded-lg border border-line bg-surface-2">
                <span className="absolute inset-y-1 left-1 w-[45%] rounded-md bg-brand-soft" />
                <span className="absolute bottom-1 left-3 h-0.5 w-[30%] rounded-full bg-brand-ink" />
              </span>
              <span className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-muted">
                <Pause className="size-4" />
              </span>
            </div>
          }
        >
          Tabs rotate every 8 seconds with a visible timer, pause on hover, focus or off screen, stop the moment you
          interact, and never move with reduced motion on.
        </Card>
      </ul>

      <div className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <h3 className="scroll-reveal text-center text-xl font-semibold tracking-tight">
          Trade offs I chose on purpose
        </h3>
        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {tradeOffs.map((item) => (
            <li key={item.choice} className="scroll-reveal rounded-2xl border border-line bg-surface p-6 shadow-card">
              <p className="font-semibold">{item.choice}</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt>
                    <Chip tone="ok">Gain</Chip>
                  </dt>
                  <dd className="mt-1.5 text-muted">{item.gain}</dd>
                </div>
                <div>
                  <dt>
                    <Chip tone="wait">Cost</Chip>
                  </dt>
                  <dd className="mt-1.5 text-muted">{item.cost}</dd>
                </div>
                <div>
                  <dt>
                    <Chip tone="brand">Plan</Chip>
                  </dt>
                  <dd className="mt-1.5 text-muted">{item.plan}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-20 max-w-4xl px-4 sm:px-6">
        <h3 className="scroll-reveal flex items-center justify-center gap-2 text-center text-xl font-semibold tracking-tight">
          <Gauge className="size-5 text-brand-ink" aria-hidden="true" />
          What I would do in week one
        </h3>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {weekOne.map((step, i) => (
            <li
              key={step.title}
              className="scroll-reveal relative rounded-2xl border border-line bg-surface p-6 shadow-card"
            >
              <span
                aria-hidden="true"
                className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-brand to-violet text-sm font-semibold text-white"
              >
                {i + 1}
              </span>
              <p className="mt-4 font-semibold">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

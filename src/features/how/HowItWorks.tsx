import { Clock } from 'lucide-react'
import { SectionHeading } from '../../components/SectionHeading'
import { Chip } from '../../components/ui'
import { steps } from '../../data/site'

export function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-heading"
      className="defer-render border-y border-line bg-surface/60 px-4 py-20 sm:px-6 sm:py-28"
    >
      <SectionHeading
        id="how-heading"
        eyebrow="How it works"
        title="Live in under an hour. Replies over the next few days."
      >
        Setup is quick. The sending is deliberately unhurried, because human pacing is what keeps your account safe.
      </SectionHeading>

      <ol className="steps-timeline relative mx-auto mt-14 max-w-3xl">
        <span
          aria-hidden="true"
          className="absolute top-4 bottom-4 left-[1.0625rem] w-0.5 overflow-hidden rounded-full bg-line"
        >
          <span className="steps-rail-fill absolute inset-0 origin-top rounded-full bg-gradient-to-b from-brand to-violet" />
        </span>
        {steps.map((step, i) => (
          <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
            <span
              aria-hidden="true"
              className="step-dot relative z-10 mt-4 grid size-9 shrink-0 place-items-center rounded-full border border-line bg-brand text-sm font-semibold text-white"
            >
              {i + 1}
            </span>
            <div className="spotlight flex-1 rounded-2xl border border-line bg-surface p-5 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">{step.title}</h3>
                <Chip tone={i === steps.length - 1 ? 'wait' : 'neutral'}>
                  <Clock className="size-3.5" aria-hidden="true" />
                  {step.time}
                </Chip>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

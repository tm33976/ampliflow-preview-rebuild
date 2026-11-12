import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'

const proofPoints = ['24/7 cloud execution', 'No browser extension', '7 day free trial']

export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[46rem] bg-grid" />
      <div
        className="absolute -top-48 left-1/2 h-[40rem] w-[72rem] -translate-x-1/2"
        style={{ background: 'radial-gradient(closest-side, var(--glow-1), transparent)' }}
      />
      <div
        className="absolute top-72 -left-48 size-[34rem]"
        style={{ background: 'radial-gradient(closest-side, var(--glow-2), transparent)' }}
      />
      <div
        className="absolute top-[28rem] -right-56 size-[38rem]"
        style={{ background: 'radial-gradient(closest-side, var(--glow-3), transparent)' }}
      />
    </div>
  )
}

export function Hero() {
  const [submitted, setSubmitted] = useState(false)
  const emailId = useId()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section aria-labelledby="hero-heading" className="mx-auto max-w-4xl px-5 pt-14 pb-12 text-center sm:pt-20">
      <p className="inline-flex animate-enter items-center gap-2 rounded-full border border-line bg-surface/80 py-1 pr-3 pl-1 text-xs font-medium shadow-card backdrop-blur sm:text-sm">
        <span className="relative flex items-center gap-1.5 rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping-soft rounded-full bg-white/80" />
            <span className="relative inline-flex size-1.5 rounded-full bg-white" />
          </span>
          LIVE
        </span>
        Founding member offer · Only 100 spots
      </p>
      <h1
        id="hero-heading"
        tabIndex={-1}
        className="mt-7 rounded-md text-[2.6rem] leading-[1.05] font-bold tracking-tighter text-balance sm:text-6xl lg:text-7xl"
      >
        Turn LinkedIn outreach into <span className="text-gradient pr-1">pipeline</span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base text-pretty text-muted sm:text-lg">
        Reach hundreds of qualified prospects and <strong className="font-semibold text-ink">book more meetings</strong>
        , with safe, automated LinkedIn outreach built for SaaS founders, SDRs, and recruiters.
      </p>
      <form onSubmit={onSubmit} className="mx-auto mt-9 flex max-w-md flex-col gap-2 sm:flex-row">
        <label htmlFor={emailId} className="sr-only">
          Work email
        </label>
        <input
          id={emailId}
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="h-12 w-full min-w-0 rounded-xl border border-line bg-surface px-4 text-base shadow-card placeholder:text-muted focus-visible:border-brand-ink sm:flex-1"
        />
        <button
          type="submit"
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_8px_24px_-8px_var(--glow-1)] transition-colors hover:bg-brand-hover"
        >
          Get 7 days free
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </form>
      <p role="status" className="mt-3 min-h-5 text-sm text-muted">
        {submitted ? 'This is a prototype, so nothing was sent.' : ''}
      </p>
      <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted">
        {proofPoints.map((point) => (
          <li key={point} className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-ok" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
    </section>
  )
}

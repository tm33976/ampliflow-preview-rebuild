import { useState, type FormEvent } from 'react'

export function Hero() {
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="mx-auto max-w-3xl px-5 pt-12 pb-10 text-center sm:pt-16">
      <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white py-1 pr-3 pl-1 text-xs font-medium sm:text-sm">
        <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white">LIVE</span>
        Founding member offer · Only 100 spots
      </p>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
        Turn LinkedIn outreach into <span className="text-brand">pipeline</span>
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-base text-pretty text-muted sm:text-lg">
        Reach hundreds of qualified prospects and <strong className="font-semibold text-ink">book more meetings</strong>,
        with safe, automated LinkedIn outreach built for SaaS founders, SDRs, and recruiters.
      </p>
      <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row">
        <label htmlFor="hero-email" className="sr-only">
          Work email
        </label>
        <input
          id="hero-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="h-12 w-full min-w-0 rounded-xl border border-line bg-white px-4 text-base placeholder:text-muted/80 focus-visible:border-brand sm:flex-1"
        />
        <button
          type="submit"
          className="h-12 rounded-xl bg-brand px-5 font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Get 7 days free
        </button>
      </form>
      <p role="status" className="mt-3 min-h-5 text-sm text-muted">
        {submitted ? 'This is a prototype, so nothing was sent.' : ''}
      </p>
    </section>
  )
}

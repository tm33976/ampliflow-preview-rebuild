export function CaseStudyDivider() {
  return (
    <section aria-labelledby="case-study-heading" className="scroll-reveal px-4 pt-10 pb-16 text-center sm:px-6">
      <div
        aria-hidden="true"
        className="mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-brand-ink/50 to-transparent"
      />
      <p className="mt-12 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted shadow-card">
        <span className="size-1.5 rounded-full bg-gradient-to-r from-brand to-violet" aria-hidden="true" />
        The case study
      </p>
      <h2 id="case-study-heading" className="mt-4 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        Everything above is ampliflow.in, rebuilt with the fixes applied.
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-pretty text-muted">
        Below is what I found on the live site, how the rebuild behaves on a phone, what I measured, and why I made each
        call.
      </p>
    </section>
  )
}

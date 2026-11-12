import type { ReactNode } from 'react'

type Props = { id: string; eyebrow: string; title: ReactNode; children?: ReactNode }

export function SectionHeading({ id, eyebrow, title, children }: Props) {
  return (
    <div className="scroll-reveal mx-auto max-w-2xl px-5 text-center">
      <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted shadow-card">
        <span className="size-1.5 rounded-full bg-gradient-to-r from-brand to-violet" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2
        id={id}
        tabIndex={-1}
        className="mt-4 rounded-md text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
      >
        {title}
      </h2>
      {children && <p className="mt-4 text-pretty text-muted">{children}</p>}
    </div>
  )
}

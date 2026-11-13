import { ArrowUpRight, Command } from 'lucide-react'
import { Kbd } from '../../components/ui'
import { LINKS, shortcutLabel } from '../../lib/links'

export function Closing({ onOpenPalette }: { onOpenPalette: () => void }) {
  return (
    <section aria-labelledby="closing-heading" className="defer-render px-4 py-20 sm:px-6 sm:py-28">
      <div className="beam scroll-reveal relative mx-auto max-w-4xl overflow-hidden rounded-3xl px-6 py-14 text-center shadow-frame sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 80% at 50% 0%, var(--glow-1), transparent 70%), radial-gradient(40% 60% at 100% 100%, var(--glow-2), transparent 70%)',
          }}
        />
        <div className="relative">
          <h2 id="closing-heading" className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Thanks for taking a look
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted">
            Everything here is real code: every number comes from one dataset, every control works from the keyboard,
            and the whole page weighs less than one of the original screenshots.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
              className="shine inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)] transition-colors hover:bg-brand-hover"
            >
              Read the source
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={onOpenPalette}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-5 font-semibold shadow-card transition-colors hover:border-line-strong"
            >
              <Command className="size-4" aria-hidden="true" />
              Explore with the command menu
              <Kbd>{shortcutLabel()}</Kbd>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

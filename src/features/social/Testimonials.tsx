import { Pause, Play } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { SectionHeading } from '../../components/SectionHeading'
import { Avatar } from '../../components/ui'
import { testimonials, type Testimonial } from '../../data/site'
import { cx } from '../../lib/cx'

function Quote({ testimonial }: { testimonial: Testimonial }) {
  return (
    <li className="w-[min(22rem,80vw)] shrink-0">
      <figure className="spotlight flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card">
        <blockquote className="flex-1 text-sm leading-relaxed text-ink-2">“{testimonial.quote}”</blockquote>
        <figcaption className="mt-4 flex items-center gap-3">
          <Avatar name={testimonial.name} />
          <span>
            <span className="block text-sm font-semibold">{testimonial.name}</span>
            <span className="block text-xs text-muted">{testimonial.role}</span>
          </span>
        </figcaption>
      </figure>
    </li>
  )
}

type RowProps = { items: Testimonial[]; reverse?: boolean; decorative?: boolean; paused: boolean }

/** The track renders the list twice and slides by exactly one copy, so the loop is seamless. */
function MarqueeRow({ items, reverse, decorative, paused }: RowProps) {
  const list = (copy: boolean) => (
    <ul
      aria-hidden={copy || decorative || undefined}
      inert={copy || decorative}
      className={cx('flex shrink-0 gap-4', copy && 'marquee-copy')}
    >
      {items.map((item) => (
        <Quote key={item.name} testimonial={item} />
      ))}
    </ul>
  )
  return (
    <div
      className="marquee overflow-hidden py-2"
      data-reverse={reverse || undefined}
      style={{ '--marquee-gap': '1rem', '--marquee-duration': '80s' } as CSSProperties}
    >
      <div className="marquee-track flex w-max gap-4" style={paused ? { animationPlayState: 'paused' } : undefined}>
        {list(false)}
        {list(true)}
      </div>
    </div>
  )
}

export function Testimonials() {
  const [paused, setPaused] = useState(false)
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="defer-render overflow-hidden border-y border-line bg-surface/60 py-20 sm:py-28"
    >
      <SectionHeading
        id="testimonials-heading"
        eyebrow="Founding members"
        title="From the first founders locked in at $19"
      >
        Quoted word for word from ampliflow.in. Rows pause while you hover them.
      </SectionHeading>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setPaused((current) => !current)}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm text-muted shadow-card transition-colors hover:text-ink"
        >
          {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
          {paused ? 'Play quotes' : 'Pause quotes'}
        </button>
      </div>
      <div className="mt-10 space-y-4">
        <MarqueeRow items={testimonials} paused={paused} />
        <MarqueeRow items={[...testimonials].reverse()} reverse decorative paused={paused} />
      </div>
    </section>
  )
}

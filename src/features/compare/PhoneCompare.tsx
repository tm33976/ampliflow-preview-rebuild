import type { ReactNode } from 'react'
import { SectionHeading } from '../../components/SectionHeading'
import { Chip } from '../../components/ui'
import { useInView, useMediaQuery } from '../../lib/hooks'
import { ProductPreview } from '../preview/ProductPreview'

const ORIGINAL_SCREENSHOT = 'https://ampliflow.in/dash-analytics.webp'

function StatusBar() {
  return (
    <div aria-hidden="true" className="flex h-11 shrink-0 items-center justify-between px-7 text-[12px] font-semibold">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="flex items-end gap-px">
          {[4, 6, 8, 10].map((h) => (
            <span key={h} className="w-[3px] rounded-sm bg-ink" style={{ height: h }} />
          ))}
        </span>
        <span className="ml-1 h-2.5 w-5 rounded-[3px] border border-ink/60 p-px">
          <span className="block h-full w-3/4 rounded-[1px] bg-ink" />
        </span>
      </span>
    </div>
  )
}

function Phone({ children, scrollLabel }: { children: ReactNode; scrollLabel?: string }) {
  return (
    <div className="relative w-[21.5rem] max-w-full rounded-[2.9rem] bg-[#0d0f14] p-2.5 shadow-frame ring-1 ring-line-strong">
      <div className="relative flex h-[42rem] flex-col overflow-hidden rounded-[2.35rem] bg-canvas">
        <div
          aria-hidden="true"
          className="absolute top-2.5 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-[#0d0f14]"
        />
        <StatusBar />
        {scrollLabel ? (
          <div role="region" aria-label={scrollLabel} className="flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">{children}</div>
        )}
      </div>
    </div>
  )
}

function OriginalScreen({ load }: { load: boolean }) {
  return (
    <div className="px-3 pt-1">
      <p aria-hidden="true" className="mx-auto w-max rounded-full bg-surface-2 px-3 py-1 text-[11px] text-muted">
        ampliflow.in
      </p>
      <div
        aria-hidden="true"
        className="mt-4 grid grid-cols-4 overflow-hidden rounded-lg border border-line bg-surface text-center text-[10px] font-medium text-muted"
      >
        {['Analytics', 'Workflow', 'Leads', 'Smart Inbox'].map((tab, i) => (
          <span key={tab} className={i === 0 ? 'bg-surface-2 py-2 text-ink' : 'py-2'}>
            {tab}
          </span>
        ))}
      </div>
      {load ? (
        <img
          src={ORIGINAL_SCREENSHOT}
          alt="Ampliflow's current analytics screenshot squeezed to phone width. The text is too small to read."
          width={2400}
          height={1528}
          decoding="async"
          referrerPolicy="no-referrer"
          className="mt-2 h-auto w-full rounded-md border border-line"
        />
      ) : (
        <div className="mt-2 aspect-[2400/1528] w-full rounded-md border border-line bg-surface-2" />
      )}
      <p className="mt-5 rounded-xl bg-rose-soft p-3 text-xs leading-relaxed text-rose">
        On a 390 pixel phone, ampliflow.in shows this 2400 pixel screenshot about 350 pixels wide. Most of its text
        renders at 2 to 3 pixels, and the tabs keep switching every 4 seconds.
      </p>
    </div>
  )
}

export function PhoneCompare() {
  // Both phones are heavy (a 234 KB remote screenshot and a second live preview), so they
  // mount only when the section is close, and the live phone only where it is shown.
  const [stageRef, near] = useInView<HTMLDivElement>(0, { once: true, rootMargin: '600px 0px' })
  const wide = useMediaQuery('(min-width: 48rem)')

  return (
    <section id="phone" aria-labelledby="phone-heading" className="border-y border-line bg-surface/60 py-20 sm:py-28">
      <SectionHeading
        id="phone-heading"
        eyebrow="On a phone"
        title="The same preview, on the screen founders actually use"
      >
        Most founders open links from LinkedIn on their phone. Here is ampliflow.in today at real size, and the rebuild
        running live: the same component, laid out by container queries instead of screen width.
      </SectionHeading>

      <div ref={stageRef} className="mx-auto mt-14 grid max-w-4xl justify-items-center gap-14 px-4 md:grid-cols-2">
        <figure className="scroll-reveal flex flex-col items-center gap-4">
          <figcaption className="flex items-center gap-2 text-sm font-semibold">
            Today
            <Chip tone="rose">Static screenshot</Chip>
          </figcaption>
          <Phone>
            <OriginalScreen load={near} />
          </Phone>
        </figure>

        <figure className="scroll-reveal hidden flex-col items-center gap-4 md:flex">
          <figcaption className="flex items-center gap-2 text-sm font-semibold">
            Rebuild
            <Chip tone="ok">Live components</Chip>
          </figcaption>
          <Phone scrollLabel="Rebuild running inside a phone frame">
            {near && wide && <ProductPreview label="Product preview on a phone" className="px-2 pt-1 pb-6" />}
          </Phone>
        </figure>

        <p className="max-w-xs text-center text-sm text-muted md:hidden">
          You are already looking at the rebuild on your phone. Scroll back up and try the tabs.
        </p>
      </div>
    </section>
  )
}

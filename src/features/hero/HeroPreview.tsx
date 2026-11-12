import { CalendarCheck, MessageSquareText, UserCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { Avatar } from '../../components/ui'
import { cx } from '../../lib/cx'
import type { PreviewController } from '../preview/controller'
import { ProductPreview } from '../preview/ProductPreview'

type ToastProps = {
  name: string
  title: string
  detail: string
  icon: ReactNode
  className: string
  delay: string
  /** Only shown on very wide screens, where it fits beside the frame. */
  wideOnly?: boolean
}

function Toast({ name, title, detail, icon, className, delay, wideOnly }: ToastProps) {
  return (
    <div
      className={cx('absolute z-20 hidden w-64 animate-enter', wideOnly ? '2xl:block' : 'xl:block', className)}
      style={{ animationDelay: delay }}
    >
      <div
        className="flex animate-float items-start gap-3 rounded-2xl border border-line bg-surface/90 p-3 shadow-float backdrop-blur"
        style={{ animationDelay: `calc(${delay} * -3)` }}
      >
        <Avatar name={name} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] leading-snug font-semibold">{title}</p>
          <p className="mt-0.5 truncate text-xs text-muted">{detail}</p>
        </div>
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-ink">
          {icon}
        </span>
      </div>
    </div>
  )
}

/** The hero copy of the preview, with depth: a glow, floating activity and a scroll driven tilt. */
export function HeroPreview({ controller }: { controller: PreviewController }) {
  return (
    <section
      id="preview"
      aria-label="Interactive product preview"
      className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-16 -z-10 mx-auto h-[70%] max-w-5xl"
        style={{ background: 'radial-gradient(closest-side, var(--glow-1), transparent 75%)' }}
      />
      <div aria-hidden="true">
        <Toast
          name="Sofia Martins"
          title="Sofia Martins accepted your invite"
          detail="CTO at Quanta Labs"
          icon={<UserCheck className="size-3.5" />}
          className="top-[30%] -left-8"
          delay="0.5s"
        />
        <Toast
          name="Ananya Rao"
          title="Meeting booked with Ananya"
          detail="Thursday, 4:00 PM"
          icon={<CalendarCheck className="size-3.5" />}
          className="bottom-36 -left-4"
          delay="0.9s"
        />
        <Toast
          name="Marcus Lee"
          title="Marcus Lee replied"
          detail="What does pricing look like for a team of 3?"
          icon={<MessageSquareText className="size-3.5" />}
          className="top-[5.25rem] -right-44"
          delay="1.3s"
          wideOnly
        />
      </div>
      <ProductPreview controller={controller} className="scroll-tilt origin-top" />
    </section>
  )
}

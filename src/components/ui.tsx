import { AudioLines } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cx } from '../lib/cx'
import { formatNumber } from '../lib/format'
import { useReducedMotion, useRovingFocus } from '../lib/hooks'
import { useRevealed } from './reveal'

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-ink', className)}>
      <AudioLines className="size-5 text-brand-ink" aria-hidden="true" />
      <span className="text-[1.05rem] tracking-tight">
        <span className="font-bold">ampli</span>
        <span className="font-medium">flow</span>
      </span>
    </span>
  )
}

const tones = {
  ok: 'bg-ok-soft text-ok',
  wait: 'bg-wait-soft text-wait',
  brand: 'bg-brand-soft text-brand-ink',
  rose: 'bg-rose-soft text-rose',
  sky: 'bg-sky-soft text-sky',
  neutral: 'bg-surface-2 text-muted ring-1 ring-line ring-inset',
}

export type Tone = keyof typeof tones

export function Chip({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

const avatarTones: Tone[] = ['brand', 'ok', 'wait', 'rose', 'sky']

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
  const tone = avatarTones[[...name].reduce((n, ch) => n + ch.charCodeAt(0), 0) % avatarTones.length]
  return (
    <span
      aria-hidden="true"
      className={cx(
        'grid shrink-0 place-items-center rounded-full font-semibold',
        tones[tone],
        size === 'sm' && 'size-8 text-xs',
        size === 'md' && 'size-9 text-sm',
        size === 'lg' && 'size-11 text-base',
      )}
    >
      {initials}
    </span>
  )
}

export function Sparkline({ values }: { values: number[] }) {
  const min = Math.min(...values)
  const span = Math.max(...values) - min || 1
  const step = values.length > 1 ? 100 / (values.length - 1) : 100
  const line = values.map((v, i) => `${i * step},${27 - ((v - min) / span) * 22}`).join(' ')
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full overflow-visible" aria-hidden="true">
      <polygon points={`0,32 ${line} 100,32`} className="fill-brand-soft transition-all duration-500" />
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

const variableLabels: Record<string, string> = { first_name: 'First name', company: 'Company' }

export function MessageTemplate({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{\{\w+\}\})/).map((part, i) => {
        const variable = /^\{\{(\w+)\}\}$/.exec(part)?.[1]
        if (!variable) return part
        return (
          <span key={i} className="rounded bg-brand-soft px-0.5 py-px font-medium whitespace-nowrap text-brand-ink">
            {variableLabels[variable] ?? variable}
          </span>
        )
      })}
    </>
  )
}

/** Animates between values for sighted users; screen readers only ever get the final value. */
export function CountUp({ value, format = formatNumber }: { value: number; format?: (n: number) => string }) {
  const reducedMotion = useReducedMotion()
  const revealed = useRevealed()
  const [shown, setShown] = useState(0)
  const from = useRef(0)

  useEffect(() => {
    if (reducedMotion) {
      from.current = value
      return
    }
    if (!revealed) return
    const start = performance.now()
    const origin = from.current
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 750)
      const eased = 1 - (1 - progress) ** 3
      const current = origin + (value - origin) * eased
      from.current = current
      setShown(current)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, reducedMotion, revealed])

  return (
    <>
      <span aria-hidden="true">{format(reducedMotion ? value : shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-line-strong bg-surface px-1.5 font-sans text-[11px] font-medium whitespace-nowrap text-muted">
      {children}
    </kbd>
  )
}

export type SegmentedOption<T> = { value: T; label: ReactNode; srSuffix?: string; count?: number }

type SegmentedProps<T> = {
  label: string
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  variant?: 'pill' | 'chips'
  className?: string
}

/** A radio group with roving focus: one tab stop, arrow keys change the selection. */
export function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  variant = 'pill',
  className,
}: SegmentedProps<T>) {
  const index = options.findIndex((option) => option.value === value)
  const roving = useRovingFocus<HTMLButtonElement>(options.length, index, (i) => onChange(options[i].value), 'both')
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx(
        variant === 'pill' && 'inline-flex rounded-lg bg-surface-2 p-0.5 ring-1 ring-line ring-inset',
        variant === 'chips' && 'flex flex-wrap gap-1.5',
        className,
      )}
    >
      {options.map((option, i) => {
        const checked = i === index
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={checked}
            {...roving(i)}
            onClick={() => onChange(option.value)}
            className={cx(
              'inline-flex min-h-7 items-center gap-1.5 text-xs font-medium whitespace-nowrap transition-colors',
              variant === 'pill' && 'rounded-md px-2.5',
              variant === 'pill' && (checked ? 'bg-surface text-ink shadow-card' : 'text-muted hover:text-ink'),
              variant === 'chips' && 'rounded-full px-3',
              variant === 'chips' &&
                (checked ? 'bg-ink text-canvas' : 'bg-surface text-muted ring-1 ring-line ring-inset hover:text-ink'),
            )}
          >
            {option.label}
            {option.srSuffix && <span className="sr-only"> {option.srSuffix}</span>}
            {option.count !== undefined && (
              <span className="font-semibold tabular-nums">{formatNumber(option.count)}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

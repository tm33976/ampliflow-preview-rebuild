import { AudioLines } from 'lucide-react'
import type { ReactNode } from 'react'

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-ink ${className}`}>
      <AudioLines className="size-5 text-brand" aria-hidden="true" />
      <span className="text-[1.05rem] tracking-tight">
        <span className="font-bold">ampli</span>
        <span className="font-medium">flow</span>
      </span>
    </span>
  )
}

const tones = {
  ok: 'bg-ok-bg text-ok',
  wait: 'bg-wait-bg text-wait',
  brand: 'bg-brand-50 text-brand',
  neutral: 'bg-canvas text-muted ring-1 ring-line ring-inset',
}

export type Tone = keyof typeof tones

export function Chip({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

const avatarColors = [
  'bg-brand-50 text-brand',
  'bg-ok-bg text-ok',
  'bg-wait-bg text-wait',
  'bg-[#fde7ef] text-[#9d174d]',
  'bg-[#e0f2fe] text-[#075985]',
]

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
  const color = avatarColors[[...name].reduce((n, ch) => n + ch.charCodeAt(0), 0) % avatarColors.length]
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${color} ${
        size === 'sm' ? 'size-8 text-xs' : 'size-9 text-sm'
      }`}
    >
      {initials}
    </span>
  )
}

export function Sparkline({ values }: { values: number[] }) {
  const min = Math.min(...values)
  const span = Math.max(...values) - min || 1
  const points = values.map((v, i) => [(i / (values.length - 1)) * 100, 26 - ((v - min) / span) * 20])
  const line = points.map(([x, y]) => `${x},${y}`).join(' ')
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full" aria-hidden="true">
      <polygon points={`0,32 ${line} 100,32`} className="fill-brand-50" />
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

const variableLabels: Record<string, string> = {
  first_name: 'First name',
  company: 'Company',
}

export function MessageTemplate({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{\{\w+\}\})/).map((part, i) => {
        const variable = /^\{\{(\w+)\}\}$/.exec(part)?.[1]
        if (!variable) return part
        return (
          <span key={i} className="rounded bg-brand-50 px-0.5 py-px font-medium whitespace-nowrap text-brand">
            {variableLabels[variable] ?? variable}
          </span>
        )
      })}
    </>
  )
}

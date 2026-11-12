import { Clock, Eye, GitBranch, MessageSquare, Reply, Send, UserPlus } from 'lucide-react'
import { Fragment } from 'react'
import { ratio, workflow, type WorkflowStep } from '../../data/demo'
import { formatNumber, formatPercent } from '../../lib/format'
import { Chip, MessageTemplate } from '../ui'

const icons = { visit: Eye, invite: UserPlus, branch: GitBranch, message: Send }

const sampleValues: Record<string, string> = { first_name: 'Ananya', company: 'Brightloop' }

function Connector() {
  return <span aria-hidden="true" className="block h-2.5 w-px bg-brand-100" />
}

function WaitStep({ days }: { days: number }) {
  return (
    <li className="flex flex-col items-center">
      <Connector />
      <span className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-0.5 text-xs text-muted">
        <Clock className="size-3.5" aria-hidden="true" />
        Wait {days} {days === 1 ? 'day' : 'days'}
      </span>
      <Connector />
    </li>
  )
}

function ActionStep({ step }: { step: Exclude<WorkflowStep, { kind: 'wait' }> }) {
  const Icon = icons[step.kind]
  const progress = step.done !== undefined && step.of ? ratio(step.done, step.of) : null
  return (
    <li className="rounded-xl border border-line bg-white p-3 shadow-[0_1px_2px_rgba(13,15,20,0.05)] lg:p-2.5">
      <div className="flex items-center gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold">{step.title}</span>
        <span className="ml-auto text-[11px] font-medium text-muted">{step.kind === 'branch' ? 'Logic' : 'Action'}</span>
      </div>
      {step.note && (
        <p className="mt-2 line-clamp-3 rounded-lg bg-canvas px-2.5 py-1.5 text-xs leading-relaxed text-muted lg:hidden">
          <MessageTemplate text={step.note} />
        </p>
      )}
      {progress !== null && (
        <div className="mt-2.5 flex items-center gap-2 text-xs lg:mt-2">
          <span aria-hidden="true" className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-50">
            <span className="block h-full rounded-full bg-brand" style={{ width: `${progress * 100}%` }} />
          </span>
          <span className="text-muted tabular-nums">
            <span className="font-semibold text-ink">{formatNumber(step.done ?? 0)}</span> of {formatNumber(step.of ?? 0)}{' '}
            {step.unit}
          </span>
        </div>
      )}
      {step.detail && <p className="mt-1.5 text-xs text-muted">{step.detail}</p>}
    </li>
  )
}

function NoteEditor({ label, text }: { label: string; text: string }) {
  const preview = text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => sampleValues[key] ?? key)
  return (
    <div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1.5 rounded-lg border border-line bg-canvas p-2.5 text-[13px] leading-relaxed">
        <MessageTemplate text={text} />
      </p>
      <p className="mt-1 text-right text-[11px] text-muted tabular-nums">{preview.length} characters</p>
    </div>
  )
}

export function WorkflowPanel() {
  const { campaign, steps, replied, messaged } = workflow
  const notes = steps.flatMap((step) =>
    step.kind !== 'wait' && step.note ? [{ label: step.title, text: step.note }] : [],
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold sm:text-lg">{campaign.name}</h3>
        <Chip tone="ok">Running</Chip>
        <span className="text-sm text-muted">{formatNumber(campaign.leads)} leads</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_17rem]">
        <div className="dot-grid rounded-xl border border-line bg-white/50 p-3 sm:p-4">
          <ol aria-label="Sequence steps" className="mx-auto max-w-sm">
            {steps.map((step, i) => {
              if (step.kind === 'wait') return <WaitStep key={i} days={step.days} />
              const followsAction = i > 0 && steps[i - 1].kind !== 'wait'
              return (
                <Fragment key={i}>
                  {followsAction && (
                    <li aria-hidden="true" className="flex justify-center">
                      <Connector />
                    </li>
                  )}
                  <ActionStep step={step} />
                </Fragment>
              )
            })}
            <li className="flex flex-col items-center">
              <Connector />
              <p className="flex items-center gap-2 rounded-xl bg-ok-bg px-3 py-1.5 text-center text-xs font-medium text-ok">
                <Reply className="size-3.5 shrink-0" aria-hidden="true" />
                {replied} of {messaged} replied ({formatPercent(ratio(replied, messaged))}), sequences paused on reply
              </p>
            </li>
          </ol>
        </div>

        <div className="hidden space-y-4 rounded-xl border border-line bg-white p-4 lg:block">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <MessageSquare className="size-4 text-brand" aria-hidden="true" />
            Messages
          </p>
          {notes.map((note) => (
            <NoteEditor key={note.label} label={note.label} text={note.text} />
          ))}
        </div>
      </div>
    </div>
  )
}

import { Clock, Eye, GitBranch, Reply, Send, UserPlus } from 'lucide-react'
import { Fragment, memo, useId, useState } from 'react'
import { Avatar, Chip, MessageTemplate, Segmented } from '../../../components/ui'
import { ratio, workflow, type WorkflowStep } from '../../../data/demo'
import { cx } from '../../../lib/cx'
import { formatNumber, formatPercent } from '../../../lib/format'

type ActionStep = Exclude<WorkflowStep, { kind: 'wait' }>

const icons = { visit: Eye, invite: UserPlus, branch: GitBranch, message: Send }
const sampleLead = {
  name: 'Ananya Rao',
  values: { first_name: 'Ananya', company: 'Brightloop' } as Record<string, string>,
}

const fillTemplate = (text: string) => text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => sampleLead.values[key] ?? key)

function Connector({ tall }: { tall?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cx('relative block w-px overflow-hidden bg-brand-soft-2', tall ? 'h-4' : 'h-2.5')}
    >
      <span className="absolute inset-x-0 top-0 h-1/2 animate-flow bg-brand-ink [animation-play-state:paused] group-data-[active=true]/panel:[animation-play-state:running]" />
    </span>
  )
}

function WaitStep({ days }: { days: number }) {
  return (
    <li className="flex flex-col items-center">
      <Connector />
      <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs text-muted">
        <Clock className="size-3.5" aria-hidden="true" />
        Wait {days} {days === 1 ? 'day' : 'days'}
      </span>
      <Connector />
    </li>
  )
}

function Progress({ step }: { step: ActionStep }) {
  return (
    <span className="flex items-center gap-2 text-xs">
      <span aria-hidden="true" className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-soft">
        <span
          className="bar-fill block h-full rounded-full bg-gradient-to-r from-brand to-violet"
          style={{ width: `${ratio(step.done, step.of) * 100}%` }}
        />
      </span>
      <span className="text-muted tabular-nums">
        <span className="font-semibold text-ink">{formatNumber(step.done)}</span> of {formatNumber(step.of)} {step.unit}
      </span>
    </span>
  )
}

function StepCard({ step, selected, onSelect }: { step: ActionStep; selected: boolean; onSelect: () => void }) {
  const Icon = icons[step.kind]
  return (
    <li>
      <button
        type="button"
        aria-pressed={selected}
        onClick={onSelect}
        className={cx(
          'block w-full rounded-xl border bg-surface p-3 text-left shadow-card transition-[border-color,box-shadow] duration-200 @3xl:p-2.5',
          selected ? 'border-brand-ink/50 ring-4 ring-brand-soft' : 'border-line hover:border-line-strong',
        )}
      >
        <span className="flex items-center gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-ink">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold">{step.title}</span>
          <span className="ml-auto text-[11px] font-medium text-muted">
            {step.kind === 'branch' ? 'Logic' : 'Action'}
          </span>
        </span>
        {step.note && (
          <span className="mt-2 line-clamp-3 rounded-lg bg-surface-2 px-2.5 py-1.5 text-xs leading-relaxed text-muted @3xl:hidden">
            <MessageTemplate text={step.note} />
          </span>
        )}
        {selected && (
          <span className="mt-2 block text-xs leading-relaxed text-muted @3xl:hidden">{step.description}</span>
        )}
        <span className="mt-2.5 block @3xl:mt-2">
          <Progress step={step} />
        </span>
      </button>
    </li>
  )
}

function Inspector({ step }: { step: ActionStep }) {
  const [mode, setMode] = useState<'template' | 'preview'>('template')
  const headingId = useId()
  const Icon = icons[step.kind]
  const characters = step.note ? fillTemplate(step.note).length : 0
  return (
    <div
      role="group"
      aria-labelledby={headingId}
      className="hidden flex-col gap-3 rounded-xl border border-line bg-surface p-4 shadow-card @3xl:flex"
    >
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand-ink">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <h4 id={headingId} className="text-sm font-semibold">
          {step.title}
        </h4>
        <Chip tone="neutral" className="ml-auto">
          {step.kind === 'branch' ? 'Logic' : 'Action'}
        </Chip>
      </div>
      <p className="text-xs leading-relaxed text-muted">{step.description}</p>
      <div className="rounded-lg bg-surface-2 p-3">
        <p className="text-2xl font-semibold tracking-tight tabular-nums">{formatPercent(ratio(step.done, step.of))}</p>
        <p className="mb-2 text-xs text-muted">
          {formatNumber(step.done)} of {formatNumber(step.of)} {step.unit}
        </p>
        <Progress step={step} />
      </div>
      {step.note && (
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted">Message</p>
            <Segmented
              label="Show message as"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'template', label: 'Template' },
                { value: 'preview', label: 'Preview' },
              ]}
            />
          </div>
          {mode === 'template' ? (
            <p className="mt-2 rounded-lg border border-line bg-surface-2 p-2.5 text-[13px] leading-relaxed">
              <MessageTemplate text={step.note} />
            </p>
          ) : (
            <div className="mt-2 flex items-start gap-2">
              <Avatar name={sampleLead.name} size="sm" />
              <p className="rounded-2xl rounded-tl-md bg-brand px-3 py-2 text-[13px] leading-relaxed text-white">
                {fillTemplate(step.note)}
              </p>
            </div>
          )}
          <p className="mt-1 text-right text-[11px] text-muted tabular-nums">
            {step.noteLimit ? `${characters} / ${step.noteLimit} characters` : `${characters} characters`}
          </p>
        </div>
      )}
    </div>
  )
}

export const WorkflowPanel = memo(function WorkflowPanel() {
  const { campaign, steps, replied, messaged } = workflow
  const actionSteps = steps.filter((step): step is ActionStep => step.kind !== 'wait')
  const [selectedTitle, setSelectedTitle] = useState(actionSteps[1].title)
  const selected = actionSteps.find((step) => step.title === selectedTitle) ?? actionSteps[0]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold @lg:text-lg">{campaign.name}</h3>
        <Chip tone="ok">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping-soft rounded-full bg-ok opacity-60 [animation-play-state:paused] group-data-[active=true]/panel:[animation-play-state:running]" />
            <span className="relative inline-flex size-1.5 rounded-full bg-ok" />
          </span>
          Running
        </Chip>
        <span className="text-sm text-muted">{formatNumber(campaign.leads)} leads</span>
      </div>

      <div className="grid gap-4 @3xl:grid-cols-[1fr_18rem]">
        <div className="rounded-xl border border-line bg-surface-2/40 bg-dots p-3 @lg:p-4">
          <ol aria-label="Sequence steps" className="mx-auto max-w-sm">
            {steps.map((step, i) => {
              if (step.kind === 'wait') return <WaitStep key={i} days={step.days} />
              const followsAction = i > 0 && steps[i - 1].kind !== 'wait'
              return (
                <Fragment key={step.title}>
                  {followsAction && (
                    <li aria-hidden="true" className="flex justify-center">
                      <Connector tall />
                    </li>
                  )}
                  <StepCard step={step} selected={step === selected} onSelect={() => setSelectedTitle(step.title)} />
                </Fragment>
              )
            })}
            <li className="flex flex-col items-center">
              <Connector />
              <p className="flex items-center gap-2 rounded-xl bg-ok-soft px-3 py-1.5 text-center text-xs font-medium text-ok">
                <Reply className="size-3.5 shrink-0" aria-hidden="true" />
                {replied} of {messaged} replied ({formatPercent(ratio(replied, messaged))}), sequences paused on reply
              </p>
            </li>
          </ol>
        </div>
        <Inspector key={selected.title} step={selected} />
      </div>
    </div>
  )
})

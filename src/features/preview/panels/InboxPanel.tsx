import { CirclePause, SendHorizontal } from 'lucide-react'
import { memo, useId, useRef, useState, type FormEvent } from 'react'
import { Avatar, Chip, Segmented, type SegmentedOption, type Tone } from '../../../components/ui'
import {
  conversations,
  inboxCounts,
  leadById,
  type Conversation,
  type InboxTag,
  type Message,
} from '../../../data/demo'
import { cx } from '../../../lib/cx'
import { useRovingFocus } from '../../../lib/hooks'

type Filter = 'all' | InboxTag

const tagMeta: Record<InboxTag, { label: string; tone: Tone }> = {
  'needs-reply': { label: 'Needs reply', tone: 'wait' },
  interested: { label: 'Interested', tone: 'brand' },
  booked: { label: 'Booked', tone: 'ok' },
  'not-now': { label: 'Not now', tone: 'neutral' },
}

const totalReplies = Object.values(inboxCounts).reduce((total, n) => total + n, 0)

const filterOptions: SegmentedOption<Filter>[] = [
  { value: 'all', label: 'All', count: totalReplies },
  ...(Object.keys(tagMeta) as InboxTag[]).map((tag) => ({
    value: tag,
    label: tagMeta[tag].label,
    count: inboxCounts[tag],
  })),
]

const lastLeadMessage = (messages: Message[]) => [...messages].reverse().find((m) => m.from === 'lead')?.text ?? ''

function Thread({
  conversation,
  extra,
  onSend,
}: {
  conversation: Conversation
  extra: Message[]
  onSend: (text: string) => void
}) {
  const lead = leadById(conversation.leadId)
  const [draft, setDraft] = useState('')
  const inputId = useId()
  const messages = [...conversation.messages, ...extra]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft('')
  }

  return (
    <div
      role="group"
      aria-label={`Conversation with ${lead.name}`}
      className="flex h-full flex-col rounded-xl border border-line bg-surface shadow-card"
    >
      <div className="flex items-center gap-2.5 border-b border-line px-3 py-2.5">
        <Avatar name={lead.name} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{lead.name}</p>
          <p className="truncate text-xs text-muted">
            {lead.role} at {lead.company}
          </p>
        </div>
        <Chip tone={tagMeta[conversation.tag].tone}>{tagMeta[conversation.tag].label}</Chip>
      </div>
      <div role="log" aria-label="Messages" className="flex-1 overflow-y-auto">
        <ol className="space-y-2.5 p-3">
          {messages.map((message, i) =>
            message.from === 'system' ? (
              <li key={i} className="flex justify-center">
                <span className="flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] text-muted">
                  <CirclePause className="size-3" aria-hidden="true" />
                  {message.text}
                </span>
              </li>
            ) : (
              <li key={i} className={cx('flex flex-col', message.from === 'you' ? 'items-end' : 'items-start')}>
                <p
                  className={cx(
                    'max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed',
                    message.from === 'you'
                      ? 'rounded-br-md bg-brand text-white'
                      : 'rounded-bl-md bg-surface-2 text-ink ring-1 ring-line',
                  )}
                >
                  <span className="sr-only">{message.from === 'you' ? 'You: ' : `${lead.name}: `}</span>
                  {message.text}
                </p>
                <span className="mt-0.5 text-[11px] text-muted">{message.time}</span>
              </li>
            ),
          )}
        </ol>
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-line p-2">
        <label htmlFor={inputId} className="sr-only">
          Reply to {lead.name}
        </label>
        <input
          id={inputId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={`Reply to ${lead.name.split(' ')[0]}`}
          autoComplete="off"
          className="h-9 min-w-0 flex-1 rounded-lg bg-surface-2 px-3 text-sm placeholder:text-muted focus-visible:outline-brand-ink"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Send reply"
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand text-white transition-opacity hover:bg-brand-hover disabled:opacity-40"
        >
          <SendHorizontal className="size-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}

export const InboxPanel = memo(function InboxPanel() {
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedId, setSelectedId] = useState(conversations[0].leadId)
  const [sent, setSent] = useState<Record<string, Message[]>>({})
  const threadRef = useRef<HTMLDivElement>(null)

  const visible = conversations.filter((c) => filter === 'all' || c.tag === filter)
  const selected = visible.find((c) => c.leadId === selectedId) ?? visible[0]
  const selectedIndex = visible.indexOf(selected)

  const choose = (index: number) => {
    setSelectedId(visible[index].leadId)
    threadRef.current?.scrollIntoView({ block: 'nearest' })
  }
  const roving = useRovingFocus<HTMLLIElement>(visible.length, selectedIndex, choose, 'vertical')

  const send = (text: string) =>
    setSent((current) => ({
      ...current,
      [selected.leadId]: [...(current[selected.leadId] ?? []), { from: 'you', text, time: 'Just now' }],
    }))

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold @lg:text-lg">Smart inbox</h3>
        <p className="text-sm text-muted">Every reply from every campaign, in one place</p>
      </div>

      <Segmented
        label="Filter conversations"
        variant="chips"
        options={filterOptions}
        value={filter}
        onChange={setFilter}
      />

      <div className="grid gap-3 @2xl:grid-cols-[15rem_1fr]">
        <ul
          role="listbox"
          aria-label="Conversations"
          className="order-2 max-h-52 divide-y divide-line self-start overflow-y-auto rounded-xl border border-line bg-surface shadow-card @2xl:order-1 @2xl:max-h-none"
        >
          {visible.map((conversation, i) => {
            const lead = leadById(conversation.leadId)
            const active = conversation === selected
            return (
              <li
                key={conversation.leadId}
                role="option"
                aria-selected={active}
                {...roving(i)}
                onClick={() => choose(i)}
                className={cx(
                  'flex cursor-pointer items-start gap-2.5 px-3 py-2.5 outline-offset-[-2px] transition-colors',
                  active ? 'bg-brand-soft shadow-[inset_3px_0_0_var(--brand-ink)]' : 'hover:bg-surface-2',
                )}
              >
                <Avatar name={lead.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{lead.name}</span>
                    <span className="shrink-0 text-[11px] text-muted">{conversation.when}</span>
                  </span>
                  <span className="block truncate text-xs text-muted">{lastLeadMessage(conversation.messages)}</span>
                </span>
              </li>
            )
          })}
        </ul>
        <div ref={threadRef} className="order-1 @2xl:order-2">
          {selected && (
            <Thread key={selected.leadId} conversation={selected} extra={sent[selected.leadId] ?? []} onSend={send} />
          )}
        </div>
      </div>
    </div>
  )
})

import { CalendarCheck, CirclePause } from 'lucide-react'
import { conversations, inboxFilters, thread, type Conversation } from '../../data/demo'
import { formatNumber } from '../../lib/format'
import { Avatar, Chip, type Tone } from '../ui'

const tagTone: Record<Conversation['tag'], Tone> = {
  Booked: 'ok',
  Interested: 'brand',
  'Needs reply': 'wait',
}

type RowProps = { conversation: Conversation; active: boolean; desktopOnly: boolean }

function ConversationRow({ conversation, active, desktopOnly }: RowProps) {
  return (
    <li
      className={`items-start gap-2.5 px-3 py-2.5 ${desktopOnly ? 'hidden md:flex' : 'flex'} ${
        active ? 'bg-brand-50/70 shadow-[inset_3px_0_0_var(--color-brand)]' : ''
      }`}
    >
      <Avatar name={conversation.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-semibold">{conversation.name}</p>
          <span className="shrink-0 text-[11px] text-muted">{conversation.when}</span>
        </div>
        <p className="truncate text-xs text-muted">{conversation.preview}</p>
        <div className="mt-1.5">
          <Chip tone={tagTone[conversation.tag]}>{conversation.tag}</Chip>
        </div>
      </div>
    </li>
  )
}

function Thread() {
  const lead = conversations[0]
  return (
    <section aria-label={`Conversation with ${lead.name}`} className="flex flex-col rounded-xl border border-line bg-white">
      <div className="flex items-center gap-2.5 border-b border-line px-3 py-2.5">
        <Avatar name={lead.name} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{lead.name}</p>
          <p className="truncate text-xs text-muted">Founder at Brightloop</p>
        </div>
        <Chip tone="ok">
          <CalendarCheck className="size-3.5" aria-hidden="true" />
          Meeting booked
        </Chip>
      </div>
      <ol className="space-y-2.5 p-3">
        {thread.map((message, i) => (
          <li key={i} className={`flex flex-col ${message.from === 'you' ? 'items-end' : 'items-start'}`}>
            <p
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                message.from === 'you' ? 'rounded-br-md bg-brand text-white' : 'rounded-bl-md bg-canvas text-ink ring-1 ring-line'
              }`}
            >
              <span className="sr-only">{message.from === 'you' ? 'You: ' : `${lead.name}: `}</span>
              {message.text}
            </p>
            <span className="mt-0.5 text-[11px] text-muted">{message.time}</span>
            {i === 1 && (
              <p className="mt-2 flex items-center gap-1.5 self-center rounded-full bg-canvas px-2.5 py-0.5 text-[11px] text-muted">
                <CirclePause className="size-3" aria-hidden="true" />
                Sequence paused because {lead.name.split(' ')[0]} replied
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

export function InboxPanel() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold sm:text-lg">Smart inbox</h3>
        <p className="text-sm text-muted">Every reply from every campaign, in one place</p>
      </div>

      <ul aria-label="Conversation counts" className="flex flex-wrap gap-1.5">
        {inboxFilters.map((filter, i) => (
          <li
            key={filter.label}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              i === 0 ? 'bg-ink text-white' : 'bg-white text-muted ring-1 ring-line ring-inset'
            }`}
          >
            {filter.label} <span className="tabular-nums">{formatNumber(filter.count)}</span>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 md:grid-cols-[16rem_1fr]">
        <ul
          aria-label="Recent conversations"
          className="order-2 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white md:order-1"
        >
          {conversations.map((conversation, i) => (
            <ConversationRow
              key={conversation.name}
              conversation={conversation}
              active={i === 0}
              desktopOnly={i >= 2}
            />
          ))}
        </ul>
        <div className="order-1 md:order-2">
          <Thread />
        </div>
      </div>
    </div>
  )
}

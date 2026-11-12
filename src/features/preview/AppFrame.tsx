import { Bell, Inbox, LayoutDashboard, Megaphone, Moon, Search, Settings, Users, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { Wordmark } from '../../components/ui'
import { cx } from '../../lib/cx'
import { TAB_LABELS, type TabId } from './controller'

const nav: { id: TabId; label: string; Icon: typeof Inbox }[] = [
  { id: 'analytics', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'workflow', label: 'Campaigns', Icon: Megaphone },
  { id: 'leads', label: 'Leads', Icon: Users },
  { id: 'inbox', label: 'Inbox', Icon: Inbox },
]

/**
 * The window chrome around the panels. Layout reacts to the frame's own width
 * (container queries), so the same component works full width and inside a phone.
 * The chrome is decoration, so it stays out of the accessibility tree.
 */
export function AppFrame({ activeTab, children }: { activeTab: TabId; children: ReactNode }) {
  return (
    <div className="@container/frame relative overflow-hidden rounded-2xl border border-line bg-surface shadow-frame">
      <div
        aria-hidden="true"
        className="flex items-center justify-between border-b border-line px-3 py-2.5 @2xl/frame:hidden"
      >
        <Wordmark />
        <span className="text-xs font-medium text-muted">{TAB_LABELS[activeTab].label}</span>
      </div>

      <div aria-hidden="true" className="hidden items-center gap-4 border-b border-line px-4 py-2.5 @2xl/frame:flex">
        <span className="flex w-44 shrink-0 items-center gap-2">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <Wordmark className="ml-2" />
        </span>
        <span className="flex h-9 w-72 items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 text-sm text-muted">
          <Search className="size-4" />
          Search name, company, title
        </span>
        <span className="ml-auto flex items-center gap-4 text-muted">
          <Moon className="size-[18px]" />
          <Bell className="size-[18px]" />
          <Settings className="size-[18px]" />
          <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-brand to-violet text-xs font-semibold text-white">
            RS
          </span>
        </span>
      </div>

      <div className="flex">
        <div aria-hidden="true" className="hidden w-52 shrink-0 flex-col border-r border-line p-3 @4xl/frame:flex">
          <span className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium text-muted">
            <span className="flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-[3px] bg-[#0a66c2] text-[9px] font-bold text-white">
                in
              </span>
              Profile
            </span>
            <span className="rounded-full bg-ok-soft px-1.5 py-px text-[11px] text-ok">Connected</span>
          </span>
          <span className="mt-3 flex flex-col gap-0.5">
            {nav.map(({ id, label, Icon }) => (
              <span
                key={id}
                className={cx(
                  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors duration-300',
                  id === activeTab ? 'bg-brand-soft font-semibold text-brand-ink' : 'text-muted',
                )}
              >
                <Icon className="size-4" />
                {label}
              </span>
            ))}
          </span>
          <span className="mt-auto flex flex-col rounded-xl border border-line bg-surface-2 p-3 text-xs">
            <span className="flex items-center justify-between font-semibold">
              Standard plan
              <span className="flex items-center gap-0.5 text-brand-ink">
                <Zap className="size-3" />
                20% off
              </span>
            </span>
            <span className="mt-1 text-muted">Higher daily limits and unlimited campaigns.</span>
            <span className="mt-2.5 rounded-lg bg-brand py-1.5 text-center font-semibold text-white">
              Upgrade to Pro
            </span>
          </span>
        </div>

        <div className="@container min-w-0 flex-1 bg-surface-2/40 p-3 @md/frame:p-4 @2xl/frame:p-5 @4xl/frame:h-[37rem] @4xl/frame:overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

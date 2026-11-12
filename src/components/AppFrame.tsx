import { Bell, Inbox, LayoutDashboard, Megaphone, Moon, Search, Settings, Users, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { Wordmark } from './ui'

const nav = [
  { id: 'analytics', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'workflow', label: 'Campaigns', Icon: Megaphone },
  { id: 'leads', label: 'Leads', Icon: Users },
  { id: 'inbox', label: 'Inbox', Icon: Inbox },
]

// The app chrome is decoration around the panels, so it stays out of the accessibility tree.
export function AppFrame({ activeId, children }: { activeId: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_70px_-40px_rgba(13,15,20,0.45)]">
      <div aria-hidden="true" className="hidden items-center gap-4 border-b border-line px-4 py-2.5 md:flex">
        <Wordmark className="w-44 shrink-0" />
        <div className="flex h-9 w-72 items-center gap-2 rounded-lg border border-line bg-canvas px-3 text-sm text-muted">
          <Search className="size-4" />
          Search name, company, title
        </div>
        <div className="ml-auto flex items-center gap-4 text-muted">
          <Moon className="size-[18px]" />
          <Bell className="size-[18px]" />
          <Settings className="size-[18px]" />
          <span className="grid size-8 place-items-center rounded-full bg-brand text-xs font-semibold text-white">
            RS
          </span>
        </div>
      </div>

      <div className="flex">
        <div aria-hidden="true" className="hidden w-52 shrink-0 flex-col border-r border-line p-3 lg:flex">
          <div className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium text-muted">
            <span className="flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-[3px] bg-[#0a66c2] text-[9px] font-bold text-white">
                in
              </span>
              Profile
            </span>
            <span className="rounded-full bg-ok-bg px-1.5 py-px text-[11px] text-ok">Connected</span>
          </div>
          <ul className="mt-3 space-y-0.5">
            {nav.map(({ id, label, Icon }) => (
              <li
                key={id}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                  id === activeId ? 'bg-brand-50 font-semibold text-brand' : 'text-muted'
                }`}
              >
                <Icon className="size-4" />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-auto rounded-xl border border-line p-3 text-xs">
            <div className="flex items-center justify-between font-semibold">
              Standard plan
              <span className="flex items-center gap-0.5 text-brand">
                <Zap className="size-3" />
                20% off
              </span>
            </div>
            <p className="mt-1 text-muted">Higher daily limits and unlimited campaigns.</p>
            <div className="mt-2.5 rounded-lg bg-brand py-1.5 text-center font-semibold text-white">Upgrade to Pro</div>
          </div>
        </div>

        <div className="min-w-0 flex-1 bg-canvas/70 p-3 sm:p-5 lg:h-[36rem] lg:overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

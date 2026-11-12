import { useCallback, useMemo, useState } from 'react'
import type { RangeDays } from '../../data/demo'
import { useReducedMotion } from '../../lib/hooks'

export const TAB_IDS = ['analytics', 'workflow', 'leads', 'inbox'] as const
export type TabId = (typeof TAB_IDS)[number]

export const TAB_LABELS: Record<TabId, { label: string; short: string }> = {
  analytics: { label: 'Analytics', short: 'Analytics' },
  workflow: { label: 'Workflow', short: 'Workflow' },
  leads: { label: 'Leads', short: 'Leads' },
  inbox: { label: 'Smart Inbox', short: 'Inbox' },
}

export type PreviewController = {
  tab: TabId
  range: RangeDays
  autoplay: boolean
  /** A person picked a tab, so rotation stops until they press play. */
  selectTab: (tab: TabId) => void
  advance: () => void
  setRange: (range: RangeDays) => void
  setAutoplay: (on: boolean) => void
}

export function usePreviewController(): PreviewController {
  const reducedMotion = useReducedMotion()
  const [tab, setTab] = useState<TabId>('analytics')
  const [range, setRange] = useState<RangeDays>(30)
  const [autoplayChoice, setAutoplayChoice] = useState<boolean | null>(null)
  const autoplay = autoplayChoice ?? !reducedMotion

  const selectTab = useCallback((next: TabId) => {
    setTab(next)
    setAutoplayChoice(false)
  }, [])

  const advance = useCallback(() => {
    setTab((current) => TAB_IDS[(TAB_IDS.indexOf(current) + 1) % TAB_IDS.length])
  }, [])

  const setAutoplay = useCallback((on: boolean) => setAutoplayChoice(on), [])

  return useMemo(
    () => ({ tab, range, autoplay, selectTab, advance, setRange, setAutoplay }),
    [tab, range, autoplay, selectTab, advance, setAutoplay],
  )
}

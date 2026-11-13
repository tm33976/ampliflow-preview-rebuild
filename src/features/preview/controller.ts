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

/**
 * `paused` freezes the tab timer where it is, so play continues from the same point.
 * `stopped` means the person took over (picked a tab or used a panel), so the timer is gone.
 */
export type Rotation = 'playing' | 'paused' | 'stopped'

export type PreviewController = {
  tab: TabId
  range: RangeDays
  rotation: Rotation
  autoplay: boolean
  /** A person picked a tab, so rotation stops until they press play. */
  selectTab: (tab: TabId) => void
  advance: () => void
  setRange: (range: RangeDays) => void
  /** The pause and play control: pausing keeps the timer's position. */
  setAutoplay: (on: boolean) => void
  stop: () => void
}

export function usePreviewController(): PreviewController {
  const reducedMotion = useReducedMotion()
  const [tab, setTab] = useState<TabId>('analytics')
  const [range, setRange] = useState<RangeDays>(30)
  const [rotationChoice, setRotationChoice] = useState<Rotation | null>(null)
  const rotation = rotationChoice ?? (reducedMotion ? 'stopped' : 'playing')

  const selectTab = useCallback((next: TabId) => {
    setTab(next)
    setRotationChoice('stopped')
  }, [])

  const advance = useCallback(() => {
    setTab((current) => TAB_IDS[(TAB_IDS.indexOf(current) + 1) % TAB_IDS.length])
  }, [])

  const setAutoplay = useCallback((on: boolean) => setRotationChoice(on ? 'playing' : 'paused'), [])
  const stop = useCallback(() => setRotationChoice('stopped'), [])

  return useMemo(
    () => ({ tab, range, rotation, autoplay: rotation === 'playing', selectTab, advance, setRange, setAutoplay, stop }),
    [tab, range, rotation, selectTab, advance, setAutoplay, stop],
  )
}

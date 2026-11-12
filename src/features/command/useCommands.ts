import {
  BarChart3,
  CalendarRange,
  ChevronsUp,
  Code2,
  ExternalLink,
  Gauge,
  Inbox,
  Laptop,
  Lightbulb,
  Moon,
  Pause,
  Play,
  Smartphone,
  Sun,
  UserRound,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { useMemo } from 'react'
import { RANGES } from '../../data/demo'
import { LINKS } from '../../lib/links'
import { switchTheme, type ThemePreference } from '../../lib/theme'
import { TAB_IDS, TAB_LABELS, type PreviewController, type TabId } from '../preview/controller'
import type { Command } from './types'

const tabIcons: Record<TabId, LucideIcon> = { analytics: BarChart3, workflow: Workflow, leads: Users, inbox: Inbox }

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

function focusSection(id: string) {
  const section = document.getElementById(id)
  section?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
  section?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true })
}

function focusTab(tab: TabId) {
  document.getElementById('preview')?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
  document.querySelector<HTMLElement>(`#preview [role="tab"][data-tab="${tab}"]`)?.focus({ preventScroll: true })
}

const openExternal = (url: string) => window.open(url, '_blank', 'noopener')

export function useCommands(preview: PreviewController, theme: ThemePreference): Command[] {
  const { autoplay, setAutoplay, selectTab, setRange } = preview

  return useMemo(() => {
    const revealOrigin = () => ({ x: innerWidth / 2, y: innerHeight / 3 })
    const themeCommand = (value: ThemePreference, label: string, icon: LucideIcon): Command => ({
      id: `theme-${value}`,
      group: 'Theme',
      label,
      icon,
      keywords: 'appearance mode color',
      hint: theme === value ? 'Current' : undefined,
      perform: () => switchTheme(value, revealOrigin()),
    })

    return [
      ...TAB_IDS.map((tab): Command => ({
        id: `tab-${tab}`,
        group: 'Preview',
        label: `Show ${TAB_LABELS[tab].label}`,
        icon: tabIcons[tab],
        keywords: 'tab panel open',
        perform: () => {
          selectTab(tab)
          focusTab(tab)
        },
      })),
      ...RANGES.map((range): Command => ({
        id: `range-${range}`,
        group: 'Preview',
        label: `Analytics, last ${range} days`,
        icon: CalendarRange,
        keywords: 'range date period filter',
        perform: () => {
          selectTab('analytics')
          setRange(range)
          focusTab('analytics')
        },
      })),
      {
        id: 'autoplay',
        group: 'Preview',
        label: autoplay ? 'Pause tab rotation' : 'Play tab rotation',
        icon: autoplay ? Pause : Play,
        keywords: 'autoplay carousel motion stop start',
        perform: () => setAutoplay(!autoplay),
      },
      themeCommand('light', 'Light theme', Sun),
      themeCommand('dark', 'Dark theme', Moon),
      themeCommand('system', 'Match system theme', Laptop),
      {
        id: 'go-phone',
        group: 'Jump to',
        label: 'Phone comparison',
        icon: Smartphone,
        perform: () => focusSection('phone'),
      },
      {
        id: 'go-results',
        group: 'Jump to',
        label: 'Measured results',
        icon: Gauge,
        perform: () => focusSection('results'),
      },
      {
        id: 'go-decisions',
        group: 'Jump to',
        label: 'Decisions and trade offs',
        icon: Lightbulb,
        perform: () => focusSection('decisions'),
      },
      {
        id: 'go-top',
        group: 'Jump to',
        label: 'Back to top',
        icon: ChevronsUp,
        perform: () => {
          window.scrollTo({ top: 0, behavior: scrollBehavior() })
          document.getElementById('hero-heading')?.focus({ preventScroll: true })
        },
      },
      {
        id: 'link-github',
        group: 'Links',
        label: 'View source on GitHub',
        icon: Code2,
        perform: () => openExternal(LINKS.github),
      },
      {
        id: 'link-original',
        group: 'Links',
        label: 'Open the original ampliflow.in',
        icon: ExternalLink,
        perform: () => openExternal(LINKS.original),
      },
      {
        id: 'link-portfolio',
        group: 'Links',
        label: 'Tushar Mishra’s portfolio',
        icon: UserRound,
        perform: () => openExternal(LINKS.portfolio),
      },
    ]
  }, [autoplay, setAutoplay, selectTab, setRange, theme])
}

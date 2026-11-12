import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const THEME_COLORS: Record<ResolvedTheme, string> = { light: '#f6f7fb', dark: '#090b10' }

const listeners = new Set<() => void>()
const systemQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

function readStored(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

let preference: ThemePreference = typeof window === 'undefined' ? 'system' : readStored()

const resolve = (value: ThemePreference): ResolvedTheme =>
  value === 'system' ? (systemQuery().matches ? 'dark' : 'light') : value

function applyToDocument() {
  const resolved = resolve(preference)
  document.documentElement.dataset.theme = resolved
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[resolved])
}

function setPreference(next: ThemePreference) {
  preference = next
  try {
    if (next === 'system') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Storage can be unavailable (private mode); the theme still applies for this visit.
  }
  applyToDocument()
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const query = systemQuery()
  const onSystemChange = () => {
    if (preference !== 'system') return
    applyToDocument()
    listener()
  }
  query.addEventListener('change', onSystemChange)
  return () => {
    listeners.delete(listener)
    query.removeEventListener('change', onSystemChange)
  }
}

export function useTheme() {
  const current = useSyncExternalStore(
    subscribe,
    () => preference,
    () => 'system' as const,
  )
  const resolved = useSyncExternalStore(
    subscribe,
    () => resolve(preference),
    () => 'light' as const,
  )
  return { preference: current, resolved }
}

type Origin = { x: number; y: number }

/** Switches theme with a circular reveal from `origin` where the View Transitions API is available. */
export function switchTheme(next: ThemePreference, origin?: Origin) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!('startViewTransition' in document) || reduceMotion) {
    setPreference(next)
    return
  }
  const transition = document.startViewTransition(() => flushSync(() => setPreference(next)))
  if (!origin) return
  const radius = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y))
  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        { duration: 520, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
    .catch(() => {})
}

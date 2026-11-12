import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type RefCallback,
} from 'react'

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

const subscribeVisibility = (onChange: () => void) => {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

export function usePageVisible() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => true,
  )
}

export function useInView<T extends Element>(threshold = 0.3, { once = false, rootMargin = '0px' } = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (once && entry.isIntersecting) observer.disconnect()
      },
      { threshold, rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, once, rootMargin])

  return [ref, inView] as const
}

type Orientation = 'horizontal' | 'vertical' | 'both'

const KEYS: Record<Orientation, { previous: string[]; next: string[] }> = {
  horizontal: { previous: ['ArrowLeft'], next: ['ArrowRight'] },
  vertical: { previous: ['ArrowUp'], next: ['ArrowDown'] },
  both: { previous: ['ArrowLeft', 'ArrowUp'], next: ['ArrowRight', 'ArrowDown'] },
}

/**
 * Roving tabindex for tabs, radio groups and listboxes: one tab stop for the
 * whole group, arrow keys plus Home and End move focus and selection together.
 */
export function useRovingFocus<T extends HTMLElement>(
  count: number,
  activeIndex: number,
  onMove: (index: number) => void,
  orientation: Orientation = 'horizontal',
) {
  const items = useRef<(T | null)[]>([])
  const focusable = activeIndex >= 0 ? activeIndex : 0

  const onKeyDown = (event: KeyboardEvent<T>) => {
    const { previous, next } = KEYS[orientation]
    let target: number | undefined
    if (next.includes(event.key)) target = (focusable + 1) % count
    else if (previous.includes(event.key)) target = (focusable - 1 + count) % count
    else if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = count - 1
    if (target === undefined) return
    event.preventDefault()
    onMove(target)
    items.current[target]?.focus()
  }

  return (index: number): { ref: RefCallback<T>; tabIndex: number; onKeyDown: (event: KeyboardEvent<T>) => void } => ({
    ref: (node) => {
      items.current[index] = node
    },
    tabIndex: index === focusable ? 0 : -1,
    onKeyDown,
  })
}

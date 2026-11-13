import { useEffect } from 'react'

/**
 * One delegated, rAF throttled pointer listener feeds cursor coordinates to every
 * `.spotlight` card and `.spotlight-zone` area, instead of a listener per element.
 */
export function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    let frame = 0
    let pointer: PointerEvent | null = null

    const paint = () => {
      frame = 0
      const target = (pointer?.target as Element | null)?.closest?.<HTMLElement>('.spotlight, .spotlight-zone')
      if (!pointer || !target) return
      const rect = target.getBoundingClientRect()
      target.style.setProperty('--mx', `${pointer.clientX - rect.left}px`)
      target.style.setProperty('--my', `${pointer.clientY - rect.top}px`)
    }

    const onMove = (event: PointerEvent) => {
      pointer = event
      if (!frame) frame = requestAnimationFrame(paint)
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])
}

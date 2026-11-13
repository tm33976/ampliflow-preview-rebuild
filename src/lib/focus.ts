export const HERO_EMAIL_ID = 'hero-email'

export const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

/**
 * Sections below the fold use `content-visibility: auto`, so their heights are estimates
 * until they render. Jump once, let the neighbours render at their real size, then land.
 */
export function scrollIntoViewSettled(element: Element | null, block: ScrollLogicalPosition = 'start') {
  if (!element) return
  // A labelled region (an FAQ answer) is best shown from its label (the question).
  const labelId = element.getAttribute('role') === 'region' ? element.getAttribute('aria-labelledby') : null
  const target = (labelId && document.getElementById(labelId)) || element
  const land = () => target.scrollIntoView({ block })
  land()
  requestAnimationFrame(() => requestAnimationFrame(land))
  setTimeout(land, 250)
  setTimeout(land, 500)
}

/** Every "start trial" button leads to the one signup form, so there is a single path in. */
export function focusSignup() {
  const input = document.getElementById(HERO_EMAIL_ID)
  input?.scrollIntoView({ behavior: scrollBehavior(), block: 'center' })
  input?.focus({ preventScroll: true })
}

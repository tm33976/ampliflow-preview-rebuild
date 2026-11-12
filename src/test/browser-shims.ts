// jsdom implements none of the browser APIs below. This file must run before React DOM
// loads, because React picks its animation event names from what `window` supports.

window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList

class VisibleIntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]
  private readonly callback: IntersectionObserverCallback
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }
  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
window.IntersectionObserver ??= VisibleIntersectionObserver as unknown as typeof IntersectionObserver

if (!('AnimationEvent' in window)) {
  class AnimationEventShim extends Event {
    readonly animationName: string
    readonly elapsedTime: number
    readonly pseudoElement: string
    constructor(type: string, init: AnimationEventInit = {}) {
      super(type, init)
      this.animationName = init.animationName ?? ''
      this.elapsedTime = init.elapsedTime ?? 0
      this.pseudoElement = init.pseudoElement ?? ''
    }
  }
  // Testing Library builds events from the document's own window, which can differ from the global one.
  for (const target of new Set([window, document.defaultView]))
    Object.assign(target ?? window, { AnimationEvent: AnimationEventShim })
}

HTMLDialogElement.prototype.showModal ??= function showModal(this: HTMLDialogElement) {
  this.setAttribute('open', '')
}
HTMLDialogElement.prototype.close ??= function close(this: HTMLDialogElement) {
  this.removeAttribute('open')
  this.dispatchEvent(new Event('close'))
}
Element.prototype.scrollIntoView ??= () => {}

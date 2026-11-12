export const LINKS = {
  github: 'https://github.com/tm33976/ampliflow-preview-rebuild',
  original: 'https://ampliflow.in/',
  portfolio: 'https://tushar-mishra-cse-portfolio.vercel.app/',
}

export const isApplePlatform = () =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)

export const shortcutLabel = () => (isApplePlatform() ? '⌘K' : 'Ctrl K')

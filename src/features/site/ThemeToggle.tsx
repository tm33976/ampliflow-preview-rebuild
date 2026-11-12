import { Moon, Sun } from 'lucide-react'
import { switchTheme, useTheme } from '../../lib/theme'

export function ThemeToggle() {
  const { resolved } = useTheme()
  const next = resolved === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        switchTheme(next, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
      }}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-muted shadow-card transition-colors hover:text-ink"
    >
      {resolved === 'dark' ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </button>
  )
}

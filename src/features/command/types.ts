import type { LucideIcon } from 'lucide-react'

export type Command = {
  id: string
  label: string
  group: string
  icon: LucideIcon
  keywords?: string
  hint?: string
  perform: () => void
}

export function filterCommands(commands: Command[], query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return commands
  return commands.filter((command) => {
    const haystack = `${command.label} ${command.group} ${command.keywords ?? ''}`.toLowerCase()
    return words.every((word) => haystack.includes(word))
  })
}

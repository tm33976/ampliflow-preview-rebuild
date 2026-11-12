import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Moon, Sun, Users } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import CommandPalette from './CommandPalette'
import { filterCommands, type Command } from './types'

const makeCommands = () =>
  [
    { id: 'leads', label: 'Show Leads', group: 'Preview', icon: Users, perform: vi.fn() },
    { id: 'light', label: 'Light theme', group: 'Theme', icon: Sun, keywords: 'appearance', perform: vi.fn() },
    { id: 'dark', label: 'Dark theme', group: 'Theme', icon: Moon, keywords: 'appearance', perform: vi.fn() },
  ] satisfies Command[]

describe('filterCommands', () => {
  it('matches every word against the label, group and keywords', () => {
    const commands = makeCommands()
    expect(filterCommands(commands, 'theme dark').map((c) => c.id)).toEqual(['dark'])
    expect(filterCommands(commands, 'appearance').map((c) => c.id)).toEqual(['light', 'dark'])
    expect(filterCommands(commands, '  ')).toHaveLength(3)
  })
})

describe('CommandPalette', () => {
  it('filters as you type and runs the active command with Enter', async () => {
    const user = userEvent.setup()
    const commands = makeCommands()
    const onClose = vi.fn()
    render(<CommandPalette open onClose={onClose} commands={commands} />)

    await user.type(screen.getByRole('combobox', { name: 'Search commands' }), 'dark')
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Dark theme'])

    await user.keyboard('{Enter}')
    expect(onClose).toHaveBeenCalled()
    await waitFor(() => expect(commands[2].perform).toHaveBeenCalled())
  })

  it('tracks the active option for screen readers as the arrow keys move', async () => {
    const user = userEvent.setup()
    render(<CommandPalette open onClose={() => {}} commands={makeCommands()} />)
    const input = screen.getByRole('combobox', { name: 'Search commands' })
    const options = screen.getAllByRole('option')

    expect(input.getAttribute('aria-activedescendant')).toBe(options[0].id)
    await user.keyboard('{ArrowDown}')
    expect(input.getAttribute('aria-activedescendant')).toBe(options[1].id)
    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(input.getAttribute('aria-activedescendant')).toBe(options[2].id)
  })
})

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { InboxPanel } from './InboxPanel'
import { LeadsPanel } from './LeadsPanel'

describe('LeadsPanel', () => {
  const rows = () => within(screen.getByRole('list', { name: 'Recent leads' })).getAllByRole('listitem')

  it('filters by status and says how many leads are shown', async () => {
    const user = userEvent.setup()
    render(<LeadsPanel />)
    await user.click(screen.getByRole('radio', { name: /Pending/ }))
    expect(rows()).toHaveLength(2)
    expect(screen.getByRole('status').textContent).toBe('Showing 2 of 330 pending leads')
  })

  it('shows an empty state for a search with no match, and recovers', async () => {
    const user = userEvent.setup()
    render(<LeadsPanel />)
    await user.type(screen.getByRole('searchbox', { name: 'Search leads' }), 'zzz')
    expect(await screen.findByText('No recent leads match that search')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Clear search and filters' }))
    expect(rows()).toHaveLength(6)
  })
})

describe('InboxPanel', () => {
  it('sends a reply into the open conversation', async () => {
    const user = userEvent.setup()
    render(<InboxPanel />)
    await user.type(screen.getByRole('textbox', { name: 'Reply to Ananya Rao' }), 'See you Thursday!')
    await user.click(screen.getByRole('button', { name: 'Send reply' }))
    expect(within(screen.getByRole('log', { name: 'Messages' })).getByText('See you Thursday!')).toBeTruthy()
  })

  it('opens the next conversation with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<InboxPanel />)
    const options = screen.getAllByRole('option')
    options[0].focus()
    await user.keyboard('{ArrowDown}')
    expect(options[1].getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('group', { name: 'Conversation with Marcus Lee' })).toBeTruthy()
  })
})

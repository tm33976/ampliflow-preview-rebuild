import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ProductPreview } from './ProductPreview'

const selectedTab = () => screen.getAllByRole('tab').find((tab) => tab.getAttribute('aria-selected') === 'true')

const panelFor = (tab: HTMLElement) => document.getElementById(tab.getAttribute('aria-controls') ?? '') as HTMLElement

describe('ProductPreview', () => {
  it('links every tab to its panel', () => {
    render(<ProductPreview />)
    for (const tab of screen.getAllByRole('tab')) {
      const panel = panelFor(tab)
      expect(panel.getAttribute('role')).toBe('tabpanel')
      expect(panel.getAttribute('aria-labelledby')).toBe(tab.id)
    }
  })

  it('moves focus and selection with the arrow keys, Home and End', async () => {
    const user = userEvent.setup()
    render(<ProductPreview />)
    const tabs = screen.getAllByRole('tab')

    await user.click(tabs[0])
    await user.keyboard('{ArrowRight}')
    expect(selectedTab()).toBe(tabs[1])
    expect(document.activeElement).toBe(tabs[1])

    await user.keyboard('{End}')
    expect(selectedTab()).toBe(tabs[3])
    await user.keyboard('{ArrowRight}')
    expect(selectedTab()).toBe(tabs[0])
    await user.keyboard('{Home}')
    expect(selectedTab()).toBe(tabs[0])
  })

  it('advances when the timer finishes', () => {
    const { container } = render(<ProductPreview />)
    fireEvent.animationEnd(container.querySelector('.tab-progress') as Element, { animationName: 'tab-progress' })
    expect(selectedTab()?.textContent).toContain('Workflow')
  })

  it('hides the timer while paused and resumes it from the same point', async () => {
    const user = userEvent.setup()
    const { container } = render(<ProductPreview />)
    const root = container.querySelector('[data-preview]') as HTMLElement
    const timer = container.querySelector('.tab-progress') as HTMLElement

    await user.click(screen.getByRole('button', { name: 'Pause tab rotation' }))
    expect(root.dataset.playing).toBe('false')
    expect(timer.classList.contains('opacity-0')).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Play tab rotation' }))
    expect(root.dataset.playing).toBe('true')
    expect(container.querySelector('.tab-progress')).toBe(timer)
    expect(timer.classList.contains('opacity-0')).toBe(false)
  })

  it('stops rotating as soon as someone picks a tab', async () => {
    const user = userEvent.setup()
    const { container } = render(<ProductPreview />)
    await user.click(screen.getByRole('tab', { name: /Leads/ }))
    expect(container.querySelector('.tab-progress')).toBeNull()
  })

  it('recalculates the analytics for a shorter range', async () => {
    const user = userEvent.setup()
    render(<ProductPreview />)
    const analytics = panelFor(selectedTab() as HTMLElement)

    await user.click(within(analytics).getByRole('radio', { name: /7D/ }))
    const acceptance = within(analytics).getByText('Acceptance rate').parentElement as HTMLElement
    expect(within(acceptance).getByText('43%', { selector: '.sr-only' })).toBeTruthy()
    expect(within(acceptance).getByText('59 of 138 invites')).toBeTruthy()
  })
})

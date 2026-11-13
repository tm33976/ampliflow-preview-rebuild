import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Audit } from './audit/Audit'
import { findings } from './audit/findings'
import { Faq } from './faq/Faq'

describe('Faq', () => {
  it('opens and closes answers, each tied to its question', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const question = screen.getByRole('button', { name: /Can I cancel any time\?/ })
    const answer = document.getElementById(question.getAttribute('aria-controls') ?? '') as HTMLElement

    expect(question.getAttribute('aria-expanded')).toBe('false')
    expect(answer.getAttribute('aria-labelledby')).toBe(question.id)
    expect(answer.hasAttribute('inert')).toBe(true)

    await user.click(question)
    expect(question.getAttribute('aria-expanded')).toBe('true')
    expect(answer.hasAttribute('inert')).toBe(false)

    await user.click(question)
    expect(question.getAttribute('aria-expanded')).toBe('false')
  })
})

describe('Audit', () => {
  it('filters findings by category and reports the count', async () => {
    const user = userEvent.setup()
    render(<Audit />)
    const accessibility = findings.filter((f) => f.category === 'accessibility').length

    await user.click(screen.getByRole('radio', { name: /Accessibility/ }))
    expect(screen.getByRole('status').textContent).toBe(`Showing ${accessibility} of ${findings.length} findings`)

    const list = screen.getAllByRole('list').find((el) => within(el).queryAllByRole('heading').length > 0)
    expect(within(list as HTMLElement).getAllByRole('heading')).toHaveLength(accessibility)
  })
})

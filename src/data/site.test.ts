import { describe, expect, it } from 'vitest'
import { findings } from '../features/audit/findings'
import { faqs, numberWord, plans, systems } from './site'

const SECTION_IDS = ['top', 'preview', 'features', 'how', 'pricing', 'faq', 'audit', 'phone', 'results', 'decisions']

describe('site content', () => {
  it('names the number of systems it actually lists', () => {
    expect(numberWord(systems.length)).toBe('six')
  })

  it('only builds plans on plans that exist and come first', () => {
    plans.forEach((plan, index) => {
      plan.features
        .map((feature) => /^Everything in (\w+)$/.exec(feature)?.[1])
        .filter(Boolean)
        .forEach((base) => {
          const baseIndex = plans.findIndex((p) => p.name === base)
          expect(baseIndex, `${plan.name} builds on ${base}`).toBeGreaterThanOrEqual(0)
          expect(baseIndex).toBeLessThan(index)
        })
    })
  })

  it('quotes the same prices in the FAQ as on the plan cards', () => {
    const answer = faqs.find((faq) => faq.id === 'price')?.answer ?? ''
    plans.forEach((plan) => {
      expect(answer).toContain(`$${plan.price}`)
      if (plan.regular) expect(answer).toContain(`$${plan.regular}`)
    })
  })

  it('keeps status codes and phantom plans out of customer copy', () => {
    const copy = [...faqs.map((faq) => faq.answer), ...plans.flatMap((plan) => plan.features)].join(' ')
    expect(copy).not.toMatch(/(?<![\d,])\b[45]\d\d\b/)
    expect(copy).not.toMatch(/Everything in Free/)
  })

  it('points every audit finding at a section that exists', () => {
    findings.forEach((finding) => {
      if (finding.where) expect(SECTION_IDS, finding.id).toContain(finding.where)
      if (finding.status === 'quick-win') expect(finding.where).toBeUndefined()
    })
  })
})

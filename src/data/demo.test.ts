import { describe, expect, it } from 'vitest'
import { campaigns, DAILY_INVITE_LIMIT, funnel, leadFilters, metrics, totals, workflow } from './demo'

describe('demo data', () => {
  it('uses one lead total everywhere', () => {
    expect(campaigns.reduce((n, c) => n + c.leads, 0)).toBe(totals.leads)
    expect(funnel[0].count).toBe(totals.leads)
    expect(leadFilters[0].count).toBe(totals.leads)
  })

  it('never grows from one funnel step to the next', () => {
    funnel.slice(1).forEach((stage, i) => expect(stage.count).toBeLessThanOrEqual(funnel[i].count))
  })

  it('shows the rates the copy promises', () => {
    expect(Math.round(metrics.acceptanceRate * 100)).toBe(41)
    expect(Math.round(metrics.replyRate * 100)).toBe(23)
  })

  it('keeps the sending pace inside the safety limit', () => {
    expect(metrics.invitesPerDay).toBeLessThanOrEqual(DAILY_INVITE_LIMIT)
  })

  it('derives the featured campaign from the same rates', () => {
    const invite = workflow.steps.find((step) => step.kind === 'invite')
    const branch = workflow.steps.find((step) => step.kind === 'branch')
    if (invite?.kind !== 'invite' || branch?.kind !== 'branch') throw new Error('missing steps')
    expect(branch.done).toBe(Math.round((invite.done ?? 0) * metrics.acceptanceRate))
    expect(workflow.replied).toBe(Math.round(workflow.messaged * metrics.replyRate))
    expect(invite.of).toBe(workflow.campaign.leads)
  })
})

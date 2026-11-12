import { describe, expect, it } from 'vitest'
import {
  campaigns,
  conversations,
  DAILY_INVITE_LIMIT,
  days,
  inboxCounts,
  leadById,
  leadStatusCounts,
  RANGES,
  summaries,
  totalLeads,
  workflow,
} from './demo'

const sum = (values: number[]) => values.reduce((total, n) => total + n, 0)

describe('demo data', () => {
  it('covers 30 consecutive days ending on the last day', () => {
    expect(days).toHaveLength(30)
    days.slice(1).forEach((day, i) => {
      const previous = days[i].date
      const nextCalendarDay = new Date(previous.getFullYear(), previous.getMonth(), previous.getDate() + 1)
      expect(day.date.toDateString()).toBe(nextCalendarDay.toDateString())
    })
  })

  it('never sends more invites in a day than the safety limit allows', () => {
    days.forEach((day) => expect(day.invites).toBeLessThanOrEqual(DAILY_INVITE_LIMIT))
  })

  it('keeps every lead status adding up to the campaign total', () => {
    expect(sum(campaigns.map((c) => c.leads))).toBe(totalLeads)
    expect(sum(Object.values(leadStatusCounts))).toBe(totalLeads)
  })

  it('keeps inbox tags adding up to the replies received', () => {
    expect(sum(Object.values(inboxCounts))).toBe(summaries[30].totals.replies)
    expect(inboxCounts.booked).toBe(summaries[30].totals.meetings)
  })

  it('shows the 30 day rates the pitch quotes', () => {
    const month = summaries[30]
    expect(month.totals.invites).toBe(560)
    expect(Math.round(month.acceptanceRate * 100)).toBe(41)
    expect(Math.round(month.replyRate * 100)).toBe(23)
    expect(month.totals.meetings).toBe(12)
  })

  it.each(RANGES)('never grows from one funnel step to the next over %i days', (range) => {
    const { funnel } = summaries[range]
    funnel.slice(1).forEach((stage, i) => expect(stage.count).toBeLessThanOrEqual(funnel[i].count))
  })

  it('nests the shorter ranges inside the longer ones', () => {
    expect(summaries[7].totals.invites).toBeLessThan(summaries[14].totals.invites)
    expect(summaries[14].totals.invites).toBeLessThan(summaries[30].totals.invites)
  })

  it('links every conversation to a lead who replied', () => {
    conversations.forEach((conversation) => {
      const lead = leadById(conversation.leadId)
      expect(['replied', 'booked']).toContain(lead.status)
      expect(conversation.tag === 'booked').toBe(lead.status === 'booked')
    })
  })

  it('derives the featured campaign from the same rates', () => {
    const invite = workflow.steps.find((step) => step.kind === 'invite')
    const branch = workflow.steps.find((step) => step.kind === 'branch')
    if (invite?.kind !== 'invite' || branch?.kind !== 'branch') throw new Error('missing steps')
    expect(branch.done).toBe(Math.round(invite.done * summaries[30].acceptanceRate))
    expect(workflow.replied).toBe(Math.round(workflow.messaged * summaries[30].replyRate))
  })
})

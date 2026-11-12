// Every number shown in the preview is derived from the raw counts in this file,
// so no two tabs can disagree.

export type CampaignStatus = 'running' | 'paused' | 'completed'

export type Campaign = {
  name: string
  leads: number
  status: CampaignStatus
}

export const campaigns: Campaign[] = [
  { name: 'SaaS founders', leads: 240, status: 'running' },
  { name: 'Fintech growth leads', leads: 220, status: 'running' },
  { name: 'Series A CTOs', leads: 200, status: 'paused' },
  { name: 'Agency owners', leads: 180, status: 'completed' },
  { name: 'Tech recruiters', leads: 160, status: 'completed' },
]

export type WeekStats = {
  invites: number
  accepted: number
  messages: number
  replies: number
}

export const weeks: WeekStats[] = [
  { invites: 130, accepted: 50, messages: 40, replies: 8 },
  { invites: 140, accepted: 56, messages: 44, replies: 10 },
  { invites: 145, accepted: 60, messages: 46, replies: 11 },
  { invites: 145, accepted: 64, messages: 50, replies: 12 },
]

export const PERIOD_DAYS = 30
export const DAILY_INVITE_LIMIT = 25

const sum = (key: keyof WeekStats) => weeks.reduce((total, week) => total + week[key], 0)

export const ratio = (part: number, whole: number) => (whole === 0 ? 0 : part / whole)

export const totals = {
  leads: campaigns.reduce((total, c) => total + c.leads, 0),
  invites: sum('invites'),
  accepted: sum('accepted'),
  messages: sum('messages'),
  replies: sum('replies'),
  meetings: 12,
  unreadReplies: 7,
}

const acceptanceByWeek = weeks.map((w) => ratio(w.accepted, w.invites))
const replyByWeek = weeks.map((w) => ratio(w.replies, w.messages))

export const metrics = {
  acceptanceRate: ratio(totals.accepted, totals.invites),
  replyRate: ratio(totals.replies, totals.messages),
  acceptanceByWeek,
  replyByWeek,
  acceptanceDelta: acceptanceByWeek[acceptanceByWeek.length - 1] - acceptanceByWeek[0],
  replyDelta: replyByWeek[replyByWeek.length - 1] - replyByWeek[0],
  pendingInvites: totals.invites - totals.accepted,
  invitesPerDay: totals.invites / PERIOD_DAYS,
  runningCampaigns: campaigns.filter((c) => c.status === 'running').length,
}

export type FunnelStage = { label: string; count: number }

export const funnel: FunnelStage[] = [
  { label: 'Leads', count: totals.leads },
  { label: 'Invites sent', count: totals.invites },
  { label: 'Accepted', count: totals.accepted },
  { label: 'Messaged', count: totals.messages },
  { label: 'Replied', count: totals.replies },
  { label: 'Meetings', count: totals.meetings },
]

export type WorkflowStep =
  | { kind: 'wait'; days: number }
  | {
      kind: 'visit' | 'invite' | 'branch' | 'message'
      title: string
      done?: number
      of?: number
      unit?: string
      note?: string
      detail?: string
    }

const featured = campaigns[0]
const visited = 180
const invited = 150
const connected = Math.round(invited * metrics.acceptanceRate)
const messaged = 48

export const workflow: {
  campaign: Campaign
  steps: WorkflowStep[]
  replied: number
  messaged: number
} = {
  campaign: featured,
  steps: [
    { kind: 'visit', title: 'Visit profile', done: visited, of: featured.leads, unit: 'visited' },
    { kind: 'wait', days: 1 },
    {
      kind: 'invite',
      title: 'Send an invite',
      done: invited,
      of: featured.leads,
      unit: 'sent',
      note: 'Hi {{first_name}}, enjoyed your post on scaling outbound at {{company}}. Would love to connect.',
    },
    { kind: 'wait', days: 3 },
    { kind: 'branch', title: 'If connected', done: connected, of: invited, unit: 'connected' },
    {
      kind: 'message',
      title: 'Send a message',
      done: messaged,
      of: connected,
      unit: 'sent',
      note: 'Thanks for connecting, {{first_name}}! We help founders run LinkedIn outreach on autopilot, within safe limits. Worth a 15 minute look this week?',
      detail: 'Follows up after 4 days if there is no reply',
    },
  ],
  replied: Math.round(messaged * metrics.replyRate),
  messaged,
}

export type LeadStatus = 'pending' | 'connected' | 'replied' | 'booked'

export type Lead = {
  name: string
  role: string
  company: string
  campaign: string
  status: LeadStatus
  lastAction: string
  when: string
}

export const leads: Lead[] = [
  {
    name: 'Ananya Rao',
    role: 'Founder',
    company: 'Brightloop',
    campaign: 'SaaS founders',
    status: 'booked',
    lastAction: 'Meeting booked',
    when: '2h ago',
  },
  {
    name: 'Marcus Lee',
    role: 'Head of Growth',
    company: 'Finlane',
    campaign: 'Fintech growth leads',
    status: 'replied',
    lastAction: 'Replied',
    when: '5h ago',
  },
  {
    name: 'Sofia Martins',
    role: 'CTO',
    company: 'Quanta Labs',
    campaign: 'Series A CTOs',
    status: 'connected',
    lastAction: 'Accepted invite',
    when: '1d ago',
  },
  {
    name: 'Rahul Menon',
    role: 'Co-founder',
    company: 'Stackly',
    campaign: 'SaaS founders',
    status: 'pending',
    lastAction: 'Invite sent',
    when: '1d ago',
  },
  {
    name: 'Emily Carter',
    role: 'Talent Lead',
    company: 'Hirewave',
    campaign: 'Tech recruiters',
    status: 'pending',
    lastAction: 'Profile visited',
    when: '2d ago',
  },
  {
    name: 'Lena Fischer',
    role: 'VP Sales',
    company: 'Corvalo',
    campaign: 'Fintech growth leads',
    status: 'connected',
    lastAction: 'Accepted invite',
    when: '3d ago',
  },
]

export const leadFilters = [
  { label: 'All', count: totals.leads },
  { label: 'Pending', count: metrics.pendingInvites },
  { label: 'Connected', count: totals.accepted },
  { label: 'Replied', count: totals.replies },
]

export type Conversation = {
  name: string
  preview: string
  when: string
  tag: 'Booked' | 'Interested' | 'Needs reply'
}

export const conversations: Conversation[] = [
  { name: 'Ananya Rao', preview: 'Thursday at 4 pm works for me.', when: '2h', tag: 'Booked' },
  { name: 'Marcus Lee', preview: 'Pricing for a team of 3?', when: '5h', tag: 'Needs reply' },
  { name: 'Kavya Iyer', preview: 'Happy to take a look next week.', when: '1d', tag: 'Interested' },
  { name: 'Daniel Brooks', preview: 'How do the daily limits work?', when: '2d', tag: 'Needs reply' },
]

export const thread = [
  {
    from: 'you',
    text: 'Thanks for connecting, Ananya! We help founders run LinkedIn outreach on autopilot, within safe limits. Worth a 15 minute look this week?',
    time: '10:57 AM',
  },
  { from: 'lead', text: 'This looks useful. Could we do Thursday at 4 pm?', time: '1:12 PM' },
  { from: 'you', text: 'Perfect, I have sent you an invite for Thursday at 4 pm.', time: '1:20 PM' },
] as const

export const inboxFilters = [
  { label: 'All', count: totals.replies },
  { label: 'Needs reply', count: totals.unreadReplies },
  { label: 'Booked', count: totals.meetings },
]

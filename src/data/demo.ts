// Every number in the preview is derived from the daily counts and the lists in
// this file, so no two views can disagree. All people and companies are fictional.

export const DAILY_INVITE_LIMIT = 25
export const INVITE_NOTE_LIMIT = 300

export const RANGES = [7, 14, 30] as const
export type RangeDays = (typeof RANGES)[number]

const series = {
  visits: [
    21, 20, 22, 14, 14, 20, 27, 23, 20, 26, 13, 15, 22, 24, 26, 21, 27, 14, 14, 25, 24, 27, 23, 24, 17, 12, 28, 25, 25,
    27,
  ],
  invites: [
    18, 20, 18, 13, 12, 19, 22, 20, 18, 21, 12, 13, 19, 22, 21, 20, 23, 12, 13, 21, 21, 23, 21, 22, 14, 12, 23, 22, 23,
    22,
  ],
  accepted: [1, 4, 7, 8, 6, 6, 8, 8, 10, 8, 8, 6, 7, 8, 8, 10, 10, 8, 7, 7, 8, 9, 9, 10, 8, 7, 7, 8, 10, 9],
  messages: [0, 2, 5, 4, 4, 6, 6, 7, 8, 8, 5, 4, 6, 7, 7, 9, 9, 5, 4, 6, 7, 7, 9, 8, 5, 4, 6, 6, 8, 8],
  replies: [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2],
  meetings: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
}

export type DayMetric = keyof typeof series
export type DayStats = Record<DayMetric, number> & { date: Date }

const LAST_DAY = new Date(2026, 10, 12)

export const days: DayStats[] = series.invites.map((_, i) => ({
  date: new Date(LAST_DAY.getFullYear(), LAST_DAY.getMonth(), LAST_DAY.getDate() - (series.invites.length - 1 - i)),
  visits: series.visits[i],
  invites: series.invites[i],
  accepted: series.accepted[i],
  messages: series.messages[i],
  replies: series.replies[i],
  meetings: series.meetings[i],
}))

export const ratio = (part: number, whole: number) => (whole === 0 ? 0 : part / whole)

const sumOf = (list: DayStats[], key: DayMetric) => list.reduce((total, day) => total + day[key], 0)

function chunk<T>(list: T[], size: number) {
  return Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, i * size + size))
}

const BUCKET_DAYS: Record<RangeDays, number> = { 7: 1, 14: 2, 30: 5 }

function summarize(range: RangeDays) {
  const window = days.slice(-range)
  const totals = {
    visits: sumOf(window, 'visits'),
    invites: sumOf(window, 'invites'),
    accepted: sumOf(window, 'accepted'),
    messages: sumOf(window, 'messages'),
    replies: sumOf(window, 'replies'),
    meetings: sumOf(window, 'meetings'),
  }
  const buckets = chunk(window, BUCKET_DAYS[range])
  return {
    range,
    days: window,
    totals,
    acceptanceRate: ratio(totals.accepted, totals.invites),
    replyRate: ratio(totals.replies, totals.messages),
    meetingRate: ratio(totals.meetings, totals.replies),
    acceptanceTrend: buckets.map((b) => ratio(sumOf(b, 'accepted'), sumOf(b, 'invites'))),
    replyTrend: buckets.map((b) => ratio(sumOf(b, 'replies'), sumOf(b, 'messages'))),
    invitesPerDay: totals.invites / range,
    peakInvites: Math.max(...window.map((day) => day.invites)),
    funnel: [
      { label: 'Profile visits', count: totals.visits },
      { label: 'Invites sent', count: totals.invites },
      { label: 'Accepted', count: totals.accepted },
      { label: 'Messaged', count: totals.messages },
      { label: 'Replied', count: totals.replies },
      { label: 'Meetings', count: totals.meetings },
    ],
  }
}

export type Summary = ReturnType<typeof summarize>

export const summaries = Object.fromEntries(RANGES.map((range) => [range, summarize(range)])) as Record<
  RangeDays,
  Summary
>

export type CampaignStatus = 'running' | 'paused' | 'completed'
export type Campaign = { name: string; leads: number; status: CampaignStatus }

export const campaigns: Campaign[] = [
  { name: 'SaaS founders', leads: 240, status: 'running' },
  { name: 'Fintech growth leads', leads: 220, status: 'running' },
  { name: 'Series A CTOs', leads: 200, status: 'paused' },
  { name: 'Agency owners', leads: 180, status: 'completed' },
  { name: 'Tech recruiters', leads: 160, status: 'completed' },
]

export const totalLeads = campaigns.reduce((total, c) => total + c.leads, 0)
export const runningCampaigns = campaigns.filter((c) => c.status === 'running').length

// Every campaign started inside the 30 day window, so all-time counts equal the 30 day totals.
const allTime = summaries[30].totals

export type LeadStatus = 'queued' | 'pending' | 'connected' | 'replied' | 'booked'

export const leadStatusCounts: Record<LeadStatus, number> = {
  queued: totalLeads - allTime.invites,
  pending: allTime.invites - allTime.accepted,
  connected: allTime.accepted - allTime.replies,
  replied: allTime.replies - allTime.meetings,
  booked: allTime.meetings,
}

export type Lead = {
  id: string
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
    id: 'ananya',
    name: 'Ananya Rao',
    role: 'Founder',
    company: 'Brightloop',
    campaign: 'SaaS founders',
    status: 'booked',
    lastAction: 'Meeting booked',
    when: '2h ago',
  },
  {
    id: 'marcus',
    name: 'Marcus Lee',
    role: 'Head of Growth',
    company: 'Finlane',
    campaign: 'Fintech growth leads',
    status: 'replied',
    lastAction: 'Replied',
    when: '5h ago',
  },
  {
    id: 'sofia',
    name: 'Sofia Martins',
    role: 'CTO',
    company: 'Quanta Labs',
    campaign: 'Series A CTOs',
    status: 'connected',
    lastAction: 'Accepted invite',
    when: '1d ago',
  },
  {
    id: 'kavya',
    name: 'Kavya Iyer',
    role: 'Founder',
    company: 'Nimbly',
    campaign: 'SaaS founders',
    status: 'replied',
    lastAction: 'Replied',
    when: '1d ago',
  },
  {
    id: 'rahul',
    name: 'Rahul Menon',
    role: 'Co-founder',
    company: 'Stackly',
    campaign: 'SaaS founders',
    status: 'pending',
    lastAction: 'Invite sent',
    when: '1d ago',
  },
  {
    id: 'jonas',
    name: 'Jonas Weber',
    role: 'Head of Sales',
    company: 'Kitebase',
    campaign: 'SaaS founders',
    status: 'booked',
    lastAction: 'Meeting booked',
    when: '1d ago',
  },
  {
    id: 'daniel',
    name: 'Daniel Brooks',
    role: 'VP Revenue',
    company: 'Ledgerly',
    campaign: 'Fintech growth leads',
    status: 'replied',
    lastAction: 'Replied',
    when: '2d ago',
  },
  {
    id: 'emily',
    name: 'Emily Carter',
    role: 'Talent Lead',
    company: 'Hirewave',
    campaign: 'Tech recruiters',
    status: 'pending',
    lastAction: 'Invite sent',
    when: '2d ago',
  },
  {
    id: 'lena',
    name: 'Lena Fischer',
    role: 'VP Sales',
    company: 'Corvalo',
    campaign: 'Fintech growth leads',
    status: 'connected',
    lastAction: 'Accepted invite',
    when: '3d ago',
  },
  {
    id: 'omar',
    name: 'Omar Haddad',
    role: 'Founder',
    company: 'Northpeak Studio',
    campaign: 'Agency owners',
    status: 'replied',
    lastAction: 'Replied',
    when: '3d ago',
  },
  {
    id: 'wei',
    name: 'Wei Chen',
    role: 'CTO',
    company: 'Orbitals',
    campaign: 'Series A CTOs',
    status: 'queued',
    lastAction: 'Visit scheduled',
    when: 'Tomorrow',
  },
  {
    id: 'grace',
    name: 'Grace Kim',
    role: 'Recruiting Lead',
    company: 'Talentry',
    campaign: 'Tech recruiters',
    status: 'queued',
    lastAction: 'Visit scheduled',
    when: 'Tomorrow',
  },
]

export type InboxTag = 'needs-reply' | 'interested' | 'booked' | 'not-now'

const NEEDS_REPLY = 7
const NOT_NOW = 7

export const inboxCounts: Record<InboxTag, number> = {
  'needs-reply': NEEDS_REPLY,
  interested: allTime.replies - allTime.meetings - NEEDS_REPLY - NOT_NOW,
  booked: allTime.meetings,
  'not-now': NOT_NOW,
}

export type Message = { from: 'you' | 'lead' | 'system'; text: string; time: string }
export type Conversation = { leadId: string; tag: InboxTag; when: string; messages: Message[] }

const opener = (name: string, hook: string) =>
  `Thanks for connecting, ${name}! ${hook} We run LinkedIn outreach on autopilot, within safe limits. Worth a 15 minute look this week?`

export const conversations: Conversation[] = [
  {
    leadId: 'ananya',
    tag: 'booked',
    when: '2h',
    messages: [
      { from: 'you', text: opener('Ananya', 'Loved how Brightloop is growing.'), time: '10:57 AM' },
      { from: 'lead', text: 'This looks useful. Could we do Thursday at 4 pm?', time: '1:12 PM' },
      { from: 'system', text: 'Sequence paused because Ananya replied', time: '1:12 PM' },
      { from: 'you', text: 'Perfect, I have sent you an invite for Thursday at 4 pm.', time: '1:20 PM' },
    ],
  },
  {
    leadId: 'marcus',
    tag: 'needs-reply',
    when: '5h',
    messages: [
      { from: 'you', text: opener('Marcus', 'Saw Finlane is scaling its growth team.'), time: '9:02 AM' },
      { from: 'lead', text: 'Interesting. What does pricing look like for a team of 3?', time: '11:40 AM' },
      { from: 'system', text: 'Sequence paused because Marcus replied', time: '11:40 AM' },
    ],
  },
  {
    leadId: 'kavya',
    tag: 'interested',
    when: '1d',
    messages: [
      { from: 'you', text: opener('Kavya', 'Nimbly looks like a great product.'), time: 'Wed' },
      { from: 'lead', text: 'Happy to take a look next week. Can you send a short demo video?', time: 'Wed' },
      { from: 'system', text: 'Sequence paused because Kavya replied', time: 'Wed' },
      { from: 'you', text: 'Sure, here is a 2 minute walkthrough. Next Tuesday works for a call too.', time: 'Wed' },
    ],
  },
  {
    leadId: 'jonas',
    tag: 'booked',
    when: '1d',
    messages: [
      { from: 'you', text: opener('Jonas', 'Saw Kitebase is hiring SDRs.'), time: 'Tue' },
      { from: 'lead', text: 'Good timing, we are building the team right now. Send me a link?', time: 'Tue' },
      { from: 'system', text: 'Sequence paused because Jonas replied', time: 'Tue' },
      { from: 'you', text: 'Friday at 11 am works on my side. Calendar invite sent.', time: 'Tue' },
    ],
  },
  {
    leadId: 'daniel',
    tag: 'needs-reply',
    when: '2d',
    messages: [
      { from: 'you', text: opener('Daniel', 'Ledgerly has been on my radar.'), time: 'Mon' },
      {
        from: 'lead',
        text: 'How do the daily limits work? We got restricted with another tool last year.',
        time: 'Mon',
      },
      { from: 'system', text: 'Sequence paused because Daniel replied', time: 'Mon' },
    ],
  },
  {
    leadId: 'omar',
    tag: 'not-now',
    when: '3d',
    messages: [
      { from: 'you', text: opener('Omar', 'Northpeak Studio does lovely work.'), time: 'Sun' },
      { from: 'lead', text: 'Not right now, we are heads down until January. Ping me then?', time: 'Mon' },
      { from: 'system', text: 'Sequence paused because Omar replied', time: 'Mon' },
      { from: 'you', text: 'Will do, I have set a reminder for January.', time: 'Mon' },
    ],
  },
]

export const leadById = (id: string) => {
  const lead = leads.find((l) => l.id === id)
  if (!lead) throw new Error(`Unknown lead ${id}`)
  return lead
}

export type WorkflowStep =
  | { kind: 'wait'; days: number }
  | {
      kind: 'visit' | 'invite' | 'branch' | 'message'
      title: string
      description: string
      done: number
      of: number
      unit: string
      note?: string
      noteLimit?: number
      detail?: string
    }

const featured = campaigns[0]
const visited = 180
const invited = 150
const connected = Math.round(invited * summaries[30].acceptanceRate)
const messaged = 48

export const workflow: { campaign: Campaign; steps: WorkflowStep[]; replied: number; messaged: number } = {
  campaign: featured,
  steps: [
    {
      kind: 'visit',
      title: 'Visit profile',
      description: 'Views each profile first, so your name already feels familiar when the invite arrives.',
      done: visited,
      of: featured.leads,
      unit: 'visited',
    },
    { kind: 'wait', days: 1 },
    {
      kind: 'invite',
      title: 'Send an invite',
      description: 'Sends a connection request with a short personal note.',
      done: invited,
      of: featured.leads,
      unit: 'sent',
      note: 'Hi {{first_name}}, enjoyed your post on scaling outbound at {{company}}. Would love to connect.',
      noteLimit: INVITE_NOTE_LIMIT,
    },
    { kind: 'wait', days: 3 },
    {
      kind: 'branch',
      title: 'If connected',
      description:
        'Splits the sequence. Leads who accept move on to the message, the rest stay on the not connected path.',
      done: connected,
      of: invited,
      unit: 'connected',
    },
    {
      kind: 'message',
      title: 'Send a message',
      description: 'Follows up after 4 days if there is no reply, and pauses the moment a lead replies.',
      done: messaged,
      of: connected,
      unit: 'sent',
      note: 'Thanks for connecting, {{first_name}}! We help founders run LinkedIn outreach on autopilot, within safe limits. Worth a 15 minute look this week?',
      detail: 'Follows up after 4 days if there is no reply',
    },
  ],
  replied: Math.round(messaged * summaries[30].replyRate),
  messaged,
}

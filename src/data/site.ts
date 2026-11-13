// Marketing content rebuilt from ampliflow.in and ampliflow.in/pricing, with the
// contradictions found in the audit resolved. Plan limits come from their pricing table.

import { DAILY_INVITE_LIMIT } from './demo'

export type System = { id: string; title: string; body: string; proof: string }

export const systems: System[] = [
  {
    id: 'builder',
    title: 'Visual workflow builder',
    body: 'Drag and drop multi step sequences with if and else branches, delays and A/B tests. No code.',
    proof: 'If and else · delays · A/B',
  },
  {
    id: 'cloud',
    title: 'Cloud execution',
    body: 'Runs server side around the clock with randomised human pacing. No extension, no laptop left open.',
    proof: '24/7 · no extension',
  },
  {
    id: 'import',
    title: 'LinkedIn search import',
    body: 'Paste a LinkedIn or Sales Navigator search URL and import up to 1,000 leads. Profiles enrich automatically.',
    proof: '100 to 1,000 leads per import',
  },
  {
    id: 'safety',
    title: 'Account safety controls',
    body: 'Daily limits, working hours, timing jitter, blacklists, auto pause on reply and a real time safety score.',
    proof: `${DAILY_INVITE_LIMIT} invites a day, max`,
  },
  {
    id: 'inbox',
    title: 'Unified smart inbox',
    body: 'Every reply from every campaign in one place. Answer without opening LinkedIn, and the sequence pauses.',
    proof: 'Pauses on reply',
  },
  {
    id: 'analytics',
    title: 'Campaign analytics',
    body: 'Per step performance, acceptance and reply rates, and daily activity measured against your safety limits.',
    proof: 'Per step, per day',
  },
]

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
export const numberWord = (n: number) => NUMBER_WORDS[n] ?? String(n)

export const integrations = {
  live: ['Slack', 'Outbound webhooks'],
  planned: ['HubSpot', 'Google Sheets', 'Gmail', 'Notion', 'Zapier', 'Apollo', 'Clay'],
}

export type Step = { title: string; body: string; time: string }

export const steps: Step[] = [
  {
    title: 'Connect LinkedIn',
    body: 'Sign in securely through Unipile. Ampliflow never sees your password.',
    time: '2 minutes',
  },
  {
    title: 'Import your audience',
    body: 'Paste a LinkedIn or Sales Navigator search URL, or upload a CSV of profile links.',
    time: '5 minutes',
  },
  {
    title: 'Build the sequence',
    body: 'Visit, invite, wait, then message only the people who connect. Drag and drop, no code.',
    time: '15 minutes',
  },
  {
    title: 'Launch and let it run',
    body: 'It runs in the cloud inside your working hours and safe limits. Replies arrive over the following days as invites are accepted, and each sequence pauses the moment someone answers.',
    time: 'Days, not minutes',
  },
]

export type Plan = {
  id: 'standard' | 'pro' | 'team'
  name: string
  tagline: string
  price: number
  /** Regular price once the 100 founding spots are gone. */
  regular?: number
  featured?: boolean
  features: string[]
  limits: { invites: number; messages: number; views: number }
}

export const plans: Plan[] = [
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'For getting outreach going.',
    price: 19,
    regular: 39,
    features: ['5 active campaigns', 'Up to 2,500 leads', 'Per step campaign analytics', 'Email support'],
    limits: { invites: 25, messages: 25, views: 50 },
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For solo operators who ship.',
    price: 39,
    regular: 59,
    featured: true,
    features: [
      'Everything in Standard',
      'Unlimited active campaigns',
      'Up to 10,000 leads',
      'CSV upload and LinkedIn search sources',
      'Slack and outbound webhooks',
      'Priority support',
    ],
    limits: { invites: 25, messages: 50, views: 80 },
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'For agencies and small teams.',
    price: 99,
    features: [
      'Everything in Pro',
      'Up to 50,000 leads',
      'Multiple LinkedIn accounts, billed per seat',
      'Onboarding call and dedicated support',
    ],
    limits: { invites: 25, messages: 80, views: 100 },
  },
]

export const FOUNDING_SPOTS = 100

const plan = (id: Plan['id']) => {
  const match = plans.find((p) => p.id === id)
  if (!match) throw new Error(`Unknown plan ${id}`)
  return match
}

const range = (limit: keyof Plan['limits']) => {
  const values = plans.map((p) => p.limits[limit])
  return `${Math.min(...values)} to ${Math.max(...values)}`
}

export type Testimonial = { quote: string; name: string; role: string }

// Quoted word for word from the testimonials on ampliflow.in.
export const testimonials: Testimonial[] = [
  {
    quote:
      'Replaced our entire SDR seat. We’re getting 40-60 qualified replies a month at zero marginal cost. Auto-pause on reply alone is worth the subscription.',
    name: 'Marcus R.',
    role: 'Founder · Series A SaaS',
  },
  {
    quote:
      'Migrated from Dripify in 20 minutes. The visual builder is genuinely faster and the safety controls are a level above what I had before. Half the bill.',
    name: 'Sara C.',
    role: 'Head of Growth · Fintech',
  },
  {
    quote:
      'Six concurrent search campaigns for clients. The smart inbox keeps everything separated and the safety score has caught two anomalies before they became problems.',
    name: 'Nikita V.',
    role: 'Tech Recruiter · Agency',
  },
  {
    quote:
      'Cut our outbound tooling cost in half and the workflow builder is more intuitive than what we had. Closing notes auto-attach to leads now.',
    name: 'Alex M.',
    role: 'Founder · Bootstrapped SaaS',
  },
  {
    quote:
      'Setup took 15 minutes. By Friday I’d booked four meetings from a single LinkedIn search import. The workflow I wish I’d had a year ago.',
    name: 'Priya N.',
    role: 'Head of Sales · B2B',
  },
  {
    quote:
      'Being able to pause sequences from the inbox view alone saves me an hour a day. Smart unified inbox is the killer feature.',
    name: 'Tomas G.',
    role: 'Tech Recruiter · Agency',
  },
]

export type Faq = { id: string; topic: string; question: string; answer: string }

export const faqs: Faq[] = [
  {
    id: 'safety',
    topic: 'Safety',
    question: 'Is this safe for my LinkedIn account?',
    answer: `Every action respects human daily limits: ${DAILY_INVITE_LIMIT} connection requests on every plan, ${range('messages')} messages and ${range('views')} profile views depending on plan. Actions run only inside your working hours with random timing between them, the sequence pauses the moment a lead replies, and a real time safety score warns you before anything looks unusual.`,
  },
  {
    id: 'ip',
    topic: 'Safety',
    question: 'What IP address does my account run from?',
    answer:
      'Your own country’s. Each account runs through a dedicated, country matched residential proxy, never a shared or foreign data centre address.',
  },
  {
    id: 'laptop',
    topic: 'Setup',
    question: 'Do I need to keep my computer on?',
    answer:
      'No. Everything runs on Ampliflow’s servers, so sequences keep going while your laptop is closed, within your limits and working hours.',
  },
  {
    id: 'start',
    topic: 'Access',
    question: 'Can I start today?',
    answer: `Yes. Ampliflow is live. Every plan starts with a 7 day free trial, billed on day 7, and the founding price applies to the first ${FOUNDING_SPOTS} accounts.`,
  },
  {
    id: 'price',
    topic: 'Pricing',
    question: 'What happens to the price after the founding offer?',
    answer: `Founding members keep their price for the life of the account: $${plan('standard').price} for Standard and $${plan('pro').price} for Pro. After the first ${FOUNDING_SPOTS} accounts, Standard is $${plan('standard').regular}, Pro is $${plan('pro').regular} and Team is $${plan('team').price} a month.`,
  },
  {
    id: 'limits',
    topic: 'Pricing',
    question: 'What happens when I reach my plan’s limit?',
    answer:
      'Campaigns that are already running keep going up to your lead limit. New campaigns wait until you upgrade or free up space, and you will see a clear note in the app explaining why.',
  },
  {
    id: 'cancel',
    topic: 'Billing',
    question: 'Can I cancel any time?',
    answer: 'Yes, in one click. You keep access until the end of the billing period you have paid for.',
  },
  {
    id: 'integrations',
    topic: 'Integrations',
    question: 'Which integrations work today?',
    answer:
      'Slack and outbound webhooks are live on Pro and Team. More native integrations, including HubSpot, are rolling out through 2026.',
  },
]

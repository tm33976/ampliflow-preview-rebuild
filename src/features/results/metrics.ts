export type Metric = {
  label: string
  unit: string
  hint: string
  before: number
  after: number
  /** Formats the big headline number, which sits next to `unit`. */
  headline: (value: number) => string
  /** Formats values in the comparison bars, unit included. */
  format: (value: number) => string
  max: number
  higherIsBetter: boolean
}

export const MEASURED_NOTE =
  'Google PageSpeed Insights on mobile, two runs for each site on 13 Nov 2026. Both sites score 95 to 100 for performance, so the cards show where they differ, using the slower rebuild run.'

const whole = (value: number) => String(Math.round(value))
const oneDecimal = (value: number) => value.toFixed(1)

export const metrics: Metric[] = [
  {
    label: 'Accessibility',
    unit: '/ 100',
    hint: 'Tabs, labels and contrast all pass',
    before: 87,
    after: 100,
    headline: whole,
    format: whole,
    max: 100,
    higherIsBetter: true,
  },
  {
    label: 'Page weight',
    unit: 'KiB',
    hint: 'Initial page load, fonts included',
    before: 389,
    after: 168,
    headline: whole,
    format: (value) => `${whole(value)} KiB`,
    max: 400,
    higherIsBetter: false,
  },
  {
    label: 'Largest paint',
    unit: 'seconds',
    hint: 'When the main content is visible',
    before: 1.7,
    after: 1.4,
    headline: oneDecimal,
    format: (value) => `${oneDecimal(value)} s`,
    max: 2.5,
    higherIsBetter: false,
  },
  {
    label: 'Best practices',
    unit: '/ 100',
    hint: 'ampliflow.in logs a 404 from its spots counter',
    before: 96,
    after: 100,
    headline: whole,
    format: whole,
    max: 100,
    higherIsBetter: true,
  },
]

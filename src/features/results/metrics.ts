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
  'Lighthouse mobile runs on 13 Nov 2026, with the same settings for ampliflow.in and this rebuild. Scores move a little between runs, so the typical result is shown.'

const whole = (value: number) => String(Math.round(value))
const oneDecimal = (value: number) => value.toFixed(1)

export const metrics: Metric[] = [
  {
    label: 'Performance',
    unit: '/ 100',
    hint: 'ampliflow.in scored 38 to 72 across runs',
    before: 71,
    after: 91,
    headline: whole,
    format: whole,
    max: 100,
    higherIsBetter: true,
  },
  {
    label: 'Accessibility',
    unit: '/ 100',
    hint: 'Tabs, labels and contrast all pass',
    before: 86,
    after: 100,
    headline: whole,
    format: whole,
    max: 100,
    higherIsBetter: true,
  },
  {
    label: 'Largest paint',
    unit: 'seconds',
    hint: 'When the main content is visible',
    before: 4.9,
    after: 1.9,
    headline: oneDecimal,
    format: (value) => `${oneDecimal(value)} s`,
    max: 6.5,
    higherIsBetter: false,
  },
  {
    label: 'Page weight',
    unit: 'KB',
    hint: 'Initial page load, fonts included',
    before: 388,
    after: 164,
    headline: whole,
    format: (value) => `${whole(value)} KB`,
    max: 620,
    higherIsBetter: false,
  },
]

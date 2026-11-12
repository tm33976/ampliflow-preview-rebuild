export type Metric = {
  label: string
  /** Big number for the rebuild, with its unit shown beside it. */
  headline: string
  unit: string
  hint: string
  before: number
  after: number
  format: (value: number) => string
  max: number
  higherIsBetter: boolean
}

export const MEASURED_NOTE =
  'Lighthouse mobile runs on 13 Nov 2026, with the same settings for ampliflow.in and this rebuild. Scores move a little between runs, so the typical result is shown.'

const score = (value: number) => String(value)
const seconds = (value: number) => `${value.toFixed(1)} s`
const kilobytes = (value: number) => `${value} KB`

export const metrics: Metric[] = [
  {
    label: 'Performance',
    headline: '96',
    unit: '/ 100',
    hint: 'ampliflow.in scored 38 to 72 across runs',
    before: 71,
    after: 96,
    format: score,
    max: 100,
    higherIsBetter: true,
  },
  {
    label: 'Accessibility',
    headline: '100',
    unit: '/ 100',
    hint: 'Tabs, labels and contrast all pass',
    before: 86,
    after: 100,
    format: score,
    max: 100,
    higherIsBetter: true,
  },
  {
    label: 'Largest paint',
    headline: '1.9',
    unit: 'seconds',
    hint: 'When the main content is visible',
    before: 4.9,
    after: 1.9,
    format: seconds,
    max: 6.5,
    higherIsBetter: false,
  },
  {
    label: 'Page weight',
    headline: '152',
    unit: 'KB',
    hint: 'Initial page load, fonts included',
    before: 388,
    after: 152,
    format: kilobytes,
    max: 620,
    higherIsBetter: false,
  },
]

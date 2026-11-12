const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const dayFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const weekdayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

export const formatNumber = (n: number) => numberFormat.format(Math.round(n))

export const formatPercent = (ratio: number) => `${Math.round(ratio * 100)}%`

export const formatDay = (date: Date) => dayFormat.format(date)

export const formatWeekday = (date: Date) => weekdayFormat.format(date)

export const plural = (count: number, one: string, many = `${one}s`) =>
  `${formatNumber(count)} ${count === 1 ? one : many}`

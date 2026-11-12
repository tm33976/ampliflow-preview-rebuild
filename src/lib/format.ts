const numberFormat = new Intl.NumberFormat('en-US')

export const formatNumber = (n: number) => numberFormat.format(n)

export const formatPercent = (ratio: number) => `${Math.round(ratio * 100)}%`

export const formatPoints = (delta: number) => {
  const points = Math.round(delta * 100)
  return `${points >= 0 ? '+' : '-'}${Math.abs(points)} pts`
}

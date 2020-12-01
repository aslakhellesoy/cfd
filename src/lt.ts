import * as d3 from 'd3'

import { TimeDatum } from './types'

export default function lt<Layer extends string>(
  timestamp: Date,
  from: Layer,
  keys: readonly Layer[],
  data: readonly TimeDatum<Layer>[]
): number | undefined {
  const stack = d3.stack<TimeDatum<Layer>>().keys(keys)
  const series = stack(data)

  const layer = series.find((l) => l.key === from)
  if (!layer) throw new Error(`Could not find ${from} in series: ${JSON.stringify(series)}`)

  const pointFrom = layer.find((point) => point.data.timestamp === timestamp)!
  const threshold = pointFrom[1]
  const pointTo = layer.find(
    (point) => point.data.timestamp.getTime() > pointFrom.data.timestamp.getTime() && point[0] >= threshold
  )
  if (!pointTo) return undefined
  const pointToLt = pointTo.data.timestamp.getTime() - pointFrom.data.timestamp.getTime()

  const previousPoint = layer[layer.indexOf(pointTo) - 1]
  const previousPointLt = previousPoint.data.timestamp.getTime() - pointFrom.data.timestamp.getTime()

  // TODO: Weighted
  return (pointToLt + previousPointLt) / 2
}

import lt from './lt'
import { TimeDatum } from './types'

export default function toLt<Layer extends string>(
  data: readonly TimeDatum<Layer>[],
  keys: readonly Layer[]
): readonly TimeDatum<Layer>[] {
  return data.map((datum) => {
    return Object.fromEntries(
      Object.entries<unknown>(datum).map(([key, value]) => [
        key,
        key === 'timestamp' ? value : lt(datum.timestamp, key, keys, data),
      ])
    ) as TimeDatum<Layer>
  })
}

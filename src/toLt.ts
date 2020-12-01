import lt from './lt'
import { TimeDatum } from './types'

export default function toLt<L extends string>(
  data: readonly TimeDatum<L>[],
  keys: readonly L[]
): readonly TimeDatum<L>[] {
  return data.map((datum) => {
    return Object.fromEntries(
      Object.entries<unknown>(datum).map(([key, value]) => [
        key,
        key === 'timestamp' ? value : lt(datum.timestamp, key, keys, data),
      ])
    ) as TimeDatum<L>
  })
}

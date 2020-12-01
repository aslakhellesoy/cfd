import lt from './lt'
import { TimeDatum } from './types'

/**
 * Calculates average lead times (LT) from WIP.
 *
 * @param data a list of data with WIP values
 * @param keys the order of the layers
 * @param linear
 * @param adjust a function to convert millis to another unit (useful for testing)
 * @return a list of data with LT
 */
export default function toLt<Layer extends string>(
  data: readonly TimeDatum<Layer>[],
  keys: readonly Layer[],
  linear: boolean,
  adjust: (millis: number) => number = (millis) => millis
): readonly TimeDatum<Layer>[] {
  return data.map((datum) => {
    return Object.fromEntries(
      Object.entries<unknown>(datum).map(([key, value]) => [
        key,
        key === 'timestamp' ? value : lt(datum.timestamp, key, keys, data, linear, adjust),
      ])
    ) as TimeDatum<Layer>
  })
}

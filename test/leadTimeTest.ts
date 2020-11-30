import assert from 'assert'
import * as d3 from 'd3'
import fs from 'fs'
import Papa from 'papaparse'

import TestDatum from './TestDatum'

function leadTime(timestamp: Date, from: string, data: TestDatum[]): number | undefined {
  const stack = d3.stack<TestDatum>().keys(['done', 'doing', 'todo'])
  const series = stack(data)

  const layer = series.find((l) => l.key === from)!

  const pointFrom = layer.find((point) => point.data.timestamp === timestamp)!
  const threshold = pointFrom[1]
  const pointTo = layer.find(
    (point) => point.data.timestamp.getTime() > pointFrom.data.timestamp.getTime() && point[0] >= threshold
  )
  if (!pointTo) return undefined
  return pointTo.data.timestamp.getTime() - pointFrom.data.timestamp.getTime()
}

describe('leadTime', () => {
  // each datum is thickness
  let data: TestDatum[]

  beforeEach((cb) => {
    const csv = fs.createReadStream(__dirname + '/test-cfd.csv', 'utf-8')
    Papa.parse<TestDatum>(csv, {
      header: true,
      dynamicTyping: true,
      transform(value: string | number, field: string) {
        return field === 'timestamp' ? new Date(value) : value
      },
      complete(results) {
        if (results.errors.length > 0) return cb(results.errors[0])
        data = results.data
        cb()
      },
    })
  })

  it('calculates all the lead times', () => {
    const lts = [
      {
        todo: 1,
        doing: 1,
      },
      {
        todo: 2,
        doing: 1,
      },
      {
        todo: undefined,
        doing: 1,
      },
      {
        todo: undefined,
        doing: 2,
      },
      {
        todo: undefined,
        doing: undefined,
      },
      {
        todo: undefined,
        doing: undefined,
      },
    ]

    const keys = ['todo', 'doing']
    for (let t = 0; t < data.length; t++) {
      for (const l of keys) {
        const timestamp = data[t].timestamp
        const lt = leadTime(timestamp, l, data)
        const d = lts[t][l]
        assert.strictEqual(
          lt,
          days(d),
          `Lead time ${t} / ${timestamp.toISOString()} @ ${l} expected to be ${d}, but was ${lt}`
        )
      }
    }
  })

  it('calculates lead time 1 for todo', () => {
    assert.strictEqual(leadTime(data[1].timestamp, 'todo', data), days(2))
  })

  it('calculates lead time 3 for doing', () => {
    assert.strictEqual(leadTime(data[3].timestamp, 'doing', data), days(2))
  })

  it('calculates lead time 4 for doing', () => {
    assert.strictEqual(leadTime(data[4].timestamp, 'doing', data), undefined)
  })
})

function days(d: number | undefined): number | undefined {
  if (d === undefined) return undefined
  return d * 24 * 60 * 60 * 1000
}

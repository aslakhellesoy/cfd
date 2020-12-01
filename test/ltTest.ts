import assert from 'assert'
import fs from 'fs'
import Papa from 'papaparse'

import leadTime from '../src/lt'
import { TimeDatum } from '../src/types'
import TestLayer from './TestLayer'

describe('leadTime', () => {
  // each datum is thickness
  let data: readonly TimeDatum<TestLayer>[]

  beforeEach((cb) => {
    const csv = fs.createReadStream(__dirname + '/test-cfd.csv', 'utf-8')
    Papa.parse<TimeDatum<TestLayer>>(csv, {
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

    const keys = [TestLayer.todo, TestLayer.doing]
    for (let t = 0; t < data.length; t++) {
      for (const l of keys) {
        const timestamp = data[t].timestamp
        const lt = leadTime(timestamp, l, keys, data)
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
    assert.strictEqual(leadTime(data[1].timestamp, TestLayer.todo, [TestLayer.todo, TestLayer.doing], data), days(2))
  })

  it('calculates lead time 3 for doing', () => {
    assert.strictEqual(leadTime(data[3].timestamp, TestLayer.doing, [TestLayer.todo, TestLayer.doing], data), days(2))
  })

  it('calculates lead time 4 for doing', () => {
    assert.strictEqual(leadTime(data[4].timestamp, TestLayer.doing, [TestLayer.todo, TestLayer.doing], data), undefined)
  })
})

function days(d: number | undefined): number | undefined {
  if (d === undefined) return undefined
  return d * 24 * 60 * 60 * 1000
}

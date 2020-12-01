import assert from 'assert'
import fs from 'fs'

import parseCsvData from '../src/parseCsvData'
import toLt from '../src/toLt'
import { TimeDatum } from '../src/types'
import TestLayer from './TestLayer'

describe('leadTime', () => {
  let data: readonly TimeDatum<TestLayer>[]

  beforeEach(async () => {
    data = await parseCsvData<TestLayer>(fs.createReadStream(__dirname + '/test-cfd.csv', 'utf-8'))
  })

  it('calculates discrete average lead times', () => {
    const ltData = toLt<TestLayer>(data, Object.keys(TestLayer).reverse() as TestLayer[], false, days)
    console.log(JSON.stringify(ltData, null, 2))
    assert.deepStrictEqual(ltData, [
      {
        timestamp: data[0].timestamp,
        todo: 1,
        done: 1,
        doing: 1,
      },
      {
        timestamp: data[1].timestamp,
        todo: 3,
        doing: 1,
        done: 1,
      },
      {
        timestamp: data[2].timestamp,
        todo: 3,
        doing: 2,
        done: 1,
      },
      {
        timestamp: data[3].timestamp,
        todo: 3,
        doing: 1,
        done: 1,
      },
      {
        timestamp: data[4].timestamp,
        todo: undefined,
        doing: undefined,
        done: undefined,
      },
      {
        timestamp: data[5].timestamp,
        todo: undefined,
        doing: undefined,
        done: undefined,
      },
      {
        timestamp: data[6].timestamp,
        todo: undefined,
        doing: undefined,
        done: undefined,
      },
    ])
  })

  it('calculates linear average lead times', () => {
    const ltData = toLt<TestLayer>(data, Object.keys(TestLayer).reverse() as TestLayer[], true)
    assert.deepStrictEqual(ltData, [
      {
        timestamp: data[0].timestamp,
        todo: 1,
        done: 1,
        doing: 1,
      },
      {
        timestamp: data[1].timestamp,
        todo: 3,
        doing: 1,
        done: 1,
      },
      {
        timestamp: data[2].timestamp,
        todo: 3,
        doing: 2,
        done: 1,
      },
      {
        timestamp: data[3].timestamp,
        todo: 3,
        doing: 1,
        done: 1,
      },
      {
        timestamp: data[4].timestamp,
        todo: undefined,
        doing: undefined,
        done: undefined,
      },
      {
        timestamp: data[5].timestamp,
        todo: undefined,
        doing: undefined,
        done: undefined,
      },
      {
        timestamp: data[6].timestamp,
        todo: undefined,
        doing: undefined,
        done: undefined,
      },
    ])
  })
})

function days(ms: number): number {
  return ms / (1000 * 60 * 60 * 24)
}

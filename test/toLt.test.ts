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

  it('calculates lead times for each datum', () => {
    const ltData = toLt<TestLayer>(data, Object.keys(TestLayer) as TestLayer[])
    assert.deepStrictEqual(ltData, [
      {
        timestamp: data[0].timestamp,
        todo: 86400000,
        done: 86400000,
        doing: 86400000,
      },
      {
        timestamp: data[1].timestamp,
        todo: undefined,
        doing: 86400000,
        done: 86400000,
      },
      {
        timestamp: data[2].timestamp,
        todo: undefined,
        doing: undefined,
        done: 172800000,
      },
      {
        timestamp: data[3].timestamp,
        todo: undefined,
        doing: undefined,
        done: 86400000,
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
    ])
  })
})

import fs from 'fs'

import parseCsvData from '../src/parseCsvData'
import toLt from '../src/toLt'
import { TimeDatum } from '../src/types'
import TestLayer from './TestLayer'

describe('toLt', () => {
  // each datum is thickness
  let data: readonly TimeDatum<TestLayer>[]

  beforeEach(async () => {
    data = await parseCsvData(fs.createReadStream(__dirname + '/test-cfd.csv', 'utf-8'))
  })

  it('calculates all the lead times', () => {
    const ltData = toLt(data, [TestLayer.todo, TestLayer.doing, TestLayer.done])
    console.log('%o', ltData)
  })
})

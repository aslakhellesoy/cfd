import '../css/styles.css'

import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

// @ts-ignore
import test from '../../test/test-cfd.csv'
import TestLayer from '../../test/TestLayer'
import Cfd from '../components/Cfd'
import { TimeDatum } from '../types'
// @ts-ignore
import ardalis from './ardalis-cfd.csv'
// @ts-ignore
import bekk from './bekk-cfd.csv'

export default {
  title: 'Cfd',
  component: Cfd,
} as Meta

function convert<Layer extends string>(data: Record<string, string | number>[]): ReadonlyArray<TimeDatum<Layer>> {
  return data.map((datum) => {
    return { ...datum, ...{ timestamp: new Date(datum.timestamp) } } as TimeDatum<Layer>
  })
}

// https://blogg.bekk.no/cumulative-flow-diagrams-with-google-spreadsheets-f3c001a431b0

enum BekkLayers {
  Backlog = 'Backlog',
  Specify = 'Specify',
  Develop = 'Develop',
  QA = 'QA',
  Approved = 'Approved',
  Deployed = 'Deployed',
}

export const Bekk = () => {
  return <Cfd data={convert<BekkLayers>(bekk)} keys={Object.keys(BekkLayers).reverse() as BekkLayers[]} />
}

// https://ardalis.com/excel-cumulative-flow-diagram/
enum ArdalisLayer {
  Ready = 'Ready',
  Dev = 'Dev',
  Test = 'Test',
  Deployed = 'Deployed',
}

export const Ardalis = () => {
  return <Cfd data={convert<ArdalisLayer>(ardalis)} keys={Object.keys(ArdalisLayer).reverse() as ArdalisLayer[]} />
}

export const Test = () => {
  return <Cfd data={convert<TestLayer>(test)} keys={Object.keys(TestLayer).reverse() as TestLayer[]} />
}

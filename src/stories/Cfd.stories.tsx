import '../css/styles.css'

import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

// @ts-ignore
import test from '../../test/test-cfd.csv'
import TestDatum from '../../test/TestDatum'
import Cfd, { TimeDatum } from '../components/Cfd'
import Cfd2 from '../components/Cfd2'
// @ts-ignore
import ardalis from './ardalis-cfd.csv'
// @ts-ignore
import bekk from './bekk-cfd.csv'

export default {
  title: 'Cfd',
  component: Cfd,
} as Meta

function convert<T extends TimeDatum>(data: Record<string, string | number>[]): ReadonlyArray<T> {
  return data.map((datum) => {
    return { ...datum, ...{ timestamp: new Date(datum.timestamp) } } as T
  })
}

// https://blogg.bekk.no/cumulative-flow-diagrams-with-google-spreadsheets-f3c001a431b0
type BekkDatum = TimeDatum & {
  Deployed: string
  Approved: number
  QA: number
  Develop: number
  Specify: number
  Backlog: number
}

export const Bekk = () => {
  return (
    <Cfd2
      data={convert<BekkDatum>(bekk)}
      properties={[
        {
          key: 'Backlog',
          label: 'Backlog',
        },
        {
          key: 'Specify',
          label: 'Specify',
        },
        {
          key: 'Develop',
          label: 'Develop',
        },
        {
          key: 'QA',
          label: 'QA',
        },
        {
          key: 'Approved',
          label: 'Approved',
        },
        {
          key: 'Deployed',
          label: 'Deployed',
        },
      ]}
    />
  )
}

// https://ardalis.com/excel-cumulative-flow-diagram/
type ArdalisDatum = TimeDatum & {
  Ready: number
  Dev: number
  Test: number
  Deployed: number
}

export const Ardalis = () => {
  return (
    <Cfd
      data={convert<ArdalisDatum>(ardalis)}
      properties={[
        {
          key: 'Ready',
          label: 'Ready',
        },
        {
          key: 'Dev',
          label: 'Dev',
        },
        {
          key: 'Test',
          label: 'Test',
        },
        {
          key: 'Deployed',
          label: 'Deployed',
        },
      ]}
    />
  )
}

export const Test = () => {
  return (
    <Cfd2
      data={convert<TestDatum>(test)}
      properties={[
        {
          key: 'todo',
          label: 'Todo',
        },
        {
          key: 'doing',
          label: 'Doing',
        },
        {
          key: 'done',
          label: 'Done',
        },
      ]}
    />
  )
}

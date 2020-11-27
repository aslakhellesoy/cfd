import '../css/styles.css'

import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Cfd, { TimeDatum } from '../components/Cfd'
// @ts-ignore
import ardalis from './ardalis-cfd.csv'
// @ts-ignore
import bekk from './bekk-cfd.csv'

export default {
  title: 'Cfd',
  component: Cfd,
} as Meta

// https://blogg.bekk.no/cumulative-flow-diagrams-with-google-spreadsheets-f3c001a431b0
type BekkDatum = TimeDatum & {
  Deployed: string
  Approved: string
  QA: string
  Develop: string
  Specify: string
  Backlog: string
}

export const Bekk = () => {
  return (
    <Cfd
      data={bekk as readonly BekkDatum[]}
      properties={[
        {
          key: 'Deployed',
          label: 'Deployed',
        },
        {
          key: 'Approved',
          label: 'Approved',
        },
        {
          key: 'QA',
          label: 'QA',
        },
        {
          key: 'Develop',
          label: 'Develop',
        },
        {
          key: 'Specify',
          label: 'Specify',
        },
        {
          key: 'Backlog',
          label: 'Backlog',
        },
      ]}
    />
  )
}

// https://ardalis.com/excel-cumulative-flow-diagram/
type ArdalisDatum = TimeDatum & {
  Ready: string
  Dev: string
  Test: string
  Deployed: string
}

export const Ardalis = () => {
  return (
    <Cfd
      data={ardalis as readonly ArdalisDatum[]}
      properties={[
        {
          key: 'Deployed',
          label: 'Deployed',
        },
        {
          key: 'Test',
          label: 'Test',
        },
        {
          key: 'Dev',
          label: 'Dev',
        },
        {
          key: 'Ready',
          label: 'Ready',
        },
      ]}
    />
  )
}

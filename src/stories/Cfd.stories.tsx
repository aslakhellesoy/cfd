import '../css/styles.css'

import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Cfd from '../components/Cfd'
// @ts-ignore
import cfdCsv from './cfd.csv'

type CfdDatum = {
  Date: string
  Ready: string
  Dev: string
  Test: string
  Deployed: string
}

const cfdData = cfdCsv as readonly CfdDatum[]

console.log(cfdCsv)

export default {
  title: 'Cfd',
  component: Cfd,
} as Meta

export const FromPoints = () => {
  return (
    <Cfd
      data={cfdData}
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

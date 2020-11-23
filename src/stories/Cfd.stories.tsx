import '../css/styles.css'

import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Cfd from '../components/Cfd'

export default {
  title: 'Cfd',
  component: Cfd,
} as Meta

export const Simple = () => {
  const data = [
    { timestamp: 0, todo: 10 },
    { timestamp: 1, todo: 15 },
    { timestamp: 2, todo: 35 },
    { timestamp: 3, todo: 20 },
  ]
  return <Cfd data={data} />
}

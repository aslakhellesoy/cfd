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
    { x: 0, y: 10 },
    { x: 1, y: 15 },
    { x: 2, y: 35 },
    { x: 3, y: 20 },
  ]
  return <Cfd data={data} />
}

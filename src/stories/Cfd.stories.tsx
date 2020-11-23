import '../css/styles.css'

import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Cfd from '../components/Cfd'

export default {
  title: 'Cfd',
  component: Cfd,
} as Meta

export const Simple = () => {
  return <Cfd data={[10, 20, 40]} />
}

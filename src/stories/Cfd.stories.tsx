import '../css/styles.css'

import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Cfd from '../components/Cfd'

export default {
  title: 'Cfd',
  component: Cfd,
} as Meta

export const FromPoints = () => {
  const points = [
    {
      timestamp: 2000,
      todo: 50,
      doing: 300,
      done: 10,
    },
    {
      timestamp: 2001,
      todo: 150,
      doing: 50,
      done: 15,
    },
    {
      timestamp: 2002,
      todo: 200,
      doing: 100,
      done: 30,
    },
    {
      timestamp: 2003,
      todo: 130,
      doing: 50,
      done: 35,
    },
    {
      timestamp: 2004,
      todo: 240,
      doing: 80,
      done: 50,
    },
    {
      timestamp: 2005,
      todo: 380,
      doing: 10,
      done: 50,
    },
    {
      timestamp: 2006,
      todo: 420,
      doing: 200,
      done: 100,
    },
    {
      timestamp: 2007,
      todo: 120,
      doing: 100,
      done: 200,
    },
  ]
  return <Cfd points={points} />
}

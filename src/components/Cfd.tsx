import * as d3 from 'd3'
import React, { PropsWithChildren, useEffect, useRef } from 'react'

export type TimeDatum = {
  timestamp: Date
}

interface Props<Datum extends TimeDatum> {
  data: readonly Datum[]
  properties: readonly {
    key: keyof Datum
    label: string
  }[]
}

interface StackDatum {
  timestamp: Date
  values: number[]
}

const color = ['#585a4d', '#707266', '#888980', '#9fa199', '#b7b8b2', '#cfd0cc']
const strokeWidth = 1.5

const bisectDate = d3.bisector((d: StackDatum) => d.timestamp).left

const Cfd = <Datum extends TimeDatum>(props: PropsWithChildren<Props<Datum>>) => {
  const { data, properties } = props

  const d3Container = useRef(null)

  useEffect(() => {
    if (d3Container.current) {
      const keys = properties.map((p) => p.key.toString()).reverse()
      const stack = d3.stack<Datum>().keys(keys)
      const stackedValues = stack(data)

      // Can we do without stackedData? These examples seem to be using stackedValues directly:
      // https://observablehq.com/@d3/stacked-area-chart?collection=@d3/d3-shape
      // We should make a new implementation that uses that.
      // And absolutely read this! https://github.com/d3/d3-shape/blob/master/README.md#stacks
      // Also simple: https://stackoverflow.com/questions/54426531/d3-stack-area-problem-using-typescript-in-angular

      const stackedData: StackDatum[][] = []
      stackedValues.forEach((layer) => {
        const currentStack: StackDatum[] = []
        layer.forEach((d, i) => {
          currentStack.push({
            timestamp: new Date(data[i].timestamp),
            values: d,
          })
        })
        stackedData.push(currentStack)
      })

      const margin = { top: 20, right: 50, bottom: 30, left: 50 }
      const svg = d3.select(d3Container.current)
      // .attr('width', width + margin.left + margin.right)
      // .attr('height', height + margin.top + margin.bottom)

      const width = +svg.attr('width') - margin.left - margin.right
      const height = +svg.attr('height') - margin.top - margin.bottom
      // Sometimes called g in bl.ocks.org examples
      const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`).attr('class', 'chart')

      const xDomain = d3.extent(stackedData[stackedData.length - 1].map((sd) => sd.timestamp)) as [Date, Date]
      const xScale = d3.scaleTime().domain(xDomain).range([0, width])
      const xAxis = d3.axisBottom(xScale)

      const yMax = d3.max(stackedValues[stackedValues.length - 1], (dp) => dp[1])!
      const yDomain = [0, yMax]
      const yScale = d3.scaleLinear().domain(yDomain).range([height, 0])
      const yAxis = d3.axisLeft(yScale)

      const area = d3
        .area<StackDatum>()
        .x((d) => xScale(d.timestamp))
        .y0((d) => yScale(d.values[0]))
        .y1((d) => yScale(d.values[1]))

      chart
        .append('g')
        .attr('transform', `translate(-${margin.left - strokeWidth},0)`)
        .attr('class', 'grp')
        .selectAll('.series')
        .data(stackedData)
        .enter()
        .append('g')
        .attr('class', 'series')
        .append('path')
        .attr('transform', `translate(${margin.left},0)`)
        .style('fill', (d, i) => color[i])
        .attr('stroke', '#111401')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', strokeWidth)
        .attr('d', area)

      // Add the X Axis
      chart
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis.ticks(data.length))

      // Add the Y Axis
      chart.append('g').attr('class', 'y axis').attr('transform', `translate(0, 0)`).call(yAxis)

      /////// Hover lines
      const hoverContainer = chart.append('g').style('display', 'none')
      const circles = stackedData.map(() => hoverContainer.append('circle').attr('r', 4))

      // Create a new element for the line - initially invisible
      const focus = hoverContainer.append('g').attr('class', 'focus')

      // The height of the line is the full chart. Defined with ({x1=0,y1}, {x2,y2})
      focus.append('line').attr('class', 'hover-line').attr('y1', 0).attr('y2', height)
      focus.append('line').attr('class', 'hover-line').attr('x1', width).attr('x2', width)
      // focus.append('text').attr('x', 15).attr('dy', '.31em')

      chart
        .append('rect')
        // .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', () => hoverContainer.style('display', null))
        .on('mouseout', () => hoverContainer.style('display', 'none'))
        .on('mousemove', (evt) => {
          const pointer = d3.pointer(evt)

          // Find the closest datum along the x axis and calculate the translate x value
          const data0 = stackedData[0]
          const x0 = xScale.invert(pointer[0])
          const i = bisectDate(data0, x0, 1)
          const n =
            x0.getTime() - data0[i - 1].timestamp.getTime() > data0[i].timestamp.getTime() - x0.getTime() ? i : i - 1
          const d = data0[n]
          const translateX = xScale(d.timestamp)

          for (let di = 0; di < stackedData.length; di++) {
            const data = stackedData[di][n]
            // Move the circle
            const circleTranslateY = yScale(data.values[1])
            const circle = circles[di]
            circle.attr('transform', `translate(${translateX},${circleTranslateY})`)
          }

          focus.attr('transform', `translate(${translateX},0)`)

          // Set the text
          // focus.select('text').text(() => d.values[1])
        })
    }
  }, [data, properties])

  return <svg width={800} height={400} ref={d3Container} />
}

export default Cfd

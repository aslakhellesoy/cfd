import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'

/*
D3 / React
https://www.mattlayman.com/blog/2015/d3js-area-chart/
https://bl.ocks.org/d3noob/119a138ef9bd1d8f0a8d57ea72355252
https://medium.com/@louisemoxy/how-to-create-a-stacked-area-chart-with-d3-28a2fee0b8ca

Hover lines / tooltip
https://bl.ocks.org/alandunning/cfb7dcd7951826b9eacd54f0647f48d3
https://medium.com/@louisemoxy/create-an-accurate-tooltip-for-a-d3-area-chart-bf59783f8a2d

Responsiveness
https://medium.com/@louisemoxy/create-an-accurate-tooltip-for-a-d3-area-chart-bf59783f8a2d

CFD
https://getnave.com/blog/how-to-read-the-cumulative-flow-diagram-infographic/
*/

interface Props {
  points: readonly Point[]
}

interface Point {
  timestamp: number
  todo: number
  doing: number
  done: number
}

interface StackDatum {
  timestamp: number
  values: number[]
}

const color = ['lightgreen', 'lightblue', 'pink']
const strokeWidth = 1.5

const bisectDate = d3.bisector((d: StackDatum) => d.timestamp).left

const Cfd: React.FunctionComponent<Props> = ({ points }) => {
  const d3Container = useRef(null)

  useEffect(() => {
    if (d3Container.current) {
      const keys = ['todo', 'doing', 'done']
      const stack = d3.stack<Point>().keys(keys)
      const stackedValues = stack(points)

      const stackedData: StackDatum[][] = []
      stackedValues.forEach((layer) => {
        const currentStack: StackDatum[] = []
        layer.forEach((d, i) => {
          currentStack.push({
            timestamp: points[i].timestamp,
            values: d,
          })
        })
        stackedData.push(currentStack)
      })

      const margin = { top: 20, right: 20, bottom: 30, left: 50 }
      const svg = d3.select(d3Container.current)
      // .attr('width', width + margin.left + margin.right)
      // .attr('height', height + margin.top + margin.bottom)

      const width = +svg.attr('width') - margin.left - margin.right
      const height = +svg.attr('height') - margin.top - margin.bottom
      // const width = 575 - margin.left - margin.right
      // const height = 350 - margin.top - margin.bottom

      // Sometimes called g in bl.ocks.org examples
      const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`).attr('class', 'chart')
      const grp = chart
        .append('g')
        .attr('transform', `translate(-${margin.left - strokeWidth},0)`)
        .attr('class', 'grp')

      const xDomain = d3.extent(stackedData[stackedData.length - 1].map((sd) => sd.timestamp)) as [number, number]
      const xScale = d3.scaleLinear().domain(xDomain).range([0, width])
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

      const series = grp.selectAll('.series').data(stackedData).enter().append('g').attr('class', 'series')

      // TODO: Use CSS (we can even have multiple styles using https://github.com/theBstar/react-switch-theme or similar)
      series
        .append('path')
        .attr('transform', `translate(${margin.left},0)`)
        .style('fill', (d, i) => color[i])
        .attr('stroke', 'steelblue')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', strokeWidth)
        .attr('d', (d) => area(d))
        .on('mousemove', (a, b) => {
          // console.log('DATUM', b)
        })

      // Add the X Axis
      chart
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis.ticks(points.length))

      // Add the Y Axis
      chart.append('g').attr('class', 'y axis').attr('transform', `translate(0, 0)`).call(yAxis)

      // Focus lines
      const focus = chart.append('g').attr('class', 'focus').style('display', 'none')

      focus.append('line').attr('class', 'x-hover-line hover-line').attr('y1', 0).attr('y2', height)
      focus.append('line').attr('class', 'y-hover-line hover-line').attr('x1', width).attr('x2', width)

      focus.append('circle').attr('r', 7.5)

      focus.append('text').attr('x', 15).attr('dy', '.31em')

      svg
        .append('rect')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', () => focus.style('display', null))
        .on('mouseout', () => focus.style('display', 'none'))
        .on('mousemove', (evt) => {
          const data = stackedData[stackedData.length - 1]
          const pointer = d3.pointer(evt)

          const x0 = xScale.invert(pointer[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0
          const translateX = xScale(d.timestamp)
          const translateY = yScale(d.values[0])
          focus.attr('transform', `translate(${translateX},${translateY})`)
          focus.select('text').text(() => d.values[1])
          focus.select('.x-hover-line').attr('y2', height - translateY)
          focus.select('.y-hover-line').attr('x2', width + width)
        })
      //
      // focus.append('line').attr('class', 'y-hover-line hover-line').attr('x1', width).attr('x2', width)
      //
      // focus.append('circle').attr('r', 7.5)
      //
      // focus.append('text').attr('x', 15).attr('dy', '.31em')
      //
      // svg
      //   .append('rect')
      //   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      //   .attr('class', 'overlay')
      //   .attr('width', width)
      //   .attr('height', height)
      //   .on('mouseover', function () {
      //     focus.style('display', null)
      //   })
      //   .on('mouseout', function () {
      //     focus.style('display', 'none')
      //   })
      // .on('mousemove', mousemove)
    }
  }, [points])

  return <svg width={800} height={400} ref={d3Container} />
}

export default Cfd

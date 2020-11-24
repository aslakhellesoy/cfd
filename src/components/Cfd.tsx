import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'

/*
D3 / React
https://www.mattlayman.com/blog/2015/d3js-area-chart/
https://bl.ocks.org/d3noob/119a138ef9bd1d8f0a8d57ea72355252
https://medium.com/@louisemoxy/how-to-create-a-stacked-area-chart-with-d3-28a2fee0b8ca

Hover behaviour / tooltip
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

const Cfd: React.FunctionComponent<Props> = ({ points }) => {
  const d3Container = useRef(null)

  useEffect(() => {
    if (points && d3Container.current) {
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
      const width = 575 - margin.left - margin.right
      const height = 350 - margin.top - margin.bottom

      const yMax = d3.max(stackedValues[stackedValues.length - 1], (dp) => dp[1])!
      console.log({ yMax })
      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(points, (point) => point.timestamp) as [number, number])
        .range([0, width])
      const yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0])
      const xAxis = d3.axisBottom(xScale)
      const yAxis = d3.axisLeft(yScale)

      const area = d3
        .area<StackDatum>()
        .x((d) => xScale(d.timestamp))
        .y0((d) => yScale(d.values[0]))
        .y1((d) => yScale(d.values[1]))

      const svg = d3
        .select(d3Container.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
      const grp = chart.append('g').attr('transform', `translate(-${margin.left - strokeWidth},-${margin.top})`)
      const series = grp.selectAll('.series').data(stackedData).enter().append('g').attr('class', 'series')

      series
        .append('path')
        .attr('transform', `translate(${margin.left},0)`)
        .style('fill', (d, i) => color[i])
        .attr('stroke', 'steelblue')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', strokeWidth)
        .attr('d', (d) => area(d))

      // Add the X Axis
      chart
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis.ticks(points.length))

      // Add the Y Axis
      chart.append('g').attr('class', 'y axis').attr('transform', `translate(0, 0)`).call(yAxis)
    }
  }, [points])

  return <svg width={400} height={200} ref={d3Container} />
}

export default Cfd

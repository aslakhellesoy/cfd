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

// interface StackDatum {
//   timestamp: Date
//   data: number[]
// }
const bisectDate = d3.bisector((d: TimeDatum) => d.timestamp).left

// const color = ['#585a4d', '#707266', '#888980', '#9fa199', '#b7b8b2', '#cfd0cc']
const margin = { top: 20, right: 30, bottom: 30, left: 40 }

const Cfd2 = <Datum extends TimeDatum>(props: PropsWithChildren<Props<Datum>>) => {
  const { data, properties } = props

  const d3Container = useRef(null)

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3.select(d3Container.current)

      const width = +svg.attr('width') - margin.left - margin.right
      const height = +svg.attr('height') - margin.top - margin.bottom

      const color = d3
        .scaleOrdinal()
        .domain(properties.map((p) => p.label))
        // https://github.com/d3/d3-scale-chromatic
        .range(d3.schemeGreens[9])

      const keys = properties.map((p) => p.key.toString()).reverse()
      const series = d3.stack<Datum>().keys(keys)(data)

      console.log('series: %o', series)

      const xScale = d3
        .scaleUtc()
        .domain(d3.extent(data, (d) => d.timestamp) as [Date, Date])
        .range([margin.left, width - margin.right])

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1])) as number])
        .nice()
        .range([height - margin.bottom, margin.top])

      const area = d3
        .area()
        // @ts-ignore
        .x((d) => xScale(d.data.timestamp))
        .y0((d) => yScale(d[0]))
        .y1((d) => {
          return yScale(d[1])
        })

      const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        g.attr('transform', `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(xScale)
            .ticks(width / 80)
            .tickSizeOuter(0)
        )

      const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        g.attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yScale))

      svg
        .append('g')
        .selectAll('path')
        .data(series)
        .join('path')
        // .style('fill', (d, i) => color[i])
        .attr('fill', ({ key }) => color(key) as string)
        .attr('stroke', '#111401')
        // @ts-ignore
        .attr('d', area)
        .append('title')
        .text(({ key }) => key)

      svg.append('g').call(xAxis)
      svg.append('g').call(yAxis)

      /////// Hover lines
      const hoverContainer = svg.append('g').style('display', 'none')
      const circles = series.map(() => hoverContainer.append('circle').attr('r', 4))

      // Create a new element for the line - initially invisible
      const focus = hoverContainer.append('g').attr('class', 'focus')

      // The height of the line is the full chart. Defined with ({x1=0,y1}, {x2,y2})
      focus.append('line').attr('class', 'hover-line').attr('y1', 0).attr('y2', height)
      focus.append('line').attr('class', 'hover-line').attr('x1', width).attr('x2', width)
      // focus.append('text').attr('x', 15).attr('dy', '.31em')

      svg
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
          const x0 = xScale.invert(pointer[0])
          const i = bisectDate(data, x0, 1)
          const datumLeft = data[i - 1]
          const datumRight = data[i]
          const n =
            x0.getTime() - datumLeft.timestamp.getTime() > datumRight.timestamp.getTime() - x0.getTime() ? i : i - 1
          const dx = data[n]
          const translateX = xScale(dx.timestamp)

          for (let di = 0; di < series.length; di++) {
            const data = series[di][n]
            // Move the circle
            const circleTranslateY = yScale(data[1])
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

export default Cfd2

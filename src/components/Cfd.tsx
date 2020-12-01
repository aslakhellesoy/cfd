import * as d3 from 'd3'
import React, { PropsWithChildren, useEffect, useRef } from 'react'

import toLt from '../toLt'
import { BaseTimeDatum, TimeDatum } from '../types'

interface Props<Layer extends string> {
  data: readonly TimeDatum<Layer>[]
  keys: readonly Layer[]
}

const bisectDate = d3.bisector((d: BaseTimeDatum) => d.timestamp).left

// const color = ['#585a4d', '#707266', '#888980', '#9fa199', '#b7b8b2', '#cfd0cc']
const margin = { top: 20, right: 30, bottom: 30, left: 40 }

const Cfd = <Layer extends string>(props: PropsWithChildren<Props<Layer>>) => {
  const { data, keys } = props
  const ltData = toLt(data, keys)

  const d3Container = useRef(null)

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3.select(d3Container.current)

      const width = +svg.attr('width') - margin.left - margin.right
      const height = +svg.attr('height') - margin.top - margin.bottom

      const color = d3
        .scaleOrdinal()
        .domain(keys)
        // https://github.com/d3/d3-scale-chromatic
        .range(d3.schemeGreens[9])

      const stackGen = d3.stack<TimeDatum<Layer>>().keys(keys)
      const series = stackGen(data)

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
        .y1((d) => yScale(d[1]))

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
      const datumCircles = series.map(() => hoverContainer.append('circle').attr('r', 4))
      const ltCircles = series.map(() => hoverContainer.append('circle').attr('r', 4))

      // Create a new element for the line - initially invisible
      const focus = hoverContainer.append('g').attr('class', 'focus')

      // The height of the line is the full chart. Defined with ({x1=0,y1}, {x2,y2})
      focus.append('line').attr('class', 'hover-line').attr('y1', 0).attr('y2', height)
      // focus.append('line').attr('class', 'hover-line').attr('x1', width).attr('x2', width)
      // focus.append('text').attr('x', 15).attr('dy', '.31em')

      svg
        .append('rect')
        // .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', () => hoverContainer.style('display', null))
        .on('mouseout', () => hoverContainer.style('display', 'none'))
        .on(
          'mousemove',
          (evt) => {
            const pointer = d3.pointer(evt)
            // Use the mouse's x-position to find the nearest data index
            const x0 = xScale.invert(pointer[0])
            const index = bisectDate(data, x0, 1)
            const datumLeft = data[index - 1]
            const datumRight = data[index]
            if (datumLeft === undefined || datumRight === undefined) return

            const nearestIndex =
              x0.getTime() - datumLeft.timestamp.getTime() > datumRight.timestamp.getTime() - x0.getTime()
                ? index
                : index - 1

            // Move (transform) lines and circles
            const ltDatum = ltData[nearestIndex]

            const datumTimestamp = data[nearestIndex].timestamp
            const datumX = xScale(datumTimestamp)
            for (let di = 0; di < series.length; di++) {
              const seriesDi = series[di]
              const stackDatum = seriesDi[nearestIndex]

              // The y coordinate is the top (y1) of the stack datum
              const datumY = yScale(stackDatum[1])

              // Move the datum circle
              const datumCircle = datumCircles[di]
              datumCircle.attr('transform', `translate(${datumX},${datumY})`)

              const lt = ltDatum[seriesDi.key]
              const ltCircle = ltCircles[di]
              if (lt !== undefined) {
                // Move (and show) the lt circle
                ltCircle.style('display', null)
                const ltTimestamp = new Date(datumTimestamp.getTime() + lt)
                const ltX = xScale(ltTimestamp)

                ltCircle.attr('transform', `translate(${ltX},${datumY})`)
              } else {
                // Hide the lt circle
                ltCircle.style('display', 'none')
              }
            }
            focus.attr('transform', `translate(${datumX},0)`)

            // Set the text
            // focus.select('text').text(() => d.values[1])
          },
          'mousemove'
        )
    }
  }, [data, keys, ltData])

  return <svg width={1200} height={600} ref={d3Container} />
}

export default Cfd

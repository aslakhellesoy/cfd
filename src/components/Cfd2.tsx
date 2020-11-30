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

      const x = d3
        .scaleUtc()
        .domain(d3.extent(data, (d) => d.timestamp) as [Date, Date])
        .range([margin.left, width - margin.right])

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1])) as number])
        .nice()
        .range([height - margin.bottom, margin.top])

      const area = d3
        .area()
        // @ts-ignore
        .x((d) => x(d.data.timestamp))
        .y0((d) => y(d[0]))
        .y1((d) => {
          return y(d[1])
        })

      const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        g.attr('transform', `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        )

      const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        g.attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y))

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
    }
  }, [data, properties])

  return <svg width={800} height={400} ref={d3Container} />
}

export default Cfd2

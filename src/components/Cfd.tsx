import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'

interface Props {
  data: readonly Point[]
}

interface Point {
  x: number
  y: number
}

const Cfd: React.FunctionComponent<Props> = ({ data }) => {
  const d3Container = useRef(null)

  useEffect(() => {
    if (data && d3Container.current) {
      const margin = { top: 20, right: 20, bottom: 30, left: 50 }
      const width = 575 - margin.left - margin.right
      const height = 350 - margin.top - margin.bottom

      const xMax = d3.max(data, function (d) {
        return d.x
      })!

      const yMax = d3.max(data, function (d) {
        return d.y
      })!

      const x = d3.scaleLinear().domain([0, xMax]).range([0, width])
      const y = d3.scaleLinear().domain([0, yMax]).range([height, 0])
      const xAxis = d3.axisBottom(x)
      const yAxis = d3.axisLeft(y)

      const area = d3
        .area<Point>()
        .x(function (d) {
          return x(d.x)
        })
        .y0(height)
        .y1(function (d) {
          return y(d.y)
        })

      const svg = d3
        .select(d3Container.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      svg.append('path').datum(data).attr('class', 'area').attr('d', area)

      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      svg.append('g').attr('class', 'y axis').call(yAxis)
    }
  }, [data])

  return <svg width={400} height={200} ref={d3Container} />
}

export default Cfd

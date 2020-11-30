# Cfd

This is an interactive React component for [Cumulative Flow Diagrams](https://en.wikipedia.org/wiki/Cumulative_flow_diagram)
built with [d3](https://d3js.org/).

## Introduction

Most people have no idea of where their process has bottlenecks. Or how long it takes to deliver something.
(ref Reinertsen).

This project gives you this insight, as interactive charts. You provide the raw data, extracted from Trello, JIRA, GitHub,
ClubHouse or any other process management tool.

In return you get advanced insights into your process.

### How to connect your data

- Built-in
  - GitHub issues
  - Cucumber
  - JIRA
  - Trello
- Plugins
  - REST API
    - Post your events
    - Post your data

## Data model

The data model is a series of

## FAQ

### Is this like Amplitude or MixPanel?

No, this is not a tool to analyze user behaviour. This is a tool to analyze the efficiency of your process.

## Try it out

    npm install
    npm run storybook

## Inspiration

### D3 Stacked Charts

- https://observablehq.com/@d3/stacked-area-chart-via-d3-group?collection=@d3/d3-shape
- https://www.mattlayman.com/blog/2015/d3js-area-chart/
- https://bl.ocks.org/d3noob/119a138ef9bd1d8f0a8d57ea72355252
- https://medium.com/@louisemoxy/how-to-create-a-stacked-area-chart-with-d3-28a2fee0b8ca

### Hover lines / tooltip

- https://bl.ocks.org/alandunning/cfb7dcd7951826b9eacd54f0647f48d3
- https://medium.com/@louisemoxy/create-an-accurate-tooltip-for-a-d3-area-chart-bf59783f8a2d

### Responsiveness

- https://medium.com/@louisemoxy/create-an-accurate-tooltip-for-a-d3-area-chart-bf59783f8a2d

### CFD

- https://getnave.com/blog/how-to-read-the-cumulative-flow-diagram-infographic/

### TypeScript generic component

- https://wanago.io/2020/03/09/functional-react-components-with-generic-props-in-typescript/

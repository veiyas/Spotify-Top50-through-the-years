import { extent, scaleLinear, scalePoint, select, axisLeft } from 'd3';

export default class ParallelCoord {
  /** propsToUse is a Set */
  constructor(data, divId, propsToUse) {
    this.data = data;
    this.div = document.getElementById(divId);
    this.propsToUse = propsToUse;

    // Calculate width, height, etc.
    const containerWidth = this.div.clientWidth;
    this.margin = { top: 40, right: 10, bottom: 10, left: 30 };
    this.width = containerWidth - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    // TODO Something is a bit off with the margins somewhere -- fix it!

    // Put plot svg to this.div
    this.div.innerHTML = '';
    this.svg = select(this.div)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // Create a group in svg for the actual plot space
    this.plot = this.svg
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.draw();
  }

  draw() {
    // The name of the dimensions(/axes) to use for plotting
    const dimensions = Object.keys(this.data[0]).filter((key) =>
      this.propsToUse.has(key)
    );

    const yScales = {};
    for (const dim of dimensions) {
      yScales[dim] = scaleLinear()
        .domain(extent(this.data, (d) => +d[dim]))
        .range([this.height, 0]);
    }

    const xScale = scalePoint()
      .range([0, this.width])
      .padding(1)
      .domain(dimensions);

    // TODO Draw lines

    // Draw axes
    this.plot
      .selectAll('.dimension')
      .data(dimensions)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${xScale(d)})`)
      .each(function (d) {
        select(this).call(axisLeft(yScales[d]));
      })
      // Axis label
      .append('text')
      .style('text-anchor', 'middle')
      .attr('y', -9)
      .text((d) => d)
      .style('fill', 'black'); // Maybe use a class instead
  }

  setData(newData) {
    this.data = newData;
    // TODO Do i need to force an update maybe
  }
}

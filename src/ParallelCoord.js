import { extent, scaleLinear, scalePoint, select, axisLeft, line } from 'd3';

/* Some links that might be useful
     - https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.258.5174&rep=rep1&type=pdf
       combinations...
     - https://core.ac.uk/download/pdf/192069397.pdf -- Mostly 3d pc
*/
export default class ParallelCoord {
  /** propsToUse is a Set */
  constructor(data, divId, propsToUse) {
    this.data = data;
    this.div = document.getElementById(divId);
    this.propsToUse = propsToUse;

    // Calculate width, height, etc.
    const containerWidth = this.div.clientWidth;
    const containerHeight = this.div.clientHeight;
    this.margin = { top: 40, right: 10, bottom: 10, left: 20 };
    this.width = containerWidth - this.margin.left - this.margin.right;
    this.height = containerHeight - this.margin.top - this.margin.bottom;
    // TODO Something is a bit off with the margins somewhere -- fix it!

    // Put plot svg to this.div
    this.div.innerHTML = '';
    this.svg = select(this.div)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    // Create a group in svg for the actual plot space
    this.plot = this.svg
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.draw();
  }

  draw() {
    // Inspired by https://www.d3-graph-gallery.com/graph/parallel_basic.html

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
      .padding(0.2)
      .domain(dimensions);

    const pathGen = (d) =>
      line()(dimensions.map((p) => [xScale(p), yScales[p](d[p])]));

    // Draw lines
    this.plot
      .selectAll('.line')
      .data(this.data)
      .enter()
      .append('path')
      .attr('d', pathGen)
      .attr('class', 'line');

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
      .attr('class', 'axis-label');
  }

  setData(newData) {
    this.data = newData;
    // TODO Do i need to force an update maybe
  }
}

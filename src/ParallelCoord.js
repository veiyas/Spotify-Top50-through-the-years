import { extent, scaleLinear, scalePoint, select, axisLeft, line } from 'd3';

/* Some links that might be useful
     - https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.258.5174&rep=rep1&type=pdf
       combinations...
     - https://core.ac.uk/download/pdf/192069397.pdf -- Mostly 3d pc
     - https://www.napier.ac.uk/~/media/worktribe/output-267438/using-curves-to-enhance-parallel-coordinate-visualisations.pdf
*/
export default class ParallelCoord {
  /** `propsToUse` is a Set */
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

    // Initialize axes
    // TODO

    this.draw();
  }

  draw() {
    // Inspired by https://www.d3-graph-gallery.com/graph/parallel_basic.html

    // The name of the dimensions(/axes) to use for plotting
    this.dimensions = Object.keys(this.data[0]).filter((key) =>
      this.propsToUse.has(key)
    );

    this.yScales = {};
    for (const dim of this.dimensions) {
      this.yScales[dim] = scaleLinear()
        .domain(extent(this.data, (d) => +d[dim]))
        .range([this.height, 0])
        .nice();
    }

    this.xScale = scalePoint()
      .range([0, this.width])
      .padding(0.2)
      .domain(this.dimensions);

    if (!this.axes) {
      this.axes = new Map(
        this.dimensions.map((d) => [d, axisLeft(this.yScales[d]).ticks(2)])
      );
    }

    this.drawLines();
    this.drawAxes();
  }

  /** Must be called *after* scales and `this.axes` are initialized */
  drawAxes() {
    // TODO Fix updates for axes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    this.plot
      .selectAll('.dimension')
      .data(this.dimensions)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${this.xScale(d)})`)
      .each((d, i, nodes) => {
        // Reduce the number of ticks on the scale to reduce clutter
        select(nodes[i]).transition().duration(2000).call(this.axes.get(d));
      })
      // Axis label
      .append('text')
      .style('text-anchor', 'middle')
      .attr('y', -9)
      .text((d) => d)
      .attr('class', 'axis-label');
  }

  /** Must be called *after* scales are initialized */
  drawLines() {
    const pathGen = (d) =>
      line()(
        this.dimensions.map((p) => [this.xScale(p), this.yScales[p](d[p])])
      );

    const lines = this.plot.selectAll('.line').data(this.data);
    lines.exit().remove();
    lines
      .enter()
      .append('path')
      .merge(lines)
      .transition()
      .attr('d', pathGen)
      .attr('class', 'line');
  }

  setData(newData) {
    this.data = newData;
    // // TODO While this way kinda works, its probably not "correct"
    // this.plot.selectAll('*').remove();
    this.draw();
  }
}

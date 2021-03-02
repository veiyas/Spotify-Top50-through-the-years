import {
  extent,
  scaleLinear,
  scalePoint,
  select,
  axisLeft,
  line,
  brushY,
  drag,
} from 'd3';
import RadarPlot from './RadarPlot';

/* Some links that might be useful
     - https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.258.5174&rep=rep1&type=pdf
       combinations...
     - https://core.ac.uk/download/pdf/192069397.pdf -- Mostly 3d pc
     - https://www.napier.ac.uk/~/media/worktribe/output-267438/using-curves-to-enhance-parallel-coordinate-visualisations.pdf
*/

/** Width of the brush selections */
const BRUSH_WIDTH = 35;

/** Name of dimensions with values up to 100 */
const HUNDRED_RANGE = new Set([
  'nrgy',
  'pop',
  'spch',
  'acous',
  'val',
  'live',
  'dnce',
]);

// Inspired by https://www.d3-graph-gallery.com/graph/parallel_basic.html
export default class ParallelCoord {
  /** `propsToUse` is a Set */
  constructor(data, divId, propsToUse) {
    this.data = data;
    this.div = document.getElementById(divId);
    this.propsToUse = propsToUse;

    this.radarPlot = new RadarPlot();
    this.radarPlotExists = false;

    // Calculate width, height, etc.
    const containerWidth = this.div.clientWidth;
    const containerHeight = this.div.clientHeight;
    this.margin = { top: 40, right: 10, bottom: 10, left: 20 };
    /** Width excluding margins */
    this.width = containerWidth - this.margin.left - this.margin.right;
    /** Height excluding margins */
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

    // Group on top of this.plot to make the axes and brushes on top at all times
    this.plotAxesGroup = this.svg
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.tooltip = select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // The name of the dimensions(/axes) to use for plotting
    this.dimensions = Object.keys(this.data[0]).filter((key) =>
      this.propsToUse.has(key)
    );

    this.yScales = {};
    for (const dim of this.dimensions) {
      this.yScales[dim] = scaleLinear()
        .domain(
          // Show full [0,100] for applicable parameters
          HUNDRED_RANGE.has(dim) ? [0, 100] : extent(this.data, (d) => +d[dim])
        )
        .range([this.height, 0])
        .nice();
    }

    this.xScale = scalePoint()
      .range([0, this.width])
      .padding(0.2)
      .domain(this.dimensions);

    this.axes = new Map(
      // Reduce the number of ticks on the scale to reduce clutter
      this.dimensions.map((d) => [d, axisLeft(this.yScales[d]).ticks(2)])
    );

    this.pathGen = (d) =>
      line()(
        this.dimensions.map((p) => [this.xPosition(p), this.yScales[p](d[p])])
      );

    // Brush
    const selections = new Map();
    this.brush = brushY()
      .extent([
        [-(BRUSH_WIDTH / 2), 0],
        [BRUSH_WIDTH / 2, this.height],
      ])
      // .on('start', (event) => {
      //   event.sourceEvent.preventDefault();
      // })
      .on('start brush end', ({ selection, sourceEvent }, key) => {
        // Inspired by https://observablehq.com/@d3/brushable-parallel-coordinates?collection=@d3/d3-brush
        // TODO Understand and make it work hehe
        if (selection === null) selections.delete(key);
        else selections.set(key, selection.map(this.yScales[key].invert));
        // ...
        const selected = [];
        // ...
        this.allLinesSelection.each(function (d) {
          const lineIsActive = Array.from(selections).every(
            ([key, [max, min]]) => d[key] >= min && d[key] <= max
          );
          select(this).style('stroke', lineIsActive ? 'red' : 'blue');
          // select(this).style('opacity', lineIsActive ? 1 : 0.1);
          if (lineIsActive) {
            select(this).raise();
            selected.push(d);
          }
        });
        // TODO Figure out what this does and if it is needed
        // this.svg.property('value', selected).dispatch('input');
      });

    // Axis reordering stuff
    this.draggedAxes = new Map();

    this.draw();
  }

  draw() {
    this.updateScales();
    this.drawLines();
    this.drawAxes();
  }

  /** Updates scales to fit the current data */
  updateScales() {
    for (const dim of this.dimensions) {
      this.yScales[dim].domain(
        // Show full [0,100] for applicable parameters
        HUNDRED_RANGE.has(dim) ? [0, 100] : extent(this.data, (d) => +d[dim])
      );
      // this.yScales[dim].domain(extent(this.data, (d) => +d[dim]));
    }
  }

  drawAxes() {
    const axesSelection = this.plotAxesGroup
      .selectAll('.dimension')
      .data(this.dimensions);

    // Handle new axes
    const newAxes = axesSelection
      .enter()
      .append('g')
      .attr('class', 'dimension');
    newAxes
      .append('text')
      .style('text-anchor', 'middle')
      .attr('y', -9)
      .text((d) => d)
      .attr('class', 'axis-label');
    newAxes.call(
      // Inspired by https://bl.ocks.org/jasondavies/1341281
      drag()
        .filter(({ target }) => target.classList.contains('axis-label'))
        .on('start', (event, d) => {
          this.draggedAxes.set(d, this.xScale(d));
        })
        .on('drag', (event, d) => {
          this.draggedAxes.set(d, Math.min(this.width, Math.max(0, event.x)));
          this.allLinesSelection.attr('d', this.pathGen);
          this.dimensions.sort((a, b) => this.xPosition(a) - this.xPosition(b));
          this.xScale.domain(this.dimensions);
          newAxes.attr('transform', (d) => `translate(${this.xPosition(d)})`);
        })
        .on('end', (event, d) => {
          this.draggedAxes.delete(d);
          newAxes
            .merge(axesSelection)
            .transition()
            .attr('transform', (d) => `translate(${this.xPosition(d)})`);
          this.allLinesSelection.transition().attr('d', this.pathGen);
          // this.draw(); // this messes everithing up it seems hehe
        })
    );
    newAxes.append('g').call(this.brush);

    // TODO Maybe let axes wiggle or something to show that they're interactable

    // Handle both new and old axes
    newAxes
      .merge(axesSelection)
      .attr('transform', (d) => `translate(${this.xScale(d)})`)
      .each((d, i, nodes) => {
        select(nodes[i]).transition().call(this.axes.get(d));
      });
  }

  drawLines() {
    const lines = this.plot.selectAll('.line').data(this.data);
    lines.exit().remove();
    this.allLinesSelection = lines.enter().append('path').merge(lines);

    this.allLinesSelection
      .transition()
      .attr('d', this.pathGen)
      .attr('class', 'line')
      .style('stroke', (d) => (d['cluster'] === 0 ? 'red' : 'lime'));

    this.allLinesSelection
      .on('mouseover', (event, d) => {
        this.tooltip.transition().duration(40).style('opacity', 1);
        this.tooltip
          .html(d.title + '<br/>by ' + d.artist)
          .style('left', event.pageX + 'px')
          .style('top', event.pageY - 28 + 'px');

        // So this only works like 30% of the time for some reason
        // select(event.target).raise();
      })
      .on('mouseout', (event, d) => {
        this.tooltip.transition().style('opacity', 0);
      });

    this.allLinesSelection
      .on('click', (event, d) => {
        if (this.radarPlotExists) {
          this.radarPlot.setData(d);
        } else {
          this.radarPlot = new RadarPlot(d);
          this.radarPlotExists = true;
        }
      })
      .on('mouseout', (event, d) => {
        this.tooltip.transition().style('opacity', 0);
      });
  }

  /** Returns the xPosition taking dragging into account */
  xPosition(d) {
    const draggedPos = this.draggedAxes.get(d);
    return draggedPos ? draggedPos : this.xScale(d);
  }

  /** Data should have the same dimensions as the initial data */
  setData(newData) {
    this.data = newData;
    this.draw();
  }
}

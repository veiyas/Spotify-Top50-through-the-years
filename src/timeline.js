import {
  select,
  scaleTime,
  scaleLinear,
  axisBottom,
  axisLeft,
  timeParse,
  extent,
  line,
  scaleOrdinal,
  schemeCategory10,
  brushX,
  rollup,
  mean,
} from 'd3';
import { paramFullNames } from './paramInfo';

export default class Timeline {
  constructor(data, divId, propsToUse, pc) {
    this.data = data;
    this.div = document.getElementById(divId);
    this.propsToUse = propsToUse;
    this.pc = pc;

    const containerWidth = this.div.clientWidth;
    const containerHeight = this.div.clientHeight;

    this.margin = { top: 10, right: 10, bottom: 10, left: 40 };
    this.width = containerWidth - this.margin.left - this.margin.right;
    this.height = containerHeight - this.margin.top - this.margin.bottom;

    var parseYear = timeParse('%Y');

    this.data.forEach(function (d) {
      d.year = parseYear(d.year);
    });

    this.div.innerHTML = '';
    this.svg = select(this.div)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.timeline = this.svg
      .append('g')
      .attr('class', 'timeline')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.draw();
  }

  draw() {
    var parseYear = timeParse('%Y');

    const rawAvgData = rollup(
      this.data,
      (v) =>
        new Map(
          Array.from(this.propsToUse).map((key) => {
            return [key, mean(v, (d) => d[key])];
          })
        ),
      (v) => v.year
    );

    // Reshape the data bcs I don't have time to rewrite everything
    const tempMap = new Map(
      Array.from(this.propsToUse).map((key) => [
        key,
        {
          id: key,
          values: [],
        },
      ])
    );
    for (const [date, attrMap] of rawAvgData) {
      for (const [attr, val] of attrMap) {
        const current = tempMap.get(attr);
        current.values.push({
          date: date,
          score: val,
        });
      }
    }
    const avgData = Array.from(tempMap.values());

    const xScale = scaleTime()
      .range([0, this.width])
      .domain(extent(this.data, (d) => d.year))
      .nice();

    const yScale = scaleLinear().range([this.height, 0]).domain([0, 250]);

    const graphLine = line()
      .x(function (d) {
        return xScale(d.date);
      })
      .y(function (d) {
        return yScale(d.score);
      });

    //Give the lines ids
    var id = ['bpm', 'nrgy', 'dnce', 'live', 'val', 'acous', 'spch', 'pop'];
    var counter = 0;
    const ids = function () {
      return 'line-' + id[counter++];
    };

    //give each line a color
    var colors = scaleOrdinal().domain(id).range(schemeCategory10);

    //Draw x-axis
    this.timeline
      .append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(axisBottom(xScale));

    //Draw y-axis
    this.timeline
      .append('g')
      .attr('class', 'axis axis--y')
      .call(axisLeft(yScale).ticks(7));

    //Draw lines
    const lines = this.timeline
      .selectAll('lines')
      .data(avgData)
      .enter()
      .append('g');

    lines
      .append('path')
      .attr('class', ids)
      .attr('d', function (d) {
        return graphLine(d.values);
      })
      .attr('fill', 'none')
      .attr('stroke', (d) => colors(d.id))
      .attr('stroke-width', 3);

    //Add line legend
    const legend = select('#timeline-legend')
      .selectAll('li')
      .data(avgData)
      .enter()
      .append('li');
    legend
      .append('span')
      .attr('class', 'color-dot')
      .style('background-color', (d) => colors(d.id));
    legend.append('span').text((d) => paramFullNames.get(d.id));

    //Brushing
    var brush = brushX()
      .extent([
        [0, 0],
        [this.width, this.height],
      ])
      .on('end', brushed);
    var container = this.data;
    var parallel = this.pc;

    this.timeline
      .append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, xScale.range());

    function brushed({ selection }) {
      var brushedData = container;
      var minYear = parseYear(xScale.invert(selection[0]).getFullYear());
      var maxYear = parseYear(xScale.invert(selection[1]).getFullYear());

      brushedData = brushedData.filter(function (d) {
        return d.year >= minYear && d.year <= maxYear;
      });
      parallel.setData(brushedData);
    }
  }
}

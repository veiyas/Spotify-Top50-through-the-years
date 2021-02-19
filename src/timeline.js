import { select, scaleTime, scaleLinear, axisBottom, axisLeft, timeParse, max, min, extent, timeFormat, nest, rollup, sum, group, line, curveCardinal } from 'd3';

export default class Timeline {

    constructor(data, divId, propsToUse){
        this.data = data;
        this.div = document.getElementById(divId);
        this.propsToUse = propsToUse;

        this.margin = { top: 20, right: 20, bottom: 150, left: 40 },
        this.height = 300;
        this.width = 1000;

        var parseYear= timeParse("%Y");

        this.data.forEach(function(d) {
            d.year = parseYear(d.year);
        });

        this.div.innerHTML = '';
        this.svg = select(this.div)
          .append('svg')
          .attr('width', this.width+100)
          .attr('height', this.height+100);
        
        this.timeline = this.svg.append("g")
            .attr("class", "timeline")
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        this.draw();        
    }


    draw() {

      const attributes = Object.keys(this.data[0]).filter((key) => 
        this.propsToUse.has(key)
      );


      //Sum each column by year
      const byYear = rollup(this.data,
        v => Object.fromEntries(attributes.map(col => [col, sum(v, d => +d[col])])),
        d => d.year);


      const xScale = scaleTime()
        .range([0,this.width])
        .domain(extent(this.data, d => d.year));
        
      const yScale = scaleLinear()
        .range([this.height, 0])
        .domain([0,12000]); //Max bpm for a year is 11378

        //Draw x-axis
      this.timeline.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", "translate(0," + (this.height ) + ")")
        .call(axisBottom(xScale))
        .append("text")
        .style('text-anchor', 'middle')
        .attr('x', this.width/2)
        .attr('y', 50)
        .text('year')
        .style('fill', 'black'); 

        //Draw y-axis
      this.timeline.append("g")
        .attr("class", "axis axis--y")
        .call(axisLeft(yScale));


      // let values = Array.from(byYear).map(([key,value]) => value);
      // let keys = Array.from( byYear.keys());
      // console.log(keys);
      // console.log(values);

      // this.timeline
      //  .selectAll('.line')
      //  .append('g')
      //  .attr('class', 'line')
      //  .data(byYear)
      //  .enter()
      //  .append('path')
      //  .attr('d', function (d) {
      //    return line()
      //      .x((d) => xScale(Array.from(d.keys())))
      //      .y((d) => yScale(Array.from(d).map(([key,value]) => value)))
      //  });

    }

}
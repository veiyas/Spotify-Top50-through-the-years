import { select, scaleTime, scaleLinear, axisBottom, axisLeft, timeParse, max, min, extent, timeFormat, nest, rollup, sum, group } from 'd3';

export default class Timeline {

    constructor(data, divId, propsToUse){
        this.data = data;
        this.div = document.getElementById(divId);
        this.propsToUse = propsToUse;

        //const containerWidth = this.div.clientWidth;
        this.margin = { top: 20, right: 20, bottom: 150, left: 40 },
        //this.width = containerWidth - this.margin.left - this.margin.right;
        //this.height = 500 - this.margin.top - this.margin.bottom;
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

        //Sum each column and group by year
      const byYear = rollup(this.data,
        v => Object.fromEntries(attributes.map(col => [col, sum(v, d=> +d[col])])),
        d => d.year);

    // const byYear = group(this.data, d => d.year)
    // .rollup(function(d) { 
    //  return sum(d, function(g) {return g.bpm,g.nrgy,g.dnce,g.live,g.val,g.acous,g.spch,g.pop; });
    // }).entries(this.data);

      console.log(typeof(byYear));
      console.log(byYear);

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
        .style('fill', 'black'); // Maybe use a class instead
    
        //Draw y-axis
      this.timeline.append("g")
        .attr("class", "axis axis--y")
        .call(axisLeft(yScale));

        console.log(byYear.values())        
    }

}
import { select, scaleTime, scaleLinear, axisBottom, axisLeft, timeParse, max, min, extent, timeFormat, nest, rollup, sum, group, line, scaleOrdinal, schemeCategory10 } from 'd3';

export default class Timeline {

    constructor(data, divId, propsToUse){
        this.data = data;
        this.div = document.getElementById(divId);
        this.propsToUse = propsToUse;

        this.margin = { top: 20, right: 20, bottom: 150, left: 40 },
        this.height = 300;
        this.width = 900;

        var parseYear= timeParse("%Y");

        this.data.forEach(function(d) {
            d.year = parseYear(d.year);
        });

        var slices = this.data.columns.slice(1).map(function(id) {
          return {
            id: id,
            values: data.map(function(d){
              return {
                date: d.year,
                score: +d[id]
              };
            })
          };
        });

        this.newSlices = [];

        var counter = 0;
        for (var i = 4; i < 14; i++) {
          if (i == 7 || i == 10) continue;
          this.newSlices[counter] = slices[i];
          counter++;
        }

        this.div.innerHTML = '';
        this.svg = select(this.div)
          .append('svg')
          .attr('width', this.width+150)
          .attr('height', this.height+100);
        
        this.timeline = this.svg.append("g")
            .attr("class", "timeline")
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        this.draw();      
    }


    draw() {

      var parseYear= timeParse("%Y");

      var sumData = [];
      sumData[0] = {id: "bpm", values: [{date: parseYear("2010"), score:6225 },{date:parseYear("2011"), score: 6311},{date:parseYear("2012"), score: 4238},{date:parseYear("2013"), score: 8639},{date:parseYear("2014"), score: 7134},{date:parseYear("2015"), score: 11378},{date:parseYear("2016"), score: 9146},{date:parseYear("2017"), score: 7592},{date:parseYear("2018"), score:7334},{date:parseYear("2019"), score:3486}]};
      sumData[1] = {id: "nrgy", values: [{date: parseYear("2010"), score:3973 },{date:parseYear("2011"), score: 3969},{date:parseYear("2012"), score: 2642},{date:parseYear("2013"), score:5245},{date:parseYear("2014"), score:3931},{date:parseYear("2015"), score:6682},{date:parseYear("2016"), score: 5379},{date:parseYear("2017"), score: 4496},{date:parseYear("2018"), score:4190},{date:parseYear("2019"), score:2007}]};
      sumData[2] = {id: "dnce", values: [{date: parseYear("2010"), score:3291 },{date:parseYear("2011"), score: 3373},{date:parseYear("2012"), score: 2300},{date:parseYear("2013"), score: 4405},{date:parseYear("2014"), score: 3627},{date:parseYear("2015"), score: 6048},{date:parseYear("2016"), score: 5066},{date:parseYear("2017"), score:4249},{date:parseYear("2018"), score:4301},{date:parseYear("2019"), score:2161}]}; 
      sumData[3] = {id: "live", values: [{date: parseYear("2010"), score:1080 },{date:parseYear("2011"), score: 1110},{date:parseYear("2012"), score:554},{date:parseYear("2013"), score: 1400},{date:parseYear("2014"), score:1003},{date:parseYear("2015"), score:1739},{date:parseYear("2016"), score: 1419},{date:parseYear("2017"), score:999},{date:parseYear("2018"), score:944},{date:parseYear("2019"), score:470}]}; 
      sumData[4] = {id: "val", values: [{date: parseYear("2010"), score:2907 },{date:parseYear("2011"), score: 2846},{date:parseYear("2012"), score: 2246},{date:parseYear("2013"), score:3776},{date:parseYear("2014"), score: 3021},{date:parseYear("2015"), score: 4990},{date:parseYear("2016"), score: 3612},{date:parseYear("2017"), score:3398},{date:parseYear("2018"), score:3121},{date:parseYear("2019"), score:1575}]}; 
      sumData[5] = {id: "acous", values: [{date: parseYear("2010"), score:593 },{date:parseYear("2011"), score: 707},{date:parseYear("2012"), score: 170},{date:parseYear("2013"), score: 733},{date:parseYear("2014"), score: 1018},{date:parseYear("2015"), score:1577 },{date:parseYear("2016"), score: 1270},{date:parseYear("2017"), score:1079},{date:parseYear("2018"), score:818},{date:parseYear("2019"), score:674}]}; 
      sumData[6] = {id: "spch", values: [{date: parseYear("2010"), score:453 },{date:parseYear("2011"), score: 512},{date:parseYear("2012"), score: 203},{date:parseYear("2013"), score: 590},{date:parseYear("2014"), score: 503},{date:parseYear("2015"), score: 670},{date:parseYear("2016"), score: 669},{date:parseYear("2017"), score:636},{date:parseYear("2018"), score:552},{date:parseYear("2019"), score:252}]}; 
      sumData[7] = {id: "pop", values: [{date: parseYear("2010"), score:4277 },{date:parseYear("2011"), score: 3279},{date:parseYear("2012"), score: 2372},{date:parseYear("2013"), score: 4543},{date:parseYear("2014"), score: 3637},{date:parseYear("2015"), score:6134},{date:parseYear("2016"), score: 5133},{date:parseYear("2017"), score:4486},{date:parseYear("2018"), score:4636},{date:parseYear("2019"), score:2615}]}; 

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

      const graphLine = line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.score); }); 

      //Give the lines ids
      var id = ["bpm","nrgy","dnce","live","val","acous","spch","pop"];
      var counter = 0;
      const ids = function () {
          return "line-"+id[counter++];
      }

      //give each line a color
      var colors = scaleOrdinal().domain(id).range(schemeCategory10);
      console.log(schemeCategory10)


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

      //Draw lines
      const lines = this.timeline.selectAll("lines")
        .data(sumData)
        .enter()
        .append("g");

      lines.append("path")
        .attr("class", ids)
        .attr("d", function(d) {return graphLine(d.values); })
        .attr("fill", "none")
        .attr("stroke", d => colors(d.id))
        .attr("stroke-width", 3);

      //Add line legend
      var legend = this.timeline
        .selectAll('g.legend')
        .data(sumData)
        .enter()
        .append("g")
        .attr("class", "legend");

      legend.append("circle")
        .attr("cx", 930)
        .attr('cy', (d, i) => i * 30 + 45)
        .attr("r", 6)
        .style("fill", d => colors(d.id))

        legend.append("text")
        .attr("x", 940)
        .attr("y", (d, i) => i * 30 + 50)
        .text(d => d.id)
        .style("fill", "white");



      //append circle to the lines. Not working
      // this.timeline
      //   .selectAll('circle')
      //   .append('g')
      //   .data(sumData)
      //   .enter()
      //   .append('circle')
      //   .attr('r', 6)
      //   .attr('cx', (d) => { console.log(d.date); return xScale(d.date);})
      //   .attr('cy', (d) => { console.log(d.score); yScale(d.score);})
      //   .style("fill", d => colors(d.id))
    
    }
  }
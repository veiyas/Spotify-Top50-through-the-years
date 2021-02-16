import { scaleLinear, select, line, path } from 'd3';

// Class to create a RadarPlot of the stats of a single song
// Inspired by https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
export default class RadarPlot {
  /** propsToUse is a Set */
  constructor(song, divId, propsToUse) {
    this.song = song;
    this.div = document.getElementById(divId);
    this.propsToUse = propsToUse;

    // Calculate width, height, etc.
    this.margin = { top: 40, right: 10, bottom: 10, left: 30 };
    this.width = 300;
    this.height = 300;

    // Put plot svg to this.div
    this.div.innerHTML = '';
    this.svg = select(this.div)
      .append('svg')
      .attr('width', this.width*2)
      .attr('height', this.height*2);

    // Create a group in svg for the actual plot space
    this.plot = this.svg
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.radialScale = scaleLinear()
    .domain([0,100])
    .range([0,250]);
    this.features = [];

    this.draw();
  }
  
    draw() {
        // The name of the dimensions to use for plotting
        const songFeatures = Object.keys(this.song).filter((key) =>
        this.propsToUse.has(key)
        );
        this.features = songFeatures;

        // Create circles and incremental ticks
        const ticks = [20, 40, 60, 80, 100];
        ticks.forEach(t =>
            this.svg.append("circle")
            .attr("cx", this.width)
            .attr("cy", this.height)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("r", this.radialScale(t))
        );

        // Append the circles
        ticks.forEach(t =>
            this.svg.append("text")
            .attr("x", this.width + 2)
            .attr("y", this.height - 2 - this.radialScale(t))
            .text(t.toString())
        );
        
        // Draw axis lines and labels
        for (var i = 0; i < songFeatures.length; i++) {
            let ft_name = songFeatures[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / songFeatures.length);
            let line_coordinate = this.angleToCoordinate(angle, 100);
            let label_coordinate = this.angleToCoordinate(angle, 110);
        
            // Draw axis line
            this.svg.append("line")
            .attr("x1", this.width)
            .attr("y1", this.height)
            .attr("x2", line_coordinate.x)
            .attr("y2", line_coordinate.y)
            .attr("stroke","black");
        
            // Draw axis label
            this.svg.append("text")
            .attr("x", label_coordinate.x-15)
            .attr("y", label_coordinate.y)
            .text(ft_name);
        }

        // Prepare the data and drawing configs
        const color = "darkorange";
        const coordinates = this.getPathCoordinates(this.song);

        // Draw the data with a <path>
        this.svg.append("path")
        .datum(coordinates)
        .attr("d", line()
            .x(d => d.x)
            .y(d => d.y))
        .attr("stroke-width", 3)
        .attr("stroke", color)
        .attr("fill", color)
        .attr("stroke-opacity", 1)
        .attr("opacity", 0.5);

        // Display textual song info
        select('#song-info')
        .append("p")
        .text(this.song['artist'] + " - " + this.song['title'] + " (" + this.song["year"] +")")
        .style("text-align", "center")
        .append("p")
        .text("Duration: " +  (this.song['dur']/60).toFixed(0) + " min " + (this.song['dur'] % 60).toFixed(0) + " sec")
        .append("p")
        .text("Tempo: " + this.song['bpm'] + " bpm");
    }

    getPathCoordinates(data_point) {
      const coordinates = [];
        for (var i = 0; i < this.features.length; i++){
            const ft_name = this.features[i];
            const angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
            coordinates.push(this.angleToCoordinate(angle, data_point[ft_name]));
        }
        return coordinates;
    }

    angleToCoordinate(angle, value) {
      const x = Math.cos(angle) * this.radialScale(value);
      const y = Math.sin(angle) * this.radialScale(value);
        return {"x": this.width + x, "y": this.height - y};
    }

  setData(newData) {
    this.song = newData;
    // TODO Do i need to force an update maybe
  }
}

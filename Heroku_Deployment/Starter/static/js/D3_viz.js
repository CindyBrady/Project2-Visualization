// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 100,
      bottom: 100,
      right: 200,
      left: 200
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
    // Append SVG element
    var svg = d3
      .select(".chart")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
      svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 6)
      .classed("axis-text", true)
      .text("Total Revenue from Jan 2020 to Jan 2021");
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
     // append y axis
      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Total Revenue (USD)");
  
      //create x-axis label
      var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
      var xLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "Month") 
      .classed("axis-text", true)
      .text("Month");
  
    // Read CSV
    d3.csv("../data/TGOD.csv").then(function(salesData) {
  
      // create date parser
      var dateParser = d3.timeParse("%b");
  
      // parse data
      salesData.forEach(function(data) {
        data.Month = dateParser(data.Month);
        data.Revenue = +data.Revenue;
      });
  
      // create scales
      var xTimeScale = d3.scaleTime()
        .domain(d3.extent(salesData, d => d.Month))
        .range([0, width]);
  
      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(salesData, d => d.Revenue)])
        .range([height, 0]);
  
      // create axes
      var xAxis = d3.axisBottom(xTimeScale);
      var yAxis = d3.axisLeft(yLinearScale).ticks(6);
  
      // append axes
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .classed("yAxis-text", true)
        .call(xAxis);
  
  
      chartGroup.append("g")
        .classed("yAxis-text", true)
        .call(yAxis);
  
      // line generator
      var line = d3.line()
        .x(d => xTimeScale(d.Month))
        .y(d => yLinearScale(d.Revenue));
  
      // append line
      chartGroup.append("path")
        .data([salesData])
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "red");
  
      // append circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(salesData)
        .enter()
        .append("circle")
        .attr("cx", d => xTimeScale(d.Month))
        .attr("cy", d => yLinearScale(d.Revenue))
        .attr("r", "5")
        .attr("fill", "#FFD6C")
        .attr("stroke-width", "3")
        .attr("stroke", "#FFD6C");
  
      // date formatter to display dates nicely
      var dateFormatter = d3.timeFormat("%b");
  
      // Step 1: Append tooltip div
      var toolTip = d3.select("body")
        .append("div")
        .classed("tooltip", true);
  
      // Step 2: Create "mouseover" event listener to display tooltip
      circlesGroup.on("mouseover", function(d) {
        toolTip.style("display", "block")
            .html(
              `<strong>${dateFormatter(d.Month)}<strong><hr>${d.Revenue}
          Sales (USD)`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
      })
        // Step 3: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function() {
          toolTip.style("display", "none");
        });
  
    }).catch(function(error) {
      console.log(error);
    });
  }
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
  
let svgWidth = 900;
let svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
let svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(data => {
    console.log(data)

    // Step 1: Parse Data/Cast as numbers
     data.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    })

    // Step 2: Create scale functions
    let xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(data, d => d.poverty)])
    .range([0, width]);

    let yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

    // Step 3: Create axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // Step 5: Create Circles
    let circlesGroup = chartGroup.selectAll(".stateCircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("opacity", ".5")


    let stateAbbrevGroup = chartGroup.selectAll(".stateText")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "stateText")
        .attr("dx", d => xLinearScale(d.poverty))
        .attr("dy", d => yLinearScale(d.healthcare)+5)
        .text(d => d.abbr);

    // // Step 6: Initialize tool tip
    // let toolTip = d3.tip()
    // .attr("class", "tooltip")
    // .offset([80, -60]) //lets you style universally
    // .html(function(d) {
    //     return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`)
    // })


    // // Step 7: Create tooltip in the chart
    // chartGroup.call(toolTip);

    // // Step 8: Create event listeners to display and hide the tooltip
    // circlesGroup.on("mouseover", function(data) {
    //     toolTip.show(data)
    // })

    //     // on mouseout event
    //     .on("mouseout", function(data, index) {
    //     toolTip.hide(data);
    //     });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

});
var margin = { top: 30, right: 20, bottom: 30, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


xAxis = g => g
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x));
x = d3.scaleLinear([0, 10], [margin.left, width - margin.right]);
rx = d3.randomUniform(...x.domain());
ry = d3.randomNormal(height / 2, height / 10);

const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("viewBox", [0, 0, width, height]);

const brush = d3.brushX()
    .extent([[margin.left, margin.top], [width-margin.right, height-margin.bottom]])

const circle = svg.append("g")
    .selectAll("circle")
    .data(Float64Array.from({ length: 800 }, rx))
        .join("circle")
        .attr("transform", d => `translate(${x(d)}, ${ry()})`)
        .attr("r", 5.5)
        .attr("fill-opacity", .4)
        .attr("fill", "red");


svg.append("g").call(xAxis);
svg.append("g").call(brush);
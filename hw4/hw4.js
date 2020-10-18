var margin = { top: 60, right: 20, bottom: 40, left: 50 },
    width = (window.innerWidth * 0.75) - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

data = [
    {color: "Purple", count: 4, hex: "#c37bd4"},
    {color: "Blue", count: 2, hex: "#49bdc9"},
    {color: "Prussian Blue", count: 1, hex: "#2566b0"},
    {color: "Pink", count: 1, hex: "#ff80aa"},
    {color: "Orange", count: 1, hex: "#ffa03b"},
    {color: "Mustard", count: 1, hex: "#FFDB58"},
    {color: "Highlighter Yellow", count: 1, hex: "#fff200"},
    {color: "Green", count: 1, hex: "#8ee36f"},
];

var colors = [];
data.forEach(function(d){
    colors.push(d.color);
});

var mostPopularCount = d3.max(data, function(d){
    return d.count;
});

const barSpace = 200;
const barWidth = (width-barSpace)/colors.length;

var x = d3.scaleBand()
    .domain(colors)
    .range([margin.left, width - margin.right]);

var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, mostPopularCount+1]);

//function for calculating the scaled bar height
var barHeight = d3.scaleLinear()
    .range([height, 0])
    .domain([mostPopularCount+1, 0]);

//SVG
var svg = d3.select("#graph-location")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

//x axis
svg.append("g")
    .attr("class", "x-axis")
    .attr("fill", "none")
    .attr("transform", "translate(0, "+height+")")
    .call(d3.axisBottom(x).ticks(colors.length));

//x axis label 
svg.append("text")
    .attr("class", "x label")
    .attr("transform", "translate("+(width/2)+", "+(height+margin.bottom)+")")
    .text("Colors");
    

//y axis
svg.append("g")
    .attr("class", "y-axis")
    .attr("fill", "none")
    .attr("transform", "translate("+margin.left+", 0)")
    .call(d3.axisLeft(y).ticks((mostPopularCount + 1)))

//y axis label 
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 0)
    .attr("x", (0-(height/2))+margin.top)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Number of Students");

//bars
svg.append('g')
    .selectAll('rect')
    .data(data)
    .join((enter) => enter.append('rect'))
    .attr('width', barWidth)
    .attr("y", (d) => height - barHeight(d.count))
    .attr('height', (d) => barHeight(d.count))
    .attr('fill', (d) => d.hex)
    .attr('x', (d) => x(d.color)+10);

//title
svg.append("text")
    .attr("class", "title")
    .text("Favorite Colors")
    .attr("transform", "translate("+(width/2-margin.left-margin.right)+", "+(margin.top)+")");

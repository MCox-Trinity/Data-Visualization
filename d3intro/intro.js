var margin = { top: 30, right: 20, bottom: 30, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

data = [
    { date: "1-May-12", close: 58.13 },
    { date: "30-Apr-12", close: 53.98 },
    { date: "27-Apr-12", close: 67.00 },
    { date: "26-Apr-12", close: 89.70 },
    { date: "25-Apr-12", close: 99.00 },
    { date: "24-Apr-12", close: 130.28 },
    { date: "23-Apr-12", close: 166.70 },
    { date: "20-Apr-12", close: 234.98 },
    { date: "19-Apr-12", close: 345.44 },
    { date: "18-Apr-12", close: 443.34 },
    { date: "17-Apr-12", close: 543.70 },
    { date: "16-Apr-12", close: 580.13 },
    { date: "13-Apr-12", close: 605.23 },
    { date: "12-Apr-12", close: 622.77 },
    { date: "11-Apr-12", close: 626.20 },
    { date: "10-Apr-12", close: 628.44 },
    { date: "9-Apr-12", close: 636.23 },
    { date: "5-Apr-12", close: 633.68 },
    { date: "4-Apr-12", close: 624.31 },
    { date: "3-Apr-12", close: 629.32 },
    { date: "2-Apr-12", close: 618.63 },
    { date: "30-Mar-12", close: 599.55 },
    { date: "29-Mar-12", close: 609.86 },
    { date: "28-Mar-12", close: 617.62 },
    { date: "27-Mar-12", close: 614.48 },
    { date: "26-Mar-12", close: 606.98 }
];

var parseDate =d3.timeParse("%d-%b-%y");

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
data.forEach(function (d) {
    d.date = parseDate(d.date);
    d.close = +d.close;
});

x.domain(d3.extent(data, function (d) {
    return d.date;
}));
y.domain([0, d3.max(data, function(d){
    return d.close;
})]);




var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

//line
var line = d3.line()
    .x(function(d) {return x(d.date);})
    .y(function(d) {return y(d.close);})
var area = d3.area()
    .x(function(d) {return x(d.date);})
    .y0(height)
    .y1(function(d) {return y(d.close);});

svg.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", "2")
    .attr("d", line(data));
svg.append("path")
    .attr("class", "fill")
    .attr("fill", "pink")
    .attr("d", area(data));

//x axis
svg.append("g")
    .attr("class", "x-axis")
    .attr("fill", "none")
    .attr("transform", "translate(0, "+height+")")
    .call(d3.axisBottom(x).ticks(5));

//y axis
svg.append("g")
    .attr("class", "x-axis")
    .attr("fill", "none")
    .call(d3.axisLeft(y).ticks(5));
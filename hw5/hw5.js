//General Functions 
var dollarFormat = function (d) { return '$' + (d) };
var parseDate = d3.timeParse("%Y-%m-%d");

//Data Parse

var XOM_Data = document.getElementById("XOM").value;
let XOM_Parsed = [];
XOM_Data.split(';').slice(1).forEach(point => {
    let pointData = point.split(',');
    XOM_Parsed.push({
        date: parseDate(pointData[0]),
        open: pointData[1],
        high: pointData[2],
        low: pointData[3],
        close: pointData[4],
        adj_close: pointData[5],
        volume: pointData[6]
    });
});

var TSLA_Data = document.getElementById("TSLA").value;
let TSLA_Parsed = [];
TSLA_Data.split(';').slice(1).forEach(point => {
    let pointData = point.split(',');
    TSLA_Parsed.push({
        date: parseDate(pointData[0]),
        open: pointData[1],
        high: pointData[2],
        low: pointData[3],
        close: pointData[4],
        adj_close: pointData[5],
        volume: pointData[6]
    });
});

//Setup 
var margin = { top: 60, right: 20, bottom: 40, left: 50 },
    SVGwidth = (window.innerWidth * 0.75) - margin.left - margin.right,
    SVGheight = 700 - margin.top - margin.bottom;
var gap = 50;
var DetailViewHeight = (SVGheight * .85) - gap;
var OverviewViewHeight = SVGheight * .15;

var default_data = TSLA_Parsed;
var primary_color = "#F58A94";

let default_start_date = parseDate("2019-10-30");
let default_end_date = parseDate("2019-12-30");

var overview_y = d3.scaleLinear().range([OverviewViewHeight, 0]);
var overview_x = d3.scaleTime().range([0, SVGwidth]);

var detail_y = d3.scaleLinear().range([DetailViewHeight, 0]);
var detail_x = d3.scaleTime().range([0, SVGwidth]);

//SVG
var svg = d3.select("#detail-location")
    .append("svg")
    .attr("width", SVGwidth + margin.left + margin.right)
    .attr("height", SVGheight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

//Overview Section 
var overviewView = svg.append("g")
    .attr("width", SVGwidth - margin.right)
    .attr("height", OverviewViewHeight)
    .attr("transform", `translate(0, ${DetailViewHeight + gap})`);

//Detail View Section 
var detailView = svg.append("g")
    .attr("width", SVGwidth - margin.right)
    .attr("height", DetailViewHeight)
    .attr("transform", `translate(0, 0)`);

//Render the XOM data by default
viewXOM();

//Render the XOM Data
function viewXOM() {
    console.log("XOM")
    document.getElementById("XOM_Button").className = "disabled";
    document.getElementById("TSLA_Button").className = "";
    renderWithData(default_start_date, default_end_date, XOM_Parsed)
}

//Render the TSLA Data
function viewTSLA() {
    console.log("TSLA")
    document.getElementById("TSLA_Button").className = "disabled";
    document.getElementById("XOM_Button").className = "";
    renderWithData(default_start_date, default_end_date, TSLA_Parsed)
}

//Render the graphs with the given data
function renderWithData(start, end, data) {
    //Remove the data on the graph 
    overviewView.selectAll('*').remove();
    
    //Overview view axis info
    overview_y = d3.scaleLinear().range([OverviewViewHeight, 0]);
    overview_x = d3.scaleTime().range([0, SVGwidth]);
    overview_y.domain([0, d3.max(data, function (d) { return d.close; })]);
    overview_x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    overview_xAxis = g => g
        .attr("transform", `translate(0, ${OverviewViewHeight})`)
        .call(d3.axisBottom(overview_x));
    overview_yAxis = g => g
        .call(d3.axisLeft(overview_y)
            .ticks(3)
            .tickFormat(dollarFormat));

    //Area function for the overview section
    var overview_area = d3.area()
        .x(function (d) { return overview_x(d.date); })
        .y0(OverviewViewHeight)
        .y1(function (d) { return overview_y(d.close); });

    overviewView.append("path")
        .attr("class", "fill")
        .attr("fill", primary_color)
        .attr("d", overview_area(data));

    const brush = d3.brushX()
        .extent([[0, 0], [SVGwidth - margin.right, OverviewViewHeight]])
        .on("start brush end", brushed);

    overviewView.append("g").call(overview_xAxis);
    overviewView.append("g").call(overview_yAxis);
    overviewView.append("g").call(brush, data);
    renderDetailView(start, end, data);

    function brushed(event) {
        const selection = event.selection;
        if (selection === null) {

        } else {
            const [x0, x1] = selection.map(overview_x.invert);
            renderDetailView(x0, x1, data);
        }
    }
}

function renderDetailView(start_date, end_date, data) {
    //Remove what is currently in the detail view
    detailView.selectAll('*').remove();

    //filter to only show the data that is in the range
    var dataInRange = data.filter(d => d.date >= start_date && d.date <= end_date);

    //Axis Setup
    detail_y = d3.scaleLinear().range([DetailViewHeight, 0]);
    detail_x = d3.scaleTime().range([0, SVGwidth]);
    detail_y.domain([0, d3.max(
        dataInRange,
        function (d) {
            return d.close;
        }
    )]);
    detail_x.domain([start_date, end_date]);
    detail_xAxis = g => g
        .attr("transform", `translate(0, ${DetailViewHeight})`)
        .call(d3.axisBottom(detail_x));
    detail_yAxis = g => g
        .call(d3.axisLeft(detail_y)
            .ticks(10)
            .tickFormat(dollarFormat));

    var detail_area = d3.area()
        .x(function (d) { return detail_x(d.date); })
        .y0(DetailViewHeight)
        .y1(function (d) { return detail_y(d.close); });

    detailView.append("path")
        .attr("class", "fill")
        .attr("fill", primary_color)
        .attr("d", detail_area(dataInRange));

    detailView.append("g").call(detail_xAxis);
    detailView.append("g").call(detail_yAxis);
}
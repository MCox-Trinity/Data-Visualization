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
var primary_color = "#9ad3bc";
var secondary_color = "#16697a";

let default_start_date = parseDate("2019-10-30");
let default_end_date = parseDate("2019-12-30");

// var selection_start_date = default_start_date;
// var selection_end_date = default_end_date;

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

//Detail Section
// var detail = svg.append("g")
//     .attr("fill", "red")
//     .attr("width", SVGwidth - margin.right)
//     .attr("height", DetailViewHeight);


//Overview Section 
var overview = svg.append("g")
    .attr("fill", "blue")
    .attr("width", SVGwidth - margin.right)
    .attr("height", OverviewViewHeight)
    .attr("transform", `translate(0, ${DetailViewHeight + gap})`);

//Detail View Section 
var detailView = svg.append("g")
    .attr("fill", "blue")
    .attr("width", SVGwidth - margin.right)
    .attr("height", DetailViewHeight)
    .attr("transform", `translate(0, 0)`);
    
renderDetailView(default_start_date, default_end_date, default_data);
renderWithData(default_start_date, default_end_date, default_data);

//Functions

function viewXOM() {
    console.log("XOM")
    renderWithData(XOM_Parsed)
}

function viewTSLA() {
    console.log("TSLA")
    renderWithData(TSLA_Parsed)
}

function renderWithData(start_date, end_date, data) {
    console.log(d3.max(data, function(d){return d.close;}))
    
    overview_y.domain([0, d3.max(data, function (d) {
        return d.close;
    })]);
    overview_x.domain(d3.extent(data, function (d) {
        return d.date;
    }));

    detail_y.domain([0, d3.max(
        data.filter(d => d.date >= start_date && d.date <= end_date),
        function (d) {
            return d.close;
        }
    )]);
    detail_x.domain([start_date, end_date]);

    //overview stuff
    overview.selectAll('*').remove();
    overview_xAxis = g => g
        .attr("transform", `translate(0, ${OverviewViewHeight})`)
        .call(d3.axisBottom(overview_x));

    var overview_area = d3.area()
        .x(function (d) { return overview_x(d.date); })
        .y0(OverviewViewHeight)
        .y1(function (d) { return overview_y(d.close); });

    overview.append("path")
        .attr("class", "fill")
        .attr("fill", secondary_color)
        .attr("d", overview_area(data));

    const brush = d3.brushX()
        .extent([[0, 0], [SVGwidth - margin.right, OverviewViewHeight]])
        .on("start brush end", brushed);

    overview.append("g").call(overview_xAxis);
    overview.append("g").call(brush, data);

    function brushed(event) {
        const selection = event.selection;
        if (selection === null) {

        } else {
            const [x0, x1] = selection.map(overview_x.invert);
            let start = x0;
            let end = x1;
            // console.log(`start: ${selection_start_date} end ${selection_end_date}`)
            renderDetailView(start, end, data);
        }
    }
}

function renderDetailView(start_date, end_date, data) {
    detailView.selectAll('*').remove();
    detail_y = d3.scaleLinear().range([DetailViewHeight, 0]);
    detail_x = d3.scaleTime().range([0, SVGwidth]);
    var dataInRange = data.filter(d => d.date >= start_date && d.date <= end_date);
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

    var overview_area = d3.area()
        .x(function (d) { return detail_x(d.date); })
        .y0(DetailViewHeight)
        .y1(function (d) { return detail_y(d.close); });

    detailView.append("path")
        .attr("class", "fill")
        .attr("fill", secondary_color)
        .attr("d", overview_area(dataInRange));

    detailView.append("g").call(detail_xAxis);
    detailView.append("g").call(detail_yAxis);
}
var margin = { top: 30, right: 20, bottom: 30, left: 50 },
    width = 900 - margin.left - margin.right,
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
    .on("start brush end", brushed);

const circle = svg.append("g")
    .selectAll("circle")
    .data(Float64Array.from({ length: 800 }, rx))
        .join("circle")
        .attr("transform", d => `translate(${x(d)}, ${ry()})`)
        .attr("r", 5.5)
        .attr("fill-opacity", .4)
        .attr("fill", "purple");


svg.append("g").call(xAxis);
svg.append("g").call(brush);

svg.append("g")
    .call(brush)
    .call(brush.move, [4, 6].map(x))
    .call(g => g.select(".overlay")
        .datum({type: "selection"})
        .on("mousedown", brushClick));

function brushed(event){
    const selection = event.selection;
    if(selection === null){
        circle.attr("fill", "purple");
    } else {
        const [x0, x1] = selection.map(x.invert);
        circle.attr("fill", d => x0 <= d && d <= x1 ? "lime" : "purple")
    }
}

function brushClick(event){
    const brushWidth = x(2) - x(0);
    const [[clickLocation]] = d3.pointers(event);
    const [x0, x1] = [clickLocation-brushWidth/2, clickLocation+brushWidth/2];
    const [leftBound, rightBound] = x.range()
    d3.select(this.parentNode)
        .call(brush.move, 
            x1 > rightBound ? [rightBound-brushWidth, rightBound] : 
            x0 < leftBound ? [leftBound, leftBound+brushWidth] : 
            [x0, x1]);
}
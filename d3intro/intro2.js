

d3.csv("./data.csv").then(function (data) {
    data.forEach(function (d) {
        d.population = +d.population;
        d.red = +d.red;
        d.green = +d.green;
        d.blue = +d.blue;
    });
    var svg = d3.select("body").append("svg").attr("width", 1000).attr("height", 300);
    //var circle = svg.selectAll("circle").data([32, 64, 100, 115]);
    //circle.attr("r",30);
    //circle.attr("cx", function (d, i) { return i * 200 + 30; });
    //var newCircle = circle.enter().append("circle");
    //newCircle.attr("cy",60);
    //newCircle.attr("cx",500);
    //newCircle.attr("r",20);

    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cy", 60)
        .attr("cx", function (d, i) { return i * 200 + 30; })
        .attr("r", function (d) { return Math.sqrt(d.population); })
        .style("fill", function (d) {
            return "rgb(" + d.red + "," + d.green + "," + d.blue + ")";
        })
        .style("stroke", "black");

    //var removeCircle = svg.selectAll("circle")
    //.data([32, 64]);
    //removeCircle.exit().remove();
});
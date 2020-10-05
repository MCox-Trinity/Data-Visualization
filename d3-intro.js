d3.csv("./data.csv").then(function (data) {
    var svg = d3.select("svg");
    var newPink = "#fc0356";

    // var circle = svg.selectAll("circle").data([32, 64, 100, 115]);
    // circle.attr("r", 30);
    // circle.attr("cx", function(){return Math.random() * 650;})
    // circle.attr("cx", function(d, i) {return i * 200 + 30;});
    // var newCircle = circle.enter().append("circle");
    // newCircle.attr("cy", 60);
    // newCircle.attr("cx", 500);
    // newCircle.attr("r", 20);

    svg.selectAll("circle")
        .data([32, 64, 100, 115])
        .enter().append("circle")
        .attr("cy", 60)
        .attr("cx", function (d, i) { return i * 200 + 30; })
        .attr("r", function (d) { return Math.sqrt(d) })
        .style("fill", newPink)
        .style("stroke", "Black")
        .style("opacity", .7);

    //removes the ones that are not in the data list
    // var removeCircle = svg.selectAll("circle")
    // .data([32, 64]);
    // removeCircle.exit().remove();
});


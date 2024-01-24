/* US state map */
const map = d3.select("svg#map");
const mapWidth = 650;
const mapHeight = 450;
const stateColorWidth = 50;
const stateColorHeight = 15;
const mapColors = ["#d6e5fd", "#b1cdfa", "#8cb5f8", "#679df6", "#4285f4"];
const years = [1920, 1940, 1960, 1980, 2000, 2020];
const sliderWidth = 300;
const sliderHeight = 15;
const sliderYearWidth = (sliderWidth - 57.5) / 5;

// map components
let mapArea = map.append("g").attr("transform", "translate(50, 30)");
let mapLegend = map.append("g").attr("transform", "translate(450, 500)");
let sliderArea = map.append("g").attr("transform", "translate(50, 500)");
let tooltip = map
    .append("g")
    .attr("transform", "translate(325, 30)")
    .attr("visibility", "hidden");
let tooltipState = tooltip
    .append("text")
    .text("Test State")
    .attr("x", 10)
    .attr("y", 20)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "top")
    .style("font-size", 14);

// start draw map
let selectedYear = "2000"; //default value

async function drawMap() {
    const hqData = await d3.csv("data/map_data.csv", d3.autoType);
    const topoData = await d3.json("data/usstatemap.json");

    //states
    let state = topojson.feature(topoData, topoData.objects.states);
    //outline
    let stateMesh = topojson.mesh(topoData, topoData.objects.states);
    let projection = d3.geoAlbersUsa().fitSize([mapWidth, mapHeight], state);
    let projectPath = d3.geoPath().projection(projection);

    // map color scale

    filtered_data = hqData.filter(function (st) {
        return st.yearfloor == selectedYear;
    });

    const hqExtent = d3.extent(filtered_data, (d) => d.job_count);
    const mapScale = d3.scaleQuantile().domain(hqExtent).range(mapColors);
    quantileEdge = mapScale.quantiles().map((d) => parseInt(d));
    quantileRange = [hqExtent[0], ...quantileEdge, hqExtent[1]];

    // color legend text
    mapLegend
        .append("text")
        .text("# of Headquarters Established")
        .attr("x", 0)
        .attr("y", -10)
        .attr("alignment-baseline", "top");
    mapLegend
        .selectAll("text.number")
        .data(quantileRange)
        .join("text")
        .attr("class", "number")
        .attr("x", (d, i) => i * stateColorWidth)
        .attr("y", stateColorHeight + 15)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "top")
        .attr("color", "black")
        .text((d, i) => (i === 0 ? 0 : d));
    // color legend rectangles
    mapColors.forEach((color, i) => {
        mapLegend
            .append("rect")
            .attr("x", i * stateColorWidth)
            .attr("y", 0)
            .attr("width", stateColorWidth)
            .attr("height", stateColorHeight)
            .attr("fill", color);
    });

    // draw map
    state.features = state.features.slice().sort(function (a, b) {
        return parseInt(a.id) - parseInt(b.id);
    });

    mapArea
        .selectAll("path.state")
        .data(state.features)
        .join("path")
        .attr("class", "state")
        .attr("d", projectPath)
        .attr("state", (st) => st.properties.name)
        .on("mouseover", mouseEntersState)
        .on("mouseout", mouseLeavesState);
    mapArea
        .append("path")
        .datum(stateMesh)
        .join("path")
        .attr("class", "state-outline")
        .attr("d", projectPath);

    // show tooltip on hover
    function mouseEntersState() {
        let stateDatum = d3.select(this).datum();

        let info = stateDatum.state + ": " + stateDatum.job_count;
        tooltipState.text(info);
        tooltip.attr("visibility", "");
    }
    // hide tooltip on leave
    function mouseLeavesState() {
        tooltipState.text("");
        tooltip.attr("visibility", "hidden");
    }

    function drawStates(hqdata_year) {
        hqdata_year = hqdata_year.slice().sort(function (a, b) {
            return a.state - b.state;
        });

        mapArea
            .selectAll("path.state")
            .data(hqdata_year)
            .join("path")
            .attr("class", "state")
            .style("fill", (d, i) =>
                d.job_count == 0 ? "white" : mapScale(d.job_count)
            );
    }

    // year range slider
    const sliderBack = sliderArea
        .append("rect")
        .attr("width", sliderWidth)
        .attr("height", sliderHeight)
        .attr("rx", sliderHeight / 2)
        .attr("fill", "lightgray");
    const sliderBar = sliderArea
        .append("rect")
        .attr("height", sliderHeight)
        .attr("rx", sliderHeight / 2)
        .attr("fill", mapColors[2]);

    // slider selection dot
    let yearDot = sliderArea
        .append("circle")
        .attr("r", 8.5)
        .attr("cy", sliderHeight / 2)
        .attr("fill", mapColors[3]);

    // text and dots
    sliderArea
        .append("text")
        .text("Click on a dot or a year to move the slider")
        .attr("x", 0)
        .attr("y", -10)
        .attr("alignment-baseline", "top");
    years.forEach((year, i) => {
        let x = 50 + i * sliderYearWidth;

        sliderArea
            .append("circle")
            .attr("id", "slider" + i)
            .attr("class", "slider")
            .attr("r", 5)
            .attr("cx", x)
            .attr("cy", sliderHeight / 2)
            .attr("fill", mapColors[0])
            .style("opacity", 0.8)
            .on("click", (e) => sliderClicked(i));
        sliderArea
            .append("text")
            .text(years[i])
            .attr("x", x)
            .attr("y", sliderHeight + 15)
            .style("font-size", 12)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "top")
            .on("click", (e) => sliderClicked(i));
    });

    function sliderClicked(i) {
        // update slider style
        let x = 50 + i * sliderYearWidth;
        yearDot.attr("cx", x);
        sliderBar.attr("width", x);
        // update map
        let year = years[0] + i * 20;
        selectedYear = year;

        var filter_hqData = hqData.filter(function (ct) {
            return ct.yearfloor == selectedYear;
        });

        drawStates(filter_hqData);
    }
    sliderClicked(4);
}
drawMap();

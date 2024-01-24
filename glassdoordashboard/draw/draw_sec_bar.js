/* bar chart */
const barChart = d3.select("svg#bar");
const chartMargin = { left: 50, right: 10, top: 50, bottom: 50 };
const chartWidth = 360;
const chartHeight = 340;
const barWidth = 20;

// buttons
industryColors = {
            "Information Technology": "#3a86ff",
            "Manufacturing": "#06d6a0",
            "Health Care":"#9b5de5",
            "Business Services":"#ff006e",
            "Finance and Insurance":"#ffbc42",
            "Aerospace & Defense":"#8f2d56",
            "Retail & Wholesale":"#dddf00",
            "Biotech & Pharmaceuticals": "red",
            "Other":"#444"
                }
const get_string_width = function(sec_string){
   return sec_string.length*8 + 10
}
const buttonWidth = {

    "Information Technology": get_string_width("Information Technology"),
    "Manufacturing": get_string_width("Manufacturing"),
    "Health Care":get_string_width("Health Care"),
    "Business Services":get_string_width("Business Services"),
    "Finance and Insurance":get_string_width("Finance and Insurance"),
    "Aerospace & Defense":get_string_width("Aerospace & Defense"),
    "Retail & Wholesale":get_string_width("Retail & Wholesale"),
    "Biotech & Pharmaceuticals": get_string_width("Biotech & Pharmaceuticals"),
    "Other":get_string_width("Other")
};
const buttonX = {
    "Information Technology": -10,
    "Biotech & Pharmaceuticals": -10 ,
    "Health Care": 250,
    "Business Services":  250,
    "Aerospace & Defense": -10,
    "Finance and Insurance": -10,
    "Manufacturing": 250,
    "Retail & Wholesale":250,
    "Other": 250 ,
};
const buttonY = {
    "Information Technology": 15,
    "Biotech & Pharmaceuticals": -10,
    "Health Care": 15,
    "Business Services": 65,
    "Aerospace & Defense": 65,
    "Finance and Insurance": 40,
    "Manufacturing": 40,
    "Other": -10,
    "Retail & Wholesale":40,

};
const buttonHeight = 20;

// bar chart components
let chartArea = barChart
    .append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
let barArea = chartArea
    .append("g")
    .attr("transform", `translate(0, ${chartHeight})`);
let buttonArea = barChart
    .append("g")
    .attr(
        "transform",
        `translate(20, ${chartMargin.top + chartHeight + chartMargin.bottom - 10})`
    );
chartArea
    .append("text")
    .text("# of Companies")
    .attr("x", -chartMargin.left + 10)
    .attr("y", -10);

let industryData = {};
// let selectedIndustry = 'All';
let selectedIndustryData = [0, 0, 0, 0, 0, 0, 0];

async function drawBarChart() {
    // store data by industry

    const chartData_new = await d3.csv(
        "data/bar_chart_data_new.csv",
        d3.autoType
    );

    alldata = chartData_new.filter(function (ct) {
        return ct.industry === "all";
    });

    // scales
    const barExtent = [0, d3.max(chartData_new, (d) => d["yearfloor"])];
    const chartScale = d3.scaleLinear().domain(barExtent).range([chartHeight, 0]);
    const yearScale = d3
        .scalePoint()
        .domain(years)
        .range([0, chartWidth])
        .padding(0.5);
    const percentScale = d3.scaleLinear().domain([0, 1]).range([chartHeight, 0]);

    // count axis and gridlines
    let leftAxis = d3.axisLeft(chartScale);
    let leftGridlines = d3
        .axisLeft(chartScale)
        .tickSize(-chartWidth - 10)
        .tickFormat("");
    chartArea
        .append("g")
        .style("font-size", "8px")
        .attr("class", "y axis")
        .attr("transform", "translate(-10,0)")
        .call(leftAxis);
    chartArea
        .append("g")
        .attr("class", "y gridlines")
        .attr("transform", "translate(-10,0)")
        .style("stroke-dasharray", "2, 2")
        .call(leftGridlines);

    // year axis
    let bottomAxis = d3.axisBottom(yearScale).ticks(yearScale.length);
    chartArea
        .append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(bottomAxis);

    // bars
    years.forEach((year, i) => {
        // all industry
        all_bar_interval = (alldata.filter(function (d) {
            return d.yearfloor === year;
        })[0]?.position_amt) ?? 0;
        chartArea
            .append("rect")
            .attr("class", "all")
            .attr("x", yearScale(year) - barWidth / 2)
            .attr("y", chartScale(all_bar_interval))
            .attr("rx", 3)
            .attr("width", barWidth)
            .attr("height", chartScale(0) - chartScale(all_bar_interval))
            .attr("fill", "lightgray")
            .style("opacity", 0.8);
        chartArea
            .append("text")
            .attr("class", "all")
            .text(all_bar_interval)
            .attr("x", yearScale(year))
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle");
    });

    // selected industry
    chartArea
        .selectAll("rect.industry")
        .data(years)
        .join("rect")
        .attr("class", "industry")
        .attr("x", (year) => yearScale(year) - barWidth / 2)
        .attr("rx", 3)
        .attr("width", barWidth)
        .attr("fill", "black")
        .style("opacity", 0.8);
    chartArea
        .selectAll("text.industry")
        .data(years)
        .join("text")
        .attr("class", "industry")
        .attr("x", (year) => yearScale(year))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

    // bars for selected industry
    function drawIndustry(selectedIndustry) {
        let industryBars = d3.selectAll("rect.industry");
        let industryValues = d3.selectAll("text.industry");
        let industryDatum = chartData_new.filter(function (fc) {
            return fc.industry == selectedIndustry;
        });

        // show industry bar and text
        industryBars
            .transition()
            .attr("y", (year, i) =>
                chartScale(
                    (industryDatum.filter(function (yr) {
                        return yr.yearfloor == year;
                    })[0]?.position_amt)?? 0


            ))  
            .attr(
                "height",
                (year) =>
                    chartScale(0) -
                    chartScale(
                        (industryDatum.filter(function (yr) {
                            return yr.yearfloor == year;
                        })[0]?.position_amt)?? 0
                    )
            )
            .attr("fill", industryColors[selectedIndustry])
            .attr("visibility", "");

        industryValues
            .text(
                (year, i) =>
                (industryDatum.filter(function (yr) {
                    return yr.yearfloor == year;
                })[0]?.position_amt)?? 0
            )
            .attr("class", "industry")
            .attr(
                "y",
                (year, i) =>
                    chartScale(
                        (industryDatum.filter(function (yr) {
                            return yr.yearfloor == year;
                        })[0]?.position_amt)?? 0
                    ) - 10
            )
            .attr("visibility", "");
    }



    const industries =  ["Information Technology",
                        "Manufacturing",
                        "Health Care",
                        "Business Services",
                        "Finance and Insurance",
                        "Aerospace & Defense",
                        "Retail & Wholesale",
                        "Biotech & Pharmaceuticals",
                        "Other"]

    industries.forEach((i) => {
        let button = buttonArea
            .append("g")
            .on("click", (e) => buttonClicked(i));
        button
            .append("rect")
            .attr("class", "button")
            .attr("id", i.substring(0, 3))
            .attr("x", buttonX[i])
            .attr("y", buttonY[i])
            .attr("rx", 10)
            .attr("width", buttonWidth[i])
            .attr("height", buttonHeight)
            .attr("stroke", industryColors[i]);
        button
            .append("text")
            .text(i)
            .attr("x", buttonX[i] + buttonWidth[i] / 2)
            .attr("y", buttonY[i] + buttonHeight / 2)
            .attr("class", "btnname")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .style("font-size", 14);
    });

    function buttonClicked(i) {
        drawIndustry(i);
        buttonArea.selectAll("rect.button").style("stroke-width", 1);
        buttonArea
            .select(`rect.button#${i.substring(0, 3)}`)
            .style("stroke-width", 2);
    }
    buttonClicked("Information Technology");
}
drawBarChart();
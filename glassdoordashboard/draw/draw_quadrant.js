


// quadrant plot
let qPlot = d3.select("svg#quadrant");
const qMargin = { top: 40, left: 20, right: 40, bottom: 10 };
const cardHeight = qPlot.attr("height");
const innerHeight = qPlot.attr("height") - qMargin.top - qMargin.bottom;
const innerWidth = qPlot.attr("width") - qMargin.right - qMargin.left;
const skills = ["python", "r", "spark", "aws", "excel"];
const jitterScale = 16;
let salaryScaler;
let rateScaler;
let positionTable;

// tooltip for selected job posting
let tooltipQplot = qPlot
    .append("g")
    .attr(
        "transform",
        `translate(${qMargin.left}, ${qMargin.top + innerHeight / 2 + qMargin.top * 2
        })`
    )
    .attr("visibility", "hidden");
let tooltipRect = tooltipQplot
    .append("rect")
    .attr("rx", 5)
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 200)
    .attr("height", 90)
    .attr("fill", mapColors[1])
    .style("opacity", 0.7);
let tooltipTitle = tooltipQplot
    .append("text")
    .text("Data Scientist")
    .attr("x", 10)
    .attr("y", 20)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "top")
    .style("font-size", 14)
    .style("font-weight", "bold");
let tooltipCompany = tooltipQplot
    .append("text")
    .text("Company")
    .attr("x", 10)
    .attr("y", 40)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "top")
    .style("font-size", 14);
let tooltipIndustry = tooltipQplot
    .append("text")
    .text("Industry")
    .attr("x", 10)
    .attr("y", 60)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "top")
    .style("font-size", 14);
let tooltipSalary = tooltipQplot
    .append("text")
    .text("Avg Salary")
    .attr("x", 10)
    .attr("y", 80)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "top")
    .style("font-size", 14);

let drawQuadrant = async function () {
    positionTable = await d3.csv("data/search_back.csv", d3.autoType);
    const salaryExt = d3.extent(positionTable, (d) => d.avg_salary);
    const rateExt = d3.extent(positionTable, (d) => d.Rating);
    axis = qPlot
        .append("g")
        .attr("transform", `translate(${qMargin.left},${qMargin.top})`)
        .lower();

    // rating on x axis
    rateScaler = d3.scaleLinear().domain([1, 5]).range([0, innerWidth]);
    let xAxis = d3.axisBottom(rateScaler);
    let xGridlines = d3
        .axisBottom(rateScaler)
        .tickSize(-innerHeight)
        .tickFormat("");
    axis
        .append("g")
        .style("font-size", "8px")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${innerHeight / 2})`)
        .call(xAxis);
    axis
        .append("g")
        .attr("class", "x gridlines")
        .attr("transform", `translate(0,${innerHeight})`)
        .style("stroke-dasharray", "2, 2")
        .call(xGridlines);

    // salary on yaxis
    salaryScaler = d3.scaleLinear().domain([15, 255]).range([innerHeight, 0]);
    let yAxis = d3
        .axisLeft(salaryScaler)
        .ticks(10)
        .tickValues(d3.range(15, 256, 24))
        .tickFormat((v) => v + "K");
    let yGridlines = d3
        .axisLeft(salaryScaler)
        .ticks(10)
        .tickValues(d3.range(15, 256, 24))
        .tickSize(-innerWidth)
        .tickFormat("");
    axis
        .append("g")
        .style("font-size", "8px")
        .attr("class", "x axis")
        .attr("transform", `translate(${innerWidth / 2},0)`)
        .call(yAxis);
    axis
        .append("g")
        .attr("class", "x gridlines")
        .style("stroke-dasharray", "2, 2")
        .call(yGridlines);

    // axis legend
    axis
        .append("text")
        .attr("x", innerWidth + 5)
        .attr("y", innerHeight / 2)
        .attr("text-anchor", "left")
        .text("Rating");
    axis
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text("Avg Salary");
};
drawQuadrant();

// matched job postings
let jobs = qPlot
    .append("g")
    .attr("transform", `translate(${qMargin.left},${qMargin.top})`);
let noMatch = jobs
    .append("text")
    .text("No Position Matched Your Search!")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight / 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("visibility", "hidden")
    .style("fill", mapColors[4])
    .style("font-family", "Impact")
    .style("font-size", 18)
    .style("letter-spacing", 0.5);

function handleSubmit(location) {
    let prefSkills = [];
    let prefState = "";
    let prefSalary = "";
    let prefCompanySize = "";
    let prefIndustries = [];
    // get skills
    const skillCheckboxes = document.querySelectorAll(
        'input[name="skills"]:checked'
    );
    skillCheckboxes.forEach((checkbox) => {
        prefSkills.push(checkbox.value);
    });
    // get preferred location (dropdown)
    prefState = document.getElementById("states").value;
    // get preferred salary
    const salaryRadios = document.querySelectorAll(
        'input[name="salary"]:checked'
    );
    if (salaryRadios.length > 0) {
        prefSalary = salaryRadios[0].value;
    }
    // get preferred company size
    const companySizeRadios = document.querySelectorAll(
        'input[name="companySize"]:checked'
    );
    if (companySizeRadios.length > 0) {
        prefCompanySize = companySizeRadios[0].value;
    }
    // get preferred indistries
    const industryCheckboxes = document.querySelectorAll(
        'input[name="industries"]:checked'
    );
    industryCheckboxes.forEach((checkbox) => {
        prefIndustries.push(checkbox.value);
    });

    // filter by location, company size, industry, salary, and required skills
    let filtered = positionTable
        .filter((job) => job.State_Acro === prefState)
        .filter((job) => job.Size_category === prefCompanySize)
        .filter((job) => prefIndustries.includes(job.Sector))
        .filter((job) => job.Salary_category === prefSalary)
        .filter((job) => {
            let matched = true;
            skills.forEach((skill) => {
                if (job[skill] === 1 && !prefSkills.includes(skill)) {
                    matched = false;
                }
            });
            return matched;
        });
    noMatch.attr("visibility", filtered.length === 0 ? "" : "hidden");
    axis.attr("opacity", filtered.length === 0 ? 0.5 : 1);
    console.log(prefState);
    console.log(prefCompanySize);
    console.log(prefIndustries);
    console.log(prefSalary);
    console.log(prefSkills);
    // draw one point for each matched job posting
    let points = jobs
        .selectAll("circle.job")
        .data(filtered)
        .join("circle")
        .attr("class", "job")
        .attr("cx", (d) => rateScaler(d.Rating))
        .attr("cy", (d) => salaryScaler(d.avg_salary))
        .attr("r", 6)
        .attr("fill", mapColors[4])
        .on("mouseover", mouseEntersJob)
        .on("mouseout", mouseLeavesJob);

    function mouseEntersJob() {
        // highlight selected job
        d3.select(this).transition().attr("r", 10);

        // show tooltip
        let jobDatum = d3.select(this).datum();
        let jobTitle = jobDatum["Job Title"];
        // only use prefix if job title is too long
        if (jobTitle.length > 40) {
            const commaIndex = jobTitle.indexOf(",");
            if (commaIndex !== -1) {
                jobTitle = jobTitle.substring(0, commaIndex);
            } else {
                const secondSpaceIndex = jobTitle.indexOf(
                    " ",
                    jobTitle.indexOf(" ") + 1
                );
                if (secondSpaceIndex !== -1)
                    jobTitle = jobTitle.substring(0, secondSpaceIndex);
            }
        }
        tooltipTitle.text(jobTitle);
        tooltipCompany.text("Company: " + jobDatum["Company Name"]);
        tooltipIndustry.text(jobDatum["Sector"]);
        tooltipSalary.text("Avg Salary: $" + jobDatum["avg_salary"] + "K");

        let w = d3.max([
            tooltipTitle.node().getBBox().width,
            tooltipCompany.node().getBBox().width,
            tooltipIndustry.node().getBBox().width,
            tooltipSalary.node().getBBox().width,
        ]);
        tooltipRect.attr("width", w + 30);
        tooltipQplot.attr("visibility", "");
    }

    function mouseLeavesJob() {
        // remove highlight
        d3.select(this).transition().attr("r", 6);

        // hide tooltip
        tooltipTitle.text("");
        tooltipCompany.text("");
        tooltipRect.attr("width", 0);
        tooltipQplot.attr("visibility", "hidden");
    }
}

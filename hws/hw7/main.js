

let svg = d3.select('div.horizontal-container')  // or select an appropriate container element
    .append('svg')
    .attr('height', '100%')
    .attr('width', '100%')
    .attr('class','horizontal-container')
    .style('margin', '10px');

const margin = { top: 10, right: 0, bottom: 0, left:0 };
let plotWidth = svg.node().clientWidth/2


let plotHeight = svg.node().clientHeight 

let plot = svg.append('g')

async function draw_map(ph) {
    let nyincome = await d3.json(ph);
    let zips = topojson.feature(nyincome,nyincome.objects.zip_codes);
    let zipsMesh = topojson.mesh(nyincome,nyincome.objects.zip_codes);
    let stateMesh = topojson.mesh(nyincome,nyincome.objects.state);

    var projection = d3.geoMercator().fitSize([plotWidth, plotHeight], zips);
    var zipcode_path = d3.geoPath().projection(projection);

    let properties = zips.features.map(d=>d['properties']['median_income'])
    let incomeExt = d3.extent(properties)
    let colorPlatte = ['#3A606E','#607B7D','#828E82','#AAAE8E','#E0E0E0']
    let colorQuanScale = d3.scaleQuantile().domain(incomeExt).range(colorPlatte)
    let getThreshold = colorPlatte.map(d=>colorQuanScale.invertExtent(d).toString().replace(',',' ~ '))

    plot.selectAll("path.zips").data(zips.features)
        .join("path")
        .attr("class", "zips")
        .style('fill', d => colorQuanScale(d.properties['median_income']))
        .attr("d", zipcode_path)

    plot.append('path').datum(zipsMesh)
        .join('path')
        .attr('class','mesh')
        .attr("d", zipcode_path)
    
    plot.append('path').datum(stateMesh)
        .join('path')
        .attr('class','stateMesh')
        .attr("d", zipcode_path)

    let bell_tower = {
        "type": "Point",
        "coordinates": [42.4476, -76.4850]
    }

    let locate = projection([-76.4850,42.4476])
    console.log(zipcode_path(bell_tower));

    plot.append('circle')
        .attr('class','belltower_locate')
        .attr('cx',locate[0])
        .attr('cy',locate[1])
        .attr('r',6)

    plot.append('text')
        .attr('class', 'belltower_locate')
        .attr('x', locate[0]+10)
        .attr('y', locate[1])
        .text('Ithaca');

    plot.style('visibility', 'hidden');
    // let svgElement = plot.node()
    // let svgString = new XMLSerializer().serializeToString(svgElement);
    // return svgString
    

}

draw_map('./hw7/ny_income.topo.json')

function show_map_plot(){
    plot.style('visibility', 'visible');
    

}
// ld_plot('./ny_income.topo.json')

let tag = d3.select('ul#tag');
let width = 770
let height = 990

const margin = { top: 10, right: 10, bottom: 50, left:50 };
let plotWidth = width - margin.top - margin.bottom;
let plotHeight = height- margin.left - margin.right;

let svg = d3.select('body')  // or select an appropriate container element
    .append('svg')
    .attr('id', 'choropleth')
    .attr('height', height)
    .attr('width', width)
    .style('margin', '20px');



let plot = svg.append('g').attr('transform', `translate(${ margin.left },${ margin.top })`);

async function draw_pic(ph) {
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

    getThreshold.forEach(d=>{ tag.append('li').text(d) })
    
    plot.style('visibility', 'hidden');
    // let svgElement = plot.node()
    // let svgString = new XMLSerializer().serializeToString(svgElement);
    // return svgString

}
draw_pic('testhw7/ny_income.topo.json');

function show_map_plot(){

     plot.style('visibility', 'visible');
}


// ld_plot('./ny_income.topo.json')


let bg = d3.select('div.horizontal-container')  // or select an appropriate container element
            .append('svg')
            .attr('height', '100%')
            .attr('width', '100%')
            .attr('class','horizontal-container')
            .style('margin', '10px');

const width = bg.node().clientWidth
const height = bg.node().clientHeight+100

let network_bg = bg.append('g');
let network_layer = network_bg.append('g');


async function draw_network(path_game_throne){
    
    const gameofthrone = await d3.json(path_game_throne);
    
    var nodes = gameofthrone.nodes;
    var edges = gameofthrone.edges;

    let EdgeList = edges.map(d=>d.weight)

    let weight_extent = d3.extent(EdgeList)
    
    let weight_sclaer = d3.scaleLinear()
                      .domain(weight_extent)
                      .range([1,5])

    let affiliation_scaler = d3.scaleOrdinal(d3.schemeCategory10);
    //init new set to store affilication types
    let affiliation_ordinal = new Set(nodes.map(d=>d.Affiliation));
    // console.log(affiliation_ordinal)

    links = edges.map(function(d){
        return {'source':d.sourceIndex,'target':d.targetIndex}})

    var sim = d3.forceSimulation() //add  attribute to links objects
              .nodes(nodes)
              .force("links", d3.forceLink()  
                                      .links(links)          
                                      .id( node => node['index'] ) )
              .force("repulse", d3.forceManyBody().strength(-20) ) 
              .force("center", d3.forceCenter(width/2.0, height/2.0)) 
              .on("tick", render);
    
              function render() {
    let lines = network_layer.selectAll('line.link').data(links)
                                .join(enter => enter.append('line')
                                                    .attr('class','link')
                                                    .style('opacity',1)                                                       
                                                    .attr("stroke","#333") 
                                                    )
                            .attr('x1',d=> d.source.x)
                            .attr('x2',d=> d.target.x)
                            .attr('y1',d=> d.source.y)
                            .attr('y2',d=> d.target.y)
                            .attr('stroke-width',d=>{return  weight_sclaer(d.source.Weight)}) 
                            // .attr('stroke-width',d=>{return  weight_sclaer(d.target.Weight)}) 

    let circles = network_layer.selectAll('circle.node').data(nodes)
                                .join( enter => enter.append('circle')
                                                    .attr("r", 8)
                                                    .attr("cx", 0)
                                                    .attr("cy", 0)
                                                    .attr('class','node')
                                                    .attr("stroke-width", 1)
                                                    .attr("stroke", "black") //black
                                                    .attr('fill',d=> {return affiliation_scaler(d.Affiliation)})
                                                    .call( d3.drag().on("start",dragstart)
                                                                    .on("drag",dragging)
                                                                    .on("end",dragend) ))
                                .attr("transform", d => `translate(${d.x},${d.y})`);
                                                                                            
    }
    render();
     // Handle drag events and add a nice text label
  var label = network_layer.append("text").attr("id","label");
  var character = network_layer.append("text").attr("id","character");

    function dragstart(event, d) {

    if (!event.active) {

        sim.alphaTarget(0.1).restart();
    }

    character.text(d.Name)
    // label.text(d.index);

    d.fx = event.x;
    d.fy = event.y;
    
    }
    function dragging(event, d) {
    // Continue dragging
    
    d.fx = event.x;
    d.fy = event.y;
    // label.attr("x",event.x -30 ).attr("y",event.y-5);
    character.attr("x",event.x -30).attr("y",event.y-35);
    }
    function dragend(event, d) {
    // End dragging a circle, make sure the simulation has enough alpha left to fix things afterwards
    if (!event.active) {
        sim.alphaTarget(0); // Allow the simulation to cool completely again
        label.text("");
        character.text("");
    }

    // Remember to null out your .fx and .fy so that d3 can begin simulating the dragged point once more
    d.fx = null;
    d.fy = null;
}
network_bg.style('visibility','hidden')

}
draw_network('GameofThroneNetwork/thrones-cooccur.json');

function show_network_plot(){
    
    network_bg.style('visibility', 'visible');
     
}
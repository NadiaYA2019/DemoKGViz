//document.addEventListener("DOMContentLoaded", mapFirststep);


SPARQL = function(o) {
    this.query = function(q) {
      return $.ajax({
        url: o.endpoint,
        accepts: {json: "application/sparql-results+json"},
        data: {query: q, apikey: o.apikey},
        dataType: "json"
      });
    };
  };

var endpoint = new SPARQL({ 
    apikey: "YOUR-API-KEY-HERE", 
    endpoint: "http://weakg.i3s.unice.fr/sparql"
});

//var map = L.map('map').setView([51.505, -0.09], 13);



function mapFirststep() {
    console.log("salut")
    const width = 550, height = 550;
    
    // Create a path object to manipulate geo data
    const path = d3.geoPath();
    
    // Define projection property
    const projection = d3.geoConicConformal() // Lambert-93
    .center([2.454071, 46.279229]) // Center on France
    .scale(2600)
    .translate([width / 2, height / 2]);
    
    path.projection(projection); // Assign projection to path object
    
    // Create the DIV that will contain our map
    const svg = d3.select('#chart').append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMid");
    
    // Append the group that will contain our paths
    const deps = svg.append("g");
    
    // Append a DIV for the tooltip
    let div = d3.select("body").append("div")
                 .attr("class", "map-tooltip")
    d3.json("./data/regions.json", function(geojson) {
        console.log(geojson)
    // Bind the entry to a SVG path
    console.log(geojson)
    deps.selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr('class', 'department')
    .attr("d", path)
    .on("mouseover", function(event, d) {
    div.transition();
    div.html( "Région : " + geojson.features[d].properties.nom )
    .style("left", (event.pageX + 30) + "px")
    .style("top", (event.pageY - 30) + "px");
    })
    .on("click", function(event, d) {
        console.log(endpoint.query(buildQuery(geojson.features[d].properties.code)))  
        let div = d3.select("body").append("div")
            
    })


    });
   

    }

    function buildQuery(insee) {
        var queryStations = `PREFIX dct: <http://purl.org/dc/terms/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX wdt: <http://www.wikidata.org/prop/direct/>
        PREFIX geosparql:  <http://www.opengis.net/ont/geosparql#> 
        SELECT distinct * WHERE
        {
        ?station rdfs:label ?stationName; dct:spatial [ wdt:P131 [rdfs:label ?label ; wdt:P2585 '`+ insee +`']];  geosparql:hasGeometry [ geosparql:asWKT ?coordinates].
        }
        `
        return queryStations

    }
   



    
    document.addEventListener("DOMContentLoaded", mapFirststep);
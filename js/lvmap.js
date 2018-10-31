var leafletMap = L.map('map').setView([36.18, -115.17], 10);
L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',{
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
}).addTo(leafletMap);


var svgMap = d3.select(leafletMap.getPanes().overlayPane).append("svg")
  .attr("width", 2000).attr("height", 2500);
var circleGroup = svgMap.append("g").attr("class", "leaflet-zoom-hide");


d3.json("data/yelp_LasVegas_business.json", function(error, dataset) {
    if (error)
        throw error;

    // Modification on the data
    dataset = dataset.filter(function(d) {
        // There is one weird entry that does not
        // have longitude
        return !isNaN(d.longitude) & !isNaN(d.latitude);
    })
    dataset.forEach(function(d) {
        d.LatLng = new L.LatLng(d.latitude, d.longitude);
    })

    function draw_circle() {
        var circleSel = circleGroup.selectAll("circle")
            .data(dataset);
        circleSel.enter()
            .append("circle")
            .attr("pointer-events", "visible")
            .attr("class", "circleMap")
            .attr("r", 7)
          .merge(circleSel) // Enter + Update
            .attr("cx", d => leafletMap.latLngToLayerPoint(d.LatLng).x)
            .attr("cy", d => leafletMap.latLngToLayerPoint(d.LatLng).y);
    }
    leafletMap.on("viewreset", draw_circle);
    draw_circle(dataset);
})


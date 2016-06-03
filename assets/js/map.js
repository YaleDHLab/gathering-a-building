// store the basemap globally so layers can be updated
var globalMap = '';

// initialize the map
var initializeMap = function() {

  // specify the coordinates on which to center the map initially
  centerCoordinates = new L.LatLng(41.307, -72.928);

  // create the map object itself
  var map = new L.Map("map", {
    center: centerCoordinates,
    zoom: 17,
    zoomControl: false
  });

  L.control.zoom({
    position: 'topright',
    zoom: 17,
    maxZoom: 20,
    minZoom: 12,
  }).addTo(map);

  map.addLayer(new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }));

};
  

// store the basemap globally so layers can be updated
var globalMap = '';

// initialize the map
var initializeMap = function() {

  // specify the coordinates on which to center the map initially
  centerCoordinates = new L.LatLng(48.85, 7.85);

  // create the map object itself
  var map = new L.Map("map", {
    center: centerCoordinates,
    zoom: 5,
    maxZoom: 10,
    minZoom: 3,
  });
};
  

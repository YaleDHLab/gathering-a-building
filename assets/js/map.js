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

  // position the zoom controls in the top right hand corner
  L.control.zoom({
    position: 'bottomright',
    zoom: 17,
    maxZoom: 20,
    minZoom: 12,
  }).addTo(map);

  // use the cartodb basemap
  map.addLayer(new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }));

  // add listener for click of a map overlay option
  $(".map-overlay-1, .map-overlay-2, .map-overlay-3").on("click", function() {
    selectOverlay($(this));
  });

  // create a click on the first map overlay option
  $(".map-overlay-1").click();
};

// create mapping from map object id to label to display
var mapOverlayLabels = {
  "1": "Doolittle Plan",
  "2": "Snider Plan",
  "3": "Pauley Plan"
}

var selectOverlay = function(selectedOption) {
  $(".map-overlay").removeClass("active");
  selectedOption.addClass("active");
  
  // use the appropriate label as the map selection label
  var selectedClasses = selectedOption.attr('class');
  var selectedId = selectedClasses.split(" map-overlay-")[1].split(" ")[0];
  $(".map-selection-label-content").html( mapOverlayLabels[selectedId] );
};
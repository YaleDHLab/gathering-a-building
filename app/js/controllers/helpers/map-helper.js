var L       = require('leaflet');
var request = require('superagent');
var $       = require('jquery');

module.exports = {

  /***
  *
  * Function to build the map overlay options
  *
  ***/

  buildMapOverlayOptions: function($scope) {

    // the dropdown options are articulated in $scope.mapOverlays
    $scope.overlayOptions = [];
    for (var i=0; i<Object.keys($scope.mapOverlays).length; i++) {

      // the display option should contain the content of
      // year - label keys.
      var year = $scope.mapOverlays[i].year;
      var label = $scope.mapOverlays[i].label;
      var overlayLabel = year + " - " + label;

      $scope.overlayOptions.push({
        "label": overlayLabel,
        "id": i
      });
    };
  },

  /***
  *
  * Function to initialize a leaflet map
  *
  ***/

  initializeMap: function() {

    // specify the coordinates on which to center the map initially
    var centerCoordinates = new L.LatLng(41.307, -72.928);

    // create the map object itself
    var map = new L.Map("map", {
      center: centerCoordinates,
      zoom: 17,
      zoomControl: false
    });

    // position the zoom controls in the bottom right hand corner
    L.control.zoom({
      position: 'bottomright',
      zoom: 16,
      maxZoom: 20,
      minZoom: 12,
    }).addTo(map);

    // use the cartodb basemap
    map.addLayer(new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }));

    return map;
  },

  /***
  *
  * Helper function to add a vector overlay to a Leaflet map
  *
  ***/

  addVectorOverlay: function(map, vectorJsonUrl) {

    // request json that describes building boundaries
    request
      .get(vectorJsonUrl)
      .set('Accept', 'application/json')
      .end(function(err, res){

        var rawJson = res.body;

        // Revove any extant building vector overlays from the map.
        // To do so, get a reference to the vectors, then fade them out.
        // One second after that function completes, remove the objects
        // from the DOM.
        var overlayBoundingBox = $(".overlay-bounding-box");
        overlayBoundingBox.addClass("fade-out");
        setTimeout(function(){
          overlayBoundingBox.remove(); },
        1000);

        // each member of this array describes a building
        for (var i=0; i<rawJson.length; i++) {
          var buildingJson = rawJson[i];
          if (buildingJson) {

            // add the building to the map
            var polyline = new L.GeoJSON(buildingJson, {
                className: 'overlay-bounding-box animated fade-in',
                weight: 2,
                fillOpacity: .85
              }
            ).addTo(map);
          }

        }
    });
  },

  /***
  *
  * Add an image overlay to a Leaflet map
  *
  ***/

  addImageOverlay: function(map, imageTileUrl) {

    // remove the old imageOverlay layer
    $(".imageOverlay").remove();

    var imageOverlay = L.tileLayer(imageTileUrl, {
      attribution: '<a href="http://web.library.yale.edu/dhlab">DHLab@Yale</a>',
      opacity: .6,
      // set max zoom to prevent requests for tiles that don't exist
      maxZoom: 20,
      tms: true,
      // also set bounds to prevent 404's from appearing when
      // the client requests image tiles from relevant zoom levels
      // if those tiles don't exist. Bounds retrieved from
      // gdalinfo {{geotiff.tif}}
      bounds: [
        L.latLng(41.3183532,-72.9385611),
        L.latLng(41.2950316, -72.8997637)
      ]
    }).addTo(map);

    // add a class to the image tile layer for dynamic css styling
    $(imageOverlay.getContainer()).addClass('imageOverlay');

  },

  /***
  *
  * Function pair to show/hide the text column
  *
  ***/

  showTextColumn: function($scope) {
    $scope.textColumn.display = "1";
    $scope.footer.right.display = "<i class='fa fa-chevron-circle-up'></i>";
  },

  hideTextColumn: function($scope) {
    $scope.textColumn.display = "0";
    $scope.footer.right.display = "<i class='fa fa-chevron-circle-down'></i>";
  }

}
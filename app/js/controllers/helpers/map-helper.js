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

      // skip the overlay option for the section introduction,
      // which will always have id == 0
      if (i != 0) {
        // the display option should contain the content of
        // year - label keys.
        var year = $scope.mapOverlays[i].year;
        var label = $scope.mapOverlays[i].label;
        var overlayLabel = year + " - " + label;

        $scope.overlayOptions.push({
          "label": overlayLabel,
          "id": i
        });

      }
    };
  },

  /***
  *
  * Function to initialize a leaflet map
  *
  ***/

  initializeMap: function($scope, callback) {

    // specify the coordinates on which to center the map initially
    var centerCoordinates = new L.LatLng(41.307, -72.928);

    // create the map object itself
    var map = new L.Map("map", {
      center: centerCoordinates,
      zoom: 16,
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
  * Add a triangle representing the building site to the map
  *
  ***/

  addBuildingSiteVector: function(map, $timeout) {
    // add the building to the map
    var siteLatLongs = [
      L.latLng(41.316054, -72.924489), // top right
      L.latLng(41.313991, -72.9251), // bottom right
      L.latLng(41.315006, -72.926248), // bump along edge from bottom right to top left
      L.latLng(41.316038, -72.92701), // top left
      L.latLng(41.316118, -72.92509) // bump along top
    ];

    var buildingSite = new L.Polygon(siteLatLongs, {
        className: 'building-site',
        weight: 1,
        fillOpacity: .75,
        opacity: 1,
        fillColor: "#ffffff",
        color: "#000000"
      }
    ).addTo(map);

  },

  /***
  *
  * Helper function to add a vector overlay to a Leaflet map
  *
  ***/

  addVectorOverlay: function(map, vectorJsonUrl, $timeout) {

    // initialize the custom buildings counter so we can store
    // the index position of custom buildings for each map
    var customBuildingIndex = 0;

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
        $timeout(function(){
          overlayBoundingBox.remove(); },
        1000);

        // each member of this array describes a building
        for (var i=0; i<rawJson.length; i++) {
          var buildingJson = rawJson[i];
          try {
            var cartodbId = rawJson[i].cartodb_id;
            if (cartodbId) {
              var buildingId = cartodbId;
            } else {
              var buildingId = 'custom-' + customBuildingIndex;
              customBuildingIndex += 1;
            }
          } catch (err) {}

          if (buildingJson) {

            // add the building to the map
            var polyline = new L.GeoJSON(buildingJson, {
                className: 'overlay-bounding-box animated fade-in building-id-' + buildingId,
                weight: 1,
                fillOpacity: .85,
                opacity: 1
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

  addImageOverlay: function($scope, map, imageTileUrl) {

    // remove the old imageOverlay layer
    $(".imageOverlay").remove();

    var imageOverlay = L.tileLayer(imageTileUrl, {
      attribution: '<a href="http://web.library.yale.edu/dhlab">DHLab@Yale</a>',
      opacity: ($scope.opacitySlider.value/100),
      // set max zoom to prevent requests for tiles that don't exist
      maxZoom: 20,
      tms: true,
      // to prevent 404's from appearing when the client requests
      // non-extant image tiles, one can create a bounds property
      // below. To do so, one needs to know the full extent of all images.
      // Bounds can be retrieved from gdalinfo {{geotiff.tif}}
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
  },

  /***
  *
  * Function to initialize the opacity slider
  *
  ***/

  initializeOpacitySlider: function($scope, $timeout) { 

    // add an opacity slider with floot, ceiling, and initial value
    $scope.opacitySlider = {
      value: 100,
      options: {
        floor: 0,
        ceil: 100
      }
    };
  }

}
var angular          = require('angular');
var request          = require('superagent');
var $                = require('jquery');
var controllerHelper = require('../helpers/controller-helper');
var mapHelper        = require('../helpers/map-helper');

angular.module('HistoricalGeographyController', [])
  .controller("historicalGeographyController", [
      "$scope", "$http", "$timeout", "$location", "backgroundStyle",
  function($scope, $http, $timeout, $location, backgroundStyle) {

    /***
    *
    * Define the data to be passed to the view on user interaction with the page
    *
    ***/

    var endpoint = "./json/historical-geography.json";

    request
      .get(endpoint)
      .set('Accept', 'application/json')
      .end(function(err, res){
        if (err) {console.log(err)};

        var data = res.body;
        $scope.textColumn = data;

        $scope.mobile = {
          "mobileControlsLeft": "/templates/partials/historical-geography/overlay-select-dropdown.html",
          "mobileControlsLeftClass": "",
          "mobileControlsRight": "/templates/partials/historical-geography/opacity-slider.html",
          "mobileControlsRightClass": ""
        }

        $scope.mapOverlays = {
          "0": {
            "year": 1748,
            "label": "Wadsworth Plan",
            "imageOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-tiles/1748_Wadsworth_Plan-NewHaven_1806-Kensett-engr_Beinecke_15675071-GEO1/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-buildings/combined_buildings_1753.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          },
          "1": {
            "year": 1748,
            "label": "Wadsworth Plan",
            "imageOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-tiles/1748_Wadsworth_Plan-NewHaven_1806-Kensett-engr_Beinecke_15675071-GEO1/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-buildings/combined_buildings_1753.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          },
          "2": {
            "year": 1824,
            "label": "Doolittle Plan",
            "imageOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-tiles/1824_Doolittle_Plan-of-New-Haven_Beinecke_156750741/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-buildings/combined_buildings_1835.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          },
          "3": {
            "year": 1849,
            "label": "Buckingham Map",
            "imageOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-tiles/1849_Buckingham_NH_156913731_Geo4/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-buildings/combined_buildings_1850.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          },
          "4": {
            "year": 1874,
            "label": "Lyman/Butler Map",
            "imageOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-tiles/1874_Benham_15691396_v2_GEO/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-buildings/combined_buildings_1870.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          },
          "5": {
            "year": 1893,
            "label": "Hill Map",
            "imageOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-tiles/1893_Hill_Beinecke_156914371-Geo2/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-buildings/combined_buildings_1894.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          },
          "6": {
            "year": 1911,
            "label": "Atlas of New Haven",
            "imageOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-tiles/1911_New-Haven-Atlas_Sanborn_cr/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-buildings/combined_buildings_1912.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          },
          "7": {
            "year": 1937,
            "label": "HOLC Map",
            "imageOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-tiles/1937_HOLC_TIFF/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-buildings/combined_buildings_1940.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          },
          "8": {
            "year": 1973,
            "label": "Sanborn Map",
            "imageOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-tiles/1973_New_Haven_Sanborn_Mosaic_2/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-buildings/combined_buildings_1970.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          },
          "9": {
            "year": 2010,
            "label": "Contemporary Map",
            "imageOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-tiles/2010_New-Haven-Plan_Neighborhoods_Mosaic3/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://lab-apps.s3.amazonaws.com/gathering-a-building/map-buildings/combined_buildings_2000.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          }
        }

        /***
        *
        * Click listener that shows/hides the text column
        *
        ***/

        $scope.toggleTextColumn = function() {
          $scope.textColumn.display === "1"?
            mapHelper.hideTextColumn($scope) :
            mapHelper.showTextColumn($scope);
        }

        /***
        *
        * Click listener that selects the overlay image/vector data
        * to display
        *
        ***/

        $scope.setOverlayOption = function(overlayOption) {
          $location.hash(overlayOption.id);
          $scope.selectOverlay(overlayOption.id);
        };

        /***
        *
        * Click listener that toggles the vector overlay
        *
        ***/

        $scope.toggleVectorOverlay = function() {
          $(".vector-overlay-toggle-button").toggleClass("active");
          $(".overlay-bounding-box").toggleClass("hidden");
        };

        /***
        *
        * Function that sets the currently selected section on
        * click of map button; exposed in the ui
        *
        ***/

        $scope.selectActiveSection = function(selectedId) {
          $location.hash(selectedId);
          $scope.selectOverlay(selectedId);
        }

        /***
        *
        * Updates the map to display the user-selected map overlay
        *
        ***/

        $scope.selectOverlay = function(selectedId) {
          $scope.selectedOverlay = selectedId;

          // indicate in the selection box which id is currently selected
          $(".map-overlay").removeClass("active");
          $(".map-overlay-" + selectedId).addClass("active");

          // update the footer state to show the selected overlay id text
          $scope.footer = {
            "left": {
              "display": $scope.mapOverlays[selectedId]["label"]
            },
            "right": {
              "display": "<i class='fa fa-chevron-circle-up'></i>",
              "url": "/#/",
              "onClick": "toggleTextColumn()"
            },
             "style": "full"
          };

          // add the image tile overlay and vector overlay
          mapHelper.addImageOverlay($scope, map, $scope.mapOverlays[selectedId]["imageOverlayUrl"]);
          mapHelper.addVectorOverlay(map, $scope.mapOverlays[selectedId]["vectorOverlayUrl"], $timeout);

          // set the appropriate brand icon color and navbar button color
          var section = $scope.mapOverlays[selectedId];
          controllerHelper.updateBackgroundStyle($scope, backgroundStyle, section);

          // add an event listener for the slider
          $scope.$on("slideEnded", function() {
            var currentOpacity = $scope.opacitySlider.value;
            var opacityPercent = currentOpacity / $scope.opacitySlider.options.ceil;
            $(".imageOverlay").css("opacity", opacityPercent);
          });

        };

        /***
        *
        * Identify a function that calls an update function
        * if the user has scrolled to a new section
        *
        ***/

        $scope.getSelectedSection = function(sectionId) {
          if (sectionId !== $scope.selectedSectionId) {
            $scope.selectedSectionId = sectionId;
            selectSection();
          }
        }

        /***
        *
        * Function that updates the background image(s),
        * links, and other page assets as a function of
        * user scroll
        *
        ***/

        var selectSection = function() {
          var sectionId = String($scope.selectedSectionId);
          $scope.selectOverlay(sectionId);
          controllerHelper.updateBodyOpacity($timeout, 1);
        }

        /***
        *
        * Initialize the map overlay and select the first overlay option
        *
        ***/

        mapHelper.initializeOpacitySlider($scope, $timeout);
        mapHelper.buildMapOverlayOptions($scope);
        var map = mapHelper.initializeMap($scope);

        // add a vector overlay that reprsents the work site
        mapHelper.addBuildingSiteVector(map, $timeout);

        $scope.selectOverlay(0)
        controllerHelper.updateBodyOpacity($timeout, 1);

    });
  }
]);
var angular          = require('angular');
var request          = require('superagent');
var $                = require('jquery');
var controllerHelper = require('../helpers/controller-helper');
var mapHelper        = require('../helpers/map-helper');

angular.module('HistoricalGeographyController', [])
  .controller("historicalGeographyController", [
      "$scope", "$http", "$timeout", "backgroundStyle",
  function($scope, $http, $timeout, backgroundStyle) {

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
            "year": 1753,
            "label": "Wadsworth Plan",
            "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1748_Wadsworth_Plan-NewHaven_1806-Kensett-engr_Beinecke_15675071-GEO1/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/buildings_json/combined_buildings_1753.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          },
          "1": {
            "year": 1802,
            "label": "Plan of New Haven",
            "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1802_Plan-New-Haven_Biencke_105622451_GEO1/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/buildings_json/combined_buildings_1802.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          },
          "2": {
            "year": 1824,
            "label": "Doolittle Plan",
            "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1824_Doolittle_Plan-of-New-Haven_Beinecke_156750741/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/buildings_json/combined_buildings_1835.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          },
          "3": {
            "year": 1849,
            "label": "Buckingham Plan",
            "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1849_Buckingham_NH_156913731_Geo4/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/buildings_json/combined_buildings_1850.json",
            "backgroundStyle": {
              "navigationButton": "dark",
              "brandIcon": "dark"
            }
          },
          "4": {
            "year": 1874,
            "label": "Benham Plan",
            "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1874_Benham_15691396_Geo2/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/buildings_json/combined_buildings_1870.json",
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
          mapHelper.addImageOverlay(map, $scope.mapOverlays[selectedId]["imageOverlayUrl"]);
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

        mapHelper.buildMapOverlayOptions($scope);
        var map = mapHelper.initializeMap($scope);
        $scope.selectOverlay(0)
        mapHelper.initializeOpacitySlider($scope, $timeout);
        controllerHelper.updateBodyOpacity($timeout, 1);

    });
  }
]);
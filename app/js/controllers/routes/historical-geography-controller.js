var angular          = require('angular');
var request          = require('superagent');
var $                = require('jquery');
var controllerHelper = require('../helpers/controller-helper');
var mapHelper        = require('../helpers/map-helper');

angular.module('HistoricalGeographyController', [])
  .controller("historicalGeographyController", [
      "$scope", "$http", "$timeout",
  function($scope, $http, $timeout) {

    /***
    *
    * Define the data to be passed to the view on user interaction with the page
    *
    ***/

    var endpoint = "http://gathering-a-building-deploy.s3-website-us-east-1.amazonaws.com/json/historical-geography.json";
    request
      .get(endpoint)
      .set('Accept', 'application/json')
      .end(function(err, res){
        if (err) {console.log(err)};

        var data = res.body;
        $scope.mobile     = data.mobile;
        $scope.textColumn = data.textColumn;

        $scope.mapOverlays = {
          "0": {
            "year": 1753,
            "label": "Wadsworth Plan",
            "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1748_Wadsworth_Plan-NewHaven_1806-Kensett-engr_Beinecke_15675071-GEO1/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1753.json"
          },
          "1": {
            "year": 1802,
            "label": "Plan of New Haven",
            "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1802_Plan-New-Haven_Biencke_105622451_GEO1/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1835.json"
          },
          "2": {
            "year": 1824,
            "label": "Doolittle Plan",
            "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1824_Doolittle_Plan-of-New-Haven_Beinecke_156750741/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1850.json"
          },
          "3": {
            "year": 1849,
            "label": "Buckingham Plan",
            "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1849_Buckingham_NH_156913731_Geo4/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1894.json"
          },
          "4": {
            "year": 1874,
            "label": "Benham Plan",
            "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1874_Benham_15691396_Geo2/{z}/{x}/{y}.png",
            "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1912.json"
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
          mapHelper.addVectorOverlay(map, $scope.mapOverlays[selectedId]["vectorOverlayUrl"]);

          // add an opacity slider with floot, ceiling, and initial value
          $scope.opacitySlider = {
            value: 70,
            options: {
              floor: 0,
              ceil: 100
            }
          };

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
          $timeout(function(){
            var sectionId = String($scope.selectedSectionId);
            $scope.selectOverlay(sectionId);
          });
        }

        /***
        *
        * Initialize the map overlay and select the first overlay option
        *
        ***/

        mapHelper.buildMapOverlayOptions($scope);
        var map = mapHelper.initializeMap();
        $scope.selectOverlay(0);

    });
  }
]);
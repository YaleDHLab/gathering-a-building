var angular = require('angular');
var request = require('superagent');
var controllerHelper = require('../helpers/controller-helper');

angular.module('MaterialJourneysController', [])
  .controller("materialJourneysController", [
      "$scope", "$http", "$timeout", "$location",
  function($scope, $http, $timeout, $location) {

    var endpoint = "http://localhost:8000/json/material-journeys.json";
    request
      .get(endpoint)
      .set('Accept', 'application/json')
      .end(function(err, res){
        if (err) {console.log(err)};

        var data = res.body;

        $scope.mobile     = data.mobile;
        $scope.textColumn = data.textColumn;

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
            var section = $scope.textColumn.sections[sectionId];
            var tableOfContents = parseInt(section["showTableOfContents"], 10);
            var background = section["background"]["1"]["url"];
            controllerHelper.updateBackground($scope, background);
            controllerHelper.showTableOfContents($scope, tableOfContents);
            controllerHelper.updateFooter($scope, $location);
          });
        }

        // initialize the application state
        $scope.selectedSectionId = 0;
        selectSection($scope);
        controllerHelper.showTableOfContents($scope, 1);
        controllerHelper.buildDropdownOptions($scope);
        controllerHelper.initializeFooter($scope, $location,
              "Material Journeys", "partial");

      });
  }
]);
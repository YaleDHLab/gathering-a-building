var angular = require('angular');
var request = require('superagent');
var controllerHelper = require('../helpers/controller-helper');

angular.module('MaterialJourneysController', [])
  .controller("materialJourneysController", [
      "$scope", "$http", "$timeout", "$location", "$sce", "backgroundStyle",
  function($scope, $http, $timeout, $location, $sce, backgroundStyle) {

    var endpoint = "./json/material-journeys.json";

    request
      .get(endpoint)
      .set('Accept', 'application/json')
      .end(function(err, res){
        if (err) {console.log(err)};

        var data = res.body;
        $scope.textColumn = data;

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
        * Give clients the ability to show/hide the iframe map
        *
        ***/

        $scope.showIframe = function(boolean, iframeSrc) {
          controllerHelper.showIframe($scope, boolean, iframeSrc);
        }

        /***
        *
        * Function to trust a src attribute in declared iframes
        *
        ***/

        $scope.trustSrc = function(src) {
          return $sce.trustAsResourceUrl(src);
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

            for (var i=0; i<$scope.textColumn.sections.length; i++) {
              if ($scope.textColumn.sections[i].id == sectionId) {
                var section = $scope.textColumn.sections[i];
              }
            }

            var background = section["background"]["url"];
            controllerHelper.updateTemplate($scope, $timeout, section);
            controllerHelper.updateBackground($scope, background);
            controllerHelper.updateFooter($scope, $location);
            controllerHelper.updateBackgroundStyle($scope, backgroundStyle, section);
            controllerHelper.updateBodyOpacity($timeout, 1);
            $scope.iframe.shown = "0";
          });
        }

        // initialize the application state
        $scope.selectedSectionId = 0;
        selectSection();
        controllerHelper.buildDropdownOptions($scope);
        controllerHelper.initializeMobile($scope);
        controllerHelper.initializeIframe($scope);
        controllerHelper.initializeFooter($scope, $location,
              "Material Journeys", "partial");

        // finally, given the loaded data, scroll to the requested id (if any)
        controllerHelper.scrollToHash($location, $timeout);

      });
  }
]);
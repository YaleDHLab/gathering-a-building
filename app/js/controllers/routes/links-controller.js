var angular = require('angular');
var request = require('superagent');
var controllerHelper = require('../helpers/controller-helper');

angular.module('LinksController', [])
  .controller("linksController", [
      "$scope", "$http", "$timeout", "$location", "backgroundStyle",
  function($scope, $http, $timeout, $location, backgroundStyle) {

    var endpoint = "./json/links.json";

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
        * Function that updates the background image(s),
        * links, and other page assets as a function of
        * user scroll
        *
        ***/

        var selectSection = function() {
          var sectionId = String($scope.selectedSectionId);
          var section = $scope.textColumn.sections[sectionId];
          var background = section["background"]["url"];
          controllerHelper.updateTemplate($scope, $timeout, section);
          controllerHelper.updateBackground($scope, background);
          controllerHelper.updateFooter($scope, $location);
          controllerHelper.updateBackgroundStyle($scope, backgroundStyle, section);
          controllerHelper.updateBodyOpacity($timeout, 1);
        }

        // initialize the application state
        controllerHelper.initializeFooter($scope, $location,
          "Links", "partial");
        $scope.selectedSectionId = 0;
        selectSection();
        controllerHelper.buildDropdownOptions($scope);
        controllerHelper.initializeMobile($scope);

        // finally, given the loaded data, scroll to the requested id (if any)
        controllerHelper.scrollToHash($location, $timeout);

      });
  }
]);
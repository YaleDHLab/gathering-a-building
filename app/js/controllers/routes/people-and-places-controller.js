var angular = require('angular');
var request = require('superagent');
var controllerHelper = require('../helpers/controller-helper');

angular.module('PeopleAndPlacesController', [])
  .controller("peopleAndPlacesController", [
      "$scope", "$http", "$timeout", "$location", "backgroundStyle",
  function($scope, $http, $timeout, $location, backgroundStyle) {

    //var endpoint = "http://gathering-a-building-deploy.s3-website-us-east-1.amazonaws.com/json/people-and-places.json";
    var endpoint = "http://localhost:8000/json/people-and-places.json";

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
          $timeout(function() {
            var sectionId = String($scope.selectedSectionId);
            var section = $scope.textColumn.sections[sectionId];
            var background = section["background"]["url"];
            controllerHelper.updateBackground($scope, background);
            controllerHelper.updateTemplate($scope, $timeout, section);
            controllerHelper.updateFooter($scope, $location);
            controllerHelper.updateBackgroundStyle($scope, backgroundStyle, section);
          });
        }

        // initialize the application state
        $timeout(function() {
          $scope.selectedSectionId = 0;
          controllerHelper.buildDropdownOptions($scope);
          controllerHelper.initializeMobile($scope);
          controllerHelper.initializeFooter($scope, $location, "People & Places", "partial");
          selectSection();

          // finally, given the loaded data, scroll to the requested id (if any)
          controllerHelper.scrollToHash($location, $timeout);

          $scope.tableOfContents = {
            "topImage": $scope.textColumn["sections"]["0"]["topImage"],
            "bottomLeftHtml": $scope.textColumn["sections"]["0"]["bottomLeftHtml"],
            "bottomRightHtml": $scope.textColumn["sections"]["0"]["bottomRightHtml"]
          };
          console.log($scope.textColumn);

        });

      });
  }
]);
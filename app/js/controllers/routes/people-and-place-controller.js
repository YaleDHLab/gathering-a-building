var angular = require('angular');
var request = require('superagent');
var controllerHelper = require('../helpers/controller-helper');

angular.module('PeopleAndPlaceController', [])
  .controller("peopleAndPlaceController", [
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
            var background = section["background"]["url"];
            controllerHelper.updateBackground($scope, background);
            controllerHelper.showTableOfContents($scope, tableOfContents);
            controllerHelper.updateFooter($scope, $location);
            controllerHelper.updateBackgroundStyle($scope, backgroundStyle, section);
          });
        }

        // initialize the application state
        $timeout(function() {
          $scope.selectedSectionId = 0;
          selectSection($scope);
          controllerHelper.showTableOfContents($scope, 1);
          controllerHelper.buildDropdownOptions($scope);
          controllerHelper.initializeMobile($scope);
          controllerHelper.initializeFooter($scope, $location, 
                "People & Places", "partial");

          // finally, given the loaded data, scroll to the requested id (if any)
          controllerHelper.scrollToHash($location, $timeout);

          $scope.tableOfContents = {
            "topRightHtml": $scope.textColumn["sections"]["0"]["topRightHtml"],
            "bottomLeftHtml": $scope.textColumn["sections"]["0"]["bottomLeftHtml"],
            "bottomRightHtml": $scope.textColumn["sections"]["0"]["bottomRightHtml"]
          };
        });

      });
  }
]);
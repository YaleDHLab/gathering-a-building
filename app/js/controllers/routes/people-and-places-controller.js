var angular = require('angular');
var request = require('superagent');
var controllerHelper = require('../helpers/controller-helper');

angular.module('PeopleAndPlacesController', [])
  .controller("peopleAndPlacesController", [
      "$scope", "$http", "$timeout", "$location", "backgroundStyle",
  function($scope, $http, $timeout, $location, backgroundStyle) {

    var endpoint = "./json/people-and-places.json";

    request
      .get(endpoint)
      .set('Accept', 'application/json')
      .end(function(err, res){
        if (err) {console.log(err)};

        var data = res.body;
        $scope.textColumn = data;

        // create an internal mapping from the 'id' field within a post
        // to that post's content
        $scope.idToSection = {};
        $scope.textColumn.sections.map((s)=> {
          $scope.idToSection[s.id] = s
        });

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
          var section = $scope.idToSection[sectionId];
          var background = section["background"]["url"];
          controllerHelper.updateTemplate($scope, $timeout, section);
          controllerHelper.updateBackground($scope, background);
          controllerHelper.updateFooter($scope, $location);
          controllerHelper.updateBackgroundStyle($scope, backgroundStyle, section);
          controllerHelper.updateBodyOpacity($timeout, 1);
        }

        // initialize the application state
        controllerHelper.initializeFooter($scope, $location,
          "People & Places", "partial");
        $scope.selectedSectionId = 0;
        selectSection();
        controllerHelper.buildDropdownOptions($scope);
        controllerHelper.initializeMobile($scope);

        // finally, given the loaded data, scroll to the requested id (if any)
        controllerHelper.scrollToHash($location, $timeout);

      });
  }
]);
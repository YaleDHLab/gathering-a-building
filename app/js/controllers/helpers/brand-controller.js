var angular = require('angular');
var $ = require('jquery');

angular.module('BrandController', [])
  .controller("brandController", [
      "$scope", "$http",
  function($scope, $http) {

    /***
    * @object: keys are aspects of brand identity
    *          values are details for the current brand
    *
    * Establishes brand information to show in the view
    ***/

    $scope.brand = {
      "title": "GATHERING A BUILDING",
      "logo": "/assets/images/dh-lab-gray.png",
      "url": "http://web.library.yale.edu/dhlab"
    };

    // add a function that hides the navigation overlay
    // on click of site title
    $scope.hideOverlay = function() {
      $(".navigation-overlay").addClass("hidden");
      $(".navigation").removeClass("hidden");
    };

  }
]);
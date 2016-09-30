var angular = require('angular');
var $ = require('jquery');

angular.module('BrandController', [])
  .controller("brandController", [
      "$scope", "$http",
  function($scope, $http) {

    /***
    *
    * Listen for changes to the asset color broadcast
    * from the asset-color service. When the background
    * changes, change the brand logo accordingly
    *
    ***/

    $scope.$on('backgroundStyleUpdated', function (event, style) {
      if (style.brandIcon == "light") {
        $scope.style = {fill: "#ffffff"};
      }
      if (style.brandIcon == "dark") {
        $scope.style = {fill: "#797979"} ;
      }
    });

    $scope.brand = {
      "title": "GATHERING A BUILDING",
      "url": "http://web.library.yale.edu/dhlab"
    };

    /***
    *
    * Function that hides the navigation overlay
    * on click of site title
    *
    ***/

    $scope.hideOverlay = function() {
      $(".navigation-overlay").addClass("hidden");
      $(".navigation").removeClass("hidden");
    };

  }
]);
var $ = require('jquery');
var angular = require('angular');

angular.module('NavigationController', [])
  .controller("navigationController", [
      "$scope", "$http",
  function($scope, $http) {

    /***
    *
    * Listen for changes to the asset color broadcast from
    * the asset-color service. When the background changes,
    * change the navigation icon color light or dark according
    * to the navigationButton's style {light, dark} (John 1:5)
    *
    ***/

    $scope.$on('backgroundStyleUpdated', function (event, style) {
      if (style.navigationButton == "dark") {
        $scope.style = {background: "#797979"}
      }

      if (style.navigationButton == "light") {
        $scope.style = {background: "#ffffff"}
      }
    });

    /***
    *
    * Hide or show the navigation overlay
    *
    ***/

    $scope.toggleNavigation = function() {
      $(".navigation").toggleClass("hidden");
      $(".navigation-overlay").toggleClass("hidden");
    };
  }
]);
var $ = require('jquery');
var angular = require('angular');

angular.module('NavigationController', [])
  .controller("navigationController", [
      "$scope", "$http",
  function($scope, $http) {

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
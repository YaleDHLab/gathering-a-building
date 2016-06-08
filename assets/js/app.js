var App = angular.module("App", []);

// Navigation Controller to populate navigation
App.controller("NavigationController", [
  "$scope", "$http",
  function($scope, $http) {


  }
]);


// Brand Controller to populate brand
App.controller("BrandController", [
  "$scope", "$http",
  function($scope, $http) {

    // populate footer fields
    $scope.brand = {
      "title": "GATHERING A BUILDING"
    };

  }
]);


// Page Controller to control page content
App.controller("PageController", [
  "$scope", "$http",
  function($scope, $http) {

    // populate footer fields
    $scope.footer = {
      "right": "Next &uarr;",
      "left": "Left footer"
    };

  }
]);
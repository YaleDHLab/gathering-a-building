var BuildingApp = angular.module("BuildingApp", []);

// filter to escape urls
BuildingApp.filter('cleanUrl', function() {
  return window.encodeURIComponent;
});


// Navigation Controller to populate navigation
BuildingApp.controller("NavigationController", [
      "$scope", "$http",
  function($scope, $http) {

  }
]);


// Brand Controller to populate brand
BuildingApp.controller("BrandController", [
      "$scope", "$http",
  function($scope, $http) {

    // populate footer fields
    $scope.brand = {
      "title": "GATHERING A BUILDING",
      "logo": "/assets/images/dh-lab-gray.png"
    };

  }
]);


// Page Controller to control page content
BuildingApp.controller("PageController", [
      "$scope", "$http",
  function($scope, $http) {

    // populate footer fields
    $scope.footer = {
      "right": "Next &uarr;",
      "left": "Left footer"
    };

    $scope.page = {
      "url": "/templates/home.html"
    };



  }
]);
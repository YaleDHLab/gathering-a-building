var BuildingApp = angular.module("BuildingApp", []);


// Service to identify the current page content
BuildingApp.factory("State", [
      "$http",
  function($http) {
    
    var state = {
      "page": 
        {
          "chapter": "",
          "article": ""
        }
    };

    state.set = function(request) {
      for (var key1 in request) {
        
        // add the key to state if necessary
        (key1 in Object.keys(state) )? {} : state[key1] = {};
          
        // loop over second order keys
        for (var key2 in request[key1]) {

          // set the state property for the key pair
          state[key1][key2] = request[key1][key2];
        }
      }
    };

    return state;  
  }
])


// Navigation Controller to populate navigation
BuildingApp.controller("NavigationController", [
      "$scope", "$http", "State",
  function($scope, $http, State) {

    // store self reference
    var self = this;

    // subscribe to shared state
    self.State = State;

    /***
    * @params: none
    * @returns: none
    *
    * Hide or show the navigation overlay
    ***/

    $scope.toggleNavigation = function() {
      $(".navigation").toggleClass("hidden");
      $(".navigation-overlay").toggleClass("hidden");
    };

    /***
    * @params: Object with the form {k1:{k2:v2, k3:v3}}
    *          used to update state in the State service
    * @returns: none
    *
    * Hide or show the navigation overlay
    ***/

    $scope.setState = function(request) {
      console.log(request);
      State.set(request);
    };

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
      "$scope", "$http", "State",
  function($scope, $http, State) {

    // publish state to view
    $scope.state = State;

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
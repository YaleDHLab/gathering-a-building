var buildingApp = angular.module("BuildingApp", ["ngRoute"]);


// Define application routes
buildingApp.config(["$routeProvider", function($routeProvider) {
      
  // route for the home view
  $routeProvider.when('/', {
    templateUrl : '/templates/home.html',
    controller  : 'homeController'
  })

  // route for the site history view
  $routeProvider.when('/routes/site-history', {
    templateUrl : '/templates/site-history.html',
    controller  : 'siteHistoryController'
  })

  // route for the architecture and urbanism view
  $routeProvider.when('/routes/architecture-and-urbanism', {
    templateUrl : '/templates/architecture-and-urbanism.html',
    controller  : 'architectureAndUrbanismController'
  })

  // route for the about page
  $routeProvider.when('/routes/material-journeys', {
    templateUrl : '/templates/material-journeys.html',
    controller  : 'materialJourneysController'
  })

  // route for all other requests
  $routeProvider.otherwise({
    redirectTo: "/"
  });

}]);






// Service to identify the current page content
buildingApp.factory("stateService", [
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
buildingApp.controller("navigationController", [
      "$scope", "$http", "stateService",
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
      State.set(request);
    };

  }
]);


/********************************
* Controllers for view partials *
********************************/

// Brand Controller to populate brand
buildingApp.controller("brandController", [
      "$scope", "$http",
  function($scope, $http) {

    // populate footer fields
    $scope.brand = {
      "title": "GATHERING A BUILDING",
      "logo": "/assets/images/dh-lab-gray.png",
      "url": "http://web.library.yale.edu/dhlab"
    };

  }
]);


// Page Controller to control page content
buildingApp.controller("footerController", [
      "$scope", "$http", "stateService",
  function($scope, $http, State) {

    // publish state to view
    $scope.state = State;

    // populate footer fields
    $scope.footer = {
      "right": "Next &uarr;",
      "left": "Left footer"
    };

  }
]);



/************************
* Controllers for views *
************************/



// Controller for home view
buildingApp.controller("homeController", [
      "$scope", "$http", "stateService",
  function($scope, $http, State) {

    /***
    * @params: Object with the form {k1:{k2:v2, k3:v3}}
    *          used to update state in the State service
    * @returns: none
    *
    * Hide or show the navigation overlay
    ***/

    $scope.setState = function(request) {
      State.set(request);
    };

    // publish state to view
    $scope.state = State;

  }
]);


// Controller for site history view
buildingApp.controller("siteHistoryController", [
      "$scope", "$http", "stateService",
  function($scope, $http, State) {

    /***
    * @params: Object with the form {k1:{k2:v2, k3:v3}}
    *          used to update state in the State service
    * @returns: none
    *
    * Hides or shows the navigation overlay
    ***/

    $scope.setState = function(request) {
      State.set(request);
    };

    // publish state to view
    $scope.state = State;

    /***
    * @object: keys are ids for the selected plan
    *          values are labels for the selected plan
    *
    * Defines the available map overlays
    ***/

    var mapOverlayLabels = {
      "1": "Doolittle Plan",
      "2": "Snider Plan",
      "3": "Pauley Plan"
    }

    /***
    * @params: Integer that is present in Object.keys(mapOverlayLabels)
    * @returns: none
    *  
    * Updates the map to display the selected map overlay
    ***/

    var selectOverlay = function(selectedOption) {
      $(".map-overlay").removeClass("active");
      selectedOption.addClass("active");
      
      // use the appropriate label as the map selection label
      var selectedClasses = selectedOption.attr('class');
      var selectedId = selectedClasses.split(" map-overlay-")[1].split(" ")[0];
      $(".map-selection-label-content").html( mapOverlayLabels[selectedId] );
    };

    /***
    * @params: none
    * @returns: none
    *  
    * Adds click listener event to map overlay options
    ***/

    $(".map-overlay-1, .map-overlay-2, .map-overlay-3").on("click", function() {
      selectOverlay($(this));
    });

     /***
    * @params: none
    * @returns: none
    *  
    * Sets the first map overlay option as the currently displayed overlay
    ***/

    $(".map-overlay-1").click();

     /***
    * @params: none
    * @returns: none
    * @source: map.js
    *  
    * Initializes map overlay
    ***/

    initializeMap();

  }
]);


// Controller for site architecture and urbanism view
buildingApp.controller("architectureAndUrbanismController", [
      "$scope", "$http", "stateService",
  function($scope, $http, State) {

    /***
    * @params: Object with the form {k1:{k2:v2, k3:v3}}
    *          used to update state in the State service
    * @returns: none
    *
    * Hide or show the navigation overlay
    ***/

    $scope.setState = function(request) {
      State.set(request);
    };

    // publish state to view
    $scope.state = State;

  }
]);


// Controller for material journeys view
buildingApp.controller("materialJourneysController", [
      "$scope", "$http", "stateService",
  function($scope, $http, State) {

    /***
    * @params: Object with the form {k1:{k2:v2, k3:v3}}
    *          used to update state in the State service
    * @returns: none
    *
    * Hide or show the navigation overlay
    ***/

    $scope.setState = function(request) {
      State.set(request);
    };

    // publish state to view
    $scope.state = State;

  }
]);


// Controller for people and place view
buildingApp.controller("peopleAndPlaceController", [
      "$scope", "$http", "stateService",
  function($scope, $http, State) {

    /***
    * @params: Object with the form {k1:{k2:v2, k3:v3}}
    *          used to update state in the State service
    * @returns: none
    *
    * Hide or show the navigation overlay
    ***/

    $scope.setState = function(request) {
      State.set(request);
    };

    // publish state to view
    $scope.state = State;

  }
]);
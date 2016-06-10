var buildingApp = angular.module("BuildingApp", ["ngRoute", "ngSanitize"]);


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
buildingApp.factory("footerService", [
      "$rootScope",
  function($rootScope) {
    
    /***
    * @object: keys describe aspects of the footer
    *          values describe the current state of those aspects
    *
    * Makes a get request to the footer service to define $scope.footer
    * for the view, and wraps that call in $timeout in order to avoid
    * creating a digest cycle if the application is already in a digest
    * cycle at the tie of request
    ***/

    var footer = {
      "left": "hey",
      "right": "oh"
    };

    /***
    * @params: none
    * @returns: functions that allow injecting controllers to get footer
    *           set the footer, or subscribe to changes to footer
    *
    * Defines the public methods controllers can call to get, set, or 
    * subscribe to changes to the footer object
    ***/

    return {

      /***
      * @params: scope object, callback
      * @returns: none
      *
      * Binds a callback function to an event so that when the
      * footer:updated event is emitted, the callback is called
      ***/

      subscribe: function(scope, callback) {
        var handler = $rootScope.$on('footer:updated', callback);
        scope.$on("destroy", handler);
      },

      /***
      * @params: a footer object as defined above
      * @returns: none
      * @emits: "footer:updated" event
      *
      * Replaces the service's footer object with the newFooter
      * object, and emits an event to subscribers so they can 
      * reissue a get request for the new footer object
      ***/

      set: function(newFooter) {
        footer = newFooter;
        $rootScope.$emit("footer:updated");
      },

      /***
      * @params: none
      * @returns: the current service footer object
      *
      * Sends requesting controllers the current footer service object
      ***/

      get: function() {
        console.log("sending get response", footer);
        return footer;
      }
    };
  }
])




// Navigation Controller to populate navigation
buildingApp.controller("navigationController", [
      "$scope", "$http",
  function($scope, $http) {

    // store self reference
    var self = this;

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

  
  }
]);


/********************************
* Controllers for view partials *
********************************/

// Brand Controller to populate brand
buildingApp.controller("brandController", [
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

  }
]);


// Footer Controller to manage footer state across views
buildingApp.controller("footerController", [
      "$scope", "$http", "$timeout", "footerService",
  function($scope, $http, $timeout, footerService) {


    /***
    * @params: none
    * @returns: none
    *
    * Makes a get request to the footer service to define $scope.footer
    * for the view, and wraps that call in $timeout in order to avoid
    * creating a digest cycle if the application is already in a digest
    * cycle at the tie of request
    ***/

    var setFooter = function() {
      $timeout( function() {
        $scope.footer = footerService.get();
      }, 0);
    }

    /***
    * @params: $scope object, callback
    * @returns: none
    *
    * Subscribes to the footerService, which will call the callback 
    * setFooter() when the footerService emits afooter:updated signal
    ***/

    footerService.subscribe($scope, setFooter);

  }
]);



/************************
* Controllers for views *
************************/



// Controller for home view
buildingApp.controller("homeController", [
      "$scope", "$http", 
  function($scope, $http) {

  }
]);





// Controller for site history view
buildingApp.controller("siteHistoryController", [
      "$scope", "$http", "footerService",
  function($scope, $http, footerService) {

    /***
    * @params: Object with the form {k1:{k2:v2, k3:v3}}
    *          used to update state in the State service
    * @returns: none
    *
    * Hides or shows the navigation overlay
    ***/

    var setFooter = function(request) {
      footerService.set(request);
    };

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
      //var request = {"footer": {"left": {"text": mapOverlayLabels[selectedId]}, "style": "full"}};


      var request = {"left": "hoyo", "right": mapOverlayLabels[selectedId]};
      setFooter(request);

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
    *  
    * Function that builds the basemap on which layers will be added
    ***/

    var initializeMap = function() {

      // specify the coordinates on which to center the map initially
      centerCoordinates = new L.LatLng(41.307, -72.928);

      // create the map object itself
      var map = new L.Map("map", {
        center: centerCoordinates,
        zoom: 17,
        zoomControl: false
      });

      // position the zoom controls in the bottom right hand corner
      L.control.zoom({
        position: 'bottomright',
        zoom: 17,
        maxZoom: 20,
        minZoom: 12,
      }).addTo(map);

      // use the cartodb basemap
      map.addLayer(new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }));

    };

    /***
    * @params: none
    * @returns: none
    *  
    * Initializes map overlay
    ***/

    initializeMap();

  }
]);





// Controller for site architecture and urbanism view
buildingApp.controller("architectureAndUrbanismController", [
      "$scope", "$http",
  function($scope, $http) {

    

  }
]);


// Controller for material journeys view
buildingApp.controller("materialJourneysController", [
      "$scope", "$http",
  function($scope, $http) {

    

  }
]);


// Controller for people and place view
buildingApp.controller("peopleAndPlaceController", [
      "$scope", "$http",
  function($scope, $http) {

    

  }
]);
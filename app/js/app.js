// async assets
import whilst from 'async/whilst';

// angular assets
require('angular');
require('angular-route');
require('angular-sanitize');
require('angularjs-slider');

// navisworks assets
require('../vendor/css/navisworks.style.min');
require('../vendor/css/navisworks-a360');
require('../vendor/js/three.min');

// route controllers
require('./controllers/routes/architecture-and-urbanism-controller');
require('./controllers/routes/building-model-controller');
require('./controllers/routes/historical-geography-controller');
require('./controllers/routes/home-controller');
require('./controllers/routes/material-journeys-controller');
require('./controllers/routes/people-and-place-controller');

// helper controllers
require('./controllers/helpers/navigation-controller');
require('./controllers/helpers/brand-controller');

// directives
require('./directives/scroll-listener');
require('./directives/background-image');
require('./directives/scroll-to-id');
require('./directives/hash-change-select');
require('./directives/hover-events');
require('./directives/load-building');
require('./directives/resize');
require('./directives/template-loaded');

// filters
require('./filters/allow-html');

// main application with dependency modules declared
var buildingApp = angular.module("BuildingApp",
  [
    // vendor dependencies
    "ngRoute",
    "ngSanitize",
    "rzModule",

    // route controllers
    "ArchitectureAndUrbanismController",
    "BuildingModelController",
    "HistoricalGeographyController",
    "HomeController",
    "MaterialJourneysController",
    "PeopleAndPlaceController",

    // helper controllers
    "NavigationController",
    "BrandController",

    // directives
    "BackgroundImage",
    "HashChangeSelect",
    "HoverEvents",
    "LoadBuilding",
    "ScrollListener",
    "ScrollToId",
    "Resize",
    "TemplateLoaded",

    // filters
    "AllowHtml"
  ]
);

/***
*
* Routing configuation for the application
*
***/

buildingApp.config([
    "$routeProvider",
  function($routeProvider) {

  // route for the home view
  $routeProvider.when('/', {
    templateUrl    : '/templates/routes/home.html',
    controller     : 'homeController',
    reloadOnSearch : false
  })

  // route for the building model view
  $routeProvider.when('/routes/building-model', {
    templateUrl    : '/templates/routes/building-model.html',
    controller     : 'buildingModelController',
    reloadOnSearch : false
  })

  // route for the historical geography view
  $routeProvider.when('/routes/historical-geography', {
    templateUrl    : '/templates/routes/historical-geography.html',
    controller     : 'historicalGeographyController',
    reloadOnSearch : false
  })

  // route for the architecture and urbanism view
  $routeProvider.when('/routes/architecture-and-urbanism', {
    templateUrl : '/templates/routes/architecture-and-urbanism.html',
    controller  : 'architectureAndUrbanismController',
    reloadOnSearch : false
  })

  // route for the material journeys view
  $routeProvider.when('/routes/material-journeys', {
    templateUrl : '/templates/routes/material-journeys.html',
    controller  : 'materialJourneysController',
    reloadOnSearch : false
  })

  // route for the about page
  $routeProvider.when('/routes/people-and-place', {
    templateUrl : '/templates/routes/people-and-place.html',
    controller  : 'peopleAndPlaceController',
    reloadOnSearch : false
  })

  // route for all other requests
  $routeProvider.otherwise({
    redirectTo: "/"
  });

}]);

/***
*
* Update scroll position using href (or anchor) in url
*
***/

buildingApp.run([
    "$rootScope", "$location", "$routeParams", "$anchorScroll", "$timeout",
  function($rootScope, $location, $routeParams, $anchorScroll, $timeout) {
    $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {

    /***
    *
    * Function to asynchronously and repeatedly test whether
    * an element with id = $location.hash() exists in the DOM.
    * This is required because on route change, if a user has
    * requested to deeplink to an article on a page, we need
    * that article (designated by an id = $location.hash()) to
    * exist in the DOM before we can scroll to it.
    *
    ***/

    var element = undefined;
    var elementId = $location.hash();

    // If the requested id is loaded on the requested route,
    // scroll to it. Else return the element itself, which will
    // trigger the whilst() loop below to try and find the
    // element again (after a defined timeout)
    var findElement = function(elementId) {
      element = document.getElementById(elementId);
      if (element != undefined && element != null) {
        $anchorScroll();

        // if the landing page map removed opacity from the body,
        // restore that opacity
        document.querySelector('.body').style.opacity = 1;

      // element was undefined or null; return that empty value
      } else {
        return element;
      }
    };

    if (elementId) {
      whilst(

        // The first function passed to whilst runs a
        // search for the curently requested href
        // and returns a boolean. If that boolean is true,
        // the next function below [i.e. function(callback)]
        // will be called
        function () {
          element = findElement(elementId);
          return (element === undefined || element === null);
        },

        // Callback function to be called when the first function
        // passed to whilst returns true. Uses a timeout to continually
        // poll the DOM until the requested ID is available
        function (callback) {
          $timeout(function() {
            findElement(elementId);
          }, 333);
        },

        function (error, success) {
          if (error) { console.log("error in findElement callback!", error); }
        }
      );

    // otherwise the user didn't requst an id
    } else {
      // Restore body opacity
      document.querySelector('.body').style.opacity = 1;
    }

  });
}])
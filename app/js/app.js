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
    "$rootScope", "$anchorScroll",
  function($rootScope, $anchorScroll) {
    $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {

    // restore opacity to the body
    document.querySelector('.body').style.opacity = 1;
  });
}])
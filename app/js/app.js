// library assets
var $ = require('jquery');
var d3 = require('d3');
var L = require('leaflet');

// angular assets
var angular = require('angular');
var ngRoute = require('angular-route');
var ngSanitize = require('angular-sanitize');
var rzModule = require('angularjs-slider');

// navisworks assets
require('../vendor/css/navisworks.style.min');
require('../vendor/css/navisworks-a360');
require('../vendor/js/three');
var autodeskCredentials = require('./lib/autodesk.js');

// main application
var buildingApp = angular.module("BuildingApp", ["ngRoute", "ngSanitize", "rzModule"]);

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
* Add a run block to update scroll position on request of
* anchor elements with article query params
*
***/

buildingApp.run([
    "$rootScope", "$location", "$anchorScroll", "$routeParams",
  function($rootScope, $location, $anchorScroll, $routeParams) {
    $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {

      // on route change, remove the hash from the url
      $location.hash(null);

  });
}])



/***
*
* Directive to dynamically set background images when 
* controllers update their backgroundImageUrl scope
* variables
*
***/

buildingApp.directive('backgroundImage', function(){
  return function(scope, element, attrs){
    attrs.$observe('backgroundImage', function(value) {
      element.css({
          'background': 'url(' + value +') no-repeat center center fixed',
          'background-size' : 'cover'
      });
    });
  };
});


/***
*
* Directive to listen for scroll events
*
***/

buildingApp.directive('scrollListener', function () {
  return {
    restrict: 'AC',

    // give the directive access to the controller function
    // specified in the html directive, so that when the
    // user scrolls, the directive can broadcast the new
    // scroll position to the subscribing controller
    scope: {
      setScrollPosition: '='
    },

    // bind a scroll event listener to the selected element
    // and broadcast the scroll position to the subscribing
    // controller function
    link: function (scope, element, attrs) {
      element.bind('scroll', function () {

        // pass the scroll position to the subscriber's setScrollPosition method
        var scrollPosition = element[0].scrollTop;

        // if the scroll position > 0, fade in articles after the 1st
        // then permanently set their opacity to 1, else fade them out
        if (scrollPosition > 0) {
          // set timeout so that fade in completes before we absolutely set opacity
          $(".major-section-spacer *").removeClass("fade-out-article");
          $(".major-section-spacer *").addClass("fade-in-article");
        } else {
          // set timeout so that fade out completes before we absolutely set opacity
          $(".major-section-spacer *").removeClass("fade-in-article");
          $(".major-section-spacer *").addClass("fade-out-article");
        }

        scope.setScrollPosition(scrollPosition);
      });
    }
  };
});


/***
*
* Directive to scroll to the href within the current a tag
*
***/

buildingApp.directive('scrollToId', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      // to give a div a pointer to another div, just
      // add data-bullseye="3", which will point to #3
      var idToScroll = attrs.bullseye;
      element.on('click', function(event) {
        event.preventDefault();
        var $target;
        if (idToScroll) {
          $target = $(idToScroll);
        } else {
          $target = element;
        }
        $(".text-column").animate({scrollTop: $target.offset().top}, "fast");
        return false;
      });
    }
  }
});


/***
*
* Directive to support scroll by href in mobile select
*
***/

buildingApp.directive('hashChangeSelect',[
    '$location',
  function($location){
  return {
    restrict : 'E',
    templateUrl : '/templates/partials/layout/hash-change-select.html',
    scope : {
      options : "=",
      value :  "=",
    },
    link : function(scope) {
      return true;
    },
    controller : function($scope) {
      /* $scope is controller scope; fetch the value object's id and set
      it in the url hash */
      $scope._value = angular.copy($scope.value);
      $scope._onOptionSelected = function(){
        $location.search('article',$scope._value.id);
        $location.hash($scope._value.id);
      }
    }
  };
}]);



/***
*
* Directive to run code after template content and ng-repeat
* events have completed. In this case, we use the directive to
* add hover states for material journeys pictures/text.
* See: http://stackoverflow.com/questions/12304291
*
***/

buildingApp.directive('hoverEvents', function() {
  return {
    link: function($scope, element, attrs) {

      // Trigger when number of children changes,
      // including by directives like ng-repeat
      var watch = $scope.$watch(function() {
        return element.children().length;
      }, function() {

        // Wait for templates to render
        $scope.$evalAsync(function() {

          // Once control passes to this step,
          // all templates have loaded and ng-repeats
          // have concluded.

          // Define functions such that hovering on text
          // highlights the images, and vice versa
          var textInfluencesImage = function(elem, index) {
            elem.addEventListener("mouseover", function() {
              var associatedImage = chapterSectionImages[index];
              associatedImage.className += " active";
            });

            elem.addEventListener("mouseout", function() {
              var associatedImage = chapterSectionImages[index];
              associatedImage.className = defaultImageClass;
            });
          };

          var imageInfluencesText = function(elem, index) {
            elem.addEventListener("mouseover", function() {
              var associatedText = chapterSectionTitles[index];
              associatedText.className += " active";
            });

            elem.addEventListener("mouseout", function() {
              var associatedText = chapterSectionTitles[index];
              associatedText.className = defaultTextClass;
            });
          };

          // select all of the section subheadings and images
          var chapterSectionTitles = document.querySelectorAll(".text-column-material-journeys a");
          var chapterSectionImages = document.querySelectorAll(".table-of-contents-right-panel");

          if (chapterSectionTitles.length > 0 && chapterSectionImages.length > 0) {

            // store the classes applied to chapter section subheadings and images
            var defaultTextClass = chapterSectionTitles[0].className;
            var defaultImageClass = chapterSectionImages[0].className;

            // make hovers on text influence images
            chapterSectionTitles.forEach(textInfluencesImage);

            // make hovers on images influence text
            chapterSectionImages.forEach(imageInfluencesText);
          };
        });
      });
    },
  };
});

/***
*
* Directive to load building model data on page load
*
***/

buildingApp.directive('loadBuilding', function() {
  return {
    link: function($scope, element, attrs) {

      // Trigger when number of children changes,
      // including by directives like ng-repeat
      var watch = $scope.$watch(function() {
        return element.children().length;
      }, function() {

        // Wait for templates to render
        $scope.$evalAsync(function() {

          // load the building data
          var viewerApp;
          var options = {
            env: 'AutodeskProduction',
            accessToken: autodeskCredentials.accessToken
          };
          var documentId = autodeskCredentials.urn;
          Autodesk.Viewing.Initializer(options, function onInitialized(){
            viewerApp = new Autodesk.A360ViewingApplication('building-model');
            viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D);
            viewerApp.loadDocumentWithItemAndObject(documentId);
          });

        });
      });
    },
  };
});

/***
*
* Filter to allow one to dangerouslySetInnerHtml
*
***/

buildingApp.filter('allowHtml', [
    '$sce',
  function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}]);



// Navigation Controller to populate navigation overlay
buildingApp.controller("navigationController", [
      "$scope", "$http",
  function($scope, $http) {

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

    // add a function that hides the navigation overlay
    // on click of site title
    $scope.hideOverlay = function() {
      $(".navigation-overlay").addClass("hidden");
      $(".navigation").removeClass("hidden");
    };

  }
]);



/************************
* Controllers for views *
************************/

// Controller for home view
buildingApp.controller("homeController", [
      "$scope", "$http",
  function($scope, $http) {

    var footer = {
      "left": {
        "display": "Home",
        "url": "/#/"
      },
      "right": {
        "display": "Next <i class='fa fa-angle-down'></i>",
        "url": "/#/"
      },
      "style": "full"
    };

    $scope.footer = footer;
    $scope.textColumn = {};

  }
]);


// Controller for building model
buildingApp.controller("buildingModelController", [
      "$scope", "$http",
  function($scope, $http) {

    var footer = {
      "left": {
        "display": "Home",
        "url": "/#/"
      },
      "right": {
        "display": "Next <i class='fa fa-angle-down'></i>",
        "url": "/#/"
      },
      "style": "full"
    };

    $scope.footer = footer;
    $scope.textColumn = {};

  }
]);



// Controller for historical geography view
buildingApp.controller("historicalGeographyController", [
      "$scope", "$http",
  function($scope, $http) {

    /**************
    * Text Column *
    **************/

    // define the text column data
    $scope.textColumn = {
      "title": "historical-geography",
      "display": "1",
      "hr": "1",
      "sections": {
        "0": {
          "id": "0",
          "title": "SECTION ONE",
          "subtitle": "HG Section 1 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, ne soleat dolorem lobortis nam, no meis civibus aliquando vis. Ut vidit sonet usu, an mel quot paulo mentitum. Eu sea tollit erroribus, vix eu reque fugit labore, an vel repudiare persecuti. Equidem omnesque ut qui, est persius ocurreret et, postulant voluptaria eam ut. Probo fierent ponderum sea ex. In mea eius utamur petentium, suscipit deserunt accommodare duo ut, ne verear omittam vel.", "Mea odio mutat lobortis no, te perpetua facilisis principes ius. Nisl fastidii periculis cu est, ex errem euripidis evertitur nec. Eu debet placerat mediocrem vis, pro vidisse accumsan gloriatur ei. Cu omittam scripserit nec. Nec erroribus reprimique te, modus fabulas ea pro, adhuc omnes offendit no pro.", "Sea ne amet voluptaria intellegam, an eos elitr moderatius complectitur. Ad epicurei oportere imperdiet eam, stet omnes nonumy per at, at fierent appellantur pri. Te modo omnes assentior qui. Elitr labitur accommodare cu mel. Ad wisi dolore nec. Adhuc nullam mel ei, duo augue imperdiet no.", "Vel etiam signiferumque ex, inermis splendide mei ea. Eu pro latine eruditi persecuti, veri iusto temporibus ei his. Pro novum soleat salutandi te, eos agam tation nominavi eu. Iisque oblique quo ea.", "Et minim constituto cum, id pri semper denique scaevola. An mea eruditi indoctum, quo dico quot nominavi in. Ut sea aperiri facilis assueverit, quodsi latine facilis ea qui. Nihil probatus vis at, ut sed atqui legere, usu propriae necessitatibus ea.", "His an detraxit consulatu, no brute pertinacia sit, an eam vivendo aliquando. Sed accusamus elaboraret ut, ei his congue percipitur. Putent epicuri argumentum in mea, eam cu option splendide, mel solum inimicus ad. Ne facilisi gloriatur vel, facer veniam vivendo ius at. In diam aeque iracundia usu, ex nec amet diceret signiferumque. Cu vix erant oblique nostrum, ei est feugiat forensibus, ea sed meis omittantur. Vel tation similique no.", "Habemus civibus eu has, usu ne debet option mentitum, pro ut tota delenit fuisset. Ut sit iriure sapientem, placerat senserit efficiantur id qui, sit malorum iudicabit et. Cu eripuit lucilius mei, eam hinc esse adhuc et, solet diceret mel ex. Duo ei dicam malorum abhorreant, error ignota scripta ea sit. Est cu justo albucius forensibus, ipsum omnium cu qui. Et est enim gloriatur, has alii solum ut.", "Eos laoreet posidonium an, doctus appareat no quo, est quot albucius in. Primis reprehendunt cum ei. Interesset cotidieque interpretaris nam ex, quo soluta putent aliquam cu. Ea pri ornatus detracto. Regione voluptaria at sed, nam adhuc nostrum at.", "Pri modus facete legendos eu, no eum amet aliquam appellantur, vivendo honestatis vix ei. Cum sonet discere neglegentur at, an pro iuvaret vivendo, eos in suscipit percipitur. Sit lucilius persequeris id. Vim et accumsan theophrastus, elitr vulputate eos cu.", "Epicurei mediocrem consequat cu pri. Vocibus repudiare pro ea, vis melius utroque rationibus ne, vim esse feugiat appetere id. Ad elit errem habemus ius, suas ferri adversarium mei te. Tollit menandri percipitur mel at."],
          "background": "NA"
        },

        "1": {
          "id": "1",
          "title": "SECTION TWO",
          "subtitle": "HG Section 2 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, ne soleat dolorem lobortis nam, no meis civibus aliquando vis. Ut vidit sonet usu, an mel quot paulo mentitum. Eu sea tollit erroribus, vix eu reque fugit labore, an vel repudiare persecuti. Equidem omnesque ut qui, est persius ocurreret et, postulant voluptaria eam ut. Probo fierent ponderum sea ex. In mea eius utamur petentium, suscipit deserunt accommodare duo ut, ne verear omittam vel.", "Mea odio mutat lobortis no, te perpetua facilisis principes ius. Nisl fastidii periculis cu est, ex errem euripidis evertitur nec. Eu debet placerat mediocrem vis, pro vidisse accumsan gloriatur ei. Cu omittam scripserit nec. Nec erroribus reprimique te, modus fabulas ea pro, adhuc omnes offendit no pro.", "Sea ne amet voluptaria intellegam, an eos elitr moderatius complectitur. Ad epicurei oportere imperdiet eam, stet omnes nonumy per at, at fierent appellantur pri. Te modo omnes assentior qui. Elitr labitur accommodare cu mel. Ad wisi dolore nec. Adhuc nullam mel ei, duo augue imperdiet no.", "Vel etiam signiferumque ex, inermis splendide mei ea. Eu pro latine eruditi persecuti, veri iusto temporibus ei his. Pro novum soleat salutandi te, eos agam tation nominavi eu. Iisque oblique quo ea.", "Et minim constituto cum, id pri semper denique scaevola. An mea eruditi indoctum, quo dico quot nominavi in. Ut sea aperiri facilis assueverit, quodsi latine facilis ea qui. Nihil probatus vis at, ut sed atqui legere, usu propriae necessitatibus ea.", "His an detraxit consulatu, no brute pertinacia sit, an eam vivendo aliquando. Sed accusamus elaboraret ut, ei his congue percipitur. Putent epicuri argumentum in mea, eam cu option splendide, mel solum inimicus ad. Ne facilisi gloriatur vel, facer veniam vivendo ius at. In diam aeque iracundia usu, ex nec amet diceret signiferumque. Cu vix erant oblique nostrum, ei est feugiat forensibus, ea sed meis omittantur. Vel tation similique no.", "Habemus civibus eu has, usu ne debet option mentitum, pro ut tota delenit fuisset. Ut sit iriure sapientem, placerat senserit efficiantur id qui, sit malorum iudicabit et. Cu eripuit lucilius mei, eam hinc esse adhuc et, solet diceret mel ex. Duo ei dicam malorum abhorreant, error ignota scripta ea sit. Est cu justo albucius forensibus, ipsum omnium cu qui. Et est enim gloriatur, has alii solum ut.", "Eos laoreet posidonium an, doctus appareat no quo, est quot albucius in. Primis reprehendunt cum ei. Interesset cotidieque interpretaris nam ex, quo soluta putent aliquam cu. Ea pri ornatus detracto. Regione voluptaria at sed, nam adhuc nostrum at.", "Pri modus facete legendos eu, no eum amet aliquam appellantur, vivendo honestatis vix ei. Cum sonet discere neglegentur at, an pro iuvaret vivendo, eos in suscipit percipitur. Sit lucilius persequeris id. Vim et accumsan theophrastus, elitr vulputate eos cu.", "Epicurei mediocrem consequat cu pri. Vocibus repudiare pro ea, vis melius utroque rationibus ne, vim esse feugiat appetere id. Ad elit errem habemus ius, suas ferri adversarium mei te. Tollit menandri percipitur mel at."],
          "background": "NA"
        },
      }
    };

    // Add a function to change map overlay on scroll events. NB:
    // only call the selection function if the background is changing
    $scope.getScrollPosition = function(arg) {
      if (arg < 2000) {
        if ($scope.selectedOverlay != 0) {
          $scope.selectOverlay(0);
        }
      };

      if (arg > 2000) {
        if ($scope.selectedOverlay != 1) {
          $scope.selectOverlay(1);
        }
      }
    };

    // Add events to hide and show the text column
    var showTextColumn = function() {
      $scope.textColumn.display = "1";
      $scope.footer.right.display = "<i class='fa fa-chevron-circle-up'></i>";
    };

    var hideTextColumn = function() {
      $scope.textColumn.display = "0";
      $scope.footer.right.display = "<i class='fa fa-chevron-circle-down'></i>";
    };

    $scope.toggleTextColumn = function() {
      $scope.textColumn.display === "1"? hideTextColumn() : showTextColumn();
    }

    /******************
    * Mobile controls *
    ******************/

    // build the dropdown for toggling map options in mobile views
    $scope.buildOverlayOptions = function() {

      // the dropdown options are articulated in $scope.mapOverlays
      $scope.overlayOptions = [];
      for (var i=0; i<Object.keys($scope.mapOverlays).length; i++) {

        // the display option should contain the content of
        // year - label keys.
        var year = $scope.mapOverlays[i].year;
        var label = $scope.mapOverlays[i].label;
        var overlayLabel = year + " - " + label;

        $scope.overlayOptions.push({
          "label": overlayLabel,
          "id": i
        });
      };
    };


    // add a client side listener to change image overlay on
    // change of the select box
    $scope.setOverlayOption = function(overlayOption) {
      $scope.selectOverlay(overlayOption.id);
    };


    // define the partials to be used within the left and right
    // regions of the mid-page mobile controls
    $scope.mobile = {
      "mobileControlsLeft": "/templates/partials/historical-geography/overlay-select-dropdown.html",
      "mobileControlsLeftClass": "",
      "mobileControlsRight": "/templates/partials/historical-geography/opacity-slider.html",
      "mobileControlsRightClass": ""
    };

    /*****************
    * Image overlays *
    *****************/

    // add a function that displays the tiles at the specified url
    var addImageOverlay = function(map, imageTileUrl) {

      // remove the old imageOverlay layer
      $(".imageOverlay").remove();

      var imageOverlay = L.tileLayer(imageTileUrl, {
        attribution: '<a href="http://web.library.yale.edu/dhlab">DHLab@Yale</a>',
        opacity: .6,
        // set max zoom to prevent requests for tiles that don't exist
        maxZoom: 20,
        tms: true,
        // also set bounds to prevent 404's from appearing when
        // the client requests image tiles from relevant zoom levels
        // if those tiles don't exist. Bounds retrieved from
        // gdalinfo {{geotiff.tif}}
        bounds: [
          L.latLng(41.3183532,-72.9385611),
          L.latLng(41.2950316, -72.8997637)
        ]
      }).addTo(map);

      // add a class to the image tile layer for dynamic css styling
      $(imageOverlay.getContainer()).addClass('imageOverlay');

    };


    /******************
    * Vector overlays *
    ******************/

    var addVectorOverlay = function(map, vectorJsonUrl) {

      // request json that describes building boundaries
      d3.json(vectorJsonUrl, function(rawJson) {

        // Revove any extant building vector overlays from the map.
        // To do so, get a reference to the vectors, then fade them out.
        // One second after that function completes, remove the objects
        // from the DOM.
        var overlayBoundingBox = $(".overlay-bounding-box");
        overlayBoundingBox.addClass("fade-out");
        setTimeout(function(){
          overlayBoundingBox.remove(); },
        1000);

        // each member of this array describes a building
        for (var i=0; i<rawJson.length; i++) {
          var buildingJson = rawJson[i];
          if (buildingJson) {

            // add the building to the map
            var polyline = new L.GeoJSON(buildingJson, {
                className: 'overlay-bounding-box animated fade-in',
                weight: 2,
                fillOpacity: .85
              }
            ).addTo(map);
          }

        }
      });
    }

    // Click listener to toggle vector overlay
    $scope.toggleVectorOverlay = function() {
      $(".vector-overlay-toggle-button").toggleClass("active");
      $(".overlay-bounding-box").toggleClass("hidden");
    };

    /***
    *
    * Overlay data
    *
    * @object: keys are ids for the selected plan
    *          values are labels for the selected plan
    *
    * Defines the available map overlays
    ***/

    $scope.mapOverlays = {
      "0": {
        "year": 1753,
        "label": "Wadsworth Plan",
        "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1748_Wadsworth_Plan-NewHaven_1806-Kensett-engr_Beinecke_15675071-GEO1/{z}/{x}/{y}.png",
        "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1753.json"
      },
      "1": {
        "year": 1802,
        "label": "Plan of New Haven",
        "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1802_Plan-New-Haven_Biencke_105622451_GEO1/{z}/{x}/{y}.png",
        "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1835.json"
      },
      "2": {
        "year": 1824,
        "label": "Doolittle Plan",
        "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1824_Doolittle_Plan-of-New-Haven_Beinecke_156750741/{z}/{x}/{y}.png",
        "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1850.json"
      },
      "3": {
        "year": 1849,
        "label": "Buckingham Plan",
        "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1849_Buckingham_NH_156913731_Geo4/{z}/{x}/{y}.png",
        "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1894.json"
      },
      "4": {
        "year": 1874,
        "label": "Benham Plan",
        "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1874_Benham_15691396_Geo2/{z}/{x}/{y}.png",
        "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1912.json"
      }
    }

    /***
    *
    * Vector overlay selection function
    *
    * @params: Integer that is present in Object.keys(mapOverlayLabels)
    * @returns: none
    *  
    * Updates the map to display the selected map overlay
    ***/

    $scope.selectOverlay = function(selectedId) {

      // store the selected overlay in a scope object
      $scope.selectedOverlay = selectedId;

      // indicate in the selection box which id is currently selected
      $(".map-overlay").removeClass("active");
      $(".map-overlay-" + selectedId).addClass("active");
      
      // update the footer state to show the selected overlay id text
      $scope.footer = {
        "left": {
          "display": $scope.mapOverlays[selectedId]["label"]
        },
        "right": {
          "display": "<i class='fa fa-chevron-circle-up'></i>",
          "url": "/#/",
          "onClick": "toggleTextColumn()"
        },
         "style": "full"
      };

      // add the image tile overlay
      addImageOverlay(map, $scope.mapOverlays[selectedId]["imageOverlayUrl"]);

      // add the vector overlay, which will remove the old vector overlay
      addVectorOverlay(map, $scope.mapOverlays[selectedId]["vectorOverlayUrl"]);

      // add an opacity slider with floot, ceiling, and initial value
      $scope.opacitySlider = {
        value: 70,
        options: {
          floor: 0,
          ceil: 100
        }
      };

      // add an event listener for the slider
      $scope.$on("slideEnded", function() {
        var currentOpacity = $scope.opacitySlider.value;
        var opacityPercent = currentOpacity / $scope.opacitySlider.options.ceil;
        $(".imageOverlay").css("opacity", opacityPercent);
      });

    };

    /***
    * @params: none
    * @returns: none
    *  
    * Function that builds the basemap on which layers will be added
    ***/

    var initializeMap = function() {

      // specify the coordinates on which to center the map initially
      var centerCoordinates = new L.LatLng(41.307, -72.928);

      // create the map object itself
      var map = new L.Map("map", {
        center: centerCoordinates,
        zoom: 17,
        zoomControl: false
      });

      // position the zoom controls in the bottom right hand corner
      L.control.zoom({
        position: 'bottomright',
        zoom: 16,
        maxZoom: 20,
        minZoom: 12,
      }).addTo(map);

      // use the cartodb basemap
      map.addLayer(new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }));

      return map;

    };

    /***
    * @params: none
    * @returns: none
    *  
    * Initializes map overlay and selects the first overlay option
    ***/

    var map = initializeMap();
    $scope.buildOverlayOptions();
    $scope.selectOverlay(0);

  }
]);



// Controller for site architecture and urbanism view
buildingApp.controller("architectureAndUrbanismController", [
    "$scope", "$http", "$location", "$anchorScroll", "$rootScope",
  function($scope, $http, $location, $anchorScroll, $rootScope) {

    /***
    * @params: footer Object sent to footerService to update footerController
    * @returns: none
    *
    * Updates the content in the footer
    ***/

    $scope.footer = {
      "left": {
        "display": "Architecture & Urbanism",
        "url": "/#/routes/architecture-and-urbanism?article=0#0"
      },
      "right": {
        "display": "Next <i class='fa fa-angle-down'></i>",
        "url": "/#/routes/architecture-and-urbanism?article=1#1"
      },
       "style": "partial"
    };


    /***
    *
    * Mobile controls
    *
    ***/

    // build the options for the footer dropdown
    $scope.buildDropdownOptions = function() {
      $scope.dropdownOptions = [];

      for (var i=0; i<Object.keys($scope.textColumn.sections).length; i++) {
        $scope.dropdownOptions.push({
          label: $scope.textColumn.sections[i].title,
          id: $scope.textColumn.sections[i].id
        });

      };
      $scope.dropdownOptions.selected = JSON.parse(localStorage.getItem('selectedOption'));
    };

    // define the configuration of the mobile mid page controls
    $scope.mobile = {
      "mobileControlsLeft": "/templates/partials/layout/dropdown-selector.html",
      "mobileControlsLeftClass": "full-width-mobile-dropdown",
      "mobileControlsRight": "",
      "mobileControlsRightClass": "hidden"
    };


    /***
    * @params: textColumn Object used to update the textColumn factory
    * @returns: none
    *
    * Updates the textColumn controller, which populates the text column
    ***/

    $scope.textColumn = {
      "title": "architecture-and-urbanism",
      "display": "1",
      "hr": "1",
      "sections": {
        "0": {
          "id": "0",
          "title": "Architecture & Urbanism 1",
          "subtitle": "AA Section 1 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, at mel purto delectus legendos, tantas labitur civibus id mel, inani timeam atomorum no eam. Tollit habemus commune mel cu. Has at labores ullamcorper, te eam ullum populo nonumes. Hinc tation nonumy qui id, vis congue molestie ut, in dolorum recusabo sea.", "Et est contentiones mediocritatem, paulo equidem similique eos ad. Forensibus persequeris interpretaris ut mea, duo vitae meliore conceptam at. Vix cu dicam legimus, pri facete fabellas ut, an vis libris aperiri partiendo. Duo conceptam argumentum in, ut eam nisl discere eripuit, errem cetero quaerendum at sed. Mea ex quis hinc persius, esse dignissim sea cu, ut eruditi contentiones has.", "Ad tacimates laboramus nec, cum ex mollis dolores. Sale aperiri pertinax quo eu. Mutat aeterno perpetua vel cu, sed accumsan verterem consequuntur ea, an nobis scribentur has. Eu iudicabit voluptatum vix. Eam eu invenire consetetur suscipiantur, summo mundi voluptaria nec eu, an omnis eirmod tincidunt quo. Vide meis an pri. Est ei meis posidonium argumentum.", "Pro te inani homero, ei delenit iudicabit ius. Minim nostro eruditi eam at, nec everti discere ponderum an. Qui illum ipsum ne. Quidam dolorem dolores ex per, ex nec integre patrioque intellegat. An nam munere impetus.", "Periculis hendrerit sententiae id has. Vel eu natum ferri evertitur, vim at augue facilisi. Pri erant civibus id, inermis definitiones cu vis. Tritani verterem cotidieque eos ea. Pri at probatus partiendo efficiendi, minim liber accusamus at vix. Vix ceteros percipit antiopam et, option concludaturque ex per, no eum modo audiam adversarium.", "Modo novum fastidii an quo. Mea ad nisl feugiat voluptaria, per tantas expetenda ad. Cum quem meis integre ne. Ius an duis appetere, tempor atomorum voluptaria sit te. Ea omnes semper explicari duo, eu velit detracto est. In aeque assentior reprimique duo.", "Congue munere his ad, an has detracto deterruisset. An eam dolor laoreet, affert nullam pri in. Vis et saepe feugiat, vim ut labore iracundia. Ut sumo vitae nec, pro ei soluta labores. Vis delenit petentium no, suscipit petentium deterruisset per no.", "Novum mucius te mea, ne natum detraxit sea. Cibo euismod incorrupte et sed, ad mel omittantur interpretaris. Ad erant nihil placerat ius. Has eu mutat persius tractatos, cu nec putant vulputate, fugit theophrastus nam ea. Cibo habemus gloriatur qui et, usu mollis fierent placerat ne, eum senserit abhorreant ut.", "Mei cu eripuit alienum euripidis. Propriae constituto complectitur ad mea, partem propriae scaevola eu nec. Sit cu verear sanctus pericula. Ut usu sint salutandi, posse noster at vis. Errem appetere ex vis, at sed scaevola accusamus inciderint.", "Pri te tota insolens mediocrem, has in illud porro facilisis. An duo laudem ocurreret, has duis detraxit argumentum eu. Ius id quis postea suscipit, est falli scripserit interpretaris ea, in sit deseruisse disputationi. At ridens apeirian sed, eam unum dicunt reformidans te. Illum minimum sit ea, per omnis laudem ea. Per eleifend corrumpit id, liber adversarium ius at, ei pro putant corpora forensibus."],
          "background": {
            "1": {
              "url": "/assets/images/skyline.jpg",
              "alt": "Image of scaffolding",
              "annotation": "Scholarly annotation of scaffold image"
            }
          }
        },

        "1": {
          "id": "1",
          "title": "Architecture & Urbanism 2",
          "subtitle": "AA Section 1 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, at mel purto delectus legendos, tantas labitur civibus id mel, inani timeam atomorum no eam. Tollit habemus commune mel cu. Has at labores ullamcorper, te eam ullum populo nonumes. Hinc tation nonumy qui id, vis congue molestie ut, in dolorum recusabo sea.", "Et est contentiones mediocritatem, paulo equidem similique eos ad. Forensibus persequeris interpretaris ut mea, duo vitae meliore conceptam at. Vix cu dicam legimus, pri facete fabellas ut, an vis libris aperiri partiendo. Duo conceptam argumentum in, ut eam nisl discere eripuit, errem cetero quaerendum at sed. Mea ex quis hinc persius, esse dignissim sea cu, ut eruditi contentiones has.", "Ad tacimates laboramus nec, cum ex mollis dolores. Sale aperiri pertinax quo eu. Mutat aeterno perpetua vel cu, sed accumsan verterem consequuntur ea, an nobis scribentur has. Eu iudicabit voluptatum vix. Eam eu invenire consetetur suscipiantur, summo mundi voluptaria nec eu, an omnis eirmod tincidunt quo. Vide meis an pri. Est ei meis posidonium argumentum.", "Pro te inani homero, ei delenit iudicabit ius. Minim nostro eruditi eam at, nec everti discere ponderum an. Qui illum ipsum ne. Quidam dolorem dolores ex per, ex nec integre patrioque intellegat. An nam munere impetus.", "Periculis hendrerit sententiae id has. Vel eu natum ferri evertitur, vim at augue facilisi. Pri erant civibus id, inermis definitiones cu vis. Tritani verterem cotidieque eos ea. Pri at probatus partiendo efficiendi, minim liber accusamus at vix. Vix ceteros percipit antiopam et, option concludaturque ex per, no eum modo audiam adversarium.", "Modo novum fastidii an quo. Mea ad nisl feugiat voluptaria, per tantas expetenda ad. Cum quem meis integre ne. Ius an duis appetere, tempor atomorum voluptaria sit te. Ea omnes semper explicari duo, eu velit detracto est. In aeque assentior reprimique duo.", "Congue munere his ad, an has detracto deterruisset. An eam dolor laoreet, affert nullam pri in. Vis et saepe feugiat, vim ut labore iracundia. Ut sumo vitae nec, pro ei soluta labores. Vis delenit petentium no, suscipit petentium deterruisset per no.", "Novum mucius te mea, ne natum detraxit sea. Cibo euismod incorrupte et sed, ad mel omittantur interpretaris. Ad erant nihil placerat ius. Has eu mutat persius tractatos, cu nec putant vulputate, fugit theophrastus nam ea. Cibo habemus gloriatur qui et, usu mollis fierent placerat ne, eum senserit abhorreant ut.", "Mei cu eripuit alienum euripidis. Propriae constituto complectitur ad mea, partem propriae scaevola eu nec. Sit cu verear sanctus pericula. Ut usu sint salutandi, posse noster at vis. Errem appetere ex vis, at sed scaevola accusamus inciderint.", "Pri te tota insolens mediocrem, has in illud porro facilisis. An duo laudem ocurreret, has duis detraxit argumentum eu. Ius id quis postea suscipit, est falli scripserit interpretaris ea, in sit deseruisse disputationi. At ridens apeirian sed, eam unum dicunt reformidans te. Illum minimum sit ea, per omnis laudem ea. Per eleifend corrumpit id, liber adversarium ius at, ei pro putant corpora forensibus."],
          "background": {
            "1": {
              "url": "/assets/images/sunset.jpg",
              "alt": "Image of skyline",
              "annotation": "Scholarly annotation of skyline image"
            }
          }
        }
      }
    };

    // Add a scroll listener to update background dynamically
    $scope.getScrollPosition = function(arg) {
      if (arg<2022) {
        $scope.backgroundImageUrl = $scope.textColumn["sections"]["0"]["background"]["1"]["url"];
        $scope.footer.right.url = "/#/routes/architecture-and-urbanism?article=1#1";
        $scope.$apply();
      };

      if (arg>2022) {
        $scope.backgroundImageUrl = $scope.textColumn["sections"]["1"]["background"]["1"]["url"];
        $scope.footer.right.url = "/#/routes/architecture-and-urbanism?article=0#0";
        $scope.$apply();
      };
    };

    // initialize the application state
    $scope.backgroundImageUrl = $scope.textColumn["sections"]["0"]["background"]["1"]["url"];
    $scope.buildDropdownOptions();

  }
]);



// Controller for material journeys view
buildingApp.controller("materialJourneysController", [
      "$scope", "$http", "$location", "$anchorScroll",
  function($scope, $http, $location, $anchorScroll) {

    // Set initial footer params, and update as page updates
    $scope.footer = {
      "left": {
        "display": "Material Journeys",
        "url": "/#/routes/material-journeys?article=0#0"
      },
      "right": {
        "display": 'Next <i class="fa fa-angle-down"></i>',
        "url": "/#/routes/material-journeys?article=1#1"
      },
       "style": "partial"
    };


    /***
    * Mobile controls
    ***/

    // build the options for the footer dropdown
    $scope.buildDropdownOptions = function() {
      $scope.dropdownOptions = [];

      for (var i=0; i<Object.keys($scope.textColumn.sections).length; i++) {
        $scope.dropdownOptions.push({
          label: $scope.textColumn.sections[i].title,
          id: $scope.textColumn.sections[i].id
        });

      };
      $scope.dropdownOptions.selected = JSON.parse(localStorage.getItem('selectedOption'));
    };

    // define the configuration of the mobile mid page controls
    $scope.mobile = {
      "mobileControlsLeft": "/templates/partials/layout/dropdown-selector.html",
      "mobileControlsLeftClass": "full-width-mobile-dropdown",
      "mobileControlsRight": "",
      "mobileControlsRightClass": "hidden"
    };


    /***
    * Text columnn
    ***/

    $scope.textColumn = {
      "title": "material-journeys",
      "display": "1",
      "hr": "1",
      "sections": {
        "0": {
          "id": "0",
          "controller": "material-journeys",
          "title": "MATERIAL JOURNEYS",
          "subtitle": "MJ TABLE OF CONTENTS",
          "paragraphs": [
            "<a href='/#/routes/material-journeys?article=1#1'><h2 class='section-subheading'>CONCRETE</h2></a>",
            "<a href='/#/routes/material-journeys?article=2#2'><h2 class='section-subheading'>STONE</h2></a>",
            "<a href='/#/routes/material-journeys?article=3#3'><h2 class='section-subheading'>BRICK</h2></a>",
            "<a href='/#/routes/material-journeys?article=4#4'><h2 class='section-subheading'>GLASS</h2></a>",
            "<div class='section-introduction-text'>Egestas hendrerit dignissim non neque urna, a imperdiet pretium congue egestas rhoncus. Porttitor vitae, at donec aliquet. Sollicitudin velit metus nonummy. Hendrerit nullam pulvinar, adipiscing mus, sit nulla justo, odio leo tellus pede risus proin, elementum et. Tellus a eget nec tempus.</div>"
          ],
          "introImage": "",
          "background": {
            "1": {
              "url": "",
              "alt": "",
              "annotation": ""
            }
          }
        },

        "1": {
          "id": "1",
          "controller": "material-journeys",
          "title": "Concrete",
          "subtitle": "MJ Section 1 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his. Probo explicari te ius. Id vix expetenda conceptam democritum, et vocent propriae pro. Cu scaevola instructior duo, his dicunt phaedrum ad, at dicat veritus constituam sea. Nobis possit scaevola sit ex, stet eloquentiam ne pri.", "Debitis mediocritatem cu pro, te pro recusabo abhorreant. Hinc perpetua per ad, mea ei munere causae commune. Vide placerat democritum ne pri, modus docendi te pro, illud dicant eos no. Quod platonem ad pri, pri ne virtute invidunt deterruisset. Ut iusto forensibus reprehendunt vis.", "Graece theophrastus ut vel, vim gloriatur intellegam cotidieque ne. Quo delenit perfecto et, dicat labores ne qui, pro id dicam aperiam disputando. Mucius intellegam te nam. Eum et augue tantas, ad tale delenit mea. An natum platonem elaboraret eam, quando forensibus pro ex. Id eam mutat mediocrem maiestatis. Mea mazim quando indoctum ea, liber integre principes quo at, pri ad accusamus consectetuer.", "Eos ex epicurei persequeris appellantur, ea alii velit augue cum. An dolor sententiae vis, ne modo aperiam imperdiet cum. Ex cum amet adversarium interpretaris, nisl utinam ea has. Minim vidisse eam no, ut eos dolor ridens, eum te moderatius efficiantur ullamcorper.", "Ne mea tempor theophrastus, eam in mandamus euripidis intellegebat. Usu laoreet lobortis efficiantur no, agam nemore evertitur eu vel, ex duo tincidunt democritum. Munere labore ei pro, impetus sensibus in vis. Vel ut habeo voluptaria, per eu quem erat facete, cu eam dolor eligendi perpetua. Dolor assentior maiestatis ne eam.", "No per rebum impetus sadipscing, tollit euismod an eum. Usu oportere partiendo no, in sed brute fastidii philosophia. Ut pri bonorum probatus. Te nostro repudiandae nam, ex eum porro atqui.", "At eos omnes decore quidam. Dolore mollis eripuit eum ex, minim mediocritatem vim te. Eruditi pertinax te cum, ancillae maluisset cum ei. Ut mei maiorum dissentias, veri virtute habemus cu has. Sed eu scribentur instructior, eos ei agam latine complectitur.", "Wisi debet clita vim ea. Magna habeo mucius vix no, ad pri recusabo expetendis. Ei est etiam aliquid. Mea brute mnesarchum et, ne dolores appareat interpretaris vel.", "Legere omittam appetere in mel. An eum quaeque referrentur. At vim quod modus scripta. Pro ne facer eruditi, partem efficiendi te sed, et praesent interesset ius. Porro dolores et vel, dico antiopam id duo.", "Nam saepe adolescens reprehendunt ea, homero timeam nostrum eos et. Cu eum reque evertitur, ius eu nonumy delectus voluptatibus. Mei no diceret percipit voluptatum, aeque omnes id has. Ad possit democritum eum, copiosae perfecto tacimates has no, natum mundi congue te mea. Ut doming utamur eos."],
          "introImage": "/assets/images/concrete.jpg",
          "background": {
            "1": {
              "url": "/assets/images/sunset.jpg",
              "alt": "Image of scaffolding",
              "annotation": "Scholarly annotation of scaffold image"
            }
          }
        },

        "2": {
          "id": "2",
          "controller": "material-journeys",
          "title": "Stone",
          "subtitle": "MJ Section 2 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his. Probo explicari te ius. Id vix expetenda conceptam democritum, et vocent propriae pro. Cu scaevola instructior duo, his dicunt phaedrum ad, at dicat veritus constituam sea. Nobis possit scaevola sit ex, stet eloquentiam ne pri.", "Debitis mediocritatem cu pro, te pro recusabo abhorreant. Hinc perpetua per ad, mea ei munere causae commune. Vide placerat democritum ne pri, modus docendi te pro, illud dicant eos no. Quod platonem ad pri, pri ne virtute invidunt deterruisset. Ut iusto forensibus reprehendunt vis.", "Graece theophrastus ut vel, vim gloriatur intellegam cotidieque ne. Quo delenit perfecto et, dicat labores ne qui, pro id dicam aperiam disputando. Mucius intellegam te nam. Eum et augue tantas, ad tale delenit mea. An natum platonem elaboraret eam, quando forensibus pro ex. Id eam mutat mediocrem maiestatis. Mea mazim quando indoctum ea, liber integre principes quo at, pri ad accusamus consectetuer.", "Eos ex epicurei persequeris appellantur, ea alii velit augue cum. An dolor sententiae vis, ne modo aperiam imperdiet cum. Ex cum amet adversarium interpretaris, nisl utinam ea has. Minim vidisse eam no, ut eos dolor ridens, eum te moderatius efficiantur ullamcorper.", "Ne mea tempor theophrastus, eam in mandamus euripidis intellegebat. Usu laoreet lobortis efficiantur no, agam nemore evertitur eu vel, ex duo tincidunt democritum. Munere labore ei pro, impetus sensibus in vis. Vel ut habeo voluptaria, per eu quem erat facete, cu eam dolor eligendi perpetua. Dolor assentior maiestatis ne eam.", "No per rebum impetus sadipscing, tollit euismod an eum. Usu oportere partiendo no, in sed brute fastidii philosophia. Ut pri bonorum probatus. Te nostro repudiandae nam, ex eum porro atqui.", "At eos omnes decore quidam. Dolore mollis eripuit eum ex, minim mediocritatem vim te. Eruditi pertinax te cum, ancillae maluisset cum ei. Ut mei maiorum dissentias, veri virtute habemus cu has. Sed eu scribentur instructior, eos ei agam latine complectitur.", "Wisi debet clita vim ea. Magna habeo mucius vix no, ad pri recusabo expetendis. Ei est etiam aliquid. Mea brute mnesarchum et, ne dolores appareat interpretaris vel.", "Legere omittam appetere in mel. An eum quaeque referrentur. At vim quod modus scripta. Pro ne facer eruditi, partem efficiendi te sed, et praesent interesset ius. Porro dolores et vel, dico antiopam id duo.", "Nam saepe adolescens reprehendunt ea, homero timeam nostrum eos et. Cu eum reque evertitur, ius eu nonumy delectus voluptatibus. Mei no diceret percipit voluptatum, aeque omnes id has. Ad possit democritum eum, copiosae perfecto tacimates has no, natum mundi congue te mea. Ut doming utamur eos."],
          "introImage": "/assets/images/stone.jpg",
          "background": {
            "1": {
              "url": "/assets/images/scaffold.jpg",
              "alt": "Image of scaffold",
              "annotation": "Scholarly annotation of scaffold image"
            }
          }
        },

        "3": {
          "id": "3",
          "controller": "material-journeys",
          "title": "Brick",
          "subtitle": "MJ Section 3 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his. Probo explicari te ius. Id vix expetenda conceptam democritum, et vocent propriae pro. Cu scaevola instructior duo, his dicunt phaedrum ad, at dicat veritus constituam sea. Nobis possit scaevola sit ex, stet eloquentiam ne pri.", "Debitis mediocritatem cu pro, te pro recusabo abhorreant. Hinc perpetua per ad, mea ei munere causae commune. Vide placerat democritum ne pri, modus docendi te pro, illud dicant eos no. Quod platonem ad pri, pri ne virtute invidunt deterruisset. Ut iusto forensibus reprehendunt vis.", "Graece theophrastus ut vel, vim gloriatur intellegam cotidieque ne. Quo delenit perfecto et, dicat labores ne qui, pro id dicam aperiam disputando. Mucius intellegam te nam. Eum et augue tantas, ad tale delenit mea. An natum platonem elaboraret eam, quando forensibus pro ex. Id eam mutat mediocrem maiestatis. Mea mazim quando indoctum ea, liber integre principes quo at, pri ad accusamus consectetuer.", "Eos ex epicurei persequeris appellantur, ea alii velit augue cum. An dolor sententiae vis, ne modo aperiam imperdiet cum. Ex cum amet adversarium interpretaris, nisl utinam ea has. Minim vidisse eam no, ut eos dolor ridens, eum te moderatius efficiantur ullamcorper.", "Ne mea tempor theophrastus, eam in mandamus euripidis intellegebat. Usu laoreet lobortis efficiantur no, agam nemore evertitur eu vel, ex duo tincidunt democritum. Munere labore ei pro, impetus sensibus in vis. Vel ut habeo voluptaria, per eu quem erat facete, cu eam dolor eligendi perpetua. Dolor assentior maiestatis ne eam.", "No per rebum impetus sadipscing, tollit euismod an eum. Usu oportere partiendo no, in sed brute fastidii philosophia. Ut pri bonorum probatus. Te nostro repudiandae nam, ex eum porro atqui.", "At eos omnes decore quidam. Dolore mollis eripuit eum ex, minim mediocritatem vim te. Eruditi pertinax te cum, ancillae maluisset cum ei. Ut mei maiorum dissentias, veri virtute habemus cu has. Sed eu scribentur instructior, eos ei agam latine complectitur.", "Wisi debet clita vim ea. Magna habeo mucius vix no, ad pri recusabo expetendis. Ei est etiam aliquid. Mea brute mnesarchum et, ne dolores appareat interpretaris vel.", "Legere omittam appetere in mel. An eum quaeque referrentur. At vim quod modus scripta. Pro ne facer eruditi, partem efficiendi te sed, et praesent interesset ius. Porro dolores et vel, dico antiopam id duo.", "Nam saepe adolescens reprehendunt ea, homero timeam nostrum eos et. Cu eum reque evertitur, ius eu nonumy delectus voluptatibus. Mei no diceret percipit voluptatum, aeque omnes id has. Ad possit democritum eum, copiosae perfecto tacimates has no, natum mundi congue te mea. Ut doming utamur eos."],
          "introImage": "/assets/images/brick.jpg",
          "background": {
            "1": {
              "url": "/assets/images/skyline.jpg",
              "alt": "Image of skyline",
              "annotation": "Scholarly annotation of skyline image"
            }
          }
        },

        "4": {
          "id": "4",
          "controller": "material-journeys",
          "title": "Glass",
          "subtitle": "MJ Section 4 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his. Probo explicari te ius. Id vix expetenda conceptam democritum, et vocent propriae pro. Cu scaevola instructior duo, his dicunt phaedrum ad, at dicat veritus constituam sea. Nobis possit scaevola sit ex, stet eloquentiam ne pri.", "Debitis mediocritatem cu pro, te pro recusabo abhorreant. Hinc perpetua per ad, mea ei munere causae commune. Vide placerat democritum ne pri, modus docendi te pro, illud dicant eos no. Quod platonem ad pri, pri ne virtute invidunt deterruisset. Ut iusto forensibus reprehendunt vis.", "Graece theophrastus ut vel, vim gloriatur intellegam cotidieque ne. Quo delenit perfecto et, dicat labores ne qui, pro id dicam aperiam disputando. Mucius intellegam te nam. Eum et augue tantas, ad tale delenit mea. An natum platonem elaboraret eam, quando forensibus pro ex. Id eam mutat mediocrem maiestatis. Mea mazim quando indoctum ea, liber integre principes quo at, pri ad accusamus consectetuer.", "Eos ex epicurei persequeris appellantur, ea alii velit augue cum. An dolor sententiae vis, ne modo aperiam imperdiet cum. Ex cum amet adversarium interpretaris, nisl utinam ea has. Minim vidisse eam no, ut eos dolor ridens, eum te moderatius efficiantur ullamcorper.", "Ne mea tempor theophrastus, eam in mandamus euripidis intellegebat. Usu laoreet lobortis efficiantur no, agam nemore evertitur eu vel, ex duo tincidunt democritum. Munere labore ei pro, impetus sensibus in vis. Vel ut habeo voluptaria, per eu quem erat facete, cu eam dolor eligendi perpetua. Dolor assentior maiestatis ne eam.", "No per rebum impetus sadipscing, tollit euismod an eum. Usu oportere partiendo no, in sed brute fastidii philosophia. Ut pri bonorum probatus. Te nostro repudiandae nam, ex eum porro atqui.", "At eos omnes decore quidam. Dolore mollis eripuit eum ex, minim mediocritatem vim te. Eruditi pertinax te cum, ancillae maluisset cum ei. Ut mei maiorum dissentias, veri virtute habemus cu has. Sed eu scribentur instructior, eos ei agam latine complectitur.", "Wisi debet clita vim ea. Magna habeo mucius vix no, ad pri recusabo expetendis. Ei est etiam aliquid. Mea brute mnesarchum et, ne dolores appareat interpretaris vel.", "Legere omittam appetere in mel. An eum quaeque referrentur. At vim quod modus scripta. Pro ne facer eruditi, partem efficiendi te sed, et praesent interesset ius. Porro dolores et vel, dico antiopam id duo.", "Nam saepe adolescens reprehendunt ea, homero timeam nostrum eos et. Cu eum reque evertitur, ius eu nonumy delectus voluptatibus. Mei no diceret percipit voluptatum, aeque omnes id has. Ad possit democritum eum, copiosae perfecto tacimates has no, natum mundi congue te mea. Ut doming utamur eos."],
          "introImage": "/assets/images/glass.jpg",
          "background": {
            "1": {
              "url": "/assets/images/sunset.jpg",
              "alt": "Image of sunset",
              "annotation": "Scholarly annotation of sunset image"
            }
          }
        }
      }
    };

    /***
    * Bind a scroll listener to swap background images dynamically
    ***/

    $scope.getScrollPosition = function(scrollPosition) {
      console.log(scrollPosition);

      if (scrollPosition < 640) {
        $scope.showTableOfContents = 1;
        $scope.backgroundImageUrl = $scope.textColumn["sections"]["0"]["background"]["1"]["url"];
        $scope.footer.right.url = "/#/routes/material-journeys?article=1#1"
        $scope.$apply();
      }

      if (scrollPosition > 640) {
        $scope.showTableOfContents = 0;
        $scope.backgroundImageUrl = $scope.textColumn["sections"]["1"]["background"]["1"]["url"];
        $scope.footer.right.url = "/#/routes/material-journeys?article=2#2"
        $scope.$apply();

      }

      if (scrollPosition > 2620) {
        $scope.backgroundImageUrl = $scope.textColumn["sections"]["2"]["background"]["1"]["url"];
        $scope.footer.right.url = "/#/routes/material-journeys?article=3#3"
        $scope.$apply();
      }

      if (scrollPosition > 4750) {
        $scope.backgroundImageUrl = $scope.textColumn["sections"]["3"]["background"]["1"]["url"];
        $scope.footer.right.url = "/#/routes/material-journeys?article=4#4"
        $scope.$apply();
      }

      if (scrollPosition > 6670) {
        $scope.backgroundImageUrl = $scope.textColumn["sections"]["4"]["background"]["1"]["url"];
        $scope.footer.right.url = "/#/routes/material-journeys?article=0#0"
        $scope.$apply();
      }
    }

    // initialize the application state
    $scope.showTableOfContents = 1;
    $scope.backgroundImageUrl = $scope.textColumn["sections"]["0"]["background"]["1"]["url"];
    $scope.buildDropdownOptions();

  }
]);


// Controller for people and place view
buildingApp.controller("peopleAndPlaceController", [
      "$scope", "$http", "$location", "$anchorScroll",
  function($scope, $http, $location, $anchorScroll) {

    /***
    *
    * Footer
    *
    ***/

    $scope.footer = {
      "left": {
        "display": "People & Place",
        "url": "/#/routes/people-and-place?article=0#0"
      },
      "right": {
        "display": "Next <i class='fa fa-angle-down'></i>",
        "url": "/#/routes/people-and-place?article=1#1"
      },
       "style": "partial"
     };


    /***
    * Mobile controls
    ***/

    // build the options for the footer dropdown
    $scope.buildDropdownOptions = function() {
      $scope.dropdownOptions = [];

      for (var i=0; i<Object.keys($scope.textColumn.sections).length; i++) {
        $scope.dropdownOptions.push({
          label: $scope.textColumn.sections[i].title,
          id: $scope.textColumn.sections[i].id
        });

      };
      $scope.dropdownOptions.selected = JSON.parse(localStorage.getItem('selectedOption'));
    };

    // define the configuration of the mobile mid page controls
    $scope.mobile = {
      "mobileControlsLeft": "/templates/partials/layout/dropdown-selector.html",
      "mobileControlsLeftClass": "full-width-mobile-dropdown",
      "mobileControlsRight": "",
      "mobileControlsRightClass": "hidden"
    };

    /***
    *
    * Text column
    *
    ***/

    $scope.textColumn = {
      "title": "people-and-place",
      "display": "1",
      "hr": "1",
      "sections": {
        "0": {
          "id": "0",
          "title": "PEOPLE & PLACE",
          "subtitle": "AU Section 1 subtitle is longer than the title",
          "paragraphs": [
            "<a href='/#/routes/people-and-place?article=1#1'><h2 class='section-subheading'>SECTION ONE</h2></a>",
            "<a href='/#/routes/people-and-place?article=2#2'><h2 class='section-subheading'>SECTION TWO</h2></a>",
            "<a href='/#/routes/people-and-place?article=3#3'><h2 class='section-subheading'>SECTION THREE</h2></a>",
            "<a href='/#/routes/people-and-place?article=4#4'><h2 class='section-subheading'>SECTION FOUR</h2></a>",
            "<a href='/#/routes/people-and-place?article=5#5'><h2 class='section-subheading'>SECTION FIVE</h2></a>",
            "<div class='section-introduction-text'>Egestas hendrerit dignissim non neque urna, a imperdiet pretium congue egestas rhoncus. Porttitor vitae, at donec aliquet. Sollicitudin velit metus nonummy.</div>"
          ],
          "topRightHtml": '<div class="fill-container" style="background: url(/assets/images/cardboard_colleges.jpg) no-repeat center center; background-size: cover;"></div>',
          "bottomLeftHtml": '<div class="fill-container" style="background: url(/assets/images/mapbox_base.png) no-repeat center center; background-size: cover;"></div>',
          "bottomRightHtml": '<div class="fill-container"><div class="caption-container"><div class="caption caption-top">Top: Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his.</div><div class="caption caption-left">Left: Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his.</div></div></div>'
        },

        "1": {
          "id": "1",
          "title": "SECTION ONE",
          "subtitle": "PP Section 1 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his. Probo explicari te ius. Id vix expetenda conceptam democritum, et vocent propriae pro. Cu scaevola instructior duo, his dicunt phaedrum ad, at dicat veritus constituam sea. Nobis possit scaevola sit ex, stet eloquentiam ne pri.", "Debitis mediocritatem cu pro, te pro recusabo abhorreant. Hinc perpetua per ad, mea ei munere causae commune. Vide placerat democritum ne pri, modus docendi te pro, illud dicant eos no. Quod platonem ad pri, pri ne virtute invidunt deterruisset. Ut iusto forensibus reprehendunt vis.", "Graece theophrastus ut vel, vim gloriatur intellegam cotidieque ne. Quo delenit perfecto et, dicat labores ne qui, pro id dicam aperiam disputando. Mucius intellegam te nam. Eum et augue tantas, ad tale delenit mea. An natum platonem elaboraret eam, quando forensibus pro ex. Id eam mutat mediocrem maiestatis. Mea mazim quando indoctum ea, liber integre principes quo at, pri ad accusamus consectetuer.", "Eos ex epicurei persequeris appellantur, ea alii velit augue cum. An dolor sententiae vis, ne modo aperiam imperdiet cum. Ex cum amet adversarium interpretaris, nisl utinam ea has. Minim vidisse eam no, ut eos dolor ridens, eum te moderatius efficiantur ullamcorper.", "Ne mea tempor theophrastus, eam in mandamus euripidis intellegebat. Usu laoreet lobortis efficiantur no, agam nemore evertitur eu vel, ex duo tincidunt democritum. Munere labore ei pro, impetus sensibus in vis. Vel ut habeo voluptaria, per eu quem erat facete, cu eam dolor eligendi perpetua. Dolor assentior maiestatis ne eam.", "No per rebum impetus sadipscing, tollit euismod an eum. Usu oportere partiendo no, in sed brute fastidii philosophia. Ut pri bonorum probatus. Te nostro repudiandae nam, ex eum porro atqui.", "At eos omnes decore quidam. Dolore mollis eripuit eum ex, minim mediocritatem vim te. Eruditi pertinax te cum, ancillae maluisset cum ei. Ut mei maiorum dissentias, veri virtute habemus cu has. Sed eu scribentur instructior, eos ei agam latine complectitur.", "Wisi debet clita vim ea. Magna habeo mucius vix no, ad pri recusabo expetendis. Ei est etiam aliquid. Mea brute mnesarchum et, ne dolores appareat interpretaris vel.", "Legere omittam appetere in mel. An eum quaeque referrentur. At vim quod modus scripta. Pro ne facer eruditi, partem efficiendi te sed, et praesent interesset ius. Porro dolores et vel, dico antiopam id duo.", "Nam saepe adolescens reprehendunt ea, homero timeam nostrum eos et. Cu eum reque evertitur, ius eu nonumy delectus voluptatibus. Mei no diceret percipit voluptatum, aeque omnes id has. Ad possit democritum eum, copiosae perfecto tacimates has no, natum mundi congue te mea. Ut doming utamur eos."],
          "introImage": "/assets/images/stone.jpg",
          "background": {
            "1": {
              "url": "/assets/images/sunset.jpg",
              "alt": "Image of scaffolding",
              "annotation": "Scholarly annotation of scaffold image"
            }
          }
        },

        "2": {
          "id": "2",
          "title": "SECTION TWO",
          "subtitle": "PP Section 2 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his. Probo explicari te ius. Id vix expetenda conceptam democritum, et vocent propriae pro. Cu scaevola instructior duo, his dicunt phaedrum ad, at dicat veritus constituam sea. Nobis possit scaevola sit ex, stet eloquentiam ne pri.", "Debitis mediocritatem cu pro, te pro recusabo abhorreant. Hinc perpetua per ad, mea ei munere causae commune. Vide placerat democritum ne pri, modus docendi te pro, illud dicant eos no. Quod platonem ad pri, pri ne virtute invidunt deterruisset. Ut iusto forensibus reprehendunt vis.", "Graece theophrastus ut vel, vim gloriatur intellegam cotidieque ne. Quo delenit perfecto et, dicat labores ne qui, pro id dicam aperiam disputando. Mucius intellegam te nam. Eum et augue tantas, ad tale delenit mea. An natum platonem elaboraret eam, quando forensibus pro ex. Id eam mutat mediocrem maiestatis. Mea mazim quando indoctum ea, liber integre principes quo at, pri ad accusamus consectetuer.", "Eos ex epicurei persequeris appellantur, ea alii velit augue cum. An dolor sententiae vis, ne modo aperiam imperdiet cum. Ex cum amet adversarium interpretaris, nisl utinam ea has. Minim vidisse eam no, ut eos dolor ridens, eum te moderatius efficiantur ullamcorper.", "Ne mea tempor theophrastus, eam in mandamus euripidis intellegebat. Usu laoreet lobortis efficiantur no, agam nemore evertitur eu vel, ex duo tincidunt democritum. Munere labore ei pro, impetus sensibus in vis. Vel ut habeo voluptaria, per eu quem erat facete, cu eam dolor eligendi perpetua. Dolor assentior maiestatis ne eam.", "No per rebum impetus sadipscing, tollit euismod an eum. Usu oportere partiendo no, in sed brute fastidii philosophia. Ut pri bonorum probatus. Te nostro repudiandae nam, ex eum porro atqui.", "At eos omnes decore quidam. Dolore mollis eripuit eum ex, minim mediocritatem vim te. Eruditi pertinax te cum, ancillae maluisset cum ei. Ut mei maiorum dissentias, veri virtute habemus cu has. Sed eu scribentur instructior, eos ei agam latine complectitur.", "Wisi debet clita vim ea. Magna habeo mucius vix no, ad pri recusabo expetendis. Ei est etiam aliquid. Mea brute mnesarchum et, ne dolores appareat interpretaris vel.", "Legere omittam appetere in mel. An eum quaeque referrentur. At vim quod modus scripta. Pro ne facer eruditi, partem efficiendi te sed, et praesent interesset ius. Porro dolores et vel, dico antiopam id duo.", "Nam saepe adolescens reprehendunt ea, homero timeam nostrum eos et. Cu eum reque evertitur, ius eu nonumy delectus voluptatibus. Mei no diceret percipit voluptatum, aeque omnes id has. Ad possit democritum eum, copiosae perfecto tacimates has no, natum mundi congue te mea. Ut doming utamur eos."],
          "introImage": "/assets/images/brick.jpg",
          "background": {
            "1": {
              "url": "/assets/images/scaffold.jpg",
              "alt": "Image of skyline",
              "annotation": "Scholarly annotation of skyline image"
            }
          }
        },

        "3": {
          "id": "3",
          "title": "SECTION THREE",
          "subtitle": "PP Section 3 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his. Probo explicari te ius. Id vix expetenda conceptam democritum, et vocent propriae pro. Cu scaevola instructior duo, his dicunt phaedrum ad, at dicat veritus constituam sea. Nobis possit scaevola sit ex, stet eloquentiam ne pri.", "Debitis mediocritatem cu pro, te pro recusabo abhorreant. Hinc perpetua per ad, mea ei munere causae commune. Vide placerat democritum ne pri, modus docendi te pro, illud dicant eos no. Quod platonem ad pri, pri ne virtute invidunt deterruisset. Ut iusto forensibus reprehendunt vis.", "Graece theophrastus ut vel, vim gloriatur intellegam cotidieque ne. Quo delenit perfecto et, dicat labores ne qui, pro id dicam aperiam disputando. Mucius intellegam te nam. Eum et augue tantas, ad tale delenit mea. An natum platonem elaboraret eam, quando forensibus pro ex. Id eam mutat mediocrem maiestatis. Mea mazim quando indoctum ea, liber integre principes quo at, pri ad accusamus consectetuer.", "Eos ex epicurei persequeris appellantur, ea alii velit augue cum. An dolor sententiae vis, ne modo aperiam imperdiet cum. Ex cum amet adversarium interpretaris, nisl utinam ea has. Minim vidisse eam no, ut eos dolor ridens, eum te moderatius efficiantur ullamcorper.", "Ne mea tempor theophrastus, eam in mandamus euripidis intellegebat. Usu laoreet lobortis efficiantur no, agam nemore evertitur eu vel, ex duo tincidunt democritum. Munere labore ei pro, impetus sensibus in vis. Vel ut habeo voluptaria, per eu quem erat facete, cu eam dolor eligendi perpetua. Dolor assentior maiestatis ne eam.", "No per rebum impetus sadipscing, tollit euismod an eum. Usu oportere partiendo no, in sed brute fastidii philosophia. Ut pri bonorum probatus. Te nostro repudiandae nam, ex eum porro atqui.", "At eos omnes decore quidam. Dolore mollis eripuit eum ex, minim mediocritatem vim te. Eruditi pertinax te cum, ancillae maluisset cum ei. Ut mei maiorum dissentias, veri virtute habemus cu has. Sed eu scribentur instructior, eos ei agam latine complectitur.", "Wisi debet clita vim ea. Magna habeo mucius vix no, ad pri recusabo expetendis. Ei est etiam aliquid. Mea brute mnesarchum et, ne dolores appareat interpretaris vel.", "Legere omittam appetere in mel. An eum quaeque referrentur. At vim quod modus scripta. Pro ne facer eruditi, partem efficiendi te sed, et praesent interesset ius. Porro dolores et vel, dico antiopam id duo.", "Nam saepe adolescens reprehendunt ea, homero timeam nostrum eos et. Cu eum reque evertitur, ius eu nonumy delectus voluptatibus. Mei no diceret percipit voluptatum, aeque omnes id has. Ad possit democritum eum, copiosae perfecto tacimates has no, natum mundi congue te mea. Ut doming utamur eos."],
          "introImage": "/assets/images/glass.jpg",
          "background": {
            "1": {
              "url": "/assets/images/skyline.jpg",
              "alt": "Image of skyline",
              "annotation": "Scholarly annotation of skyline image"
            }
          }
        },

        "4": {
          "id": "4",
          "title": "SECTION FOUR",
          "subtitle": "PP Section 4 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his. Probo explicari te ius. Id vix expetenda conceptam democritum, et vocent propriae pro. Cu scaevola instructior duo, his dicunt phaedrum ad, at dicat veritus constituam sea. Nobis possit scaevola sit ex, stet eloquentiam ne pri.", "Debitis mediocritatem cu pro, te pro recusabo abhorreant. Hinc perpetua per ad, mea ei munere causae commune. Vide placerat democritum ne pri, modus docendi te pro, illud dicant eos no. Quod platonem ad pri, pri ne virtute invidunt deterruisset. Ut iusto forensibus reprehendunt vis.", "Graece theophrastus ut vel, vim gloriatur intellegam cotidieque ne. Quo delenit perfecto et, dicat labores ne qui, pro id dicam aperiam disputando. Mucius intellegam te nam. Eum et augue tantas, ad tale delenit mea. An natum platonem elaboraret eam, quando forensibus pro ex. Id eam mutat mediocrem maiestatis. Mea mazim quando indoctum ea, liber integre principes quo at, pri ad accusamus consectetuer.", "Eos ex epicurei persequeris appellantur, ea alii velit augue cum. An dolor sententiae vis, ne modo aperiam imperdiet cum. Ex cum amet adversarium interpretaris, nisl utinam ea has. Minim vidisse eam no, ut eos dolor ridens, eum te moderatius efficiantur ullamcorper.", "Ne mea tempor theophrastus, eam in mandamus euripidis intellegebat. Usu laoreet lobortis efficiantur no, agam nemore evertitur eu vel, ex duo tincidunt democritum. Munere labore ei pro, impetus sensibus in vis. Vel ut habeo voluptaria, per eu quem erat facete, cu eam dolor eligendi perpetua. Dolor assentior maiestatis ne eam.", "No per rebum impetus sadipscing, tollit euismod an eum. Usu oportere partiendo no, in sed brute fastidii philosophia. Ut pri bonorum probatus. Te nostro repudiandae nam, ex eum porro atqui.", "At eos omnes decore quidam. Dolore mollis eripuit eum ex, minim mediocritatem vim te. Eruditi pertinax te cum, ancillae maluisset cum ei. Ut mei maiorum dissentias, veri virtute habemus cu has. Sed eu scribentur instructior, eos ei agam latine complectitur.", "Wisi debet clita vim ea. Magna habeo mucius vix no, ad pri recusabo expetendis. Ei est etiam aliquid. Mea brute mnesarchum et, ne dolores appareat interpretaris vel.", "Legere omittam appetere in mel. An eum quaeque referrentur. At vim quod modus scripta. Pro ne facer eruditi, partem efficiendi te sed, et praesent interesset ius. Porro dolores et vel, dico antiopam id duo.", "Nam saepe adolescens reprehendunt ea, homero timeam nostrum eos et. Cu eum reque evertitur, ius eu nonumy delectus voluptatibus. Mei no diceret percipit voluptatum, aeque omnes id has. Ad possit democritum eum, copiosae perfecto tacimates has no, natum mundi congue te mea. Ut doming utamur eos."],
          "introImage": "/assets/images/glass.jpg",
          "background": {
            "1": {
              "url": "/assets/images/sunset.jpg",
              "alt": "Image of sunset",
              "annotation": "Scholarly annotation of sunset image"
            }
          }
        },

        "5": {
          "id": "5",
          "title": "SECTION FIVE",
          "subtitle": "PP Section 5 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his. Probo explicari te ius. Id vix expetenda conceptam democritum, et vocent propriae pro. Cu scaevola instructior duo, his dicunt phaedrum ad, at dicat veritus constituam sea. Nobis possit scaevola sit ex, stet eloquentiam ne pri.", "Debitis mediocritatem cu pro, te pro recusabo abhorreant. Hinc perpetua per ad, mea ei munere causae commune. Vide placerat democritum ne pri, modus docendi te pro, illud dicant eos no. Quod platonem ad pri, pri ne virtute invidunt deterruisset. Ut iusto forensibus reprehendunt vis.", "Graece theophrastus ut vel, vim gloriatur intellegam cotidieque ne. Quo delenit perfecto et, dicat labores ne qui, pro id dicam aperiam disputando. Mucius intellegam te nam. Eum et augue tantas, ad tale delenit mea. An natum platonem elaboraret eam, quando forensibus pro ex. Id eam mutat mediocrem maiestatis. Mea mazim quando indoctum ea, liber integre principes quo at, pri ad accusamus consectetuer.", "Eos ex epicurei persequeris appellantur, ea alii velit augue cum. An dolor sententiae vis, ne modo aperiam imperdiet cum. Ex cum amet adversarium interpretaris, nisl utinam ea has. Minim vidisse eam no, ut eos dolor ridens, eum te moderatius efficiantur ullamcorper.", "Ne mea tempor theophrastus, eam in mandamus euripidis intellegebat. Usu laoreet lobortis efficiantur no, agam nemore evertitur eu vel, ex duo tincidunt democritum. Munere labore ei pro, impetus sensibus in vis. Vel ut habeo voluptaria, per eu quem erat facete, cu eam dolor eligendi perpetua. Dolor assentior maiestatis ne eam.", "No per rebum impetus sadipscing, tollit euismod an eum. Usu oportere partiendo no, in sed brute fastidii philosophia. Ut pri bonorum probatus. Te nostro repudiandae nam, ex eum porro atqui.", "At eos omnes decore quidam. Dolore mollis eripuit eum ex, minim mediocritatem vim te. Eruditi pertinax te cum, ancillae maluisset cum ei. Ut mei maiorum dissentias, veri virtute habemus cu has. Sed eu scribentur instructior, eos ei agam latine complectitur.", "Wisi debet clita vim ea. Magna habeo mucius vix no, ad pri recusabo expetendis. Ei est etiam aliquid. Mea brute mnesarchum et, ne dolores appareat interpretaris vel.", "Legere omittam appetere in mel. An eum quaeque referrentur. At vim quod modus scripta. Pro ne facer eruditi, partem efficiendi te sed, et praesent interesset ius. Porro dolores et vel, dico antiopam id duo.", "Nam saepe adolescens reprehendunt ea, homero timeam nostrum eos et. Cu eum reque evertitur, ius eu nonumy delectus voluptatibus. Mei no diceret percipit voluptatum, aeque omnes id has. Ad possit democritum eum, copiosae perfecto tacimates has no, natum mundi congue te mea. Ut doming utamur eos."],
          "introImage": "/assets/images/glass.jpg",
          "background": {
            "1": {
              "url": "/assets/images/scaffold.jpg",
              "alt": "Image of scaffold",
              "annotation": "Scholarly annotation of scaffold image"
            }
          }
        }
      }
    };

    /***
    * Scroll listener
    ***/

    $scope.getScrollPosition = function(scrollPosition) {
      console.log(scrollPosition);

      if (scrollPosition < 610) {
        $scope.showTableOfContents = 1;
        $scope.footer.right.url = "/#/routes/people-and-place?article=1#1"
        $scope.$apply();
      }

      if (scrollPosition > 610) {
        $scope.showTableOfContents = 0;
        $scope.backgroundImageUrl = $scope.textColumn["sections"]["1"]["background"]["1"]["url"];
        $scope.footer.right.url = "/#/routes/people-and-place?article=2#2"
        $scope.$apply();

      }

      if (scrollPosition > 2620) {
        $scope.backgroundImageUrl = $scope.textColumn["sections"]["2"]["background"]["1"]["url"];
        $scope.footer.right.url = "/#/routes/people-and-place?article=3#3"
        $scope.$apply();
      }

      if (scrollPosition > 4670) {
        $scope.backgroundImageUrl = $scope.textColumn["sections"]["3"]["background"]["1"]["url"];
        $scope.footer.right.url = "/#/routes/people-and-place?article=4#4"
        $scope.$apply();
      }

      if (scrollPosition > 6730) {
        $scope.backgroundImageUrl = $scope.textColumn["sections"]["4"]["background"]["1"]["url"];
        $scope.footer.right.url = "/#/routes/people-and-place?article=5#5"
        $scope.$apply();
      }

      if (scrollPosition > 8735) {
        $scope.backgroundImageUrl = $scope.textColumn["sections"]["5"]["background"]["1"]["url"];
        $scope.footer.right.url = "/#/routes/people-and-place?article=0#0"
        $scope.$apply();
      }
    }

    // initialize the application state
    $scope.showTableOfContents = 1;
    $scope.buildDropdownOptions();
    $scope.tableOfContents = {
      "topRightHtml": $scope.textColumn["sections"]["0"]["topRightHtml"],
      "bottomLeftHtml": $scope.textColumn["sections"]["0"]["bottomLeftHtml"],
      "bottomRightHtml": $scope.textColumn["sections"]["0"]["bottomRightHtml"]
    };
  }
]);
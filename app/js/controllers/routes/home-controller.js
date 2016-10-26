var $ = require('jquery');
var angular = require('angular');
var request = require('superagent');

angular.module('HomeController', [])
  .controller("homeController", [
      "$scope", "$http", "$location", "$timeout", "backgroundStyle",
  function($scope, $http, $location, $timeout, backgroundStyle) {

    var footer = {
      "left": {
        "display": "Home",
        "url": "/#/"
      },
      "right": {
        "display": "",
        "url": "/#/"
      },
      "style": "full"
    };

  $scope.footer = footer;
  $scope.textColumn = {};

  /***
  *
  * Overlay data
  *
  ***/

  $scope.selectedOverlay = '';

  var endpoint = "./json/home.json";

  request
    .get(endpoint)
    .set('Accept', 'application/json')
    .end(function(err, res){
      if (err) {console.log(err)};

      $scope.overlayIcons = res.body;

      /***
      *
      * Helper function to determine mouse hover position:
      * used for finding coefficients to position overlays
      *
      ***/

      /*
      (function() {
        document.onmousemove = handleMouseMove;
        function handleMouseMove(event) {
          //console.log(event);
          var dot, eventDoc, doc, body, pageX, pageY;

          event = event || window.event; // IE-ism

          // calculate image height and width
          var image = document.querySelector(".home-image-2");
          var imageHeight = image.clientHeight;
          var imageWidth = image.clientWidth;
          console.log(event.pageX/imageWidth, event.pageY/imageHeight);
        }
      })();
      */

      /***
      *
      * Public function used to position overlay icons
      *
      ***/

      $scope.positionIcons = function() {
        var overlays = document.querySelectorAll('.building-overlay-marker');
        // obtain data needed for positioning.
        var image = document.querySelector('.home-image-2');
        if (image !== null) {
          var imageHeight = image.clientHeight;
          var imageWidth = image.clientWidth;

          var overlayIcon = document.querySelector('.building-overlay-marker');
          if (overlayIcon !== null) {
            var iconWidth = overlayIcon.clientWidth;

            for (var i=0; i<overlays.length; i++) {
              var overlay = overlays[i];
              var overlayOffsets = $scope.overlayIcons[i];

              var xOffset = (overlayOffsets.xOffset * imageWidth) - (iconWidth/2);
              var yOffset = (overlayOffsets.yOffset * imageHeight) - (iconWidth/2);

              overlay.style.left = String(xOffset) + "px";
              overlay.style.top = String(yOffset) + "px";
            };
          };
        };
      };

      /***
      *
      * Funtion to reposition modal
      *
      ***/

      var positionModal = function(initializeModal) {
        var overlayId = $scope.overlayId;
        var overlayJson = $scope.overlayIcons[overlayId];
        var overlayPosition = {};

        $scope.overlayData = overlayJson;

        // set the desired distance between modal icon and modal
        // and length of modal
        var modalPadding = 22;
        var modalLength = 468;
        var modalHeight = 200;
        var iconHeight = 40;

        // store the icon the user just clicked
        var overlayIcon = document.querySelector('.building-overlay-marker-' + overlayId);
        var iconLeft = parseInt(overlayIcon.style.left, 10);
        var iconTop = parseInt(overlayIcon.style.top, 10);

        /****
        *
        * Modal positioning logic: divide the screen into a 3x3 grid, with
        * each grid region along the x-axis occupying 1/3 the image width
        * and each grid region along the y-axis occupying 1/3 the image height.
        * Then find the icon the user clicked, and use the grid in which that icon
        * falls to determine the modal's position vis-a-vis the icon
        *
        ***/

        // determine x axis position
        if (overlayJson.xOffset > .25) {
          if (overlayJson.xOffset > .75) {
            overlayPosition.xRegion = 'right';
          } else {
            overlayPosition.xRegion = 'mid';
          }
        } else {
          overlayPosition.xRegion = 'left';
        };

        // determine y axis position
        if (overlayJson.yOffset > .333) {
          if (overlayJson.yOffset > .666) {
            overlayPosition.yRegion = 'bottom';
          } else {
            overlayPosition.yRegion = 'mid';
          }
        } else {
          overlayPosition.yRegion = 'top';
        }

        /***
        *
        * Given the grid region of the icon, determine the 
        * position of the modal
        *
        ***/

        // establish x axis position of modal
        if (overlayPosition.xRegion == 'right') {
          overlayPosition.x = iconLeft - modalLength - modalPadding;
        }
        if (overlayPosition.xRegion == 'mid') {
          overlayPosition.x = iconLeft - (modalLength/2);
        }
        if (overlayPosition.xRegion == 'left') {
          overlayPosition.x = iconLeft + modalPadding;
        }

        // establish y axis position of modal
        if (overlayPosition.yRegion == 'bottom') {
          overlayPosition.y = iconTop - modalHeight - modalPadding;
        }
        if (overlayPosition.yRegion == 'mid') {
          overlayPosition.y = iconTop + iconHeight + modalPadding - 5;
        }
        if (overlayPosition.yRegion == 'top') {
          overlayPosition.y = iconTop + iconHeight + modalPadding - 5;
        }

        // position the modal
        var modal = document.querySelector(".building-overlay-modal");
        modal.style.left = overlayPosition.x + "px";
        modal.style.top = overlayPosition.y + "px";

        // after positioning the modal, display it if it needs displaying
        if (initializeModal == 1) {
          // display the modal by adding opacity
          var container = document.querySelector('.building-overlay-modal');
          container.style.display = "block";
          container.style.opacity = 1;
        }
      }

      /***
      *
      * Private function that scrolls the selected modal into full view
      * if necessary
      *
      ***/

      var scrollToModal = function() {
        var windowWidth = window.innerWidth;
        var xScroll = document.querySelector("#home").scrollLeft;
        var modal = document.querySelector('.building-overlay-modal');
        var xModal = parseInt(modal.style.left, 10);
        var modalWidth = modal.clientWidth;

        // if the modal doesn't fit entirely on the screen,
        // scroll such that it will (and display some padding right)
        var padding = 75;

        // first check to see if we must scroll right
        var sightDistance = windowWidth + xScroll;
        var modalDistance = xModal + modalWidth + padding;

        // calculate the amount we should scroll right
        var scrollRight = modalDistance - sightDistance;
        var scrollLeft = xScroll - xModal + padding;

        // use jQuery animation to create smooth scroll
        if (scrollRight > 0) {
          $("#home").animate({scrollLeft: xScroll + scrollRight}, 700, "swing");
          return;
        }

        // check to see if we must scroll left
        if (xScroll > xModal) {
          $("#home").animate({scrollLeft: xScroll - scrollLeft}, 700, "swing");
          return;
        }
      }

      /***
      *
      * Private function to determine whether an image is loaded
      *
      ***/

      var imageLoaded = function(img) {
        return img.complete && img.naturalHeight != 0;
      }

      /***
      *
      * Public function for initializing the overlays after
      * the home image is loaded
      *
      ***/

      $scope.initializeOverlays = function() {
        // If the image is already loaded, position the overlays,
        // else add an onload event that will position the overlays
        // once the image is loaded
        var image = document.querySelector(".home-image");

        if (imageLoaded(image)) {
          $scope.positionOverlays();
        } else {
          image.addEventListener('load', $scope.positionOverlays, false);
        }
      }

      /***
      *
      * Public function for repositioning icon and modal overlays
      *
      ***/

      $scope.positionOverlays = function() {
        $scope.positionIcons();

        // only reposition the modal overlay if it exists
        var overlay = document.querySelector('.building-overlay-modal');
        if (overlay !== null && overlay.style.opacity == 1) {
          positionModal(0);
        }
      };

      /***
      *
      * Function called when users click icon overlays
      *
      ***/

      $scope.toggleModal = function(overlayId) {

        // store the selected overlay in the global scope,
        // pass the overlay data to the template, and initialize
        // the modal
        $scope.overlayId = overlayId;
        var overlayJson = $scope.overlayIcons[overlayId];
        $scope.overlayData = overlayJson;
        updateHomeMobileText(overlayJson);
        positionModal(1);
        scrollToModal();
      }

      /***
      *
      * Function to update the text column within the home route
      * on mobile devices
      *
      ***/

      var updateHomeMobileText = function(overlayJson) {
        $scope.title = overlayJson.title;
        $scope.text = overlayJson.text;
      }

      /***
      *
      * Click listener that can catch clicks to close modal and restore
      * opacity to all icons
      *
      ***/

      $scope.hideModal = function() {
        var modal = document.querySelector(".building-overlay-modal");
        modal.style.display = "none";
        modal.style.opacity = 0;
      }

      /***
      *
      * Callback for requests to deeplink into application pages
      *
      * Takes as input a route from one of the overlayData.url elements,
      * fades body opacity to white, then sends the user to the requested route
      *
      ***/

      $scope.deeplink = function(path, hash) {
        var body = document.querySelector('.body');
        body.style.opacity = 0;
        $timeout(function() {
          $location.path(path).hash(hash);
        }, 1000);
      }

      /***
      *
      * Load event listeners
      *
      ***/

      $scope.windowResize = function(params) {
        $scope.positionOverlays();
      }

      /***
      *
      * Add listener for end of video
      *
      ***/

      $scope.addVideoEndListener = function() {
        var video = document.querySelector("video");
        video.addEventListener('ended', videoEnded, false);
      }

      /***
      *
      * Add a callback for the video ended event
      *
      ***/

      var videoEnded = function(e) {
        fadeInOverlays();
        fadeInHomeImage();
      }

      /***
      *
      * Function to fade in the icon overlays
      *
      ***/

      var fadeInOverlays = function() {
        var overlayIcons = document.querySelectorAll('.building-overlay-marker');
        for (var i=0; i<overlayIcons.length; i++) {
          overlayIcons[i].style.opacity = 1;
        }
      }


      /***
      *
      * Function to fade in the home image
      *
      ***/

      var fadeInHomeImage = function() {
        var homeImage = document.querySelector(".home-image-2");
        homeImage.style.opacity = 1;

        var homeImageGradient = document.querySelector(".background-gradient");
        homeImageGradient.style.opacity = 1;
      }

      /***
      *
      * Function to begin the page load sequence
      *
      ***/

      $scope.beginPageSequence = function() {
        // if the route has query param animation=false,
        // skip the video sequence and show only the icons
        var queryParams = $location.search();
        if (queryParams.animation != "false") {

          var windowWidth = window.innerWidth;
          if (windowWidth > 800) {
            $timeout(function() {
              var video = document.querySelector("video");
              if (video) {
                video.play();
              }
            }, 4000);
            $timeout(function() {
              var initialImage = document.querySelector(".home-image-1");
              initialImage.style.opacity = 0;
            }, 1000);
          }

        // handler for cases where we won't play the animation, but will
        // instead show the home-image-2 with overlays
        } else {
          var initialImage = document.querySelector(".home-image-1");
          initialImage.style.display = "none";

          var video = document.querySelector(".video");
          video.style.display = "none";

          var finalImage = document.querySelector(".home-image-2");
          finalImage.style.opacity = 1;

          var gradient = document.querySelector(".background-gradient");
          gradient.style.opacity = 1;

          $timeout(function() {
            fadeInOverlays();
          }, 500);
        }
      }

      /***
      *
      * Initialize the welcome text for mobile devices
      *
      ***/

      $scope.title = "Welcome";
      $scope.text = "Explore the physical, historical, social, and artistic aspects of the construction of Frankly and Murray Colleges, the first new residential colleges to open at Yale University since 1962.";

      /***
      *
      * Initialize controller state
      *
      ***/

      backgroundStyle.updateBackgroundStyle({navigationButton: "light", brandIcon: "light"});
      $scope.addVideoEndListener();
      $scope.initializeOverlays();
      $scope.beginPageSequence();
      $scope.$apply();
  });
}]);
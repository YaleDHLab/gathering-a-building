var $ = require('jquery');
var angular = require('angular');

angular.module('HomeController', [])
  .controller("homeController", [
      "$scope", "$http", "$location", "$timeout",
  function($scope, $http, $location, $timeout) {

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

  /***
  *
  * Overlay data
  *
  ***/

  $scope.selectedOverlay = '';

  var overlayData = [
    {
      id: 0,
      xOffset: 0.492,
      yOffset: 0.26,
      url: "/#/routes/material-journeys#3",
      path: "routes/material-journeys",
      hash: "3",
      title: "Material Journeys &raquo;",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla pharetra metus sapien, et euismod mauris diam, tempus mauris rhoncus nec. (20 words)",
      image: "/assets/images/chimneys.png"
    },
    {
      id: 1,
      xOffset: 0.30,
      yOffset: 0.78,
      url: "/#/routes/material-journeys#1",
      path: "routes/material-journeys",
      hash: "1",
      title: "Concrete Copula &raquo;",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla pharetra metus sapien, et euismod mauris diam, tempus mauris rhoncus nec. (20 words)",
      image: "/assets/images/concrete.jpg"
    },
  ];

  /***
  *
  * Helper function to determine mouse hover position:
  * used for finding coefficients to position overlays
  *
  ***/

  var findMousePosition = function(evt) {
    var x = (evt.pageX - $('body').offset().left) + $(window).scrollLeft();
    var y = (evt.pageY - $('body').offset().top) + $(window).scrollTop();
  }

  /***
  *
  * Public function used to position overlay icons
  *
  ***/

  $scope.positionIcons = function() {
    var overlays = document.querySelectorAll('.building-overlay-marker');

    // obtain data needed for positioning
    var image = document.querySelector('.home-image');
    if (image !== null) {
      var imageHeight = image.clientHeight;
      var imageWidth = image.clientWidth;

      var overlayIcon = document.querySelector('.building-overlay-marker');
      var iconWidth = overlayIcon.clientWidth;

      for (var i=0; i<overlays.length; i++) {
        var overlay = overlays[i];
        var overlayOffsets = overlayData[i];

        var xOffset = (overlayOffsets.xOffset * imageWidth) - (iconWidth/2);
        var yOffset = (overlayOffsets.yOffset * imageHeight) - (iconWidth/2);

        overlay.style.left = String(xOffset) + "px";
        overlay.style.top = String(yOffset) + "px";
        overlay.style.opacity = 1;
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
    var overlayJson = overlayData[overlayId];
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
      overlayPosition.y = iconTop - (modalHeight/2);
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
    var overlayJson = overlayData[overlayId];
    $scope.overlayData = overlayJson;
    positionModal(1);
    scrollToModal();
  }

  /***
  *
  * Click listener that can catch clicks to close modal
  *
  ***/

  $scope.hideModal = function() {
    var modal = document.querySelector(".building-overlay-modal");
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
    console.log(path, hash);
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


}]);
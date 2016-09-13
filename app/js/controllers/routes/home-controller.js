var $ = require('jquery');
var angular = require('angular');

angular.module('HomeController', [])
  .controller("homeController", [
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

  /***
  *
  * Overlay data
  *
  ***/

  var overlayData = [
    {
      id: 0,
      xOffset: 0.492,
      yOffset: 0.26,
      url: "/#/routes/material-journeys?article=3#3",
      title: "Material Journeys &raquo;",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla pharetra metus sapien, et euismod mauris diam, tempus mauris rhoncus nec. (20 words)",
      image: "/assets/images/chimneys.png"
    },
    {
      id: 1,
      xOffset: 0.292,
      yOffset: 0.76,
      url: "/#/routes/material-journeys?article=3#3",
      title: "Concrete Foundation &raquo;",
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
  * Function used to position overlay icons
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
    var modalPadding = 50;
    var modalLength = 468;
    var modalHeight = 200;

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
    if (overlayJson.xOffset > .333) {
      if (overlayJson.xOffset > .666) {
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
      overlayPosition.y = iconTop + modalPadding;
    }

    // position the modal
    var modal = document.querySelector(".building-overlay-modal");
    modal.style.left = overlayPosition.x + "px";
    modal.style.top = overlayPosition.y + "px";

    // after positioning the modal, display it if it needs displaying
    if (initializeModal == 1) {
      // display the modal by removing the hidden class from its container
      var container = document.querySelector('.building-modal-overlay-container');
      container.className = 'building-modal-overlay-container';
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
    var overlayContainer = document.querySelector('.building-modal-overlay-container');
    if (overlayContainer.className.includes("hidden") == false) {
      positionModal(0);
    }
  };

  /***
  *
  * Function called when users click icon overlays
  *
  ***/

  $scope.selectedOverlay = '';

  $scope.toggleModal = function(overlayId) {

    // store the selected overlay in the global scope
    $scope.overlayId = overlayId;

    // pass the modal data
    var overlayJson = overlayData[overlayId];
    $scope.overlayData = overlayJson;

    // load the modal
    positionModal(1);
  }

  /***
  *
  * Click listener that can catch clicks to close modal
  *
  ***/

  $scope.hideModal = function() {
    var container = document.querySelector(".building-modal-overlay-container");
    container.className += " hidden";
  }

  /***
  *
  * Load event listeners
  *
  ***/

  window.onresize = $scope.positionOverlays;

  }
]);
var resizeOverlay = function() {
  var windowHeight = $(window).height();

  // coefficients calculated by taking desired div width 
  // divided by window height, averaging multiple observations

  /***
  * Overlay 1
  ***/

  var overlayOneWidth = windowHeight * .161;
  var overlayOneHeight = windowHeight * .083;
  var overlayOneLeft = windowHeight * .645;
  var overlayOneBottom = (windowHeight + 210) * .3035;

  /***
  * Overlay 2
  ***/

  var overlayTwoLeft = (windowHeight - 19) * 1.452;
  var overlayTwoBottom = (windowHeight + 210) * .21;

  /***
  * Build styles
  ***/

  $(".home-overlay-1").css({
    "height": overlayOneHeight,
    "width": overlayOneWidth,
    "left": overlayOneLeft,
    "bottom": overlayOneBottom
  });


  $(".home-overlay-2").css({
    "left": overlayTwoLeft,
    "bottom": overlayTwoBottom
  });

  // add listener inside the document load
  $(".home-overlay-1").on("click", function() {
    $(this).toggleClass("translucent");
  });
}

// update the overlay styles on page load and resize
$(document).ready(resizeOverlay);
$(window).resize(resizeOverlay);

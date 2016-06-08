var resizeOverlay = function() {
  var windowHeight = $(window).height();

  // coefficients calculated by taking desired div width 
  // divided by window height, averaging multiple observations
  var width = windowHeight * .161;
  var height = windowHeight * .083;
  var left = windowHeight * .645;
  var bottom = (windowHeight + 210) * .3035;

  console.log(height, width, left);
  $(".home-overlay-1").css({
    "height": height,
    "width": width,
    "left": left,
    "bottom": bottom
  });

  // add listener inside the document load
  $(".home-overlay-1").on("click", function() {
    $(this).toggleClass("translucent");
  });
}

// update the overlay styles on page load and resize
$(document).ready(resizeOverlay);
$(window).resize(resizeOverlay);

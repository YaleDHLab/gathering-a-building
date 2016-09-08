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
  $(".home-overlay").on("click", function() {
    $(this).toggleClass("translucent");
  });
}

var scrollBreakpoints = [
  {
    'inpoint': 100,
    'outpoint': 300,
    'selector': ".home-overlay-1"
  },
  {
    'inpoint': 300,
    'outpoint': 600,
    'selector': ".home-overlay-2"
  }
];

var scrollListener = function() {

  // use the horizontal scroll position to determine whether to show/hide elements
  var offset = $("#home").scrollLeft();
  for (i=0; i<scrollBreakpoints.length; i++) {
    if (offset > scrollBreakpoints[i].inpoint && offset < scrollBreakpoints[i].outpoint) {
      $(scrollBreakpoints[i].selector).removeClass("hidden");
    } else if (offset < scrollBreakpoints[i].inpoint || offset > scrollBreakpoints[i].outpoint) {
      $(scrollBreakpoints[i].selector).addClass("hidden");
    }
  }
};

// update the overlay styles on page load, resize, and scroll
$(document).ready(function() {
  resizeOverlay();
  $("#home").on("scroll", scrollListener);
  $(window).resize(resizeOverlay);
});

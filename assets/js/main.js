$(window).ready( function() {

  // initialize object with background names and url values
  var backgrounds = {
    "section-1": {
      "image": "assets/images/scaffold.jpg", 
      "navigation": "#e6e6e6"
    },
    "section-2": {
      "image": "assets/images/sunset.jpg",
      "navigation": "#858585"
    },
    "section-3": {
      "image": "assets/images/angle.jpg",
      "navigation": "#858585"
    },
    "map": {
      "image": "none",
      "navigation": "#858585"
    }
  };


  // preload all of these images in .image-staging-area
  var urlsToPreload = '';
  for (i=0; i< Object.keys(backgrounds).length; i++) {
    var currentUrl = Object.keys(backgrounds)[i];
    urlsToPreload += backgrounds[currentUrl];    
  }  


  // initialize object in which to track application state
  var state = {
    "background": "section-1",
    "map": {
      "initialized": 0
    }
  };

  // function to set new background image, toggle map, and update navigation color
  var changeBackground = function(backgroundOption) {
    if (backgroundOption === "map") { 
      $("#map").removeClass("hidden");
      $(".background-content").css({"background": "none"});
      $(".navigation div").css({
        "background": backgrounds[backgroundOption].navigation
      });

    } else {
      $("#map").addClass("hidden");
      $(".background-content").css({
        "background": "url(" + backgrounds[backgroundOption].image + ") no-repeat center center fixed", 
        "-webkit-background-size": "cover",
        "-mox-background-size": "cover",
        "-o-background-size": "cover",
        "background-size": "cover"
      });
      $(".navigation div").css({
        "background": backgrounds[backgroundOption].navigation
      });
    }
    
    state["background"] = backgroundOption;
  };

  // function to establish map as background
  buildMap = function() { 
    initializeMap();
    state["map"]["initialized"] = 1;
  };

  // listener to update background on scroll breakpoints
  $(".text-overlay").on("scroll", function() {
    var distanceFromTop = $(".text-overlay").scrollTop();
    var bodyHeight = $("body").height();
    console.log(distanceFromTop); 

    // run conditionals to check which section is now in view
    if (distanceFromTop < 1050 - bodyHeight) {
      state["background"] != "section-1" ? changeBackground("section-1") : {};
    }
    if (distanceFromTop > 1050 - bodyHeight && distanceFromTop <= 2005 - bodyHeight) {
        state["background"] != "section-2" ? changeBackground("section-2") : {};
    }
    if (distanceFromTop > 2005 - bodyHeight) {
      state["background"] != "map" ? changeBackground("map") : {}; 
      state["map"]["initialized"] === 0 ? buildMap() : {};
    } 
  });

  // click listeners to toggle nav
  $(".navigation, .navigation-overlay").on("click", function() {
    $(".navigation-overlay").toggleClass("hidden");
  });

});

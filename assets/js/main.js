$(window).ready( function() {

  // initialize object with available navigation bar colors
  var navigationColors = {
    "light": "#e6e6e6",
    "dark": "#858585"
  };

  // initialize object with background names and url values
  var backgrounds = {
    "home": {
      "image": "none", 
      "navigation": navigationColors.dark
    },
    "section-1": {
      "image": "assets/images/scaffold.jpg", 
      "navigation": navigationColors.light
    },
    "section-2": {
      "image": "assets/images/sunset.jpg",
      "navigation": navigationColors.dark
    },
    "section-3": {
      "image": "assets/images/angle.jpg",
      "navigation": navigationColors.dark
    },
    "section-4": {
      "image": "assets/images/angle.jpg",
      "navigation": navigationColors.dark
    },
    "map": {
      "image": "none",
      "navigation": navigationColors.dark
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
    "background": '',
    "map": {
      "initialized": 0
    }
  };

  // function to set new background image, toggle map, and update navigation color
  var changeBackground = function(backgroundOption) {
    if (backgroundOption === "home") { 
      $(".text-overlay-container").addClass("hidden");
      $("body").addClass("sky-background");
      $(".home").removeClass("hidden");
      $(".background-content").css({"background": "none"});
    }
    else if (backgroundOption === "map") { 
      $(".home").addClass("hidden");
      $("body").removeClass("sky-background");
      $("#map").removeClass("hidden");
      $(".background-content").css({"background": "none"});
    }
    else {
      $(".home").addClass("hidden");
      $("body").removeClass("sky-background");
      $("#map").addClass("hidden");
      $(".background-content").css({
        "background": "url(" + backgrounds[backgroundOption].image + ") no-repeat center center fixed", 
        "-webkit-background-size": "cover",
        "-mox-background-size": "cover",
        "-o-background-size": "cover",
        "background-size": "cover"
      });
    }

    $(".navigation div").css({
      "background": backgrounds[backgroundOption].navigation
    });
    
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
      state["background"] != "home" ? changeBackground("home") : {};
    }
    if (distanceFromTop > 1050 - bodyHeight && distanceFromTop <= 2005 - bodyHeight) {
      state["background"] != "section-1" ? changeBackground("section-1") : {};
    }
    if (distanceFromTop > 2005 - bodyHeight && distanceFromTop <= 3005 - bodyHeight) {
        state["background"] != "section-2" ? changeBackground("section-2") : {};
    }
    if (distanceFromTop > 3005 - bodyHeight) {
      state["background"] != "map" ? changeBackground("map") : {}; 
      state["map"]["initialized"] === 0 ? buildMap() : {};
    } 
  });

  // click listeners to toggle nav
  $(".navigation, .navigation-overlay").on("click", function() {
    // hide the navigation dropdown icon on display of overlay
    $(".navigation").toggleClass("hidden");

    // display the overlay
    $(".navigation-overlay").toggleClass("hidden");
  });


  // home page click listener to send users to main nav
  $(".home-footer-next").on("click", function() {
    $(".text-overlay-container").removeClass("hidden");
    document.getElementById("section-3").scrollIntoView();
  });


  // initialize the page
  changeBackground("home");

});

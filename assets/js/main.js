$(window).ready( function() {

  // initialize object with background names and url values
  var backgrounds = {
    "section-1": "assets/images/scaffold.jpg",
    "section-2": "assets/images/sunset.jpg",
    "section-3": "assets/images/angle.jpg",
    "none": "none"
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

  // function to set new background image
  var changeBackground = function(backgroundOption) {
    if (backgroundOption === "none") { 
      $("#map").css({"width": "100%", "height": "100%"}); 
      $(".background-content").css({"background": "none"});
    } else {
      $("#map").css({"width": "0", "height": "0"});
      $(".background-content").css({
        "background": "url(" + backgrounds[backgroundOption] + ") no-repeat center center fixed", 
        "-webkit-background-size": "cover",
        "-mox-background-size": "cover",
        "-o-background-size": "cover",
        "background-size": "cover"
      });
    }
    
    state["background"] = backgroundOption;
  };

  // function to establish map as background
  buildMap = function() { 
    initializeMap();
    state["map"]["initialized"] = 1;
  };


  $(".text-overlay").on("scroll", function() {
    var distanceFromTop = $(".text-overlay").scrollTop();
    var bodyHeight = $("body").height();
    console.log(distanceFromTop); 

    // run conditionals to check which section is now in view
    if (distanceFromTop < 1050 - bodyHeight) {
      state["background"] != "section-1" ? changeBackground("section-1") : {};
    }

    if (distanceFromTop > 1050 - bodyHeight) {       
        state["background"] != "section-2" ? changeBackground("section-2") : {};
    }

    if (distanceFromTop > 2005 - bodyHeight) {
      state["background"] != "none" ? changeBackground("none") : {}; 
      state["map"]["initialized"] === 0 ? buildMap() : {};
    } 
   
  });

});

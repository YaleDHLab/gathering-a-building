$(window).ready( function() {

  // initialize object with background names and url values
  var backgrounds = {
    "section-1": "assets/images/scaffold.jpg",
    "section-2": "assets/images/sunset.jpg",
    "section-3": "assets/images/angle.jpg"
  };

  // preload all of these images in .image-staging-area
  var urlsToPreload = '';
  for (i=0; i< Object.keys(backgrounds).length; i++) {
    var currentUrl = Object.keys(backgrounds)[i];
    urlsToPreload += backgrounds[currentUrl];
    
  }  

  // initialize object to track state of background
  var state = {
    "background": "section-1"
  };

  // function to set new background image
  var changeBackground = function(backgroundOption) {
    $(".background-content").css({
      "background": "url(" + backgrounds[backgroundOption] + ") no-repeat center center fixed", 
      "-webkit-background-size": "cover",
      "-mox-background-size": "cover",
      "-o-background-size": "cover",
      "background-size": "cover"
    });

    state["background"] = backgroundOption;
  };


  $(".text-overlay").on("scroll", function() {
    var distanceFromTop = $(".text-overlay").scrollTop();
    var bodyHeight = $("body").height();
    console.log(distanceFromTop); 

    // run conditionals to check which section is now in view
    if (distanceFromTop < 941 - bodyHeight) {
      state["background"] != "section-1" ? changeBackground("section-1") : {};
    }

    if (distanceFromTop > 941 - bodyHeight) {       
        state["background"] != "section-2" ? changeBackground("section-2") : {};
    }

    if (distanceFromTop > 1845 - bodyHeight) {
      state["background"] != "section-3" ? changeBackground("section-3") : {};
    } 
   
  });

  //initializeMap();

});

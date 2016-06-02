$(window).ready( function() {

  // initialize object with background names and url values
  var backgrounds = {
    "angle": "assets/images/angle.jpg", 
    "sunset": "assets/images/sunset.jpg",
    "scaffold": "assets/images/scaffold.jpg"
  };

  // preload all of these images in .image-staging-area
  var urlsToPreload = '';
  for (i=0; i< Object.keys(backgrounds).length; i++) {
    var currentUrl = Object.keys(backgrounds)[i];
    urlsToPreload += backgrounds[currentUrl];
    
  }  

  // initialize object to track state of background
  var state = {
    "background": "scaffold"
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
  };

  $("body").on("click", function() {
    changeBackground("scaffold");
  });

  $(".text-overlay").on("scroll", function() {
    var distanceFromTop = $(".text-overlay").scrollTop();
    console.log(distanceFromTop); 
    if (distanceFromTop > 941 - $("body").height()) {       
      changeBackground("sunset");
      state["background"] = "special";
    } else {
      state["background"] === "special" ? changeBackground("scaffold") : {};
    }
  });


});

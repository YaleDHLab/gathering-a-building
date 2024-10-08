/***
*
* Directive to listen for scroll events
*
***/

var angular = require('angular');
var $ = require('jquery');

angular.module('ScrollListener', [])
  .directive('scrollListener', [
    "$location",
  function ($location) {
  return {
    restrict: 'AC',

    /***
    *
    * Give the directive access to the controller function
    * specified in the html directive, so that when the
    * user scrolls, the directive can broadcast the new
    * scroll position to the subscribing controller
    *
    ***/

    scope: {
      setSelectedSection: '='
    },

    /***
    *
    * Bind a scroll event listener to the selected element
    * and broadcast the scroll position to the subscribing
    * controller function
    *
    ***/

    link: function (scope, element, attrs) {
      element.bind('scroll', function () {

        /***
        *
        * Remove the url hash (if any) to allow users
        * to trigger href links for articles they
        * just viewed
        *
        ***/

        $location.hash(null);

        /***
        *
        * Define callback that fades in/out artices beyond
        * the first once the user starts scrolling
        *
        ***/

        var animateArticles = function(scrollPosition) {
          // if the scroll position > 0, fade in articles after the 1st
          // then permanently set their opacity to 1, else fade them out
          if (scrollPosition > 0) {
            // set timeout so that fade in completes before we absolutely set opacity
            $(".major-section-spacer *").removeClass("fade-out-article");
            $(".major-section-spacer *").addClass("fade-in-article");
          } else {
            // set timeout so that fade out completes before we absolutely set opacity
            $(".major-section-spacer *").removeClass("fade-in-article");
            $(".major-section-spacer *").addClass("fade-out-article");
          }
        }

        // fade articles after the first into/out of view
        var scrollPosition = element[0].scrollTop;
        animateArticles(scrollPosition);

        /***
        *
        * Define a function that will check each section's distance
        * from the top of the viewport and update the current
        * section in the parent controler (if necessary)
        *
        * NB: If the '.mobile-controls-container' exists, then
        * the breakpoint's distance should be measured from that
        * element, else the breakpoint's distance should be measured
        * against the top of the page
        *
        ***/

        var distanceToTop = function(elem, i) {

          var viewportOffset = elem.getBoundingClientRect();
          var top = viewportOffset.top;

          // if the user is on a mobile, measure the distance from the breakpoint
          // to the mid-page mobile controls
          var mobileControls = document.querySelector('.mobile-controls-container');
          if (mobileControls) {
            var mobileOffset = mobileControls.getBoundingClientRect();
            var mobileTop = mobileOffset.top;
            var top = top - mobileTop;
          } 

          if (top < 200 && top > -200) {
            var selectedIndex = elem.getAttribute('data-section-id');
            scope.setSelectedSection(selectedIndex);
          }
        }

        // targets for the function that updates parent controller
        var targets = document.querySelectorAll('.section');
        for (var i=0; i<targets.length; i++) {
          distanceToTop(targets[i], i);
        }

      });
    }
  };
}]);
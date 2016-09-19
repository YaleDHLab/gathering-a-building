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
        ***/

        var distanceToTop = function(elem, i) {
          var viewportOffset = elem.getBoundingClientRect();
          var top = viewportOffset.top;

          if (top < 200 && top > -200) {
            var selectedId = elem.getAttribute('data-section-id');
            scope.setSelectedSection(selectedId);
          }
        }

        // targets for the function that updates parent controller
        var targets = document.querySelectorAll('.section');
        targets.forEach(distanceToTop);

      });
    }
  };
}]);
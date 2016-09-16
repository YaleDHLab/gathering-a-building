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
      setScrollPosition: '='
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

        // define callback that fades in/out artices beyond
        // the first once the user starts scrolling
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

        // pass the scroll position to the subscriber's setScrollPosition method
        var scrollPosition = element[0].scrollTop;

        // fade articles beyond the first in/out
        animateArticles(scrollPosition);

        // pass the scrollPosition to the controller
        scope.setScrollPosition(scrollPosition);

        // remove the hash from the url to facilitate linking back to a
        // section the user just read
        $location.hash(null);
      });
    }
  };
}]);
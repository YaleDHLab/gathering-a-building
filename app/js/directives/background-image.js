/***
*
* Directive to dynamically set background images when 
* controllers update their backgroundImageUrl scope
* variables
*
* Template: <div data-background-image="{{backgroundImageUrl}}" />
*   AND     <img data-background-image="{{backgroundImageUrl}}" class="hidden" />
*
***/

var angular = require('angular');

angular.module('BackgroundImage', [])
  .directive('backgroundImage', [
    "$timeout",
  function ($timeout) {
  return function(scope, element, attrs){
    attrs.$observe('backgroundImage', function(value) {

      /***
      *
      * Define a callback to trigger once the image loads
      *
      ***/

      var imageLoadedCallback = function() {
        // once the image load event triggers, remove the event
        // listener to ensure the event is called only once
        target.removeEventListener('load', imageLoadedCallback);
        fadeOut();

        $timeout(function() {
          fadeIn();
        }, 700);
      }

      /***
      *
      * Define fade in / out events to be called once a new image
      * is passed to the attrs.backgroundImage in the directive
      *
      ***/

      var fadeOut = function() {
        element.css({'opacity': '0'})
      };

      var fadeIn = function() {
        element.css({
          'background': 'url(' + value +') no-repeat center center fixed',
          'background-size' : 'cover',
          'opacity': '1'
        });
      };

      // add an onload event to the hidden-full-screen-image
      var target = document.querySelector('.hidden-full-screen-image');
      target.addEventListener('load', imageLoadedCallback);

    });
  };
}]);
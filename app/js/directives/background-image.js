/***
*
* Directive to dynamically set background images when 
* controllers update their backgroundImageUrl scope
* variables
*
***/

var angular = require('angular');

angular.module('BackgroundImage', [])
  .directive('backgroundImage', function () {
  return function(scope, element, attrs){
    attrs.$observe('backgroundImage', function(value) {
      element.css({
          'background': 'url(' + value +') no-repeat center center fixed',
          'background-size' : 'cover'
      });
    });
  };
});
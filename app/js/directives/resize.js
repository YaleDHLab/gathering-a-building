/***
*
* Directive that listens for the div in which it's placed
* to resize.
*
* Template: <div ng-style="resizeWithOffset(165)" resize notifier="controllerFunction(params)">
*
***/

var angular = require('angular');

angular.module('Resize', [])
  .directive('resize', [
    "$window",
  function ($window) {
    return function (scope, element, attr) {

      var w = angular.element($window);
      scope.$watch(function () {
        return {
          'h': window.innerHeight,
          'w': window.innerWidth
        };
      }, function (newValue, oldValue) {
        scope.windowHeight = newValue.h;
        scope.windowWidth = newValue.w;

        scope.resizeWithOffset = function (offsetH) {
          scope.$eval(attr.notifier);
          return {
            'height': (newValue.h - offsetH) + 'px'
          };
        };
      }, true);

      w.bind('resize', function () {
        scope.$apply();
      });
    }
}]);
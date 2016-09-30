/***
*
* Service to change the background color of the navbar and brand logo
*
***/

var angular = require('angular');

angular.module('BackgroundStyle', [])
  .service('backgroundStyle', [
    "$rootScope",
  function ($rootScope) {
    var backgroundStyle = {};
    
    /***
    *
    * Allow injecting controllers to pass a background style
    * {'light', 'dark'} then broadcast that background style
    * to all scopes
    *
    ***/

    var updateBackgroundStyle = function(style) {
      backgroundStyle = style;
      $rootScope.$broadcast('backgroundStyleUpdated', style);
    };

    var getBackgroundStyle = function() {
      return backgroundStyle;
    };

    return {
      updateBackgroundStyle: updateBackgroundStyle,
      getBackgroundStyle: getBackgroundStyle
    };
}]);
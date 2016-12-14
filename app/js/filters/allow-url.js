/***
*
* Filter to allow one to set urls to remote assets
*
***/

var angular = require('angular');

angular.module('AllowUrl', [])
  .filter('allowUrl', [
    '$sce',
  function($sce){
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);
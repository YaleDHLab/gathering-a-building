/***
*
* Filter to allow one to dangerouslySetInnerHtml
*
***/

var angular = require('angular');

angular.module('AllowHtml', [])
  .filter('allowHtml', [
    '$sce',
  function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}]);
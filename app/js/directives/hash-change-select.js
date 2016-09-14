/***
*
* Directive to support scroll by href in mobile select
*
***/

var angular = require('angular');

angular.module('HashChangeSelect', [])
  .directive('hashChangeSelect',[
    '$location',
  function($location){
    "ngInject";

  return {
    restrict : 'E',
    templateUrl : '/templates/partials/layout/hash-change-select.html',
    scope : {
      options : "=",
      value :  "=",
    },
    link : function(scope) {
      return true;
    },
    controller : ["$scope", function($scope) {
      /* $scope is controller scope; fetch the value object's id and set
      it in the url hash */
      $scope._value = angular.copy($scope.value);
      $scope.onOptionSelected = function(){
        console.log($scope, $scope.$parent.$parent.$parent);
        $location.search('article',$scope._value.id);
        $location.hash($scope._value.id);
      }
    }]
  };
}]);
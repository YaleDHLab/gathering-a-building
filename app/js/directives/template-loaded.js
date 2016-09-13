/***
*
* Directive that fires a callback in the current
* controller once the directive-equipped template
* has finished loading. Template usage:
* <div template-loaded="someMethod()"></div>
*
***/

var angular = require('angular');
angular.module('TemplateLoaded', [])

.directive('templateLoaded', function( $parse ) {
  return {
    restrict: 'A',
    link: function( $scope, elem, attrs ) {    
      elem.ready(function(){
        $scope.$apply(function(){
            var func = $parse(attrs.templateLoaded);
            func($scope);
        })
      })
    }
  }
})
/***
*
* Directive to scroll to the href within the current a tag
*
***/

var angular = require('angular');
var $ = require('jquery');

angular.module('ScrollToId', [])
  .directive('scrollToId', function () {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      // to give a div a pointer to another div, just
      // add data-bullseye="3", which will point to #3
      var idToScroll = attrs.bullseye;
      element.on('click', function(event) {
        event.preventDefault();
        var $target;
        if (idToScroll) {
          $target = $(idToScroll);
        } else {
          $target = element;
        }
        $(".text-column").animate({scrollTop: $target.offset().top}, "fast");
        return false;
      });
    }
  }
});
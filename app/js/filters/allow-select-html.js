/***
*
* Filter to allow one to dangerouslySetInnerHtml
*
***/

var angular = require('angular');

angular.module('AllowSelectHtml', [])
  .filter('allowSelectHtml',
  function() {

    function htmlDecode(input) {
      var e = document.createElement('div');
      e.innerHTML = input;
      return e.childNodes[0].nodeValue;
    }

    return function(input) {
      return htmlDecode(input);
    }
});
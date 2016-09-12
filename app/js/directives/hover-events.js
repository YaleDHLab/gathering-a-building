/***
*
* Directive to run code after template content and ng-repeat
* events have completed. In this case, we use the directive to
* add hover states for material journeys pictures/text.
* See: http://stackoverflow.com/questions/12304291
*
***/

var angular = require('angular');

angular.module('HoverEvents', [])
  .directive('hoverEvents', function() {
  return {
    link: function($scope, element, attrs) {

      // Trigger when number of children changes,
      // including by directives like ng-repeat
      var watch = $scope.$watch(function() {
        return element.children().length;
      }, function() {

        // Wait for templates to render
        $scope.$evalAsync(function() {

          // Once control passes to this step,
          // all templates have loaded and ng-repeats
          // have concluded.

          // Define functions such that hovering on text
          // highlights the images, and vice versa
          var textInfluencesImage = function(elem, index) {
            elem.addEventListener("mouseover", function() {
              var associatedImage = chapterSectionImages[index];
              associatedImage.className += " active";
            });

            elem.addEventListener("mouseout", function() {
              var associatedImage = chapterSectionImages[index];
              associatedImage.className = defaultImageClass;
            });
          };

          var imageInfluencesText = function(elem, index) {
            elem.addEventListener("mouseover", function() {
              var associatedText = chapterSectionTitles[index];
              associatedText.className += " active";
            });

            elem.addEventListener("mouseout", function() {
              var associatedText = chapterSectionTitles[index];
              associatedText.className = defaultTextClass;
            });
          };

          // select all of the section subheadings and images
          var chapterSectionTitles = document.querySelectorAll(".text-column-material-journeys a");
          var chapterSectionImages = document.querySelectorAll(".table-of-contents-right-panel");

          if (chapterSectionTitles.length > 0 && chapterSectionImages.length > 0) {

            // store the classes applied to chapter section subheadings and images
            var defaultTextClass = chapterSectionTitles[0].className;
            var defaultImageClass = chapterSectionImages[0].className;

            // make hovers on text influence images
            chapterSectionTitles.forEach(textInfluencesImage);

            // make hovers on images influence text
            chapterSectionImages.forEach(imageInfluencesText);
          };
        });
      });
    },
  };
});
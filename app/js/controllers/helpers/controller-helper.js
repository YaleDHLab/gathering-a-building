module.exports = {

  /***
  *
  * Updates background image if necessary and adds associated animation
  *
  ***/

  updateBackground: function($scope, imageUrl) {
    if ($scope.backgroundImageUrl) {
      if (imageUrl != $scope.backgroundImageUrl) {
        $scope.backgroundImageUrl = imageUrl;
      }
    } else {
      $scope.backgroundImageUrl = imageUrl;
    }
  },

  /***
  *
  * Fades the table of contents into / out of view
  *
  ***/

  showTableOfContents: function($scope, v) {
    var target = document.querySelector('.table-of-contents-container');

    // if the target exists, update its opacity
    // else the target doesn't exist in the DOM; add it
    if (target) {
      target.style.opacity = v;
    } else {
      $scope.showTableOfContents = 1;
    }
  },

  /***
  *
  * Build the options for the mobile navigation dropdown
  *
  ***/

  buildDropdownOptions: function($scope) {
    $scope.dropdownOptions = [];

    for (var i=0; i<Object.keys($scope.textColumn.sections).length; i++) {
      $scope.dropdownOptions.push({
        label: $scope.textColumn.sections[i].title,
        id: $scope.textColumn.sections[i].id
      });
    };
  }
}
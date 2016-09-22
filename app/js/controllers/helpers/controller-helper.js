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
  },

  /***
  *
  * Function to initialize the left portion of the footer
  *
  ***/

  initializeFooter: function($scope, $location, title, style) {
    $scope.footer = {
      "style": style,
      "left": {
        "display": title,
        "url": "/#" + $location.path() + "#0"
      }
    }
  },

  /***
  *
  * Function to update the footer link upon section change
  *
  ***/

  updateFooter: function($scope, $location) {
    // if there is a next section, make the right hand side
    // of the footer link to it, else make the right hand
    // side of the footer blank
    var sections = Object.keys($scope.textColumn.sections).length;
    var path = $location.path();
    var hash = parseInt($scope.selectedSectionId, 10);
    var nextHash = hash + 1;

    // identify the html for the right footer
    var footerRightHtml = "Next <i class='fa fa-angle-down'></i>";

    console.log(nextHash, sections);

    // subtract 1 from sections because length is 1-based indexed,
    // and section ids count from 0
    if (nextHash > (sections-1)) {
      $scope.footer.right = {
        "url": "/#" + path + "#0",
        "display": ""
      }
    } else {
      $scope.footer.right = {
        "url": "/#" + path + "#" + nextHash,
        "display": footerRightHtml
      }
    }
  }
}
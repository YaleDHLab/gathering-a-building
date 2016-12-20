module.exports = {

  /***
  *
  * Updates background image if necessary and adds associated animation
  *
  ***/

  updateBackground: function($scope, imageUrl) {
    $scope.backgroundImageUrl = imageUrl;
    $scope.$apply();
  },

  /***
  *
  * Update the template used as the background for the view
  *
  ***/

  updateTemplate: function($scope, $timeout, $sce, section) {
    // if we're swapping templates, fade the old one out
    if (section.template == 'three-div-container') {
      this.setThreeDivContent($scope, $sce);
    }

    if ($scope.template) {
      if ($scope.template != section["template"]) {

        // apply animations to the three and four div containers
        if ($scope.template == 'three-div-container' || $scope.template == 'four-div-container') {
          document.querySelector('.' + $scope.template).style.opacity = 0;
        };

        // if the new template is a three or four div container, fade it in
        if (section["template"] == 'three-div-container' || section["template"] == 'four-div-container') {
          document.querySelector('.' + section["template"]).style.opacity = 1;
        };

        // update the new template
        $timeout(function() {
          $scope.template = section["template"];
        }, 900);
      }
    } else {
      $scope.template = section["template"];
    }
  },

  /***
  *
  * Function that sets the background content for three-div-containers
  *
  ***/

  setThreeDivContent: function($scope, $sce) {
    $scope.bottomImage = $scope.idToSection[$scope.selectedSectionId].bottomImage;
    $scope.topCaption = $scope.idToSection[$scope.selectedSectionId].topCaption;
    $scope.bottomCaption = $scope.idToSection[$scope.selectedSectionId].bottomCaption;

    // make the video and topImage assets mutually exclusive
    var youtubeVideo = $scope.idToSection[$scope.selectedSectionId].youtubeVideo;
    if (youtubeVideo != "") {
      var embed = "//www.youtube.com/embed/" + youtubeVideo.split("?v=")[1];
      $scope.youtubeVideo = embed;
    } else {
      $scope.youtubeVideo = "";
      $scope.topImage = $scope.idToSection[$scope.selectedSectionId].topImage;
    }
  },

  /***
  *
  * Function to change the color of the navigation button
  * and DHLab brand image
  *
  ***/

  updateBackgroundStyle: function($scope, backgroundStyleService, section) {
    var style = section["backgroundStyle"];
    backgroundStyleService.updateBackgroundStyle({navigationButton: style.navigationButton, brandIcon: style.brandIcon});
  },

  /***
  *
  * Build the options for the mobile navigation dropdown
  *
  ***/

  buildDropdownOptions: function($scope) {
    $scope.dropdownOptions = [];

    // iterate over the floated ids, convert each to a string for the text column
    // lookup, and proceed to build up the dropdown options
    $scope.textColumn.sections.map(function(section) {
      if (Number.isInteger(parseFloat(section.id))) {
        $scope.dropdownOptions.push({
          label: section.title,
          id: section.id
        });
      }
    });
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

    // compute the total number of links in this text column
    var links = [];
    $scope.textColumn.sections.map(function(section) {
      if (section.id.indexOf(".") > -1) {} else {
        links.push(section.id);
      }
    });

    var sections = Object.keys($scope.textColumn.sections).length;
    var path = $location.path();
    var hash = parseInt($scope.selectedSectionId, 10);
    var nextHash = hash + 1;

    // identify the html for the right footer
    var footerRightHtml = "Next <i class='fa fa-angle-down'></i>";

    // subtract 1 from sections because length is 1-based indexed,
    // and section ids count from 0
    if (nextHash > (links.length-1)) {
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
  },

  /***
  *
  * Function to initialize mobile controls
  *
  ***/

  initializeMobile: function($scope) {
    $scope.mobile = {
      "mobileControlsLeft": "/templates/partials/layout/dropdown-selector.html",
      "mobileControlsLeftClass": "full-width-mobile-dropdown",
      "mobileControlsRight": "",
      "mobileControlsRightClass": "hidden"
    }
  },

  /***
  *
  * Function to initialize the iframe controls
  *
  ***/

  initializeIframe: function($scope) {
    $scope.iframe = {
      shown: "0",
      src: ""
    }
  },

  /***
  *
  * Function to show a full screen iframe
  *
  ***/

  showIframe: function($scope, boolean, iframeSrc) {
    $scope.iframe.shown = boolean;
    $scope.iframe.src = iframeSrc;
  },

  /***
  *
  * Function to scroll to the hash() element of the current $location()
  *
  ***/

  scrollToHash($location, $timeout) {
    var hash = $location.hash();
    if (hash) {
      $timeout(function(){
        var destination = document.getElementById(hash);
        destination.scrollIntoView();
      }, 500);
    }
  },

  /***
  *
  * Function to set body opacity to a float value {0,1}
  *
  ***/

  updateBodyOpacity($timeout, val) {
    var body = document.querySelector("body");
    if (body.style.opacity != val) {
      $timeout(function() {
        body.style.opacity = val;
      }, 500);
    }
  }

}
var angular = require('angular');
var $ = require('jquery');
var d3 = require('d3');
var L = require('leaflet');

angular.module('HistoricalGeographyController', [])
  .controller("historicalGeographyController", [
      "$scope", "$http",
  function($scope, $http) {

    /**************
    * Text Column *
    **************/

    // define the text column data
    $scope.textColumn = {
      "title": "historical-geography",
      "display": "1",
      "hr": "1",
      "sections": {
        "0": {
          "id": "0",
          "title": "SECTION ONE",
          "subtitle": "HG Section 1 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, ne soleat dolorem lobortis nam, no meis civibus aliquando vis. Ut vidit sonet usu, an mel quot paulo mentitum. Eu sea tollit erroribus, vix eu reque fugit labore, an vel repudiare persecuti. Equidem omnesque ut qui, est persius ocurreret et, postulant voluptaria eam ut. Probo fierent ponderum sea ex. In mea eius utamur petentium, suscipit deserunt accommodare duo ut, ne verear omittam vel.", "Mea odio mutat lobortis no, te perpetua facilisis principes ius. Nisl fastidii periculis cu est, ex errem euripidis evertitur nec. Eu debet placerat mediocrem vis, pro vidisse accumsan gloriatur ei. Cu omittam scripserit nec. Nec erroribus reprimique te, modus fabulas ea pro, adhuc omnes offendit no pro.", "Sea ne amet voluptaria intellegam, an eos elitr moderatius complectitur. Ad epicurei oportere imperdiet eam, stet omnes nonumy per at, at fierent appellantur pri. Te modo omnes assentior qui. Elitr labitur accommodare cu mel. Ad wisi dolore nec. Adhuc nullam mel ei, duo augue imperdiet no.", "Vel etiam signiferumque ex, inermis splendide mei ea. Eu pro latine eruditi persecuti, veri iusto temporibus ei his. Pro novum soleat salutandi te, eos agam tation nominavi eu. Iisque oblique quo ea.", "Et minim constituto cum, id pri semper denique scaevola. An mea eruditi indoctum, quo dico quot nominavi in. Ut sea aperiri facilis assueverit, quodsi latine facilis ea qui. Nihil probatus vis at, ut sed atqui legere, usu propriae necessitatibus ea.", "His an detraxit consulatu, no brute pertinacia sit, an eam vivendo aliquando. Sed accusamus elaboraret ut, ei his congue percipitur. Putent epicuri argumentum in mea, eam cu option splendide, mel solum inimicus ad. Ne facilisi gloriatur vel, facer veniam vivendo ius at. In diam aeque iracundia usu, ex nec amet diceret signiferumque. Cu vix erant oblique nostrum, ei est feugiat forensibus, ea sed meis omittantur. Vel tation similique no.", "Habemus civibus eu has, usu ne debet option mentitum, pro ut tota delenit fuisset. Ut sit iriure sapientem, placerat senserit efficiantur id qui, sit malorum iudicabit et. Cu eripuit lucilius mei, eam hinc esse adhuc et, solet diceret mel ex. Duo ei dicam malorum abhorreant, error ignota scripta ea sit. Est cu justo albucius forensibus, ipsum omnium cu qui. Et est enim gloriatur, has alii solum ut.", "Eos laoreet posidonium an, doctus appareat no quo, est quot albucius in. Primis reprehendunt cum ei. Interesset cotidieque interpretaris nam ex, quo soluta putent aliquam cu. Ea pri ornatus detracto. Regione voluptaria at sed, nam adhuc nostrum at.", "Pri modus facete legendos eu, no eum amet aliquam appellantur, vivendo honestatis vix ei. Cum sonet discere neglegentur at, an pro iuvaret vivendo, eos in suscipit percipitur. Sit lucilius persequeris id. Vim et accumsan theophrastus, elitr vulputate eos cu.", "Epicurei mediocrem consequat cu pri. Vocibus repudiare pro ea, vis melius utroque rationibus ne, vim esse feugiat appetere id. Ad elit errem habemus ius, suas ferri adversarium mei te. Tollit menandri percipitur mel at."],
          "background": "NA"
        },

        "1": {
          "id": "1",
          "title": "SECTION TWO",
          "subtitle": "HG Section 2 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, ne soleat dolorem lobortis nam, no meis civibus aliquando vis. Ut vidit sonet usu, an mel quot paulo mentitum. Eu sea tollit erroribus, vix eu reque fugit labore, an vel repudiare persecuti. Equidem omnesque ut qui, est persius ocurreret et, postulant voluptaria eam ut. Probo fierent ponderum sea ex. In mea eius utamur petentium, suscipit deserunt accommodare duo ut, ne verear omittam vel.", "Mea odio mutat lobortis no, te perpetua facilisis principes ius. Nisl fastidii periculis cu est, ex errem euripidis evertitur nec. Eu debet placerat mediocrem vis, pro vidisse accumsan gloriatur ei. Cu omittam scripserit nec. Nec erroribus reprimique te, modus fabulas ea pro, adhuc omnes offendit no pro.", "Sea ne amet voluptaria intellegam, an eos elitr moderatius complectitur. Ad epicurei oportere imperdiet eam, stet omnes nonumy per at, at fierent appellantur pri. Te modo omnes assentior qui. Elitr labitur accommodare cu mel. Ad wisi dolore nec. Adhuc nullam mel ei, duo augue imperdiet no.", "Vel etiam signiferumque ex, inermis splendide mei ea. Eu pro latine eruditi persecuti, veri iusto temporibus ei his. Pro novum soleat salutandi te, eos agam tation nominavi eu. Iisque oblique quo ea.", "Et minim constituto cum, id pri semper denique scaevola. An mea eruditi indoctum, quo dico quot nominavi in. Ut sea aperiri facilis assueverit, quodsi latine facilis ea qui. Nihil probatus vis at, ut sed atqui legere, usu propriae necessitatibus ea.", "His an detraxit consulatu, no brute pertinacia sit, an eam vivendo aliquando. Sed accusamus elaboraret ut, ei his congue percipitur. Putent epicuri argumentum in mea, eam cu option splendide, mel solum inimicus ad. Ne facilisi gloriatur vel, facer veniam vivendo ius at. In diam aeque iracundia usu, ex nec amet diceret signiferumque. Cu vix erant oblique nostrum, ei est feugiat forensibus, ea sed meis omittantur. Vel tation similique no.", "Habemus civibus eu has, usu ne debet option mentitum, pro ut tota delenit fuisset. Ut sit iriure sapientem, placerat senserit efficiantur id qui, sit malorum iudicabit et. Cu eripuit lucilius mei, eam hinc esse adhuc et, solet diceret mel ex. Duo ei dicam malorum abhorreant, error ignota scripta ea sit. Est cu justo albucius forensibus, ipsum omnium cu qui. Et est enim gloriatur, has alii solum ut.", "Eos laoreet posidonium an, doctus appareat no quo, est quot albucius in. Primis reprehendunt cum ei. Interesset cotidieque interpretaris nam ex, quo soluta putent aliquam cu. Ea pri ornatus detracto. Regione voluptaria at sed, nam adhuc nostrum at.", "Pri modus facete legendos eu, no eum amet aliquam appellantur, vivendo honestatis vix ei. Cum sonet discere neglegentur at, an pro iuvaret vivendo, eos in suscipit percipitur. Sit lucilius persequeris id. Vim et accumsan theophrastus, elitr vulputate eos cu.", "Epicurei mediocrem consequat cu pri. Vocibus repudiare pro ea, vis melius utroque rationibus ne, vim esse feugiat appetere id. Ad elit errem habemus ius, suas ferri adversarium mei te. Tollit menandri percipitur mel at."],
          "background": "NA"
        },
      }
    };

    // Add a function to change map overlay on scroll events. NB:
    // only call the selection function if the background is changing
    $scope.getScrollPosition = function(arg) {
      if (arg < 2000) {
        if ($scope.selectedOverlay != 0) {
          $scope.selectOverlay(0);
        }
      };

      if (arg > 2000) {
        if ($scope.selectedOverlay != 1) {
          $scope.selectOverlay(1);
        }
      }
    };

    // Add events to hide and show the text column
    var showTextColumn = function() {
      $scope.textColumn.display = "1";
      $scope.footer.right.display = "<i class='fa fa-chevron-circle-up'></i>";
    };

    var hideTextColumn = function() {
      $scope.textColumn.display = "0";
      $scope.footer.right.display = "<i class='fa fa-chevron-circle-down'></i>";
    };

    $scope.toggleTextColumn = function() {
      $scope.textColumn.display === "1"? hideTextColumn() : showTextColumn();
    }

    /******************
    * Mobile controls *
    ******************/

    // build the dropdown for toggling map options in mobile views
    $scope.buildOverlayOptions = function() {

      // the dropdown options are articulated in $scope.mapOverlays
      $scope.overlayOptions = [];
      for (var i=0; i<Object.keys($scope.mapOverlays).length; i++) {

        // the display option should contain the content of
        // year - label keys.
        var year = $scope.mapOverlays[i].year;
        var label = $scope.mapOverlays[i].label;
        var overlayLabel = year + " - " + label;

        $scope.overlayOptions.push({
          "label": overlayLabel,
          "id": i
        });
      };
    };


    // add a client side listener to change image overlay on
    // change of the select box
    $scope.setOverlayOption = function(overlayOption) {
      $scope.selectOverlay(overlayOption.id);
    };


    // define the partials to be used within the left and right
    // regions of the mid-page mobile controls
    $scope.mobile = {
      "mobileControlsLeft": "/templates/partials/historical-geography/overlay-select-dropdown.html",
      "mobileControlsLeftClass": "",
      "mobileControlsRight": "/templates/partials/historical-geography/opacity-slider.html",
      "mobileControlsRightClass": ""
    };

    /*****************
    * Image overlays *
    *****************/

    // add a function that displays the tiles at the specified url
    var addImageOverlay = function(map, imageTileUrl) {

      // remove the old imageOverlay layer
      $(".imageOverlay").remove();

      var imageOverlay = L.tileLayer(imageTileUrl, {
        attribution: '<a href="http://web.library.yale.edu/dhlab">DHLab@Yale</a>',
        opacity: .6,
        // set max zoom to prevent requests for tiles that don't exist
        maxZoom: 20,
        tms: true,
        // also set bounds to prevent 404's from appearing when
        // the client requests image tiles from relevant zoom levels
        // if those tiles don't exist. Bounds retrieved from
        // gdalinfo {{geotiff.tif}}
        bounds: [
          L.latLng(41.3183532,-72.9385611),
          L.latLng(41.2950316, -72.8997637)
        ]
      }).addTo(map);

      // add a class to the image tile layer for dynamic css styling
      $(imageOverlay.getContainer()).addClass('imageOverlay');

    };


    /******************
    * Vector overlays *
    ******************/

    var addVectorOverlay = function(map, vectorJsonUrl) {

      // request json that describes building boundaries
      d3.json(vectorJsonUrl, function(rawJson) {

        // Revove any extant building vector overlays from the map.
        // To do so, get a reference to the vectors, then fade them out.
        // One second after that function completes, remove the objects
        // from the DOM.
        var overlayBoundingBox = $(".overlay-bounding-box");
        overlayBoundingBox.addClass("fade-out");
        setTimeout(function(){
          overlayBoundingBox.remove(); },
        1000);

        // each member of this array describes a building
        for (var i=0; i<rawJson.length; i++) {
          var buildingJson = rawJson[i];
          if (buildingJson) {

            // add the building to the map
            var polyline = new L.GeoJSON(buildingJson, {
                className: 'overlay-bounding-box animated fade-in',
                weight: 2,
                fillOpacity: .85
              }
            ).addTo(map);
          }

        }
      });
    }

    // Click listener to toggle vector overlay
    $scope.toggleVectorOverlay = function() {
      $(".vector-overlay-toggle-button").toggleClass("active");
      $(".overlay-bounding-box").toggleClass("hidden");
    };

    /***
    *
    * Overlay data
    *
    * @object: keys are ids for the selected plan
    *          values are labels for the selected plan
    *
    * Defines the available map overlays
    ***/

    $scope.mapOverlays = {
      "0": {
        "year": 1753,
        "label": "Wadsworth Plan",
        "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1748_Wadsworth_Plan-NewHaven_1806-Kensett-engr_Beinecke_15675071-GEO1/{z}/{x}/{y}.png",
        "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1753.json"
      },
      "1": {
        "year": 1802,
        "label": "Plan of New Haven",
        "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1802_Plan-New-Haven_Biencke_105622451_GEO1/{z}/{x}/{y}.png",
        "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1835.json"
      },
      "2": {
        "year": 1824,
        "label": "Doolittle Plan",
        "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1824_Doolittle_Plan-of-New-Haven_Beinecke_156750741/{z}/{x}/{y}.png",
        "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1850.json"
      },
      "3": {
        "year": 1849,
        "label": "Buckingham Plan",
        "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1849_Buckingham_NH_156913731_Geo4/{z}/{x}/{y}.png",
        "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1894.json"
      },
      "4": {
        "year": 1874,
        "label": "Benham Plan",
        "imageOverlayUrl": "https://gathering-a-building.s3.amazonaws.com/1874_Benham_15691396_Geo2/{z}/{x}/{y}.png",
        "vectorOverlayUrl": "https://s3-us-west-2.amazonaws.com/gathering-a-building/projected_buildings_1912.json"
      }
    }

    /***
    *
    * Vector overlay selection function
    *
    * @params: Integer that is present in Object.keys(mapOverlayLabels)
    * @returns: none
    *  
    * Updates the map to display the selected map overlay
    ***/

    $scope.selectOverlay = function(selectedId) {

      // store the selected overlay in a scope object
      $scope.selectedOverlay = selectedId;

      // indicate in the selection box which id is currently selected
      $(".map-overlay").removeClass("active");
      $(".map-overlay-" + selectedId).addClass("active");
      
      // update the footer state to show the selected overlay id text
      $scope.footer = {
        "left": {
          "display": $scope.mapOverlays[selectedId]["label"]
        },
        "right": {
          "display": "<i class='fa fa-chevron-circle-up'></i>",
          "url": "/#/",
          "onClick": "toggleTextColumn()"
        },
         "style": "full"
      };

      // add the image tile overlay
      addImageOverlay(map, $scope.mapOverlays[selectedId]["imageOverlayUrl"]);

      // add the vector overlay, which will remove the old vector overlay
      addVectorOverlay(map, $scope.mapOverlays[selectedId]["vectorOverlayUrl"]);

      // add an opacity slider with floot, ceiling, and initial value
      $scope.opacitySlider = {
        value: 70,
        options: {
          floor: 0,
          ceil: 100
        }
      };

      // add an event listener for the slider
      $scope.$on("slideEnded", function() {
        var currentOpacity = $scope.opacitySlider.value;
        var opacityPercent = currentOpacity / $scope.opacitySlider.options.ceil;
        $(".imageOverlay").css("opacity", opacityPercent);
      });

    };

    /***
    * @params: none
    * @returns: none
    *  
    * Function that builds the basemap on which layers will be added
    ***/

    var initializeMap = function() {

      // specify the coordinates on which to center the map initially
      var centerCoordinates = new L.LatLng(41.307, -72.928);

      // create the map object itself
      var map = new L.Map("map", {
        center: centerCoordinates,
        zoom: 17,
        zoomControl: false
      });

      // position the zoom controls in the bottom right hand corner
      L.control.zoom({
        position: 'bottomright',
        zoom: 16,
        maxZoom: 20,
        minZoom: 12,
      }).addTo(map);

      // use the cartodb basemap
      map.addLayer(new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }));

      return map;

    };

    /***
    * @params: none
    * @returns: none
    *  
    * Initializes map overlay and selects the first overlay option
    ***/

    var map = initializeMap();
    $scope.buildOverlayOptions();
    $scope.selectOverlay(0);

  }
]);
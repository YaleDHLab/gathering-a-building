var angular          = require('angular');
var $                = require('jquery');
var d3               = require('d3');
var L                = require('leaflet');
var controllerHelper = require('../helpers/controller-helper');
var mapHelper        = require('../helpers/map-helper')

angular.module('HistoricalGeographyController', [])
  .controller("historicalGeographyController", [
      "$scope", "$http", "$timeout",
  function($scope, $http, $timeout) {

    /***
    *
    * Define the data to be passed to the view on user interaction with the page
    *
    ***/

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

    $scope.mobile = {
      "mobileControlsLeft": "/templates/partials/historical-geography/overlay-select-dropdown.html",
      "mobileControlsLeftClass": "",
      "mobileControlsRight": "/templates/partials/historical-geography/opacity-slider.html",
      "mobileControlsRightClass": ""
    };

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
    * Click listener that shows/hides the text column
    *
    ***/

    $scope.toggleTextColumn = function() {
      $scope.textColumn.display === "1"?
        controllerHelper.hideTextColumn($scope) :
        controllerHelper.showTextColumn($scope);
    }

    /***
    *
    * Click listener that selects the overlay image/vector data
    * to display
    *
    ***/

    $scope.setOverlayOption = function(overlayOption) {
      $scope.selectOverlay(overlayOption.id);
    };

    /***
    *
    * Click listener that toggles the vector overlay
    *
    ***/

    $scope.toggleVectorOverlay = function() {
      $(".vector-overlay-toggle-button").toggleClass("active");
      $(".overlay-bounding-box").toggleClass("hidden");
    };

    /***
    *
    * Updates the map to display the user-selected map overlay
    *
    ***/

    $scope.selectOverlay = function(selectedId) {
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

      // add the image tile overlay and vector overlay
      mapHelper.addImageOverlay(map, $scope.mapOverlays[selectedId]["imageOverlayUrl"]);
      mapHelper.addVectorOverlay(map, $scope.mapOverlays[selectedId]["vectorOverlayUrl"]);

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
    *
    * Identify a function that calls an update function
    * if the user has scrolled to a new section
    *
    ***/

    $scope.getSelectedSection = function(sectionId) {
      if (sectionId !== $scope.selectedSectionId) {
        $scope.selectedSectionId = sectionId;
        selectSection();
      }
    }

    /***
    *
    * Function that updates the background image(s),
    * links, and other page assets as a function of
    * user scroll
    *
    ***/

    var selectSection = function() {
      $timeout(function(){
        var sectionId = String($scope.selectedSectionId);
        $scope.selectOverlay(sectionId);
      });
    }

    /***
    *  
    * Initialize the map overlay and select the first overlay option
    *
    ***/

    var map = mapHelper.initializeMap();
    mapHelper.buildMapOverlayOptions($scope);
    $scope.selectOverlay(0);

  }
]);
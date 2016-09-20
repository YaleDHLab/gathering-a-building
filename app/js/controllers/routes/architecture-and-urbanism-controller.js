var angular = require('angular');
var controllerHelper = require('../helpers/controller-helper');

angular.module('ArchitectureAndUrbanismController', [])
  .controller("architectureAndUrbanismController", [
    "$scope", "$http", "$timeout",
  function($scope, $http, $timeout) {

    $scope.footer = {
      "left": {
        "display": "Architecture & Urbanism",
        "url": "/#/routes/architecture-and-urbanism#0"
      },
      "right": {
        "display": "Next <i class='fa fa-angle-down'></i>",
        "url": "/#/routes/architecture-and-urbanism#1"
      },
       "style": "partial"
    };

    $scope.mobile = {
      "mobileControlsLeft": "/templates/partials/layout/dropdown-selector.html",
      "mobileControlsLeftClass": "full-width-mobile-dropdown",
      "mobileControlsRight": "",
      "mobileControlsRightClass": "hidden"
    };

    $scope.textColumn = {
      "title": "architecture-and-urbanism",
      "display": "1",
      "hr": "1",
      "sections": {
        "0": {
          "id": "0",
          "title": "Architecture & Urbanism 1",
          "subtitle": "AA Section 1 subtitle is longer than the title",
          "showTableOfContents": "1",
          "paragraphs": ["Lorem ipsum dolor sit amet, at mel purto delectus legendos, tantas labitur civibus id mel, inani timeam atomorum no eam. Tollit habemus commune mel cu. Has at labores ullamcorper, te eam ullum populo nonumes. Hinc tation nonumy qui id, vis congue molestie ut, in dolorum recusabo sea.", "Et est contentiones mediocritatem, paulo equidem similique eos ad. Forensibus persequeris interpretaris ut mea, duo vitae meliore conceptam at. Vix cu dicam legimus, pri facete fabellas ut, an vis libris aperiri partiendo. Duo conceptam argumentum in, ut eam nisl discere eripuit, errem cetero quaerendum at sed. Mea ex quis hinc persius, esse dignissim sea cu, ut eruditi contentiones has.", "Ad tacimates laboramus nec, cum ex mollis dolores. Sale aperiri pertinax quo eu. Mutat aeterno perpetua vel cu, sed accumsan verterem consequuntur ea, an nobis scribentur has. Eu iudicabit voluptatum vix. Eam eu invenire consetetur suscipiantur, summo mundi voluptaria nec eu, an omnis eirmod tincidunt quo. Vide meis an pri. Est ei meis posidonium argumentum.", "Pro te inani homero, ei delenit iudicabit ius. Minim nostro eruditi eam at, nec everti discere ponderum an. Qui illum ipsum ne. Quidam dolorem dolores ex per, ex nec integre patrioque intellegat. An nam munere impetus.", "Periculis hendrerit sententiae id has. Vel eu natum ferri evertitur, vim at augue facilisi. Pri erant civibus id, inermis definitiones cu vis. Tritani verterem cotidieque eos ea. Pri at probatus partiendo efficiendi, minim liber accusamus at vix. Vix ceteros percipit antiopam et, option concludaturque ex per, no eum modo audiam adversarium.", "Modo novum fastidii an quo. Mea ad nisl feugiat voluptaria, per tantas expetenda ad. Cum quem meis integre ne. Ius an duis appetere, tempor atomorum voluptaria sit te. Ea omnes semper explicari duo, eu velit detracto est. In aeque assentior reprimique duo.", "Congue munere his ad, an has detracto deterruisset. An eam dolor laoreet, affert nullam pri in. Vis et saepe feugiat, vim ut labore iracundia. Ut sumo vitae nec, pro ei soluta labores. Vis delenit petentium no, suscipit petentium deterruisset per no.", "Novum mucius te mea, ne natum detraxit sea. Cibo euismod incorrupte et sed, ad mel omittantur interpretaris. Ad erant nihil placerat ius. Has eu mutat persius tractatos, cu nec putant vulputate, fugit theophrastus nam ea. Cibo habemus gloriatur qui et, usu mollis fierent placerat ne, eum senserit abhorreant ut.", "Mei cu eripuit alienum euripidis. Propriae constituto complectitur ad mea, partem propriae scaevola eu nec. Sit cu verear sanctus pericula. Ut usu sint salutandi, posse noster at vis. Errem appetere ex vis, at sed scaevola accusamus inciderint.", "Pri te tota insolens mediocrem, has in illud porro facilisis. An duo laudem ocurreret, has duis detraxit argumentum eu. Ius id quis postea suscipit, est falli scripserit interpretaris ea, in sit deseruisse disputationi. At ridens apeirian sed, eam unum dicunt reformidans te. Illum minimum sit ea, per omnis laudem ea. Per eleifend corrumpit id, liber adversarium ius at, ei pro putant corpora forensibus."],
          "background": {
            "1": {
              "url": "/assets/images/skyline.jpg",
              "alt": "Image of scaffolding",
              "annotation": "Scholarly annotation of scaffold image"
            }
          }
        },

        "1": {
          "id": "1",
          "title": "Architecture & Urbanism 2",
          "subtitle": "AA Section 1 subtitle is longer than the title",
          "showTableOfContents": "0",
          "paragraphs": ["Lorem ipsum dolor sit amet, at mel purto delectus legendos, tantas labitur civibus id mel, inani timeam atomorum no eam. Tollit habemus commune mel cu. Has at labores ullamcorper, te eam ullum populo nonumes. Hinc tation nonumy qui id, vis congue molestie ut, in dolorum recusabo sea.", "Et est contentiones mediocritatem, paulo equidem similique eos ad. Forensibus persequeris interpretaris ut mea, duo vitae meliore conceptam at. Vix cu dicam legimus, pri facete fabellas ut, an vis libris aperiri partiendo. Duo conceptam argumentum in, ut eam nisl discere eripuit, errem cetero quaerendum at sed. Mea ex quis hinc persius, esse dignissim sea cu, ut eruditi contentiones has.", "Ad tacimates laboramus nec, cum ex mollis dolores. Sale aperiri pertinax quo eu. Mutat aeterno perpetua vel cu, sed accumsan verterem consequuntur ea, an nobis scribentur has. Eu iudicabit voluptatum vix. Eam eu invenire consetetur suscipiantur, summo mundi voluptaria nec eu, an omnis eirmod tincidunt quo. Vide meis an pri. Est ei meis posidonium argumentum.", "Pro te inani homero, ei delenit iudicabit ius. Minim nostro eruditi eam at, nec everti discere ponderum an. Qui illum ipsum ne. Quidam dolorem dolores ex per, ex nec integre patrioque intellegat. An nam munere impetus.", "Periculis hendrerit sententiae id has. Vel eu natum ferri evertitur, vim at augue facilisi. Pri erant civibus id, inermis definitiones cu vis. Tritani verterem cotidieque eos ea. Pri at probatus partiendo efficiendi, minim liber accusamus at vix. Vix ceteros percipit antiopam et, option concludaturque ex per, no eum modo audiam adversarium.", "Modo novum fastidii an quo. Mea ad nisl feugiat voluptaria, per tantas expetenda ad. Cum quem meis integre ne. Ius an duis appetere, tempor atomorum voluptaria sit te. Ea omnes semper explicari duo, eu velit detracto est. In aeque assentior reprimique duo.", "Congue munere his ad, an has detracto deterruisset. An eam dolor laoreet, affert nullam pri in. Vis et saepe feugiat, vim ut labore iracundia. Ut sumo vitae nec, pro ei soluta labores. Vis delenit petentium no, suscipit petentium deterruisset per no.", "Novum mucius te mea, ne natum detraxit sea. Cibo euismod incorrupte et sed, ad mel omittantur interpretaris. Ad erant nihil placerat ius. Has eu mutat persius tractatos, cu nec putant vulputate, fugit theophrastus nam ea. Cibo habemus gloriatur qui et, usu mollis fierent placerat ne, eum senserit abhorreant ut.", "Mei cu eripuit alienum euripidis. Propriae constituto complectitur ad mea, partem propriae scaevola eu nec. Sit cu verear sanctus pericula. Ut usu sint salutandi, posse noster at vis. Errem appetere ex vis, at sed scaevola accusamus inciderint.", "Pri te tota insolens mediocrem, has in illud porro facilisis. An duo laudem ocurreret, has duis detraxit argumentum eu. Ius id quis postea suscipit, est falli scripserit interpretaris ea, in sit deseruisse disputationi. At ridens apeirian sed, eam unum dicunt reformidans te. Illum minimum sit ea, per omnis laudem ea. Per eleifend corrumpit id, liber adversarium ius at, ei pro putant corpora forensibus."],
          "background": {
            "1": {
              "url": "/assets/images/sunset.jpg",
              "alt": "Image of skyline",
              "annotation": "Scholarly annotation of skyline image"
            }
          }
        }
      }
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
        var section = $scope.textColumn.sections[sectionId];
        var tableOfContents = parseInt(section["showTableOfContents"], 10);
        var background = section["background"]["1"]["url"];
        controllerHelper.updateBackground($scope, background);
        controllerHelper.showTableOfContents($scope, tableOfContents);
      });
    }

    // initialize the application state
    $scope.selectedSectionId = 0;
    selectSection($scope);
    controllerHelper.showTableOfContents($scope, 1);
    controllerHelper.buildDropdownOptions($scope);

  }
]);
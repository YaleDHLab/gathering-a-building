var angular = require('angular');

angular.module('MaterialJourneysController', [])
  .controller("materialJourneysController", [
      "$scope", "$http",
  function($scope, $http) {

    // Set initial footer params, and update as page updates
    $scope.footer = {
      "left": {
        "display": "Material Journeys",
        "url": "/#/routes/material-journeys#0"
      },
      "right": {
        "display": 'Next <i class="fa fa-angle-down"></i>',
        "url": "/#/routes/material-journeys#1"
      },
      "style": "partial"
    };

    /***
    * Mobile controls
    ***/

    // build the options for the footer dropdown
    $scope.buildDropdownOptions = function() {
      $scope.dropdownOptions = [];

      for (var i=0; i<Object.keys($scope.textColumn.sections).length; i++) {
        $scope.dropdownOptions.push({
          label: $scope.textColumn.sections[i].title,
          id: $scope.textColumn.sections[i].id
        });
      };
    };

    // define the configuration of the mobile mid page controls
    $scope.mobile = {
      "mobileControlsLeft": "/templates/partials/layout/dropdown-selector.html",
      "mobileControlsLeftClass": "full-width-mobile-dropdown",
      "mobileControlsRight": "",
      "mobileControlsRightClass": "hidden"
    };

    /***
    * Text columnn
    ***/

    $scope.textColumn = {
      "title": "material-journeys",
      "display": "1",
      "hr": "1",
      "sections": {
        "0": {
          "id": "0",
          "controller": "material-journeys",
          "title": "MATERIAL JOURNEYS",
          "subtitle": "MJ TABLE OF CONTENTS",
          "paragraphs": [
            "<a href='/#/routes/material-journeys#1'><h2 class='section-subheading'>CONCRETE</h2></a>",
            "<a href='/#/routes/material-journeys#2'><h2 class='section-subheading'>STONE</h2></a>",
            "<a href='/#/routes/material-journeys#3'><h2 class='section-subheading'>BRICK</h2></a>",
            "<a href='/#/routes/material-journeys#4'><h2 class='section-subheading'>GLASS</h2></a>",
            "<div class='section-introduction-text'>Egestas hendrerit dignissim non neque urna, a imperdiet pretium congue egestas rhoncus. Porttitor vitae, at donec aliquet. Sollicitudin velit metus nonummy. Hendrerit nullam pulvinar, adipiscing mus, sit nulla justo, odio leo tellus pede risus proin, elementum et. Tellus a eget nec tempus.</div>"
          ],
          "introImage": "",
          "background": {
            "1": {
              "url": "",
              "alt": "",
              "annotation": ""
            }
          }
        },

        "1": {
          "id": "1",
          "controller": "material-journeys",
          "title": "Concrete",
          "subtitle": "MJ Section 1 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his. Probo explicari te ius. Id vix expetenda conceptam democritum, et vocent propriae pro. Cu scaevola instructior duo, his dicunt phaedrum ad, at dicat veritus constituam sea. Nobis possit scaevola sit ex, stet eloquentiam ne pri.", "Debitis mediocritatem cu pro, te pro recusabo abhorreant. Hinc perpetua per ad, mea ei munere causae commune. Vide placerat democritum ne pri, modus docendi te pro, illud dicant eos no. Quod platonem ad pri, pri ne virtute invidunt deterruisset. Ut iusto forensibus reprehendunt vis.", "Graece theophrastus ut vel, vim gloriatur intellegam cotidieque ne. Quo delenit perfecto et, dicat labores ne qui, pro id dicam aperiam disputando. Mucius intellegam te nam. Eum et augue tantas, ad tale delenit mea. An natum platonem elaboraret eam, quando forensibus pro ex. Id eam mutat mediocrem maiestatis. Mea mazim quando indoctum ea, liber integre principes quo at, pri ad accusamus consectetuer.", "Eos ex epicurei persequeris appellantur, ea alii velit augue cum. An dolor sententiae vis, ne modo aperiam imperdiet cum. Ex cum amet adversarium interpretaris, nisl utinam ea has. Minim vidisse eam no, ut eos dolor ridens, eum te moderatius efficiantur ullamcorper.", "Ne mea tempor theophrastus, eam in mandamus euripidis intellegebat. Usu laoreet lobortis efficiantur no, agam nemore evertitur eu vel, ex duo tincidunt democritum. Munere labore ei pro, impetus sensibus in vis. Vel ut habeo voluptaria, per eu quem erat facete, cu eam dolor eligendi perpetua. Dolor assentior maiestatis ne eam.", "No per rebum impetus sadipscing, tollit euismod an eum. Usu oportere partiendo no, in sed brute fastidii philosophia. Ut pri bonorum probatus. Te nostro repudiandae nam, ex eum porro atqui.", "At eos omnes decore quidam. Dolore mollis eripuit eum ex, minim mediocritatem vim te. Eruditi pertinax te cum, ancillae maluisset cum ei. Ut mei maiorum dissentias, veri virtute habemus cu has. Sed eu scribentur instructior, eos ei agam latine complectitur.", "Wisi debet clita vim ea. Magna habeo mucius vix no, ad pri recusabo expetendis. Ei est etiam aliquid. Mea brute mnesarchum et, ne dolores appareat interpretaris vel.", "Legere omittam appetere in mel. An eum quaeque referrentur. At vim quod modus scripta. Pro ne facer eruditi, partem efficiendi te sed, et praesent interesset ius. Porro dolores et vel, dico antiopam id duo.", "Nam saepe adolescens reprehendunt ea, homero timeam nostrum eos et. Cu eum reque evertitur, ius eu nonumy delectus voluptatibus. Mei no diceret percipit voluptatum, aeque omnes id has. Ad possit democritum eum, copiosae perfecto tacimates has no, natum mundi congue te mea. Ut doming utamur eos."],
          "introImage": "/assets/images/concrete.jpg",
          "background": {
            "1": {
              "url": "/assets/images/sunset.jpg",
              "alt": "Image of scaffolding",
              "annotation": "Scholarly annotation of scaffold image"
            }
          }
        },

        "2": {
          "id": "2",
          "controller": "material-journeys",
          "title": "Stone",
          "subtitle": "MJ Section 2 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his. Probo explicari te ius. Id vix expetenda conceptam democritum, et vocent propriae pro. Cu scaevola instructior duo, his dicunt phaedrum ad, at dicat veritus constituam sea. Nobis possit scaevola sit ex, stet eloquentiam ne pri.", "Debitis mediocritatem cu pro, te pro recusabo abhorreant. Hinc perpetua per ad, mea ei munere causae commune. Vide placerat democritum ne pri, modus docendi te pro, illud dicant eos no. Quod platonem ad pri, pri ne virtute invidunt deterruisset. Ut iusto forensibus reprehendunt vis.", "Graece theophrastus ut vel, vim gloriatur intellegam cotidieque ne. Quo delenit perfecto et, dicat labores ne qui, pro id dicam aperiam disputando. Mucius intellegam te nam. Eum et augue tantas, ad tale delenit mea. An natum platonem elaboraret eam, quando forensibus pro ex. Id eam mutat mediocrem maiestatis. Mea mazim quando indoctum ea, liber integre principes quo at, pri ad accusamus consectetuer.", "Eos ex epicurei persequeris appellantur, ea alii velit augue cum. An dolor sententiae vis, ne modo aperiam imperdiet cum. Ex cum amet adversarium interpretaris, nisl utinam ea has. Minim vidisse eam no, ut eos dolor ridens, eum te moderatius efficiantur ullamcorper.", "Ne mea tempor theophrastus, eam in mandamus euripidis intellegebat. Usu laoreet lobortis efficiantur no, agam nemore evertitur eu vel, ex duo tincidunt democritum. Munere labore ei pro, impetus sensibus in vis. Vel ut habeo voluptaria, per eu quem erat facete, cu eam dolor eligendi perpetua. Dolor assentior maiestatis ne eam.", "No per rebum impetus sadipscing, tollit euismod an eum. Usu oportere partiendo no, in sed brute fastidii philosophia. Ut pri bonorum probatus. Te nostro repudiandae nam, ex eum porro atqui.", "At eos omnes decore quidam. Dolore mollis eripuit eum ex, minim mediocritatem vim te. Eruditi pertinax te cum, ancillae maluisset cum ei. Ut mei maiorum dissentias, veri virtute habemus cu has. Sed eu scribentur instructior, eos ei agam latine complectitur.", "Wisi debet clita vim ea. Magna habeo mucius vix no, ad pri recusabo expetendis. Ei est etiam aliquid. Mea brute mnesarchum et, ne dolores appareat interpretaris vel.", "Legere omittam appetere in mel. An eum quaeque referrentur. At vim quod modus scripta. Pro ne facer eruditi, partem efficiendi te sed, et praesent interesset ius. Porro dolores et vel, dico antiopam id duo.", "Nam saepe adolescens reprehendunt ea, homero timeam nostrum eos et. Cu eum reque evertitur, ius eu nonumy delectus voluptatibus. Mei no diceret percipit voluptatum, aeque omnes id has. Ad possit democritum eum, copiosae perfecto tacimates has no, natum mundi congue te mea. Ut doming utamur eos."],
          "introImage": "/assets/images/stone.jpg",
          "background": {
            "1": {
              "url": "/assets/images/scaffold.jpg",
              "alt": "Image of scaffold",
              "annotation": "Scholarly annotation of scaffold image"
            }
          }
        },

        "3": {
          "id": "3",
          "controller": "material-journeys",
          "title": "Brick",
          "subtitle": "MJ Section 3 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his. Probo explicari te ius. Id vix expetenda conceptam democritum, et vocent propriae pro. Cu scaevola instructior duo, his dicunt phaedrum ad, at dicat veritus constituam sea. Nobis possit scaevola sit ex, stet eloquentiam ne pri.", "Debitis mediocritatem cu pro, te pro recusabo abhorreant. Hinc perpetua per ad, mea ei munere causae commune. Vide placerat democritum ne pri, modus docendi te pro, illud dicant eos no. Quod platonem ad pri, pri ne virtute invidunt deterruisset. Ut iusto forensibus reprehendunt vis.", "Graece theophrastus ut vel, vim gloriatur intellegam cotidieque ne. Quo delenit perfecto et, dicat labores ne qui, pro id dicam aperiam disputando. Mucius intellegam te nam. Eum et augue tantas, ad tale delenit mea. An natum platonem elaboraret eam, quando forensibus pro ex. Id eam mutat mediocrem maiestatis. Mea mazim quando indoctum ea, liber integre principes quo at, pri ad accusamus consectetuer.", "Eos ex epicurei persequeris appellantur, ea alii velit augue cum. An dolor sententiae vis, ne modo aperiam imperdiet cum. Ex cum amet adversarium interpretaris, nisl utinam ea has. Minim vidisse eam no, ut eos dolor ridens, eum te moderatius efficiantur ullamcorper.", "Ne mea tempor theophrastus, eam in mandamus euripidis intellegebat. Usu laoreet lobortis efficiantur no, agam nemore evertitur eu vel, ex duo tincidunt democritum. Munere labore ei pro, impetus sensibus in vis. Vel ut habeo voluptaria, per eu quem erat facete, cu eam dolor eligendi perpetua. Dolor assentior maiestatis ne eam.", "No per rebum impetus sadipscing, tollit euismod an eum. Usu oportere partiendo no, in sed brute fastidii philosophia. Ut pri bonorum probatus. Te nostro repudiandae nam, ex eum porro atqui.", "At eos omnes decore quidam. Dolore mollis eripuit eum ex, minim mediocritatem vim te. Eruditi pertinax te cum, ancillae maluisset cum ei. Ut mei maiorum dissentias, veri virtute habemus cu has. Sed eu scribentur instructior, eos ei agam latine complectitur.", "Wisi debet clita vim ea. Magna habeo mucius vix no, ad pri recusabo expetendis. Ei est etiam aliquid. Mea brute mnesarchum et, ne dolores appareat interpretaris vel.", "Legere omittam appetere in mel. An eum quaeque referrentur. At vim quod modus scripta. Pro ne facer eruditi, partem efficiendi te sed, et praesent interesset ius. Porro dolores et vel, dico antiopam id duo.", "Nam saepe adolescens reprehendunt ea, homero timeam nostrum eos et. Cu eum reque evertitur, ius eu nonumy delectus voluptatibus. Mei no diceret percipit voluptatum, aeque omnes id has. Ad possit democritum eum, copiosae perfecto tacimates has no, natum mundi congue te mea. Ut doming utamur eos."],
          "introImage": "/assets/images/brick.jpg",
          "background": {
            "1": {
              "url": "/assets/images/skyline.jpg",
              "alt": "Image of skyline",
              "annotation": "Scholarly annotation of skyline image"
            }
          }
        },

        "4": {
          "id": "4",
          "controller": "material-journeys",
          "title": "Glass",
          "subtitle": "MJ Section 4 subtitle is longer than the title",
          "paragraphs": ["Lorem ipsum dolor sit amet, vix vide audire at, autem mentitum sententiae id eum. Adversarium signiferumque est eu, an eum sonet essent mediocritatem. Ea impedit gubergren torquatos quo, te inermis noluisse consequat his. Probo explicari te ius. Id vix expetenda conceptam democritum, et vocent propriae pro. Cu scaevola instructior duo, his dicunt phaedrum ad, at dicat veritus constituam sea. Nobis possit scaevola sit ex, stet eloquentiam ne pri.", "Debitis mediocritatem cu pro, te pro recusabo abhorreant. Hinc perpetua per ad, mea ei munere causae commune. Vide placerat democritum ne pri, modus docendi te pro, illud dicant eos no. Quod platonem ad pri, pri ne virtute invidunt deterruisset. Ut iusto forensibus reprehendunt vis.", "Graece theophrastus ut vel, vim gloriatur intellegam cotidieque ne. Quo delenit perfecto et, dicat labores ne qui, pro id dicam aperiam disputando. Mucius intellegam te nam. Eum et augue tantas, ad tale delenit mea. An natum platonem elaboraret eam, quando forensibus pro ex. Id eam mutat mediocrem maiestatis. Mea mazim quando indoctum ea, liber integre principes quo at, pri ad accusamus consectetuer.", "Eos ex epicurei persequeris appellantur, ea alii velit augue cum. An dolor sententiae vis, ne modo aperiam imperdiet cum. Ex cum amet adversarium interpretaris, nisl utinam ea has. Minim vidisse eam no, ut eos dolor ridens, eum te moderatius efficiantur ullamcorper.", "Ne mea tempor theophrastus, eam in mandamus euripidis intellegebat. Usu laoreet lobortis efficiantur no, agam nemore evertitur eu vel, ex duo tincidunt democritum. Munere labore ei pro, impetus sensibus in vis. Vel ut habeo voluptaria, per eu quem erat facete, cu eam dolor eligendi perpetua. Dolor assentior maiestatis ne eam.", "No per rebum impetus sadipscing, tollit euismod an eum. Usu oportere partiendo no, in sed brute fastidii philosophia. Ut pri bonorum probatus. Te nostro repudiandae nam, ex eum porro atqui.", "At eos omnes decore quidam. Dolore mollis eripuit eum ex, minim mediocritatem vim te. Eruditi pertinax te cum, ancillae maluisset cum ei. Ut mei maiorum dissentias, veri virtute habemus cu has. Sed eu scribentur instructior, eos ei agam latine complectitur.", "Wisi debet clita vim ea. Magna habeo mucius vix no, ad pri recusabo expetendis. Ei est etiam aliquid. Mea brute mnesarchum et, ne dolores appareat interpretaris vel.", "Legere omittam appetere in mel. An eum quaeque referrentur. At vim quod modus scripta. Pro ne facer eruditi, partem efficiendi te sed, et praesent interesset ius. Porro dolores et vel, dico antiopam id duo.", "Nam saepe adolescens reprehendunt ea, homero timeam nostrum eos et. Cu eum reque evertitur, ius eu nonumy delectus voluptatibus. Mei no diceret percipit voluptatum, aeque omnes id has. Ad possit democritum eum, copiosae perfecto tacimates has no, natum mundi congue te mea. Ut doming utamur eos."],
          "introImage": "/assets/images/glass.jpg",
          "background": {
            "1": {
              "url": "/assets/images/sunset.jpg",
              "alt": "Image of sunset",
              "annotation": "Scholarly annotation of sunset image"
            }
          }
        }
      }
    };

    /***
    *
    * Updates background image if necessary and adds associated animation
    *
    ***/

    var updateBackground = function(imageUrl) {
      if ($scope.backgroundImageUrl) {
        if (imageUrl != $scope.backgroundImageUrl) {
          $scope.backgroundImageUrl = imageUrl;
        }
      } else {
        $scope.backgroundImageUrl = imageUrl;
      }
    }

    /***
    *
    * Bind a scroll listener to swap background images dynamically
    *
    ***/

    $scope.getScrollPosition = function(scrollPosition) {
      if (scrollPosition < 640) {
        $scope.showTableOfContents = 1;
        $scope.footer.right.url = "/#/routes/material-journeys#1";
        updateBackground($scope.textColumn["sections"]["0"]["background"]["1"]["url"]);
        $scope.$apply();
      }

      if (scrollPosition > 640 && scrollPosition <= 2620) {
        $scope.showTableOfContents = 0;
        $scope.footer.right.url = "/#/routes/material-journeys#2";
        updateBackground($scope.textColumn["sections"]["1"]["background"]["1"]["url"]);
        $scope.$apply();
      }

      if (scrollPosition > 2620 && scrollPosition <= 4750) {
        $scope.showTableOfContents = 0;
        $scope.footer.right.url = "/#/routes/material-journeys#3";
        updateBackground($scope.textColumn["sections"]["2"]["background"]["1"]["url"]);
        $scope.$apply();
      }

      if (scrollPosition > 4750 && scrollPosition <= 6670) {
        $scope.showTableOfContents = 0;
        $scope.footer.right.url = "/#/routes/material-journeys#4";
        updateBackground($scope.textColumn["sections"]["3"]["background"]["1"]["url"]);
        $scope.$apply();
      }

      if (scrollPosition > 6670) {
        $scope.showTableOfContents = 0;
        $scope.footer.right.url = "/#/routes/material-journeys#0";
        updateBackground($scope.textColumn["sections"]["4"]["background"]["1"]["url"]);
        $scope.$apply();
      }
    }

    // initialize the application state
    $scope.showTableOfContents = 1;
    $scope.backgroundImageUrl = $scope.textColumn["sections"]["0"]["background"]["1"]["url"];
    $scope.buildDropdownOptions();

  }
]);
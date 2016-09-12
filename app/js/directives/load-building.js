/***
*
* Directive to load building model data on page load
*
***/

var angular = require('angular');
var autodeskCredentials = require('../lib/autodesk');

angular.module('LoadBuilding', [])
  .directive('loadBuilding', function() {
  return {
    link: function($scope, element, attrs) {

      // Trigger when number of children changes,
      // including by directives like ng-repeat
      var watch = $scope.$watch(function() {
        return element.children().length;
      }, function() {

        // Wait for templates to render
        $scope.$evalAsync(function() {

          // load the building data
          var viewerApp;
          var options = {
            env: 'AutodeskProduction',
            accessToken: autodeskCredentials.accessToken
          };
          var documentId = autodeskCredentials.urn;
          Autodesk.Viewing.Initializer(options, function onInitialized(){
            viewerApp = new Autodesk.A360ViewingApplication('building-model');
            viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D);
            viewerApp.loadDocumentWithItemAndObject(documentId);
          });

        });
      });
    },
  };
});
'use strict';

/**
 * @ngdoc function
 * @name latexOverlayApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the latexOverlayApp
 */
angular.module('latexOverlayApp')
  .controller('AboutCtrl', function ($scope) {

    $scope.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      readOnly: true,
      mode: 'stex',
      theme: 'default'
    };
  });

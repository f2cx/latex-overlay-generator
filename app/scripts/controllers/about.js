'use strict';

/**
 * @ngdoc function
 * @name latexOverlayApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the latexOverlayApp
 */
angular.module('latexOverlayApp')
  .controller('AboutCtrl', function ($scope, $http) {


    $scope.editorOptions = {
      readOnly: true,
      lineWrapping : true,
      lineNumbers: true,
      mode: 'stex',
      theme: 'default'
    };


    $scope.usage = {};
    $scope.usage.code = "";

    $http.get('usage.txt').success(function(data) {

      $scope.usage.code = data;
    });


  });

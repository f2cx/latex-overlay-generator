'use strict';

/**
 * @ngdoc overview
 * @name latexOverlayApp
 * @description
 * # latexOverlayApp
 *
 * Main module of the application.
 */
angular
  .module('latexOverlayApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'xeditable',
    'ui.codemirror'
  ])
  .config(function ($routeProvider) {


    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function($rootScope) {


    $rootScope.items = [
      {macro: "annotatedFigureBox", label: "A", x0: 0.01, y0: 0.7, x1: 0.32, y1: 0.89, x2: 0.01, y2: 0.7, },
      {macro: "annotatedFigureBox", label: "B", x0: 0.32, y0: 0.19, x1: 0.4, y1: 0.3, x2: 0.32, y2: 0.19},
      {macro: "annotatedFigureBox", label: "C", x0: 0.49, y0: 0.8, x1: 0.53, y1: 0.89, x2: 0.49, y2: 0.8},
      {macro: "annotatedFigureBox", label: "D", x0: 0.5, y0: 0.18, x1: 0.7, y1: 0.3, x2: 0.5, y2: 0.18}
    ];

    $rootScope.latex = {};
    $rootScope.latex.code = "";
    $rootScope.overlay = {};
    $rootScope.overlay.file = "teaser.png";

    $rootScope.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      mode: 'stex',
      theme: 'default'
    };
  });

/* global angular */

'use strict';

angular
        .module('latexOverlayApp', [
            'ngAnimate',
            'ngCookies',
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'ngTouch',
            'xeditable',
            'ui.codemirror',
            'ngDialog'
        ])
        .config(function ($routeProvider) {


            $routeProvider
                    .when('/v0.0.1', {
                        templateUrl: 'views/v0.0.1.html',
                        controller: 'MainCtrl'
                    })
                    .when('/', {
                        templateUrl: 'views/about.html',
                        controller: 'AboutCtrl'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });
        }).run(function ($rootScope) {



    $rootScope.latex = {};
    $rootScope.latex.code = '';
    $rootScope.overlay = {};
    $rootScope.overlay.file = 'black-demo.png';

    $rootScope.overlay.items = [
        {type: 'annotatedFigureBox', label: 'A', position: 'bl', x0: 0.01, y0: 0.7, x1: 0.32, y1: 0.89, x2: 0.01, y2: 0.7},
        {type: 'annotatedFigureBox', label: 'B', position: 'bl', x0: 0.32, y0: 0.19, x1: 0.4, y1: 0.3, x2: 0.32, y2: 0.19},
        {type: 'annotatedFigureBox', label: 'C', position: 'bl', x0: 0.49, y0: 0.8, x1: 0.53, y1: 0.89, x2: 0.49, y2: 0.8},
        {type: 'annotatedFigureBox', label: 'D', position: 'bl', x0: 0.5, y0: 0.18, x1: 0.7, y1: 0.3, x2: 0.5, y2: 0.18}
    ];



});

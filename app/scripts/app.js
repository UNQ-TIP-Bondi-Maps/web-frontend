'use strict';

/**
 * @ngdoc overview
 * @name webFrontendApp
 * @description
 * # webFrontendApp
 *
 * Main module of the application.
 */
 var app = angular.module('webFrontendApp', ['angular-growl', 'angular-storage', 'ui.bootstrap', 'ui.router', 'ngCookies', 'ngAnimate', 'ngResource', 'ngSanitize', 'ngTouch', 'ngMap', 'angularScreenfull', 'angularUtils.directives.dirPagination', 'btorfs.multiselect']);

  app.config(function ($stateProvider, $urlRouterProvider) { 
    // For unmatched routes
    $urlRouterProvider.otherwise('/');

    // Application routes
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'views/signup.html',
            controller: 'SignupCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'views/templates/dashboard.html'
        })
        .state('lines', {
            url: '/lines',
            templateUrl: 'views/lines.html',
            controller: 'LinesCtrl'
        })
        .state('buses', {
            url: '/buses/:busLineID',
            templateUrl: 'views/buses.html',
            controller: 'BusesCtrl'
        })
        .state('monitoring-buses', {
            url: '/monitoring-buses',
            templateUrl: 'views/monitoring-buses.html',
            controller: 'MonitoringBusesCtrl'
        })
        .state('tables', {
            url: '/tables',
            templateUrl: 'views/templates/tables.html'
        });
  });

app.directive('navbar', function() { 
  return { 
    restrict: 'E', 
    templateUrl: '../views/templates/navbar.html',
    controller: 'NavbarCtrl'
  }; 
}); 
 
 
app.directive('sidebar', function() { 
  return { 
    restrict: 'E', 
    templateUrl: '../views/templates/sidebar.html', 
    controller: 'MasterCtrl' 
  }; 
}); 

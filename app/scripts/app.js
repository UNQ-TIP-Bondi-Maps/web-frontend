'use strict';

/**
 * @ngdoc overview
 * @name webFrontendApp
 * @description
 * # webFrontendApp
 *
 * Main module of the application.
 */
var app = angular
  .module('webFrontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'angular-storage'
  ]);

  app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html'
      })
      .state('buses', {
        url: '/buses/:busLineID',
        templateUrl: 'views/buses.html',
        controller: 'BusesCtrl'
      })
      .state('busLine', {
        url: '/busLines',
        templateUrl: 'views/bus-line.html',
        controller: 'BusLineCtrl'
      });
  });

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
    'ui.router'
  ]);

  app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html'
      });
  });

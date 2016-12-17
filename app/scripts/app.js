'use strict';

/**
 * @ngdoc overview
 * @name webFrontendApp
 * @description
 * # webFrontendApp
 *
 * Main module of the application.
 */
 var app = angular.module('webFrontendApp', ['angular-growl', 'angular-storage', 'ui.bootstrap', 'ui.router', 'ngCookies', 'ngAnimate', 'ngResource', 'ngSanitize', 'ngTouch', 'ngMap', 'angularScreenfull', 'angularUtils.directives.dirPagination', 'btorfs.multiselect', 'angularjs-dropdown-multiselect']);

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

app.directive('numbersOnly', function(){
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           if (inputValue == undefined) return '' 
           var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         
           return transformedInput;         
       });
     }
   }
});
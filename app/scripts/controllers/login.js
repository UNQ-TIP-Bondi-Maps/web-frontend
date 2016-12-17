'use strict';

angular.module('webFrontendApp')
  .controller('LoginCtrl', ['$scope', '$http', '$location', 'store',  function($scope, $http, $location, store) {
  	$scope.errorLogin = false;
  	$scope.userName = '';
  	$scope.password = '';
    $scope.loginProblem = false;
    $scope.serverError = false;

    $scope.login = function() {
      $scope.loginProblem = false;
      $scope.serverError = false;
      $http.get('http://localhost:8080/backend/rest/companyManagers/login/' + $scope.userName + '/' + $scope.password)
        .then(function successCallback(response) {
          store.set('id', response.data);
          $location.path('/lines');
        }, function errorCallback(response) {
          if(response.status == 400) {
            $scope.loginProblem = true;
          } else {
            $scope.serverError = true;
          }
        });
    };
  }]);
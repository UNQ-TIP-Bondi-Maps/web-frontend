'use strict';

angular.module('webFrontendApp')
  .controller('LoginCtrl', ['$scope', '$http', '$location', 'store', 'usSpinnerService', function($scope, $http, $location, store, usSpinnerService) {
  	$scope.errorLogin = false;
  	$scope.userName = '';
  	$scope.password = '';
    $scope.login = function() {
      $scope.errorLogin = false;
      $http.get('http://localhost:8080/backend/rest/companyManagers/login/' + $scope.userName + '/' + $scope.password)
        .then(function successCallback(response) {
          store.set('id', response.data);
  		  $location.path('/busLines');
        }, function errorCallback(response) {
          $scope.errorLogin = true;
        });
    };
  }]);
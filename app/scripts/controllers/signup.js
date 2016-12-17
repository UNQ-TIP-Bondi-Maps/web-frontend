'use strict';

angular.module('webFrontendApp')
  .controller('SignupCtrl', ['$scope', '$http', '$location', 'store', 'growl', function($scope, $http, $location, store, growl) {
  	$scope.startCeckIfExistsUserName = false;
    $scope.notExistsUserName = false;
    $scope.existsUserName = false;
    $scope.companyManager = {nameAndSurname: '', phone: '', email: '', userName: '', password: '', company: {name: '', imageUrl: '', busLines: []}};
  	$scope.createCompanyManager = function() {
  		$http.post('http://localhost:8080/backend/rest/companyManagers/create', $scope.companyManager)
  			.then(function successCallback(response) {
  				store.set('id', response.data.id);
  				$location.path('/lines');
  			}, function errorCallback(response) {
  				console.log("server error: " + response.data);
  			});
  	};
    $scope.checkIfExistsUserName = function() {
      if(angular.isUndefined($scope.companyManager.userName)) {
        $scope.notExistsUserName = false;
        $scope.existsUserName = false;
        return;
      }
      $scope.notExistsUserName = false;
      $scope.existsUserName = false;
      $scope.startCeckIfExistsUserName = true;
      $http.get('http://localhost:8080/backend/rest/companyManagers/existsUserName/' + $scope.companyManager.userName)
        .then(function successCallback(response) {
          $scope.notExistsUserName = !response.data;
          $scope.existsUserName = response.data;
        }, function errorCallback(response) {
          $scope.existsUserName = true;
          console.log("server error: " + response.data);
        });
    };

    $scope.goToLogin = function() {
      $location.path('/login');
    };
  }]);

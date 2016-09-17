'use strict';

angular.module('webFrontendApp')
  .controller('SignupCtrl', ['$scope', '$http', '$location', 'store', function($scope, $http, $location, store) {
  	$scope.companyManager = {nameAndSurname: '', phone: '', email: '', password: '', company: {name: '', imageUrl: '', buses: []}};
  	$scope.createCompanyManager = function() {
  		$http.post('http://localhost:8080/backend/rest/companyManagers/create', $scope.companyManager)
  			.then(function successCallback(response) {
  				store.set('id', response.data.id);
  				$location.path('/buses');
  			}, function errorCallback(response) {
  				console.log("server error: " + response.data);
  			});
  	};
  }]);

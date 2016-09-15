'use strict';

angular.module('webFrontendApp')
  .controller('BusesCtrl', ['$scope', '$http', '$location', 'store', function($scope, $http, $location, store) {
  	$scope.bus = {internal: '', directionOfTravel: '', position: null};
  	$scope.buses = [];
  	$scope.addBus = function() {
  		$http.post('http://localhost:8080/backend/rest/companyManagers/addBus/' + store.get('id') , $scope.bus)
  			.then(function successCallback(response) {
  				$scope.buses.add(response.data);
  				console.log("Colectivo agregado");
  			}, function errorCallback(response) {
  				console.log("server error: " + response.data);
  			});
  	};
  }]);
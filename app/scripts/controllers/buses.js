'use strict';

angular.module('webFrontendApp')
  .controller('BusesCtrl', ['$scope', '$http', '$location', 'store', function($scope, $http, $location, store) {
  	$scope.bus = {internal: '', directionOfTravel: '', position: null};
  	$scope.buses = [];
    $scope.createMode = true;
  	$scope.addBus = function() {
  		$http.post('http://localhost:8080/backend/rest/companyManagers/' + store.get('id')  + '/addBus'  , $scope.bus)
  			.then(function successCallback(response) {
          $http.get('http://localhost:8080/backend/rest/companyManagers/' + store.get('id') + '/buses')
            .then(function successCallback(response) {
              $scope.buses = response.data;
              $scope.bus = {internal: '', directionOfTravel: '', position: null};
            }, function errorCallback() {
              console.log("server error: " + response.dataq);
            });
  			}, function errorCallback(response) {
  				console.log("server error: " + response.data);
  			});
  	};

    $scope.deleteBus = function(bus) {
      $http.delete('http://localhost:8080/backend/rest/buses/delete/' +  bus.id)
        .then(function() {
          $scope.removeBus(bus);
        });
    };

    $scope.updateBus = function() {
      $http.put('http://localhost:8080/backend/rest/buses/update', $scope.bus)
        .then(function() {
          $scope.changeToCreateMode();
        });
    };

    $scope.removeBus = function(bus) {
      var index = $scope.buses.indexOf(bus);
      $scope.buses.splice(index, 1);
    };

    $scope.changeToEditMode = function(bus) {
      $scope.createMode = false;
      $scope.editMode = true;
      $scope.bus.id = bus.id;
      $scope.bus.internal = bus.internal;
      $scope.bus.directionOfTravel = bus.directionOfTravel;
    };

    $scope.changeToCreateMode = function() {
      $scope.bus = {internal: '', directionOfTravel: '', position: null};
      $scope.createMode = true;
      $scope.editMode = false;
    };
  }]);
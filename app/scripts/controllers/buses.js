'use strict';

angular.module('webFrontendApp')
  .controller('BusesCtrl', ['$scope', '$http', '$location', 'store', '$stateParams', 'growl', function($scope, $http, $location, store, $stateParams, growl) {
  	$scope.bus = {internal: '', directionOfTravel: '', position: null};
  	$scope.buses = [];
    $scope.createMode = true;
    $http.get('http://localhost:8080/backend/rest/busLines/' + $stateParams.busLineID)
    .then(function successCallback(response) {
      $scope.busLine = response.data;
    }, function errorCallback(response) {
      console.log("server error: " + response.dataq);
    });

    updateBusesList();

  	$scope.addBus = function() {
  		$http.post('http://localhost:8080/backend/rest/busLines/' + $stateParams.busLineID + '/addBus'  , $scope.bus)
  			.then(function successCallback(response) {
          growl.success("Colectivo agregado correctamente a la Línea " + $scope.busLine.line, {ttl: 5000});
          updateBusesList();
  			}, function errorCallback(response) {
  				console.log("server error: " + response.data);
  			});
  	};

    $scope.deleteBus = function(bus) {
      $http.delete('http://localhost:8080/backend/rest/buses/delete/' +  bus.id)
        .then(function() {
          growl.success("Colectivo eliminado correctamente de la Línea " + $scope.busLine.line, {ttl: 5000});
          $scope.removeBus(bus);
        });
    };

    $scope.updateBus = function() {
      $http.put('http://localhost:8080/backend/rest/buses/update', $scope.bus)
        .then(function() {
          growl.success("Colectivo de la Línea " + $scope.busLine.line + " actualizado correctamente", {ttl: 5000});
          $scope.changeToCreateMode();
          updateBusesList();
        });
    };

    $scope.removeBus = function(bus) {
      var index = $scope.buses.indexOf(bus);
      $scope.buses.splice(index, 1);
      $scope.numberOfBusesCreated = $scope.buses.length;
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

    function updateBusesList() {
      $http.get('http://localhost:8080/backend/rest/busLines/' + $stateParams.busLineID + '/buses')
      .then(function successCallback(response) {
        $scope.buses = response.data;
        $scope.bus = {internal: '', directionOfTravel: '', position: null};
        $scope.numberOfBusesCreated = $scope.buses.length;
      }, function errorCallback(response) {
        console.log("server error: " + response.dataq);
      });
    };
  }]);
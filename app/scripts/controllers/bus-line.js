'use strict';

angular.module('webFrontendApp')
  .controller('BusLineCtrl', ['$scope', '$http', '$location', 'store', '$state', 'growl', function($scope, $http, $location, store, $state, growl) {
  	$scope.busLine = {line: null, imageUrl: ''};
  	$scope.busLines = [];
    $scope.numberOfLinesCreated = $scope.busLines.length;
    $scope.createMode = true;
   
    //Load all bus lines
    updateBusLinesList();

  	$scope.addBusLine = function() {
  		$http.post('http://localhost:8080/backend/rest/companyManagers/' + store.get('id')  + '/addBusLine'  , $scope.busLine)
  			.then(function successCallback(response) {
          growl.success("Línea agregada correctamente.", {ttl: 5000});
          updateBusLinesList();
  			}, function errorCallback(response) {
          growl.error("Error al crear la Línea, intente nuevamente.", {ttl: 5000});
  			});
  	};

    $scope.deleteBusLine = function(busLine) {
      $http.delete('http://localhost:8080/backend/rest/busLines/delete/' +  busLine.id)
        .then(function successCallback() {
          growl.success("Línea eliminada correctamente.", {ttl: 5000});
          $scope.removeBusLine(busLine);
        }, function errorCallback() {
            growl.error("Error al eliminar la Línea, intente nuevamente.", {ttl: 5000});
        });
    };

    $scope.updateBusLine = function() {
      $http.put('http://localhost:8080/backend/rest/busLines/update', $scope.busLine)
        .then(function successCallback() {
          growl.success("Línea actualizada correctamente.", {ttl: 5000});
          $scope.changeToCreateMode();
          updateBusLinesList();
        }, function errorCallback() {
            growl.error("Error al actualizar la Línea, intente nuevamente.", {ttl: 5000});
        });
    };

    $scope.removeBusLine = function(busLine) {
      var index = $scope.busLines.indexOf(busLine);
      $scope.busLines.splice(index, 1);
      $scope.numberOfLinesCreated = $scope.busLines.length;
    };

    $scope.changeToEditMode = function(busLine) {
      $scope.createMode = false;
      $scope.editMode = true;
      $scope.busLine.id = busLine.id;
      $scope.busLine.line = busLine.line;
      $scope.busLine.imageUrl = busLine.imageUrl;
    };

    $scope.changeToCreateMode = function() {
      $scope.busLine = {line: null, imageUrl: ''};
      $scope.createMode = true;
      $scope.editMode = false;
    };

    $scope.isCreateMode = function() {
      return $scope.createMode;
    };

    $scope.goToBuses = function(busLine) {
    	$state.go("buses", { busLineID: busLine.id});
    };

    function updateBusLinesList() {
      $http.get('http://localhost:8080/backend/rest/companyManagers/' + store.get('id') + '/busLines')
        .then(function successCallback(response) {
          $scope.busLines = response.data;
          $scope.busLine = {line: null, imageUrl: ''};
          $scope.numberOfLinesCreated = $scope.busLines.length;
        }, function errorCallback(response) {
          console.log("server error: " + response.dataq);
      });
    };
}]);
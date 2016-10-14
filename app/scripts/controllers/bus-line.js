'use strict';

angular.module('webFrontendApp')
  .controller('BusLineCtrl', ['$scope', '$http', '$location', 'store', '$state', function($scope, $http, $location, store, $state) {
  	$scope.busLine = {line: null, imageUrl: ''};
  	$scope.busLines = [];
    $scope.createMode = true;
  	$scope.addBusLine = function() {
  		$http.post('http://localhost:8080/backend/rest/companyManagers/' + store.get('id')  + '/addBusLine'  , $scope.busLine)
  			.then(function successCallback(response) {
          $http.get('http://localhost:8080/backend/rest/companyManagers/' + store.get('id') + '/busLines')
            .then(function successCallback(response) {
              $scope.busLines = response.data;
              $scope.busLine = {line: null, imageUrl: ''};
            }, function errorCallback() {
              console.log("server error: " + response.dataq);
            });
  			}, function errorCallback(response) {
  				console.log("server error: " + response.data);
  			});
  	};

    $scope.deleteBusLine = function(busLine) {
      $http.delete('http://localhost:8080/backend/rest/busLines/delete/' +  busLine.id)
        .then(function() {
          $scope.removeBusLine(busLine);
        });
    };

    $scope.updateBusLine = function() {
      $http.put('http://localhost:8080/backend/rest/busLines/update', $scope.busLine)
        .then(function() {
          $scope.changeToCreateMode();
        });
    };

    $scope.removeBusLine = function(busLine) {
      var index = $scope.busLines.indexOf(busLine);
      $scope.busLines.splice(index, 1);
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

    $scope.goToBuses = function(bLID) {
    	$state.go("buses", { busLineID: bLID});
    };
  }]);
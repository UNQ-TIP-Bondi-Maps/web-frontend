'use strict';

angular.module('webFrontendApp')
  .controller('MonitoringBusesCtrl', ['$scope', '$http', '$location', 'store', '$stateParams', '$interval', 'NgMap', '$q', '$timeout', '$filter', function($scope, $http, $location, store, $stateParams, $interval, NgMap, $q, $timeout, $filter) {
  	$scope.busLines = [];
    $scope.forFilterBusLines = [];
  	$scope.coordinatesBuses = [];
    $scope.centeredMap = false;
    $scope.fullscreen = false;
    $scope.linesSelected = [];
    $scope.selection = [];
    $scope.selectedLines = [];
    $scope.example1data = [ {id: 1, label: "David"}, {id: 2, label: "Jhon"}, {id: 3, label: "Danny"}];
    $scope.example7settings = {externalIdProp: '', displayProp: 'line'};
    $scope.example5customTexts = {buttonDefaultText: 'Seleccionar Líneas', checkAll: "Seleccionar todos", uncheckAll: "Deseleccionar todos", dynamicButtonTextSuffix: "seleccionados"};
    
    loadLines();
  	$interval(function () { 
      console.log($scope.example1model);
      loadLines(); }, 7000);

    function loadLines() {
      $http.get('http://localhost:8080/backend/rest/companyManagers/' + store.get('id') + '/busLines')
        .then(function successCallback(response) {
          $scope.busLines = response.data;
          $scope.forFilterBusLines = $scope.busLines;
          collectCoordinatesBuses();
         if(!$scope.centeredMap) $scope.recenterMap();
        }, function errorCallback(response) {
          console.log("server error: " + response.data);
      });
    }

  	$scope.coordinates = [
      {pos:[-34.722961, -58.287685]},
      {pos:[-34.710498, -58.269827]},
      {pos:[-34.706162, -58.268711]},
      {pos:[-34.713818, -58.267474]}
    ];
    
    $scope.reRenderMap = function() {
      $scope.fullscreen = true;
      NgMap.getMap('fullscreenMap').then(function(map) {
        google.maps.event.trigger(map, 'resize');
      });
    }

  	function collectCoordinatesBuses() {
      $scope.busLinesAux = [];
      console.log($scope.selectedLines.length);
      for (var i = 0; i < $scope.selectedLines.length; i++) {
        for (var j = 0; j < $scope.busLines.length; j++) {
          if($scope.busLines[j].line == $scope.selectedLines[i].line) {
            $scope.busLinesAux.push($scope.busLines[j]);
            break;
          }
        }
        console.log($scope.busLinesAux);
      }
      if($scope.selectedLines.length > 0)
        $scope.busLines = $scope.busLinesAux;
      var buses = getAllBuses();
      $scope.coordinatesBuses = [];
  		for (var i = 0; i < buses.length; i++) {
  			$scope.coordinatesBuses[i] = {pos:[buses[i].position.lat, buses[i].position.lng]};
  		}
  	}

  	function getAllBuses() {
  		var buses = [];
  		for (var i = 0; i < $scope.busLines.length; i++) {
  			buses.push.apply(buses, $scope.busLines[i].buses);
  		}
  		return buses;
  	}

    $scope.recenterMap = function() {
      NgMap.getMap('monitoringMap').then(function(map) {
        if(!angular.isUndefined(map.markers)) {
          var bounds = new google.maps.LatLngBounds();
          for(var keyName in map.markers){        
            var latlng = new google.maps.LatLng(map.markers[keyName].position.lat(), map.markers[keyName].position.lng());
            bounds.extend(latlng);
          }
          map.setCenter(bounds.getCenter());
          map.fitBounds(bounds);
          $scope.centeredMap = true;
        }
      });
    }
  }]);

  app.directive('fullScreenToggle', function($timeout) {
    return {
      controller: 'MonitoringBusesCtrl',
      link: function(scope, e, a, ctrl) {
        var fullScreenClick = function() {
          e.parent().toggleClass('full-screen');
          e.text( e.parent().hasClass('full-screen') ? 'Achicar Mapa' : 'Agrandar Mapa' );
          google.maps.event.trigger(scope.map, 'resize');
        };
        e.on('click', fullScreenClick);
        /*Para que el mapa empiece fullscreen
        $timeout(function() {
          fullScreenClick();
        }, 1000);
        */
      }
    }
  });
'use strict';

angular.module('webFrontendApp')
  .controller('MonitoringBusesCtrl', ['$scope', '$http', '$location', 'store', '$stateParams', '$interval', 'NgMap', '$q', '$timeout', '$filter', function($scope, $http, $location, store, $stateParams, $interval, NgMap, $q, $timeout, $filter) {
  	$scope.busLines = [];
  	$scope.coordinatesBuses = [];
    $scope.centeredMap = false;
    $scope.fullscreen = false;
    $scope.linesSelected = [];
    $scope.selection = [];
    $scope.options = function() {
  return $q(function (resolve, reject) {
    $timeout(function () {
      var res = [];
      for (var i = 0; i <  ($filter('filter')($scope.busLines, { line: $scope.searchFilter })).length; i++) {
        res[i] =  ($filter('filter')($scope.busLines, { line: $scope.searchFilter }))[i].line.toString();
      }
      resolve(res)
    }, 1000);
  });
}
  	$interval(function () {
        $http.get('http://localhost:8080/backend/rest/companyManagers/' + store.get('id') + '/busLines')
		    .then(function successCallback(response) {
		      $scope.busLines = response.data;
		      collectCoordinatesBuses();
         if(!$scope.centeredMap) $scope.recenterMap();
		    }, function errorCallback(response) {
		      console.log("server error: " + response.data);
		});
    }, 7000);

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
      for (var i = 0; i < $scope.selection.length; i++) {
        $scope.busLines = $scope.busLines.filter(function( obj ) {
            return obj.line == parseInt($scope.selection[i], 10);
        });
      }
      var buses = getAllBuses();
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
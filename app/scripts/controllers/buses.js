'use strict';

angular.module('webFrontendApp')
  .controller('BusesCtrl', ['$scope', '$http', '$location', 'store', '$stateParams', 'growl', 'NgMap', 'GeoCoder', function($scope, $http, $location, store, $stateParams, growl, NgMap, GeoCoder) {
  	$scope.bus = {internal: '', directionOfTravel: '', position: null, routeWay: '', routeBack: '', busStopsWay: [], busStopsBack: []};
  	$scope.buses = [];
    $scope.createMode = true;
    $scope.routeWaySaved = false;
    $scope.sameRoute = true;
    $scope.drawRouteBack = false;

    $http.get('http://localhost:8080/backend/rest/busLines/' + $stateParams.busLineID)
    .then(function successCallback(response) {
      $scope.busLine = response.data;
    }, function errorCallback(response) {
      console.log("server error: " + response.data);
    });

    updateBusesList();

  	$scope.addBus = function() {
  		$http.post('http://localhost:8080/backend/rest/busLines/' + $stateParams.busLineID + '/addBus'  , $scope.bus)
  			.then(function successCallback(response) {
         growl.addSuccessMessage("Colectivo agregado correctamente", {ttl: 2000});
          updateBusesList();
  			}, function errorCallback(response) {
  				console.log("server error: " + response.data);
  			});
  	};

    $scope.deleteBus = function(bus) {
      $http.delete('http://localhost:8080/backend/rest/buses/delete/' +  bus.id)
        .then(function() {
          growl.addSuccessMessage("Colectivo eliminado correctamente", {ttl: 2000});
          $scope.removeBus(bus);
        });
    };

    $scope.updateBus = function() {
      $http.put('http://localhost:8080/backend/rest/buses/update', $scope.bus)
        .then(function() {
          growl.addSuccessMessage("Colectivo actualizado correctamente", {ttl: 2000});
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

    $scope.selection = [];
    $scope.busesSelected = false;
    // helper method to get selected bus
    $scope.selectedBuses = function selectedBuses() {
      return filterFilter($scope.buses, { selected: true });
    };

    // watch buses for changes
    $scope.$watch('buses|filter:{selected:true}', function (nv) {
      $scope.selection = nv.map(function (bus) {
        return bus;
      });
      ($scope.selection.length > 0) ? $scope.busesSelected = true : $scope.busesSelected = false;
    }, true);

    $scope.originAddress = "";
    $scope.destination = "";
    $scope.backOriginAddress = "";
    $scope.backDestinationAddress = "";
    $scope.waypointsRouteBack = [];

    $scope.notBusesSelected = function() {
      return $scope.selection.length == 0;
    }

    $scope.saveRoute = function() {
      NgMap.getMap('addBus').then(function(map) {
        $scope.realBusStopsWay = markersToPositions(map.markers);
        var coords = map.directionsRenderers[0].directions.routes[0].overview_path;
        var position = {lat: coords[0].lat(), lng: coords[0].lng()};
        $scope.busesSelectedAux = $scope.selection;
        for (var i = 0; i < $scope.selection.length; i++) {
          $scope.selection[i].routeWay = map.directionsRenderers[0].directions.routes[0].overview_polyline;
          $scope.selection[i].position = position;
          $scope.selection[i].busStopsWay = $scope.realBusStopsWay;
          delete $scope.selection[i].selected;
        }
        updateBusesSelected();
        $scope.waypointsRouteBack = map.directionsRenderers[0].directions.request.waypoints;
        $scope.backOriginAddress = $scope.originAddress;
        $scope.backDestinationAddress = $scope.destination;
      });

      $scope.routeWaySaved = true;
    }

    $scope.saveRouteBack = function() {
      NgMap.getMap("mapRouteBack").then(function(map) {
        $scope.realBusStopsBack = markersToPositions(map.markers);
        $scope.busesSelectedAux = $scope.selection;
        for (var i = 0; i < $scope.selection.length; i++) {
          $scope.selection[i].routeBack = map.directionsRenderers[0].directions.routes[0].overview_polyline;
          $scope.selection[i].busStopsBack = $scope.realBusStopsBack;
          delete $scope.selection[i].selected;
        }
        updateBusesSelected();
      });
    }

    $scope.saveSameRouteForToBack = function() {
      $scope.busesSelectedAux = $scope.selection;
      for (var i = 0; i < $scope.selection.length; i++) {
        $scope.selection[i].routeBack = $scope.selection[i].routeWay;
        delete $scope.selection[i].selected;
      }
      updateBusesSelected();
    }

    function updateBusesSelected() {
      $http.put('http://localhost:8080/backend/rest/buses/updateList', $scope.selection)
        .then(function() {
          growl.addSuccessMessage("Ruta guardada correctamente", {ttl: 2000});
          selectAll();
          $scope.busStops = [];
        });
    }

    function selectAll() {
      for (var i = 0; i < $scope.busesSelectedAux.length; i++) {
        $scope.busesSelectedAux[i].selected = true;
      }
      $scope.selection = $scope.busesSelectedAux;
    }

    $scope.selectAllBuses = function() {
      for (var i = 0; i < $scope.buses.length; i++) {
        $scope.buses[i].selected = true;
      }
      $scope.selection = $scope.buses
    }

    $scope.deselectAllBuses = function() {
      for (var i = 0; i < $scope.selection.length; i++) {
        delete $scope.selection[i].selected;
      }
    }

    $scope.routeWayPath = [];
    $scope.routeBackPath = [];
    $scope.centerMap = [0,0];
    $scope.hasRoutesCreated = function(bus) {
      return bus.routeWay == null && bus.routeBack == null;
    }

    $scope.loadRoutes = function(bus) {
      $scope.routeWayPath = pathForShape(google.maps.geometry.encoding.decodePath(bus.routeWay));
      $scope.routeBackPath = pathForShape(google.maps.geometry.encoding.decodePath(bus.routeBack));
      $scope.centerMap = getCenterMap($scope.routeWayPath, $scope.routeBackPath);
      $scope.busStopsOfBusSelected = bus.busStopsWay;
      $scope.busStopsOfBusSelected = $scope.busStopsOfBusSelected.concat(bus.busStopsBack)
      $scope.busStopsAux = [];
    }

    $scope.displayBusStops = function() {
        $scope.busStopsAux = $scope.busStopsOfBusSelected;
    };

    $scope.hideBusStops = function() {
        $scope.busStopsAux = [];
    };

    function getCenterMap(routeWayPath, routeBackPath) {
      if(routeWayPath.length >= routeBackPath.length){
        return [routeWayPath[Math.round(routeWayPath.length/2)][[0],[0]], routeWayPath[Math.round(routeWayPath.length/2)][[0],[1]]];
      }
      return [routeBackPath[Math.round(routeBackPath.length/2)][[0],[0]], routeBackPath[Math.round(routeBackPath.length/2)][[0],[1]]];
    }

    function pathForShape(coords) {
      var result = [];
      for (var i = 0; i < coords.length; i++) {
        result[i] = [coords[i].lat(), coords[i].lng()];
      }
      return result;
    }

    $scope.busStops = [];
    $scope.addMarker = function(event) {
      $scope.busStops.push([event.latLng.lat(), event.latLng.lng()]);
    }

    function markersToPositions(markers) {
      var positions = [];
      for (var key in markers) {
        positions.push({lat: markers[key].position.lat(), lng: markers[key].position.lng()})
      }
      return positions;
    }
  }]);
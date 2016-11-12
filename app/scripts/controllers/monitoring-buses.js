'use strict';

angular.module('webFrontendApp')
  .controller('MonitoringBusesCtrl', ['$scope', '$http', '$location', 'store', '$stateParams', function($scope, $http, $location, store, $stateParams) {
  	$scope.coordinates = [
      {pos:[-34.722961, -58.287685]},
      {pos:[-34.710498, -58.269827]},
      {pos:[-34.706162, -58.268711]},
      {pos:[-34.713818, -58.267474]}
    ];
  }]);
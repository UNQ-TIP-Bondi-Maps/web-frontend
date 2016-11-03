'use strict';

angular.module('webFrontendApp')
  .controller('SidenavCtrl', [ '$scope', '$mdSidenav', 'store', '$location', function($scope, $mdSidenav, store, $location) {
  	$scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      }
    }

    $scope.isLoggedIn = function() {
    	return store.get('id') != null;
    }

    $scope.goToLines = function() {
    	$location.path('/busLines');
    };
}]);
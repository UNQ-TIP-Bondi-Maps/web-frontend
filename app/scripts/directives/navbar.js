'use strict';

angular.module('webFrontendApp')
  .controller('NavbarCtrl', [ '$scope', '$mdSidenav', 'store', '$location', function($scope, $mdSidenav, store, $location) {
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

    $scope.logout = function() {
    	store.remove('id');
    	$location.path('/home');
    }
}]);
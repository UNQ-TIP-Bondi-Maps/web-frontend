'use strict';

angular.module('webFrontendApp')
  .controller('NavbarCtrl', [ '$scope', 'store', '$location', function($scope, store, $location) {
    $scope.isLoggedIn = function() {
    	return store.get('id') != null;
    }
    $scope.logout = function() {
     	store.remove('id'); 
     	$location.path('/'); 
    } 
}]);

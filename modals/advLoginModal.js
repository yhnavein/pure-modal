'use strict';
var app = angular.module('myApp');

app.factory('advLoginModal', ['pureModal', function(pureModal) {
  return pureModal({
    controller: 'AdvLoginController',
    templateUrl: 'demo/modals/advLoginModal-template.html'
  });
}]);

app.controller('AdvLoginController', ['$scope', 'advLoginModal', function ($scope, advLoginModal) {
  $scope.close = function() {
    advLoginModal.close();
  };
}]);
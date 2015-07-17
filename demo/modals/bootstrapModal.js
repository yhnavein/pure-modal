'use strict';
var app = angular.module('myApp');

app.factory('bootstrapModal', ['pureModal', function(pureModal) {
  return pureModal({
    controller: 'BootstrapController',
    templateUrl: 'demo/modals/bootstrapModal-template.html'
  });
}]);

app.controller('BootstrapController', ['$scope', 'bootstrapModal', function ($scope, bootstrapModal) {
  $scope.close = function() {
    bootstrapModal.close();
  };
}]);
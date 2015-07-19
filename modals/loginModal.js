'use strict';
var app = angular.module('myApp');

app.factory('loginModal', ['pureModal', function(pureModal) {
  return pureModal({
    controller: 'LoginController',
    templateUrl: 'demo/modals/loginModal-template.html'
  });
}]);

app.controller('LoginController', ['$scope', 'loginModal', function ($scope, loginModal) {
  $scope.close = function() {
    loginModal.close();
  };
}]);
'use strict';
var app = angular.module('myApp');

app.factory('advLoginModal', ['pureModal', function(pureModal) {
  return pureModal({
    controller: 'AdvLoginController',
    templateUrl: 'demo/modals/advLoginModal-template.html'
  });
}]);

app.controller('AdvLoginController', ['$scope', 'advLoginModal', function ($scope, advLoginModal) {
  $scope.loginModel = {};

  $scope.close = function() {
    advLoginModal.close();
  };

  $scope.processLogin = function() {
    if($scope.loginModel.email === 'demo@demo.com' && $scope.loginModel.password === 'demo') {
      $scope.success($scope.loginModel);
      advLoginModal.close();
      return;
    }
  };
}]);
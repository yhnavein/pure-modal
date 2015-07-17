'use strict';

angular.module('myApp', [ 'ngAnimate', 'pureModal' ])

  .config(function ($compileProvider) {
    //$compileProvider.debugInfoEnabled(false);
  })

  .factory('infoModal', function (pureModal) {
    return pureModal({
      controller: 'InfoController',
      controllerAs: 'infoModal',
      templateUrl: 'info-modal-template.html'
    });
  })

  .factory('loremModal', function (pureModal) {
    return pureModal({
      controller: 'LoremController',
      controllerAs: 'loremModal',
      templateUrl: 'lorem-modal-template.html'
    });
  })

  .controller('LoremController', function ($scope, loremModal) {
    var ctrl = this;

    ctrl.close = loremModal.deactivate;
  })

  .controller('InfoController', function ($scope, infoModal) {
    var ctrl = this;

    ctrl.close = infoModal.deactivate;
  });
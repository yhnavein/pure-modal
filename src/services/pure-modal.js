/*jslint bitwise: true */

'use strict';
angular.module('pureModal')
.factory('pureModal', pureModalFactory);

function pureModalFactory ($animate, $compile, $rootScope, $controller, $q, $http, $templateCache, $document, modalConfig) {
  return function modalFactory (config) {
    if (!(!config.template ^ !config.templateUrl)) {
      throw new Error('Expected modal to have exacly one of either `template` or `templateUrl`');
    }

    var controller = config.controller || null,
    controllerAs = config.controllerAs,
    container = angular.element(config.container || $document[0].querySelector(modalConfig.containerSelector)),
    element = null,
    html,
    scope;

    if (config.template) {
      html = $q.when(config.template);
    } else {
      html = $http.get(config.templateUrl, {
        cache: $templateCache
      }).
      then(function (response) {
        return response.data;
      });
    }

    function activate (locals) {
      return html.then(function ($html) {
        if (!element) {
          attach($html, locals);
        }
      });
    }

    function attach ($html, locals) {
      var prop;
      element = angular.element($html);
      if (element.length === 0) {
        throw new Error('The template contains no elements; you need to wrap text nodes');
      }
      scope = $rootScope.$new();
      if (controller) {
        if (!locals) {
          locals = {};
        }
        for (prop in locals) {
          scope[prop] = locals[prop];
        }
        var ctrl = $controller(controller, {$scope: scope});
        if (controllerAs) {
          scope[controllerAs] = ctrl;
        }
      } else if (locals) {
        for (prop in locals) {
          scope[prop] = locals[prop];
        }
      }
      $compile(element)(scope);
      container.attr('v-modal-open', '');
      return $animate.enter(element, container);
    }

    function deactivate () {
      if (!element) {
        return $q.when();
      }
      return $animate.leave(element).then(function () {
        scope.$destroy();
        scope = null;
        element.remove();
        element = null;
        container.removeAttr('v-modal-open');
      });
    }

    function active () {
      return !!element;
    }

    return {
      activate: activate,
      deactivate: deactivate,
      open: activate,
      close: deactivate,
      active: active
    };
  };
}

pureModalFactory.$inject = ['$animate', '$compile', '$rootScope', '$controller', '$q', '$http', '$templateCache', '$document', 'modalConfig'];

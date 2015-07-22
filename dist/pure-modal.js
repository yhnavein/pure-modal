/**
 * pureModal - based on vModal - Simple and beautiful modals for AngularJS and Twitter Bootstrap
 * @version v1.3.2
 * @link http://yhnavein.github.io/pure-modal
 * @author PureDev Piotrek Dąbrowski <admin@puredev.eu>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */



angular.module('pureModal', ['ngAnimate'])
  .constant('modalConfig', {
    containerSelector: 'body'
  });

angular.module('pureModal')
.directive('pureClose', function pureCloseDirective () {
  return {
    restrict: 'EA',
    scope: {
      label: '@'
    },
    link: function (scope, iElement, iAttrs) {
      if (scope.label) {
        iAttrs.$set('aria-label', scope.label);
      }

      iAttrs.$set('role', 'button');
      iAttrs.$set('tabindex', 0);
    }
  };
});

angular.module('pureModal')
.directive('pureDialog', function pureDialogDirective () {
  return {
    restrict: 'AE',
    require: '^pureModal',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {
      heading: '@',
      role: '@'
    },
    link: function (scope, iElement, iAttrs) {
      if (scope.heading) {
        iAttrs.$set('aria-label', scope.heading);
      }

      iAttrs.$set('role', 'dialog');
      iAttrs.$set('tabindex', -1);

      iElement[0].focus();
      setTimeout(function () { iElement[0].focus(); }, 0);

      scope.close = function() {
        scope.closeMethod();
      };
    }
  };
});



angular.module('pureModal')
.directive('pureModal', function pureModalDirective () {
  return {
    restrict: 'AE',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {
      closeMethod: '&?onclose'
    },
    controller: function () {},
    link: function (scope, iElement) {
      scope.closeMethod = (angular.isFunction(scope.closeMethod)) ? scope.closeMethod : angular.noop;

      function isClose (el) {
        while (el.tagName !== 'PURE-CLOSE') {
          el = el.parentNode;
          if (!el) {
            return false;
          }
        }
        return true;
      }

      iElement.on('click', function (event) {
        var isBackdrop = (event.target.tagName === 'PURE-MODAL');

        if (isBackdrop || isClose(event.target)) {
          scope.$apply(function () { scope.closeMethod(); });
        }
      });
    }
  };
});
/*jslint bitwise: true */


angular.module('pureModal')
.factory('pureModal', ['$animate', '$compile', '$rootScope', '$controller', '$q', '$http', '$templateCache', '$document', 'modalConfig',
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
      container.attr('pure-modal-open', '');
      return $animate.enter(element, container);
    }

    function deactivate () {
      if (!element) {
        return $q.when();
      }
      return $animate.leave(element).then(function () {
        if(scope.onClose && angular.isFunction(scope.onClose)) {
          scope.onClose();
        }

        scope.$destroy();
        scope = null;
        element.remove();
        element = null;
        container.removeAttr('pure-modal-open');
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
}]);
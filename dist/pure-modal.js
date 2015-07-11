/**
 * pureModal - based on vModal - Simple and beautiful modals for AngularJS and Twitter Bootstrap
 * @version v1.3.2
 * @link http://yhnavein.github.io/pure-modal
 * @author Piotrek Dąbrowski <admin@puredev.eu>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */


// Config
angular.module('vModal', ['ngAnimate'])
  .constant('modalConfig', {
    containerSelector: 'body'
  });


// vClose directive
angular.module('vModal')
  .directive('vClose', vCloseDirective);


function vCloseDirective () {
  return {
    restrict: 'E',
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
}




// vDialog directive
angular.module('vModal')
  .directive('vDialog', vDialogDirective);


function vDialogDirective () {
  return {
    restrict: 'AE',
    require: '^vModal',
    transclude: true,
    scope: {
      heading: '@',
      role: '@'
    },
    link: function (scope, iElement, iAttrs, modalCtrl, transclude) {
      transclude(scope.$parent, function(clone) {
        iElement.append(clone);
      });

      if (scope.heading) {
        iAttrs.$set('aria-label', scope.heading);
      }

      iAttrs.$set('role', 'dialog');
      iAttrs.$set('tabindex', -1);

      iElement[0].focus();
      setTimeout(function () { iElement[0].focus(); }, 0);
    }
  };
}



// vModal directive
angular.module('vModal')
  .directive('vModal', vModalDirective);


function vModalDirective () {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      closeMethod: '&?onclose'
    },
    controller: function () {},
    link: function (scope, iElement, iAttrs, ctrl, transclude) {
      transclude(scope.$parent, function(clone) {
        iElement.append(clone);
      });

			scope.closeMethod = (angular.isFunction(scope.closeMethod)) ? scope.closeMethod : angular.noop;

      function isClose (el) {
        while (el.tagName !== 'V-CLOSE') {
          el = el.parentNode;
          if (!el) {
            return false;
          }
        }
        return true;
      }

      iElement.on('click', function (event) {
        var isBackdrop = (event.target.tagName === 'V-MODAL');

        if (isBackdrop || isClose(event.target)) {
          scope.$apply(function () { scope.closeMethod(); });
        }
      });
    }
  };
}


/*jslint bitwise: true */
// vModal service
'use strict';
angular.module('vModal')
.factory('vModal', vModalFactory);

function vModalFactory ($animate, $compile, $rootScope, $controller, $q, $http, $templateCache, $document, modalConfig) {
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
      active: active
    };
  };
}

vModalFactory.$inject = ['$animate', '$compile', '$rootScope', '$controller', '$q', '$http', '$templateCache', '$document', 'modalConfig'];

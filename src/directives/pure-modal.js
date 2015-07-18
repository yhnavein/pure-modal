'use strict';
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
    link: function (scope, iElement, iAttrs, ctrl, transclude) {
      // transclude(scope.$parent, function(clone, scope) {
      //   iElement.append(clone);
      // });

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
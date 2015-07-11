
angular.module('pureModal')
  .directive('pureClose', vCloseDirective);


function vCloseDirective () {
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
}


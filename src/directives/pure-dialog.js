'use strict';
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
    link: function (scope, iElement, iAttrs, modalCtrl, transclude) {
      // transclude(scope.$parent, function(clone, scope) {
      //   iElement.append(clone);
      // });

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


'use strict';
var app = angular.module('myApp');

app.controller('DemoController', ['$scope', 'loginModal', 'advLoginModal', 'bootstrapModal',
function ($scope, loginModal, advLoginModal, bootstrapModal) {

  $scope.openLoginModal = loginModal.open;
  $scope.openLoginAdvModal = advLoginModal.open;

  // Add params to the modal $scope
  $scope.openBootstrapModal = function () {
    bootstrapModal.open({
      title: 'Lorem ipsum',
      content: 'Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum adipiscing wisi. Aliquam erat ac ipsum. Integer aliquam purus. Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum sapien massa ac turpis faucibus orci luctus non, consectetuer lobortis quis, varius in, purus. Integer ultrices posuere cubilia Curae, Nulla ipsum dolor lacus, suscipit adipiscing. Cum sociis natoque penatibus et ultrices volutpat. Nullam wisi ultricies a, gravida vitae, dapibus risus ante sodales lectus blandit eu, tempor diam pede cursus vitae, ultricies eu, faucibus quis, porttitor eros cursus lectus, pellentesque eget, bibendum a, gravida ullamcorper quam. Nullam viverra consectetuer. Quisque cursus et, porttitor risus. Aliquam sem. In hendrerit nulla quam nunc, accumsan congue.'
    });
  };
}]);

app.controller('ThemeController', ['$scope', '$rootScope',
function ($scope, $rootScope) {

  $scope.avThemes = [
    { id: 'readable', isDark: false },
    { id: 'slate', isDark: true },
    { id: 'superhero', isDark: true },
    { id: 'flatly', isDark: false },
    { id: 'cerulean', isDark: false },
    { id: 'darkly', isDark: true },
    { id: 'united', isDark: false },
    { id: 'cyborg', isDark: true }
  ];
  $rootScope.selTheme = $scope.avThemes[0];

  $scope.changeTheme = function(theme) {
    $rootScope.selTheme = $scope.avThemes.find(function(el) { return el.id === theme.id; });
  };

  $rootScope.getModalTheme = function() {
    return ($rootScope.selTheme.isDark ? 'dark' : 'light');
  };

}]);
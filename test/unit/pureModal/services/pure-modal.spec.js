describe('pure-modal service', function() {

  var container;
  var pureModal;
  var $rootScope;



  beforeEach(module('pureModal'));

  beforeEach(inject(function(_pureModal_, _$rootScope_, $templateCache) {
    pureModal = _pureModal_;
    $rootScope = _$rootScope_;
    $rootScope.greeting = 'こんばんは';

    $templateCache.put('test.html', [200, '<div>{{greeting}}</div>', {}]);
  }));

  beforeEach(function () {
    container = angular.element('<div></div>');
  });

  afterEach(function() {
    container = null;
  });



  it('should not show a modal initially', function() {
    var modal = pureModal({
      templateUrl: 'test.html',
      container: container
    });

    $rootScope.$digest();

    expect(container.text()).toBe('');
  });


  it('should throw if called without a `template` or `templateUrl` option', function() {
    expect(function () { pureModal({}); }).toThrow();
  });


  it('should throw if called with a text node', function() {
    var modal = pureModal({
      template: 'hey'
    });
    expect(function () {
      modal.activate();
      $rootScope.$digest();
    }).toThrow();
  });


  it('should throw if called with both `template` and `templateUrl` options', function() {
    expect(function () {
      pureModal({
        template: 'foo',
        templateUrl: 'foo.html'
      });
    }).toThrow();
  });


  it('should show a modal when activated with `templateUrl`', function() {
    var modal = pureModal({
      templateUrl: 'test.html',
      container: container
    });
    modal.activate();
    $rootScope.$digest();

    expect(container.text()).toBe('こんばんは');
  });


  it('should show a modal when activated with `template`', function() {
    var modal = pureModal({
      template: '<span>{{greeting}}</span>',
      container: container
    });

    modal.activate();
    $rootScope.$digest();

    expect(container.text()).toBe('こんばんは');
  });


  it('should instantiate a controller via the `controller` option', function() {
    var modal = pureModal({
      template: '<span>{{greeting}}</span>',
      controller: function ($scope) {
        $scope.greeting = 'goodnight';
      },
      container: container
    });

    modal.activate();
    $rootScope.$digest();

    expect(container.text()).toBe('goodnight');
  });


  it('should expose a controller to the scope via the `controllerAs` option', function() {
    var modal = pureModal({
      template: '<span>{{ctrl.greeting}}</span>',
      controller: function () {
        this.greeting = 'boa noite';
      },
      controllerAs: 'ctrl',
      container: container
    });

    modal.activate();
    $rootScope.$digest();

    expect(container.text()).toBe('boa noite');
  });


  it('should pass locals to the modal scope', function() {
    var modal = pureModal({
      template: '<span>{{greeting}}</span>',
      container: container
    });

    modal.activate({
      greeting: 'bon soir'
    });
    $rootScope.$digest();

    expect(container.text()).toBe('bon soir');
  });


  it('should not activate multiple times', function() {
    var modal = pureModal({
      template: '<span>x</span>',
      container: container
    });

    modal.activate();
    $rootScope.$digest();
    modal.activate();
    $rootScope.$digest();

    expect(container.text()).toBe('x');
  });


  it('should resolve a promise after activating', function() {
    var spy = jasmine.createSpy('activated');

    var modal = pureModal({
      template: '<span>x</span>',
      container: container
    });

    modal.activate().then(spy);
    expect(spy).not.toHaveBeenCalled();

    $rootScope.$digest();
    expect(spy).toHaveBeenCalled();
  });

});
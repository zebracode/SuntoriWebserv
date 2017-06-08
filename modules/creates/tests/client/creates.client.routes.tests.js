(function () {
  'use strict';

  describe('Creates Route Tests', function () {
    // Initialize global variables
    var $scope,
      CreatesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CreatesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CreatesService = _CreatesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('creates');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/creates');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CreatesController,
          mockCreate;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('creates.view');
          $templateCache.put('modules/creates/client/views/view-create.client.view.html', '');

          // create mock Create
          mockCreate = new CreatesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Create Name'
          });

          // Initialize Controller
          CreatesController = $controller('CreatesController as vm', {
            $scope: $scope,
            createResolve: mockCreate
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:createId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.createResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            createId: 1
          })).toEqual('/creates/1');
        }));

        it('should attach an Create to the controller scope', function () {
          expect($scope.vm.create._id).toBe(mockCreate._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/creates/client/views/view-create.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CreatesController,
          mockCreate;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('creates.create');
          $templateCache.put('modules/creates/client/views/form-create.client.view.html', '');

          // create mock Create
          mockCreate = new CreatesService();

          // Initialize Controller
          CreatesController = $controller('CreatesController as vm', {
            $scope: $scope,
            createResolve: mockCreate
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.createResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/creates/create');
        }));

        it('should attach an Create to the controller scope', function () {
          expect($scope.vm.create._id).toBe(mockCreate._id);
          expect($scope.vm.create._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/creates/client/views/form-create.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CreatesController,
          mockCreate;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('creates.edit');
          $templateCache.put('modules/creates/client/views/form-create.client.view.html', '');

          // create mock Create
          mockCreate = new CreatesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Create Name'
          });

          // Initialize Controller
          CreatesController = $controller('CreatesController as vm', {
            $scope: $scope,
            createResolve: mockCreate
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:createId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.createResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            createId: 1
          })).toEqual('/creates/1/edit');
        }));

        it('should attach an Create to the controller scope', function () {
          expect($scope.vm.create._id).toBe(mockCreate._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/creates/client/views/form-create.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
